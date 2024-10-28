import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { checkValidData } from '../utils/validate';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '../utils/userSlice';

const AuthForm = () => {
    const [isSignInForm, setIsSignInForm] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsSignInForm(!isSignInForm);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const validationError = checkValidData(email, password);
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            if (isSignInForm) {
                // Sign In
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Dispatch setUser action with user details
                dispatch(setUser({ email: user.email, displayName: user.displayName || 'User' }));

                console.log("User Details:", user.displayName, user.email);
                navigate("/home");
            } else {
                // Sign Up
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Set the full name for the user
                await updateProfile(user, {
                    displayName: fullName
                });

                // Save user details in Firestore
                const userDocRef = doc(db, 'users', user.uid);
                await setDoc(userDocRef, {
                    displayName: fullName,
                    email: user.email,
                    createdDate: new Date().toISOString(),
                });

                // Dispatch setUser action with user details
                dispatch(setUser({ email: user.email, displayName: fullName }));

                console.log("User Signed Up:", user.displayName, user.email);
                navigate("/home");
            }
        } catch (error) {
            console.error("Error during signup:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
            {/* Explore Courses Button */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => navigate("/home")}
                    className="py-2 px-6 bg-green-500 dark:bg-green-600 text-white rounded-full hover:bg-green-600 dark:hover:bg-green-700 shadow-md transition ease-in-out"
                >
                    Explore Courses
                </button>
            </div>

            {/* Welcome Section */}
            <div className="absolute top-20 left-4 sm:left-8 text-gray-800 dark:text-gray-200 max-w-sm sm:max-w-lg">
                <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
                    Welcome to My Skill Matrix
                </h1>
                <p className="text-base sm:text-lg font-light">
                    Discover, compare, and choose from the best courses. Skill Matrix is the go-to platform where learners share experiences, compare top courses, and make informed learning decisions.
                </p>
            </div>

            {/* Auth Form */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-6 sm:px-8 py-8 sm:py-12 max-w-md w-full relative mx-4">
                <h3 className="text-center text-2xl font-medium text-indigo-600 dark:text-indigo-400 mb-6">
                    {isSignInForm ? 'Sign In' : 'Sign Up'}
                </h3>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-100 text-red-600 dark:text-red-800 p-3 rounded-md mb-6 relative shadow-sm">
                        <p className="text-center">{error}</p>
                        <button
                            onClick={() => setError('')}
                            className="absolute top-1 right-3 text-red-500 dark:text-red-700 hover:text-red-700 dark:hover:text-red-900 font-semibold"
                        >
                            &times;
                        </button>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isSignInForm && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition ease-in-out"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition ease-in-out"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition ease-in-out"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md font-medium hover:bg-indigo-700 dark:hover:bg-indigo-800 transition ease-in-out shadow-md"
                    >
                        {loading ? 'Processing...' : isSignInForm ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                {/* Toggle Form */}
                <div className="text-center mt-4">
                    <p className="text-gray-600 dark:text-gray-300">
                        {isSignInForm ? "Don't have an account?" : 'Already have an account?'}
                        <button
                            onClick={toggleForm}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium ml-1"
                        >
                            {isSignInForm ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
