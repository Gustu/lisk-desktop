import React from 'react';
import LiskHubExtensions from '../../utils/liskHubExtensions';

export default class ExtensionPoint extends React.Component {
  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error(new Error(`Error in extension point '${this.props.identifier}' ${error}`));
  }

  render() {
    const modules = this.props.modules[this.props.identifier] || [];
    const {
      sent,
      getTransactions,
      searchDelegate,
      searchVotes,
    } = this.props;

    // TODO implement a way to highlight all extension points on a page
    // for easier discover by extension developers
    // e.g. localStorage.setItem('highlightExtensionPoints', true)
    // and this component will get a red border and title with its 'identifier'

    return (
      <React.Fragment>
        { modules.map(({ moduleId }, i) => {
          const Component = LiskHubExtensions._modules[moduleId];
          if (Component) {
            return (
              <Component
                data={{
                  latestBlocks: this.props.blocks && this.props.blocks.latestBlocks,
                  transactions: this.props.transactions,
                  time: this.props.test,
                  accountAddress: this.props.account && this.props.account.address,
                  search: this.props.search,
                }}
                actions={{
                  sent,
                  getTransactions,
                  searchDelegate,
                  searchVotes,
                }}
                t={this.props.t}
                identifier={this.props.identifier}
                key={i}
              />
            );
          }
          // eslint-disable-next-line no-console
          console.error(new Error(`Invalid component in extension point ${this.props.identifier}`));
          return null;
        })}
      </React.Fragment>
    );
  }
}
