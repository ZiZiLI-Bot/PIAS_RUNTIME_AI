'use client';

import { store } from './store';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

ReduxProvider.propTypes = {
  children: PropTypes.node,
};

export default ReduxProvider;
