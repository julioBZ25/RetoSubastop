'use client';

import { useStore } from 'react-redux';
import { useEffect } from 'react';
import { useToast } from '@/shared/components/ui/toast';

export const actionLoggerMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  return result;
};

export const useApiFeedback = () => {
    const { showToast } = useToast();
    const store = useStore();
};
