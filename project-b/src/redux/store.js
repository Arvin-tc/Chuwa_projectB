import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/authSlice'
import employeeReducer from './slices/employeeSlice'
import applicationReducer from './slices/applicationSlice';

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        employees:employeeReducer,
        applications:applicationReducer,
    },
});

export default store;
