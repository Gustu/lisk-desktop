import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TableRow from './tableRow';
import styles from './table.css';

const Table = ({
  data, columns, onSortChange, sort, getRowLink, rowClassName, onRowClick, rowKey,
}) => {
  const onHeaderClick = ({ id, isSortable }) => {
    if (isSortable) {
      onSortChange(id);
    }
  };

  const getSortClass = ({ id, isSortable }) => {
    if (isSortable) {
      const className = ['sort-by', id];
      if (sort.includes(id) && sort.includes('asc')) {
        className.push(styles.sortAsc);
      } else if (sort.includes(id) && sort.includes('desc')) {
        className.push(styles.sortDesc);
      } else {
        className.push(styles.sortInactive);
      }
      return className.join(' ');
    }

    return '';
  };

  return (
    <React.Fragment>
      {!!data.length && (
      <TableRow isHeader className={grid.row}>
        {columns.map(({
          className, header, id, isSortable,
        }) => (
          <div key={id} className={className} onClick={() => onHeaderClick({ id, isSortable })}>
            <span className={styles.titleWrapper}>
              <span className={getSortClass({ id, isSortable })}>
                {header}
              </span>
            </span>
          </div>
        ))}
      </TableRow>
      )}
      {data.map(row => (
        <TableRow
          key={row[rowKey]}
          {...(getRowLink(row) && {
            Container: Link,
            to: getRowLink(row),
          })}
          onClick={onRowClick && onRowClick.bind(null, row)}
          className={[
            grid.row,
            onRowClick && styles.clickable,
            rowClassName,
          ].join(' ')}
        >
          {columns.map(({ className, id, getValue }) => (
            <span className={className} key={id}>
              {typeof getValue === 'function' ? getValue(row) : row[id]}
            </span>
          ))}
        </TableRow>
      ))}
    </React.Fragment>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onSortChange: PropTypes.func,
  getRowLink: PropTypes.func,
  rowClassName: PropTypes.string,
  sort: PropTypes.string,
  onRowClick: PropTypes.func,
};

const noop = () => null;

Table.defaultProps = {
  getRowLink: noop,
  onSortChange: noop,
  rowClassName: '',
  rowKey: 'id',
  sort: '',
};

export default Table;
