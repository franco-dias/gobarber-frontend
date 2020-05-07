import React, { useEffect } from 'react';
import {
  FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle,
} from 'react-icons/fi';

import { ToastMessage, useToast } from '../../../hooks/toast';
import { ToastContainer } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({
  message,
  style,
}) => {
  const { removeToast } = useToast();
  const {
    id, title, description, type,
  } = message;
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeToast(id);
    }, 3000);

    return (): void => {
      clearTimeout(timeout);
    };
  }, [removeToast, id]);

  return (
    <ToastContainer hasDescription type={type || 'info'} style={style}>
      {icons[type || 'info']}
      <div>
        <strong> { title } </strong>
        <p> { description } </p>
      </div>
      <button type="button" onClick={(): void => removeToast(id)}>
        <FiXCircle size={18} />
      </button>
    </ToastContainer>
  );
};

export default Toast;
