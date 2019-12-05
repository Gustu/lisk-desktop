import { connect } from 'react-redux';
import React from 'react';
import { convertUnixSecondsToLiskEpochSeconds } from '../../../../utils/datetime';
import { olderBlocksRetrieved } from '../../../../actions/blocks';
import liskService from '../../../../utils/api/lsk/liskService';
import voting from '../../../../constants/voting';


/**
 * This HOC inserts live data to list of delegates, used on delegates monitor.
 *
 * The live data is relative to forging rounds on Lisk network.
 * Blocks on Lisk network are in rounds of 101 blocks.
 * Each block has an integer height:
 * the 1st block of the first round (aka genesis block) has height = 1,
 * the 2nd block of the first round has height = 2,
 * ...
 * the 1st block of the second round has height = 101 + 1
 * ...
 * the n-th block of the m-th round has height = (101 * (m - 1)) + n
 *
 * For each delegate, this HOC inserts:
 * - forgingTime - Time until a delegate can forge their next block, based on nextForgers API
 * - lastBlock - Last block forged by this delegate, based on lastBlocks API and new block Websocket
 * - status - Forging status of the delegate, based on when lastBlock was forged
 *   For details on possible values of status, refer to unit test of this HOC.
 *
 *
 */
const withForgingStatus = delegatesKey => (ChildComponent) => {
  class DelegatesContainer extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        nextForgers: {},
        lastBlocks: {},
      };
      this.blocksFetchLimit = 100;
    }

    async componentDidMount() {
      let { latestBlocks: blocks } = this.props;
      if (blocks.length < this.blocksFetchLimit) {
        blocks = [
          ...await this.loadLastBlocks({ limit: this.blocksFetchLimit }),
          ...await this.loadLastBlocks({
            offset: this.blocksFetchLimit, limit: this.blocksFetchLimit,
          }),
        ];
      }

      this.loadNextForgers(blocks);
    }

    async loadLastBlocks(params) {
      const { network: networkConfig } = this.props;
      let blocks = await liskService.getLastBlocks({ networkConfig }, params);
      blocks = blocks.map(block => ({
        ...block,
        timestamp: convertUnixSecondsToLiskEpochSeconds(block.timestamp),
      }));
      this.props.olderBlocksRetrieved({ blocks });
      return blocks;
    }

    async loadNextForgers(blocks) {
      const { network: networkConfig } = this.props;
      const nextForgers = await liskService.getNextForgers(
        { networkConfig }, { limit: this.blocksFetchLimit },
      );
      const height = blocks[0] && blocks[0].height;
      this.setState({
        nextForgers: nextForgers.reduce((accumulator, delegate, i) => ({
          ...accumulator,
          [delegate.publicKey]: {
            nextHeight: height + i + 1,
          },
        }), {}),
      });
    }

    componentDidUpdate(prevProps) {
      const { latestBlocks } = this.props;
      const newBlock = latestBlocks[0] || {};
      if (prevProps.latestBlocks[0] && prevProps.latestBlocks[0].height < newBlock.height) {
        this.setState({
          nextForgers: {
            ...this.state.nextForgers,
            [newBlock.generatorPublicKey]: {
              nextHeight: newBlock.leight + voting.numberOfActiveDelegates,
            },
          },
        });
        if (newBlock.height % 101 === 1) { // to update next forgers in a new round
          this.loadNextForgers(latestBlocks);
        }
      }
    }

    getLastBlock(delegate) {
      const { latestBlocks } = this.props;
      return latestBlocks.find(b => b.generatorPublicKey === delegate.publicKey)
        || this.state.lastBlocks[delegate.publicKey];
    }

    getDelegatesData() {
      const { data } = this.props[delegatesKey];
      const { activeDelegates } = this.props;
      return data.map(delegate => ({
        ...delegate,
        status: activeDelegates && (activeDelegates[delegate.publicKey]
          ? activeDelegates[delegate.publicKey].status : 'missedLastRound'),
        lastBlock: this.getLastBlock(delegate),
        forgingTime: activeDelegates && (activeDelegates[delegate.publicKey]
          ? activeDelegates[delegate.publicKey].forgingTime : 'Missed block'),
      }));
    }

    render() {
      const {
        latestBlocks, network, olderBlocksRetrieved: _, ...rest
      } = this.props;
      return (
        <ChildComponent {...{
          ...rest,
          latestBlock: latestBlocks[0],
          [delegatesKey]: {
            ...this.props[delegatesKey],
            data: this.getDelegatesData(),
          },
        }}
        />
      );
    }
  }
  const mapStateToProps = ({ network }) => ({
    network,
  });

  const mapDispatchToProps = {
    olderBlocksRetrieved,
  };

  return connect(mapStateToProps, mapDispatchToProps)(DelegatesContainer);
};

export default withForgingStatus;
