import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import { 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { inventoryApi } from '@/features/inventory/inventoryApi';
import preferencesReducer from '@/features/preferences/preferencesSlice';
import { actionLoggerMiddleware } from './middleware';

const rootReducer = combineReducers({
  [inventoryApi.reducerPath]: inventoryApi.reducer,
  preferences: preferencesReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['preferences'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(inventoryApi.middleware, actionLoggerMiddleware as Middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
