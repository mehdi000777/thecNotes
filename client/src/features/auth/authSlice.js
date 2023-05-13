import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken } = action.payload;
            state.token = accessToken;
        },
        logOut: (state, action) => {
            state.token = null;
        }
    }
});

export const selectCurrentToken = (state) => state.auth.token;

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;