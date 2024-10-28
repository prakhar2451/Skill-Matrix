import { Link } from 'react-router-dom';
import { useFetchCourses } from '../hooks/useFetchCourses';

const CourseCards = ({ searchTerm }) => {
    const { courseList, loading } = useFetchCourses();
    console.log(courseList);

    const filteredCourses = courseList.filter(course => {
        const descriptionMatches = course.description.toLowerCase().includes(searchTerm.toLowerCase());
        return course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || descriptionMatches;
    });

    // Loader component
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                <p className="ml-4 text-indigo-600 dark:text-indigo-400">Loading courses...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
                className="overflow-y-auto max-h-[75vh] scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={(e) => (e.target.style.scrollbarGutter = 'stable')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div
                                key={course.courseId}
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 flex flex-col"
                            >
                                <img
                                    src={course.imageUrl}
                                    alt={course.courseName}
                                    className="w-full h-32 object-contain rounded-md mb-2"
                                />

                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{course.courseName}</h3>
                                <div className="flex flex-col mt-2 mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Duration:</span> {course.duration} hours
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Price:</span> Rs. {course.price}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Rating:</span> {course.rating} ⭐
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Platform:</span> {course.platform}
                                    </p>
                                </div>
                                <Link
                                    to={`/home/${course.courseId}`}
                                    className="mt-auto px-4 py-2 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 dark:text-gray-300 text-center">No courses found</p>
                    )}
                    {filteredCourses.length === 0 && (
                        <p className="text-gray-600 dark:text-gray-300 text-center">No more courses to load.</p>
                    )}
                </div>
            </div>
        </div>



    );
};

export default CourseCards;
