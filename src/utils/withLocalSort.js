import React from 'react';

const withLocalSort = (dataKey, initialSort) => WrapperComponent => (
  class WithSort extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        sort: initialSort,
      };
      this.actions = {
        changeSort: this.changeSort.bind(this),
      };
    }

    sort(data) {
      const { sort } = this.state;
      const [id, direction] = sort.split(':');
      return data.sort((a, b) => ((a[id] > b[id]) ? 1 : -1) * (direction === 'asc' ? 1 : -1));
    }

    changeSort(id) {
      const { sort } = this.state;
      this.setState({
        sort: `${id}:${sort.includes('asc') ? 'desc' : 'asc'}`,
      });
    }

    render() {
      return (
        <WrapperComponent {...{
          ...this.props,
          [dataKey]: {
            ...this.props[dataKey],
            data: this.sort(this.props[dataKey].data),
          },
          ...this.state,
          ...this.actions,
        }}
        />
      );
    }
  }
);

export default withLocalSort;
