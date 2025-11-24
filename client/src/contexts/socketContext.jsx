import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './authContext';
import { toast } from '../utils/toast';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Initialize socket connection
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
    const newSocket = io(apiBase, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    // Listen for recharge status changes
    newSocket.on('recharge:status_changed', (data) => {
      console.log('Recharge status changed:', data);
      if (data.status === 'success') {
        toast.success(`Recharge successful! Transaction ID: ${data.transactionId}`);
      } else if (data.status === 'failed') {
        toast.error('Recharge failed. Please try again.');
      }
    });

    // Listen for wallet updates
    newSocket.on('wallet:updated', (data) => {
      console.log('Wallet updated:', data);
      toast.success(`Wallet updated! New balance: ₹${data.balance}`);
    });

    // Listen for new notifications
    newSocket.on('notification:new', (notification) => {
      console.log('New notification:', notification);
      toast.info(notification.title, {
        description: notification.body,
        duration: 5000,
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  return ctx;
};

