import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Make sure to import your CSS file

function Profile() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(err.response?.data?.message || 'An error occurred while fetching the profile');
            }
        };

        fetchProfile();
    }, []);

    if (error) return <div className="error-message">Error: {error}</div>;
    if (!profile) return <div className="loading-message">Loading...</div>;

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-details">
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
            </div>
        </div>
    );
}

export default Profile;
