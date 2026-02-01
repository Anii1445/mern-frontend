import { configureStore } from "@reduxjs/toolkit";
import checkoutReducer from "./checkoutSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["checkout"]
}; 

const rootReducer = combineReducers({
  checkout: checkoutReducer,
  search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);