import { useState } from 'react';
import api from '../utils/api';

const SearchChild = ({ setChildData }) => {
    const [childName, setChildName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const searchChild = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/searchChild?name=${childName}`);
            setChildData(response.data);
        } catch (err) {
            setError('Error searching for child');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter child name"
            />
            <button onClick={searchChild} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default SearchChild;
