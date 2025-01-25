import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/authSlice'
import onboardingSlice from './slices/onboardingSlice';
import personalInfoSlice from './slices/personalInfoSlice';
import visaStatusSlice from './slices/visaStatusSlice';

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        onboarding: onboardingSlice,
        personalInfo: personalInfoSlice,
        visa: visaStatusSlice,
    },
});

export default store;
