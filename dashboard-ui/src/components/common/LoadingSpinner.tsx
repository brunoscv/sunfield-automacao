import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  text?: string;
  center?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'sm',
  variant = 'primary',
  text = 'Carregando...',
  center = false
}) => {
  const content = (
    <div className="d-flex align-items-center">
      <Spinner
        animation="border"
        size={size}
        variant={variant}
        role="status"
        aria-hidden="true"
      />
      {text && <span className="ms-2">{text}</span>}
    </div>
  );

  if (center) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;