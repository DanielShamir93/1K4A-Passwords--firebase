import emailReducer from "./signup-reducers/emailReducer";
import passwordReducer from "./signup-reducers/passwordReducer";
import confirmReducer from "./signup-reducers/confirmReducer";
import isAuthReducer from "./signup-reducers/isAuthReducer";
import accountChangedRenderReducer from "./accountChangedRenderReducer";
import editAccountReducer from "./editAccountReducer";
import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['isAuth']
}

const rootReducer = combineReducers({
    email: emailReducer,
    password: passwordReducer,
    confirm: confirmReducer,
    isAuth: isAuthReducer,
    accountChangedRender: accountChangedRenderReducer,
    editAccount: editAccountReducer
})

export default persistReducer(persistConfig, rootReducer);
