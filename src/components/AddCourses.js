import React, { useState } from 'react'
import Header from './Header';
import { database } from '../utils/firebase';
import { ref } from 'firebase/database';
import { push } from 'firebase/database';
const AddCourses = () => {
    /**
     * Course:
     * courseId (auto)
     * courseName
     * rating
     * duration
     * validity
     * certificaton
     * price
     * imageUrl
     * instructor
     * platform
     * category
     * description
     * isFavourite
     * fvrtCount
     * officialUrl
     * 
     * 
     */

    const [course, setCourse] = useState({
        courseName: '',
        rating: '',
        duration: '',
        validity: '',
        certification: '',
        price: '',
        imageUrl: '',
        instructor: '',
        platform: '',
        category: '',
        description: '',
        isFavourite: false,
        fvrtCount: 0,
        officialUrl: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((previousCourse) => ({
            ...previousCourse,
            [name]: value
        }));
    };

    // handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(course);
        const courseRef = ref(database, 'courses');

        push(courseRef, {
            ...course,
            fvrtCount: 0,
            isFavourite: false
        })
            .then(() => {
                alert("Course added successfuly");
                // clear form after submission
                setCourse({
                    courseName: '',
                    rating: '',
                    duration: '',
                    validity: '',
                    certification: '',
                    price: '',
                    imageUrl: '',
                    instructor: '',
                    platform: '',
                    category: '',
                    description: '',
                    isFavourite: false,
                    fvrtCount: 0,
                    officialUrl: ''

                });
            })
            .catch((error) => {
                console.error("Error adding course: ", error)
            });
    };
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header />
            <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-20 overflow-hidden">
                <div className="lg:col-span-8 lg:col-start-3 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="courseName" className="block text-sm font-medium">Course Name</label>
                                <input
                                    type="text"
                                    id="courseName"
                                    name="courseName"
                                    value={course.courseName}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="rating" className="block text-sm font-medium">Rating</label>
                                <input
                                    type="number"
                                    id="rating"
                                    name="rating"
                                    value={course.rating}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium">Duration (hours)</label>
                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    value={course.duration}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="validity" className="block text-sm font-medium">Validity (months)</label>
                                <input
                                    type="text"
                                    id="validity"
                                    name="validity"
                                    value={course.validity}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="certification" className="block text-sm font-medium">Certification</label>
                                <input
                                    type="text"
                                    id="certification"
                                    name="certification"
                                    value={course.certification}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium">Price (INR)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={course.price}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-medium">Image URL</label>
                                <input
                                    type="url"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={course.imageUrl}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="instructor" className="block text-sm font-medium">Instructor</label>
                                <input
                                    type="text"
                                    id="instructor"
                                    name="instructor"
                                    value={course.instructor}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="platform" className="block text-sm font-medium">Platform</label>
                                <input
                                    type="text"
                                    id="platform"
                                    name="platform"
                                    value={course.platform}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium">Category</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={course.category}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>

                            <div className="lg:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={course.description}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>

                            <div className="lg:col-span-2">
                                <label htmlFor="officialUrl" className="block text-sm font-medium">Official URL</label>
                                <input
                                    type="url"
                                    id="officialUrl"
                                    name="officialUrl"
                                    value={course.officialUrl}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow"
                            >
                                Add Course
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCourses;