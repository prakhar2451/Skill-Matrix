import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addBookmark, removeBookmark, addFavorite, removeFavorite } from '../utils/userSlice';
import Header from './Header';
import { useFetchCourses } from '../hooks/useFetchCourses';
import { useFetchReviews } from '../hooks/useFetchReviews';
import { ref, push, set } from 'firebase/database';
import { database } from '../utils/firebase';

const CourseDetail = () => {
    const { courseId } = useParams();
    const { courseList, loading } = useFetchCourses();
    const course = courseList.find(course => course.courseId === courseId);

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const { isLoggedIn, bookmarkedCourses, favoriteCourses } = user;

    const [newReview, setNewReview] = useState('');
    const { reviews, loading: reviewsLoading, error: reviewsError } = useFetchReviews(courseId);

    const handleReviewSubmit = async () => {
        if (!isLoggedIn) {
            alert('Please log in to submit a review.');
            return;
        }

        if (newReview.trim() === '') return;

        const courseReview = {
            text: newReview,
            author: user.displayName || "Anonymous",
            createdAt: new Date().toISOString(),
            courseName: course.courseName,
            isHelpful: 0,
            comments: [],
        };

        try {
            const reviewRef = ref(database, `courses/${courseId}/reviews`);
            const newReviewRef = push(reviewRef);
            await set(newReviewRef, courseReview);
            alert('Review submitted successfully.');
            setNewReview('');
        } catch (error) {
            console.error("Error submitting the review: ", error);
            alert("Failed to submit review. Please try again.");
        }
    };

    const toggleBookmark = () => {
        if (!isLoggedIn) {
            alert('Please log in to bookmark this course.');
            return;
        }

        if (bookmarkedCourses.includes(courseId)) {
            dispatch(removeBookmark(courseId));
        } else {
            dispatch(addBookmark(courseId));
        }
    };

    const toggleFavorite = () => {
        if (!isLoggedIn) {
            alert('Please log in to add this course to favorites.');
            return;
        }

        if (favoriteCourses.includes(courseId)) {
            dispatch(removeFavorite(courseId));
        } else {
            dispatch(addFavorite(courseId));
        }
    };


    if (!course) {
        return <div className="text-center text-gray-800 dark:text-gray-200 mt-20">Course not found!</div>;
    }
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                <p className="ml-4 text-indigo-600 dark:text-indigo-400">Loading courses...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-20">
            <Header />
            <div className="container mx-auto p-6 max-w-7xl">
                {/* Course Header */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6 grid grid-cols-1 lg:grid-cols-3">
                    <img
                        src={course.imageUrl}
                        alt={course.courseName}
                        className="w-full h-64 lg:h-auto object-cover lg:rounded-l-lg"
                    />
                    <div className="p-6 lg:col-span-2 flex flex-col justify-between">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">{course.courseName}</h2>
                        <div className="mb-4">
                            <p className="mb-1"><strong>Instructor:</strong> <span className="text-gray-800 dark:text-gray-200">{course.instructor}</span></p>
                            <p className="mb-1"><strong>Platform:</strong> <span className="text-gray-800 dark:text-gray-200">{course.platform}</span></p>
                            <p className="mb-1"><strong>Category:</strong> <span className="text-gray-800 dark:text-gray-200">{course.category}</span></p>
                            <p className="mb-1"><strong>Duration:</strong> <span className="text-gray-800 dark:text-gray-200">{course.duration}</span></p>
                            <p className="mb-4"><strong>Price:</strong> <span className="text-gray-800 dark:text-gray-200">Rs. {course.price}</span></p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 mt-4">
                            <button
                                className={`px-4 py-2 rounded-md text-white font-medium transition ${bookmarkedCourses.includes(courseId) ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                                onClick={toggleBookmark}
                            >
                                {bookmarkedCourses.includes(courseId) ? 'Bookmarked' : 'Bookmark'}
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md text-white font-medium transition ${favoriteCourses.includes(courseId) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                                onClick={toggleFavorite}
                            >
                                {favoriteCourses.includes(courseId) ? 'Favorited' : 'Add to Favorites'}
                            </button>
                            <a
                                href={course.officialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-md text-white font-medium bg-yellow-600 hover:bg-yellow-700 transition"
                            >
                                Visit Official Page
                            </a>
                        </div>
                    </div>
                </div>

                {/* Course Description */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-semibold mb-4">Course Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
                </div>

                {/* Reviews Section */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-semibold mb-4">Write a Review</h3>
                    <textarea
                        className="w-full p-4 border text-black border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 mb-4"
                        rows="4"
                        placeholder="Share your thoughts on the course..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                    />
                    <button
                        className={`px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition ${!newReview.trim() && 'opacity-50 cursor-not-allowed'}`}
                        onClick={handleReviewSubmit}
                        disabled={!newReview.trim()}
                    >
                        Submit Review
                    </button>
                </div>

                {/* Display Reviews */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-semibold mb-4">Reviews</h3>
                    {reviewsLoading ? (
                        <p className="text-gray-600 dark:text-gray-300">Loading reviews...</p>
                    ) : reviewsError ? (
                        <p className="text-red-500">{reviewsError}</p>
                    ) : reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 py-4">
                                <p className="text-gray-800 dark:text-gray-200">{review.text}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">By {review.author} | {new Date(review.createdAt).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-300">No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default CourseDetail;
