import { applyMiddleware, createStore } from 'redux';
// import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../redux/reducers/rootReducer';

// const loggerMiddleware = createLogger({});

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  {},
  applyMiddleware(thunkMiddleware)
)
export const persistor = persistStore(store)
