'use client';

import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

export default ClientProviders;
