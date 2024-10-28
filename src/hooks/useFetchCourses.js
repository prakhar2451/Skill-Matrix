import { useState, useEffect } from 'react';
import { onValue, ref } from 'firebase/database';
import { database } from '../utils/firebase';

export const useFetchCourses = () => {
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = () => {
            const courseRef = ref(database, 'courses');

            onValue(courseRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const coursesArray = Object.keys(data).map(key => ({
                        courseId: key,
                        ...data[key]
                    }));
                    setCourseList(coursesArray);
                } else {
                    setCourseList([]); // No data available
                }
                setLoading(false);
            }, (error) => {
                console.error("Error fetching courses: ", error);
                setError(error);
                setLoading(false);
            });
        };

        fetchCourses();
    }, []);

    return { courseList, loading, error };
};

