import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        email: '',
        displayName: '',
        isLoggedIn: false,
        bookmarkedCourses: [],
        favoriteCourses: [],
    },
    reducers: {
        setUser: (state, action) => {
            state.email = action.payload.email;
            state.displayName = action.payload.displayName;
            state.isLoggedIn = true;  // Mark user as logged in
        },
        clearUser: (state) => {
            state.email = '';
            state.displayName = '';
            state.isLoggedIn = false;  // Mark user as logged out
            state.bookmarkedCourses = [];
            state.favoriteCourses = [];
        },
        addBookmark: (state, action) => {
            if (!state.bookmarkedCourses.includes(action.payload)) {
                state.bookmarkedCourses.push(action.payload);
            }
        },
        removeBookmark: (state, action) => {
            state.bookmarkedCourses = state.bookmarkedCourses.filter(courseId => courseId !== action.payload);
        },
        addFavorite: (state, action) => {
            if (!state.favoriteCourses.includes(action.payload)) {
                state.favoriteCourses.push(action.payload);
            }
        },
        removeFavorite: (state, action) => {
            state.favoriteCourses = state.favoriteCourses.filter(courseId => courseId !== action.payload);
        }
    }
});

export const { setUser, clearUser, addBookmark, removeBookmark, addFavorite, removeFavorite } = userSlice.actions;
export default userSlice.reducer;
