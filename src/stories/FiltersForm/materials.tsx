import React from 'react';

import { createFiltersForm } from './../../filters-form';

export const BaseFiltersForm = createFiltersForm();

export const Container: React.FC<{ width: number }> = ({ width, children }) => (
  <>
    {width && <h4>width: {width}px</h4>}
    <div style={{ background: '#f3f3f3', padding: 16, width: width + 16 * 2 }}>{children}</div>
  </>
);
