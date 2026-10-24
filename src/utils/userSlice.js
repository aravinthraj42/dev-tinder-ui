import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        addUser: (state, action) => {
            return action.payload;
        },
        removeUser: () => null,   
        logout: () => null 

        
    }
});

export const { addUser, removeUser, logout } = userSlice.actions;
export default userSlice.reducer;