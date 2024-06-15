import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateMachineForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [make, setMake] = useState('');
    const [count, setCount] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMachine = async () => {
            try {
                const response = await fetch(`http://localhost:5000/machine/${id}`);
                if (!response.ok) {
                    setError('Failed to fetch machine details');
                    return;
                }
                const data = await response.json();
                setMake(data.make);
                setCount(data.count.toString());
            } catch (error) {
                setError('Network error. Please try again later.');
                console.error('Network error:', error.message);
            }
        };

        fetchMachine();
    }, [id]);

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:5000/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ make, count: parseInt(count) }),
            });

            if (!response.ok) {
                const result = await response.json();
                setError(result.message);
                return;
            }

            alert('Machine updated successfully');
            navigate('/machine');
        } catch (error) {
            setError('Network error. Please try again later.');
            console.error('Network error:', error.message);
        }
    };
    

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>Update Machine</h2>
            <form>
                <div>
                    <label>Make:</label>
                    <input
                        type="text"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Total Count:</label>
                    <input
                        type="number"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        required
                    />
                </div>
                <button type="button" onClick={handleUpdate}>Update Machine</button>
            </form>
        </div>
    );
};

export default UpdateMachineForm;
