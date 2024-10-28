import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';
import { SunIcon, MoonIcon, MenuIcon, XIcon } from '@heroicons/react/solid';

const Header = () => {
    const navigate = useNavigate();
    const user = useSelector((store) => store.user);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                console.log("Error occurred during sign out:", error);
            });
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="fixed top-0 w-full bg-[#1e2a38] text-white shadow-md z-50 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Brand Name */}
                <Link to="/home" className="text-2xl font-extrabold text-yellow-400 tracking-tight">
                    Skill Matrix
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleMenu}
                    className="sm:hidden block text-white focus:outline-none"
                    aria-label="Toggle navigation"
                >
                    {isMenuOpen ? (
                        <XIcon className="h-6 w-6" />
                    ) : (
                        <MenuIcon className="h-6 w-6" />
                    )}
                </button>

                {/* Navigation Links for Larger Screens */}
                <nav className="hidden sm:flex items-center space-x-6">
                    <Link
                        to="/home"
                        className="text-lg font-medium text-white hover:text-gray-200 transition-colors"
                    >
                        Courses
                    </Link>
                    <Link
                        to="/community"
                        className="text-lg font-medium text-white hover:text-gray-200 transition-colors"
                    >
                        Community
                    </Link>
                </nav>

                {/* User and Theme Toggle Section */}
                <div className="flex items-center space-x-6">
                    {user.displayName ? (
                        <div className="flex items-center space-x-2">
                            <span className="text-white text-sm font-medium">
                                {user.displayName}
                            </span>
                            <button
                                onClick={handleSignOut}
                                className="text-sm text-white bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/"
                            className="text-white text-sm bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-md transition-colors"
                        >
                            Login
                        </Link>
                    )}

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === 'light' ? (
                            <MoonIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
                        ) : (
                            <SunIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Links */}
            {isMenuOpen && (
                <nav className="sm:hidden flex flex-col space-y-2 bg-indigo-600 p-4">
                    <Link
                        to="/home"
                        className="text-white text-lg font-medium hover:text-gray-200 transition-colors"
                    >
                        Courses
                    </Link>
                    <Link
                        to="/community"
                        className="text-white text-lg font-medium hover:text-gray-200 transition-colors"
                    >
                        Community
                    </Link>
                </nav>
            )}
        </header>

    );
};

export default Header;
