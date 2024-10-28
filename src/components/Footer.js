/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

const Footer = () => {
    return (
        <footer className="bottom-0 w-full bg-[#1e2a38] text-white shadow-md z-50 border-t border-gray-700 py-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                {/* Logo and tagline */}
                <div className="flex flex-col items-center md:items-start">
                    <a href="/" className="text-2xl font-bold tracking-wide text-yellow-400">
                        Skill Matrix
                    </a>
                    <p className="text-sm mt-2">
                        Empowering learners through course reviews and community insights.
                    </p>
                </div>

                {/* Links Section */}
                <div className="flex space-x-6 text-center md:text-left">
                    <div>
                        <h3 className="font-semibold text-lg">Quick Links</h3>
                        <ul className="mt-2 space-y-1">
                            <li><a href="/home" className="hover:underline">Explore Courses</a></li>
                            <li><a href="/community" className="hover:underline">Community</a></li>
                            <li><a href="/reviews" className="hover:underline">Reviews</a></li>
                            <li><a href="/about" className="hover:underline">About Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Support</h3>
                        <ul className="mt-2 space-y-1">
                            <li><a href="/help" className="hover:underline">Help Center</a></li>
                            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
                            <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
                            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Social Media and Newsletter */}
                <div className="flex flex-col items-center md:items-end">
                    <h3 className="font-semibold text-lg">Stay Connected</h3>
                    <div className="flex space-x-4 mt-2">
                        <a href="#" className="hover:text-yellow-400"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="hover:text-yellow-400"><i className="fab fa-linkedin"></i></a>
                        <a href="#" className="hover:text-yellow-400"><i className="fab fa-facebook"></i></a>
                        <a href="#" className="hover:text-yellow-400"><i className="fab fa-instagram"></i></a>
                    </div>
                    <form className="mt-4">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="ml-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-300 text-sm">
                &copy; 2024 Skill Matrix. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer