import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/authSlice'
import onboardingSlice from './slices/onboardingSlice';

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        onboarding: onboardingSlice,
    },
});

export default store;
