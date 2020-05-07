import React, {
  useState, useCallback, createContext, useContext,
} from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContextData {
  addToast(data: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);


  const addToast = useCallback(({
    title,
    description,
    type = 'info',
  }: Omit<ToastMessage, 'id'>) => {
    const id = uuid();
    const toast = {
      id,
      type,
      title,
      description,
    };
    setMessages((prevState) => [...prevState, toast]);
  }, []);
  const removeToast = useCallback((id: string) => {
    setMessages((prevState) => prevState.filter((message) => message.id !== id));
  }, []);

  return (
    <>
      <ToastContext.Provider value={{ addToast, removeToast }}>
        {children}
        <ToastContainer messages={messages} />
      </ToastContext.Provider>
    </>
  );
};

function useToast(): ToastContextData {
  const context = useContext<ToastContextData>(ToastContext);
  if (!context) {
    throw new Error('Toast context must be used within a ToastProvider.');
  }
  return context;
}

export {
  ToastProvider,
  useToast,
};
