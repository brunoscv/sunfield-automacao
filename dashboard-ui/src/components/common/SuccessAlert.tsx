import React from 'react';
import { Alert } from 'react-bootstrap';

interface SuccessAlertProps {
  message: string | null;
  onClose?: () => void;
  dismissible?: boolean;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({
  message,
  onClose,
  dismissible = true
}) => {
  if (!message) return null;

  return (
    <Alert 
      variant="success" 
      dismissible={dismissible}
      onClose={onClose}
      className="mb-3"
    >
      <Alert.Heading>
        <i className="fas fa-check-circle me-2"></i>
        Sucesso
      </Alert.Heading>
      <p className="mb-0">{message}</p>
    </Alert>
  );
};

export default SuccessAlert;