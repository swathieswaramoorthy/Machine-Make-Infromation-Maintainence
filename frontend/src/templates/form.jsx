import React, { useState, useEffect } from 'react';
import './form.css';
import { useNavigate } from 'react-router-dom';

const MachineForm = () => {
    const [name, setName] = useState('');
    const [treateType, setTreateType] = useState('');
    const [make, setMake] = useState('');
    const [hsptlName, setHsptlName] = useState('');
    const [dateOfManufacture, setDateOfManufacture] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [warrantyDate, setWarrantyDate] = useState('');
    const [count, setCount] = useState('');
    const [errors, setErrors] = useState({});

    const id=localStorage.getItem('id');
    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await fetch(`http://localhost:5000/hsptl/name/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch machines');
                }
                const data = await response.json();
                console.log(data.hosp.hsptl_name);
                
                
                setHsptlName(data.hosp.hsptl_name);
            } catch (error) {
                console.error('Error fetching machines:', error);
            }
        };
        
        fetchMachines();
        
        
    }, [id]);
    const Navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const today = new Date();
        const newErrors = {};
        const alphaRegex = /^[A-Za-z\s]+$/;

        // Name validation
        if (!name || name.length < 3 || name.length > 100 || !alphaRegex.test(name)) {
            newErrors.name = 'Name must be 3-100 characters long and contain only alphabetic characters.';
        }

        // Treatment type validation
        if (!treateType || treateType.length < 3 || treateType.length > 100 || !alphaRegex.test(treateType)) {
            newErrors.treateType = 'Treatment type must be 3-100 characters long and contain only alphabetic characters.';
        }

        // Make validation
        if (!make || make.length < 3 || make.length > 100 || !alphaRegex.test(make)) {
            newErrors.make = 'Make must be 3-100 characters long and contain only alphabetic characters.';
        }

        // Date of Manufacture validation
        if (new Date(dateOfManufacture) >= today) {
            newErrors.dateOfManufacture = 'Date of manufacture must be before today.';
        }

        // Purchase Date validation
        if (new Date(purchaseDate) <= new Date(dateOfManufacture)) {
            newErrors.purchaseDate = 'Purchase date must be after date of manufacture.';
        }

        // Warranty Date validation
        if (new Date(warrantyDate) <= new Date(purchaseDate)) {
            newErrors.warrantyDate = 'Warranty date must be after purchase date.';
        }

        // Count validation
        if (parseInt(count) <= 0) {
            newErrors.count = 'Count must be greater than 0.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const machineData = {
            name,
            treate_type: treateType,
            make,
            hsptl_name: hsptlName,
            dateOfManufacture,
            purchaseDate,
            warrantyDate,
            count: parseInt(count)
        };

        try {
            const response = await fetch('http://localhost:5000/machine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(machineData),
            });

            if (!response.ok) {
                const result = await response.json();
                alert(result.message);
                return;
            }

            const result = await response.json();
            alert(result.message);

            setName('');
            setTreateType('');
            setMake('');
            setDateOfManufacture('');
            setPurchaseDate('');
            setWarrantyDate('');
            setCount('');
            setErrors({});
            Navigate("/admin");
        } catch (error) {
            alert('Network error. Please try again later.');
            console.error('Network error:', error.message);
        }
    };

    return (
        <div className="form-container">
            <h2><center>Add Machine</center></h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Machine Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                </div>
                <div>
                    <label>Treatment-Type:</label>
                    <input
                        type="text"
                        value={treateType}
                        onChange={(e) => setTreateType(e.target.value)}
                        required
                    />
                    {errors.treateType && <p style={{ color: 'red' }}>{errors.treateType}</p>}
                </div>
                <div>
                    <label>Machine Make:</label>
                    <input
                        type="text"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        required
                    />
                    {errors.make && <p style={{ color: 'red' }}>{errors.make}</p>}
                </div>
                <div>
                    <label>Hospital Name:</label>
                    <input
                        type="text"
                        value={hsptlName}
                        readOnly
                    />
                </div>
                <div>
                    <label>Date of Manufacture:</label>
                    <input
                        type="date"
                        value={dateOfManufacture}
                        onChange={(e) => setDateOfManufacture(e.target.value)}
                        required
                    />
                    {errors.dateOfManufacture && <p style={{ color: 'red' }}>{errors.dateOfManufacture}</p>}
                </div>
                <div>
                    <label>Purchase Date:</label>
                    <input
                        type="date"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        required
                    />
                    {errors.purchaseDate && <p style={{ color: 'red' }}>{errors.purchaseDate}</p>}
                </div>
                <div>
                    <label>Warranty Date:</label>
                    <input
                        type="date"
                        value={warrantyDate}
                        onChange={(e) => setWarrantyDate(e.target.value)}
                        required
                    />
                    {errors.warrantyDate && <p style={{ color: 'red' }}>{errors.warrantyDate}</p>}
                </div>
                <div>
                    <label>Total Count:</label>
                    <input
                        type="number"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        required
                    />
                    {errors.count && <p style={{ color: 'red' }}>{errors.count}</p>}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default MachineForm;
