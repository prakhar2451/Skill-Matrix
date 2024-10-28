import { useEffect, useState } from 'react';
import { database } from '../utils/firebase';
import { onValue, ref } from 'firebase/database';

export const useFetchReviews = (courseId) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseId) {
            setLoading(false);
            return;
        }

        const reviewRef = ref(database, `courses/${courseId}/reviews`);
        const unsubscribe = onValue(reviewRef, (snapshot) => {
            setLoading(false);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const fetchedReviews = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                }));
                setReviews(fetchedReviews);
            } else {
                setReviews([]);
            }
        }, (error) => {
            setLoading(false);
            console.error("Error fetching reviews: ", error);
            setError("Failed to fetch reviews, please try again later.");
        });

        return () => unsubscribe();
    }, [courseId]);

    return { reviews, loading, error };
};

