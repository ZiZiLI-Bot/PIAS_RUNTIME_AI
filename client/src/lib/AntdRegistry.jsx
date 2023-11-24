'use client';

import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';
import propTypes from 'prop-types';

const StyledComponentsRegistry = ({ children }) => {
  const cache = React.useMemo(() => createCache(), []);
  useServerInsertedHTML(() => <style id='antd' dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />);
  return (
    <StyleProvider cache={cache} hashPriority='low'>
      {children}
    </StyleProvider>
  );
};

export default StyledComponentsRegistry;

StyledComponentsRegistry.propTypes = {
  children: propTypes.node,
};
