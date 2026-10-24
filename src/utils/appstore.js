import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import feedSlice from './feedSlice';
import connectionSlice from './connectionSlice';
import requestSlice from './requestSlice';

const appReducer = combineReducers({
    user: userSlice,
    feed: feedSlice,
    connection: connectionSlice,
    request: requestSlice
});

const rootReducer = (state, action) => {
    if (action.type === 'user/logout') {
        state = undefined;
    }

    return appReducer(state, action);
};

const appStore = configureStore({
    reducer: rootReducer
});

export default appStore;