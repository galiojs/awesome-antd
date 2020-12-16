import React from 'react';
import Button, { ButtonProps } from 'antd/lib/button';

export interface AweButtonProps extends ButtonProps {
  compact?: boolean;
}

const AweButton = ({ style, type, compact = type === 'link', ...props }: AweButtonProps) => (
  <Button
    style={{
      height: compact ? 'auto' : undefined,
      padding: compact ? '0' : undefined,
      ...style,
    }}
    type={type}
    {...props}
  />
);

export default AweButton;
