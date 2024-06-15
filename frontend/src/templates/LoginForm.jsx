import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate=useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:5000/admin/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const { status } = response;

                const result = await response.json();
      alert(result.message);

                console.error('Error logging in:', response.statusText);
                return;
            }
            
            const result = await response.json();
            alert(result.message);
            //alert(result.user.email);
           
            localStorage.setItem('id',result.user.hospital);
            navigate("/machines");// Log success message from backend

            // Clear form fields after successful submission
            setEmail('');
            setPassword('');
            setError('');
        } catch (error) {
            setError('Network error. Please try again later.');
            console.error('Network error:', error.message);
        }
    };

    return (
        <div className='login-container'>
            <div className = 'header'>
                <h1>MACHINE MAKE INFORMATION MAINTAINENCE</h1>
            </div>
            <br></br><br></br><h2>Login</h2>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='input-group'>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className='login-button-i '>Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default LoginForm;
