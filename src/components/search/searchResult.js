import React from 'react';
import { translate } from 'react-i18next';
import Box from '../box';
import EmptyState from '../emptyState';

const SearchResult = ({ t }) => (
  <Box>
    <EmptyState title={t('No results')}
      message={t('Search for Lisk ID or Transaction ID')} />
  </Box>
);

export default translate()(SearchResult);

