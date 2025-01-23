import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/authSlice'
import onboardingSlice from './slices/onboardingSlice';
import personalInfoSlice from './slices/personalInfoSlice';

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        onboarding: onboardingSlice,
        personalInfo: personalInfoSlice,
    },
});

export default store;
