import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './machine.css'; 

const MachinesList = () => {
    const [machines, setMachines] = useState([]);
    const [filteredMachines, setFilteredMachines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [editId, setEditId] = useState(null);
    const [newMake, setNewMake] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMachines = async () => {
            const user = localStorage.getItem('id');
            if (!user) {
                setError('User not authenticated');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/machine/${user}`);
                if (!response.ok) {
                    setError('Failed to fetch machines');
                    return;
                }
                const data = await response.json();
                setMachines(data);
                setFilteredMachines(data); // Initialize filtered machines with all machines
            } catch (error) {
                setError('Network error. Please try again later.');
                console.error('Network error:', error.message);
            }
        };

        fetchMachines();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleEditClick = (id, currentMake) => {
        setEditId(id);
        setNewMake(currentMake);
    };

    const handleCancelClick = () => {
        setEditId(null);
        setNewMake('');
    };

    const handleUpdateClick = async (machineId, newMake) => {
        try {
            const response = await fetch(`http://localhost:5000/machine/update/${machineId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ make: newMake }), // Send only the 'make' field for update
            });
            if (!response.ok) {
                throw new Error('Failed to update machine');
            }
            // Update state to reflect the change locally
            const result = await response.json();
            alert(result.message);
            const updatedMachines = machines.map(machine => {
                if (machine._id === machineId) {
                    return { ...machine, make: newMake }; // Update only the 'make' field
                }
                return machine;
            });
            setMachines(updatedMachines);
            setEditId(null); // Reset edit state
        } catch (error) {
            console.error('Error updating machine:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this machine?')) {
            try {
                const response = await fetch(`http://localhost:5000/machine/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    alert('Failed to delete the machine.');
                    return;
                }

                setMachines(machines.filter(machine => machine._id !== id));
                setFilteredMachines(filteredMachines.filter(machine => machine._id !== id));
            } catch (error) {
                alert('Network error. Please try again later.');
                console.error('Network error:', error.message);
            }
        }
    };

    const handleUpdate = (id) => {
        navigate(`/form/${id}`);
    };

    const logout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const performSearch = () => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const filtered = machines.filter(machine =>
                machine.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                machine.make.toLowerCase().includes(lowerCaseSearchTerm)
            );
            setFilteredMachines(filtered);
        };

        performSearch();
    }, [searchTerm, machines]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="machines-list">
            <h2>MACHINE MAKE INFORMATION MAINTAINENCE</h2>
            <button className="add1-button" onClick={logout}>LogOut</button>
            <button className="add-button" onClick={() => navigate('/form')}>+Add Machine</button><br></br>
           
            <input
                type="text"
                placeholder="Search by name or make"
                value={searchTerm}
                onChange={handleSearchInputChange}
                style={{ padding: '5px' }}
            />
            <div className="machine-cards"> {/* Updated to use the correct CSS class */}
                {filteredMachines.map(machine => (
                    <div key={machine._id} className="machine-card">
                        <h3>{machine.name}</h3>
                        <p><span>Make:</span> {machine._id === editId ? (
                            <input
                                type="text"
                                value={newMake}
                                onChange={(e) => setNewMake(e.target.value)}
                            />
                        ) : (
                            machine.make
                        )}</p>
                        <p><span>Date of Manufacture:</span> {formatDate(machine.dateOfManufacture)}</p>
                        <p><span>Purchase Date:</span> {formatDate(machine.purchaseDate)}</p>
                        <p><span>Warranty Date:</span> {formatDate(machine.warrantyDate)}</p>
                        <p><span>Total Count:</span> {machine.count}</p>
                        {machine._id === editId ? (
                            <div className="btn-container">
                                <button onClick={() => handleUpdateClick(machine._id, newMake)} className="update-btn">Update</button>
                                <button onClick={handleCancelClick}  className="delete-btn">Cancel</button>
                            </div>
                        ) : (
                            <div className="btn-container">
                                <button onClick={() => handleEditClick(machine._id, machine.make)} className="update-btn">Edit</button>
                                <button onClick={() => handleDelete(machine._id)} className="delete-btn">Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MachinesList;
