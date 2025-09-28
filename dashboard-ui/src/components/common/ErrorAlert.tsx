import React from 'react';
import { Alert } from 'react-bootstrap';

interface ErrorAlertProps {
  error: string | null;
  onClose?: () => void;
  dismissible?: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onClose,
  dismissible = true
}) => {
  if (!error) return null;

  return (
    <Alert 
      variant="danger" 
      dismissible={dismissible}
      onClose={onClose}
      className="mb-3"
    >
      <Alert.Heading>
        <i className="fas fa-exclamation-triangle me-2"></i>
        Erro
      </Alert.Heading>
      <p className="mb-0">{error}</p>
    </Alert>
  );
};

export default ErrorAlert;