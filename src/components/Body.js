import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AuthForm from './AuthForm';
import Home from './Home';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { setUser, clearUser } from '../utils/userSlice';
import CourseDetail from './CourseDetail';
import CommunityPage from './CommunityPage';
import { ThemeProvider } from '../context/ThemeContext';
import AddCourses from './AddCourses';


const Body = () => {

    const dispatch = useDispatch();

    const appRouter = createBrowserRouter([
        {
            path: '/',
            element: <AuthForm />,
        },
        {
            path: '/home',
            element: <Home />,
        },
        {
            path: '/home/:courseId',
            element: <CourseDetail />,

        },
        {
            path: "/community",
            element: <CommunityPage />
        },
        {
            path: "/addcourse",
            element: <AddCourses />
        }
    ])

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const { uid, email, displayName } = user;
                dispatch(setUser({ uid: uid, email: email, displayName: displayName }));

            } else {
                // User is signed out
                dispatch(clearUser());


            }
        });
    }, [dispatch])

    return (


        <ThemeProvider>
            <div className="relative min-h-screen">
                <RouterProvider router={appRouter} />
            </div>
        </ThemeProvider>

    )
}

export default Body;