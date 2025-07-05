import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import tableReducer from './tableSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['table'], // Only persist table state
};

const persistedTableReducer = persistReducer(persistConfig, tableReducer);

export const store = configureStore({
  reducer: {
    table: persistedTableReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['table.editingRows'],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>; 