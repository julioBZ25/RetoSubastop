'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './index';
import { persistStore, type Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastProvider } from '@/shared/components/ui/toast';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);
  const persistorRef = useRef<Persistor>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current!}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}
