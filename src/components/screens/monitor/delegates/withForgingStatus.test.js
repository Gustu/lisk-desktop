import React from 'react';
import moment from 'moment';
import { mount } from 'enzyme';
import { firstBlockTime } from '../../../../constants/datetime';
import blocks from '../../../../../test/constants/blocks';
import defaultState from '../../../../../test/constants/defaultState';
import delegates from '../../../../../test/constants/delegates';
import liskService from '../../../../utils/api/lsk/liskService';
import voting from '../../../../constants/voting';
import withForgingStatus from './withForgingStatus';

const transformToLiskServiceFormat = ({ account, ...delegate }) => ({
  ...delegate,
  ...account,
});
const delegatesApiResponse = delegates.map(transformToLiskServiceFormat);

describe('withForgingStatus', () => {
  const className = 'dummy';
  const DummyComponent = jest.fn(props => (
    <span className={className}>
      {props.delegates.data.map(delegate => (
        <span className={delegate.username} key={delegate.username}>
          <span className="publicKey">{delegate.publicKey}</span>
          <span className="lastBlockHeight">{delegate.lastBlock && delegate.lastBlock.height}</span>
          <span className="status">{delegate.status}</span>
        </span>
      ))}
    </span>
  ));
  const delegatesKey = 'delegates';
  const notForgingDelegate = delegatesApiResponse[0];
  const forgingDelegates = delegatesApiResponse.slice(1);

  const generateBlock = height => ({
    height,
    timestamp: moment(firstBlockTime).unix() + height * 10,
    generatorPublicKey: forgingDelegates[height % forgingDelegates.length].publicKey,
  });

  const generateBlocks = ({ offset = 0, limit = 200 } = {}) =>
    [...Array(limit)].map((_, i) => generateBlock(i + offset)).reverse();

  const setupLatestBlocks = ({ lastBlockHeightAgo }) => {
    const currentHeight = voting.numberOfActiveDelegates * 10 + 10;
    const roundStartHeight = voting.numberOfActiveDelegates * 10 + 1;
    const height = roundStartHeight - lastBlockHeightAgo;
    const limit = 200;
    const latestBlocks = generateBlocks({ offset: currentHeight - limit, limit });
    liskService.getLastBlocks.mockImplementation(
      () => Promise.resolve([{ height, timestamp: 10243287 }]),
    );
    return latestBlocks;
  };

  const props = {
    [delegatesKey]: {
      isLoading: true,
      data: delegatesApiResponse,
      loadData: jest.fn(),
      clearData: jest.fn(),
      urlSearchParams: {},
    },
    latestBlocks: [],
  };

  const setup = (extraProps = {}) => {
    const DummyComponentHOC = withForgingStatus(delegatesKey)(DummyComponent);
    const wrapper = mount(<DummyComponentHOC {...{ ...props, ...extraProps }} />);
    return wrapper;
  };

  beforeEach(() => {
    jest.spyOn(liskService, 'getLastBlocks').mockImplementation(() => Promise.resolve(blocks));
    jest.spyOn(liskService, 'getNextForgers').mockImplementation(() => Promise.resolve([
      {
        publicKey: '88260051bbe6634431f8a2f3ac66680d1ee9ef1087222e6823d9b4d81170edc7',
      },
    ]));
  });

  afterEach(() => {
    liskService.getLastBlocks.mockReset();
    liskService.getNextForgers.mockReset();
  });

  it('should render passed component', () => {
    const wrapper = setup();
    expect(wrapper).toContainMatchingElement(`.${className}`);
  });

  it('should load blocks if not yet in redux store', () => {
    setup();
    expect(liskService.getLastBlocks).toHaveBeenCalledWith(
      { networkConfig: defaultState.network },
      { limit: 100 },
    );
  });

  it('update last blocks of generator of new block on new block', () => {
    const latestBlocks = generateBlocks({ limit: 201 });
    const newBlock = generateBlock(latestBlocks.length + 1);
    const newBlockGenerator = forgingDelegates.find(
      delegate => delegate.publicKey === newBlock.generatorPublicKey,
    );
    const wrapper = setup({ latestBlocks });

    wrapper.setProps({
      latestBlocks: [
        newBlock,
        ...latestBlocks,
      ],
    });

    expect(wrapper.find(`.${newBlockGenerator.username} .lastBlockHeight`)).toHaveText(`${newBlock.height}`);
  });

  it('fetches nextForgers on round start', () => {
    const latestBlocks = generateBlocks({ limit: 202 });
    const newBlock = generateBlock(latestBlocks.length + 1);
    const wrapper = setup({ latestBlocks });

    wrapper.setProps({
      latestBlocks: [
        newBlock,
        ...latestBlocks,
      ],
    });
    expect(liskService.getNextForgers).toHaveBeenCalledWith(
      { networkConfig: defaultState.network },
      { limit: 100 },
    );
  });
});
