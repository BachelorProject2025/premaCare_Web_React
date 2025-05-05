// src/components/FeedingRecords.jsx
import { useState, useEffect } from 'react';
import api from '../utils/api';

const FeedingRecords = ({ userId, babyName }) => {
    const [feedingRecords, setFeedingRecords] = useState([]);
    const [totalMilk, setTotalMilk] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];

        const fetchFeedingRecords = async () => {
            setLoading(true);
            try {
                const recordsRes = await api.get(`/feedingRecords/${userId}/${today}/${babyName}`);
                setFeedingRecords(recordsRes.data);

                const milkRes = await api.get(`/totalMilk/${userId}/${today}`);
                setTotalMilk(milkRes.data);
            } catch (err) {
                console.error('Error fetching feeding records:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId && babyName) {
            fetchFeedingRecords();
        }
    }, [userId, babyName]);

    return (
        <div>
            <h2>Feeding Records</h2>
            {loading ? (
                <p>Loading feeding records...</p>
            ) : (
                <>
                    <p><strong>Total Milk Today:</strong> {totalMilk}</p>
                    {feedingRecords.length > 0 ? (
                        <ul>
                            {feedingRecords.map((record) => (
                                <li key={record.id}>
                                    <strong>{record.time}</strong> – {record.amount} ml via {record.type}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No feeding records for today.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default FeedingRecords;
