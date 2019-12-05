import React from 'react';
import { mount } from 'enzyme';
import ForgingDetails from './forgingDetails';
import delegates from '../../../../../test/constants/delegates';

describe('Forging Details page', () => {
  let wrapper;
  const props = {
    t: key => key,
    networkStatus: {
      data: {
        supply: 9000000000000000000,
      },
    },
    nextForgers: delegates,
    filters: {
      tab: 'active',
    },
    latestBlock: {
      generatorPublicKey: '3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da972135',
    },
    applyFilters: jest.fn(),
    activeDelegates: delegates.map(delegate => ({
      ...delegate,
      publicKey: delegate.account.publicKey,
    })),
  };

  it('shows the list of total forged', () => {
    wrapper = mount(<ForgingDetails {...props} />);
    expect(wrapper.find('.total-forged')).toIncludeText('89,900,000,000');
  });

  it('shows last forger data', () => {
    wrapper = mount(<ForgingDetails {...props} />);
    expect(wrapper.find('.last-forger').at(1)).toHaveText('genesis_3');
  });
});
