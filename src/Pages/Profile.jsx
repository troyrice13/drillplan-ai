import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

// Conversion functions
const cmToFeetInches = (cm) => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return { feet, inches: remainingInches };
};

const feetInchesToCm = (feet, inches) => {
    return Math.round((feet * 12 + inches) * 2.54);
};

const kgToLbs = (kg) => Math.round(kg * 2.20462);
const lbsToKg = (lbs) => Math.round(lbs / 2.20462);

function Profile() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
        email: '',
        heightFeet: '',
        heightInches: '',
        weightLbs: '',
        fitnessGoal: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedProfile = response.data;
            const { feet, inches } = cmToFeetInches(fetchedProfile.height || 0);
            setProfile({
                ...fetchedProfile,
                heightFeet: feet,
                heightInches: inches,
                weightLbs: kgToLbs(fetchedProfile.weight || 0),
            });
            setEditedProfile({
                email: fetchedProfile.email || '',
                heightFeet: feet.toString(),
                heightInches: inches.toString(),
                weightLbs: kgToLbs(fetchedProfile.weight || 0).toString(),
                fitnessGoal: fetchedProfile.fitnessGoal || '',
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to fetch profile. Please try again later.');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        const { feet, inches } = cmToFeetInches(profile.height || 0);
        setEditedProfile({
            email: profile.email || '',
            heightFeet: feet.toString(),
            heightInches: inches.toString(),
            weightLbs: kgToLbs(profile.weight || 0).toString(),
            fitnessGoal: profile.fitnessGoal || '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const heightCm = feetInchesToCm(
                parseInt(editedProfile.heightFeet) || 0,
                parseInt(editedProfile.heightInches) || 0
            );
            const weightKg = lbsToKg(parseInt(editedProfile.weightLbs) || 0);
            
            const updatedProfile = {
                email: editedProfile.email,
                height: heightCm,
                weight: weightKg,
                fitnessGoal: editedProfile.fitnessGoal,
            };
    
            const response = await axios.put('http://localhost:3000/api/profile', updatedProfile, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.status === 200) {
                const updatedData = response.data;
                const { feet, inches } = cmToFeetInches(updatedData.height || 0);
                const updatedProfileState = {
                    ...profile,
                    ...updatedData,
                    heightFeet: feet,
                    heightInches: inches,
                    weightLbs: kgToLbs(updatedData.weight || 0),
                };
                setProfile(updatedProfileState);
                setEditedProfile({
                    email: updatedData.email,
                    heightFeet: feet.toString(),
                    heightInches: inches.toString(),
                    weightLbs: kgToLbs(updatedData.weight || 0).toString(),
                    fitnessGoal: updatedData.fitnessGoal,
                });
                setIsEditing(false);
                alert('Profile updated successfully!');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again later.');
        }
    };

    if (error) return <div className="error-message">Error: {error}</div>;
    if (!profile) return <div className="loading-message">Loading...</div>;

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-card">
                <div className="profile-header">
                    <img src={profile.avatar || 'https://via.placeholder.com/150'} alt="Profile" className="profile-avatar" />
                    <h2>{profile.username}</h2>
                </div>
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" value={editedProfile.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="heightFeet">Height:</label>
                            <div className="height-inputs">
                                <input type="number" id="heightFeet" name="heightFeet" value={editedProfile.heightFeet} onChange={handleChange} min="0" max="8" /> ft
                                <input type="number" id="heightInches" name="heightInches" value={editedProfile.heightInches} onChange={handleChange} min="0" max="11" /> in
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="weightLbs">Weight (lbs):</label>
                            <input type="number" id="weightLbs" name="weightLbs" value={editedProfile.weightLbs} onChange={handleChange} min="0" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fitnessGoal">Fitness Goal:</label>
                            <select id="fitnessGoal" name="fitnessGoal" value={editedProfile.fitnessGoal} onChange={handleChange}>
                                <option value="">Select a goal</option>
                                <option value="muscle growth">Muscle Growth</option>
                                <option value="lean muscle">Lean Muscle</option>
                                <option value="weight loss">Weight Loss</option>
                                <option value="general fitness">General Fitness</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="save-btn">Save Changes</button>
                            <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-details">
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Height:</strong> {profile.heightFeet} ft {profile.heightInches} in</p>
                        <p><strong>Weight:</strong> {profile.weightLbs} lbs</p>
                        <p><strong>Fitness Goal:</strong> {profile.fitnessGoal}</p>
                        <button onClick={handleEdit} className="edit-btn">Edit Profile</button>
                    </div>
                )}
            </div>
            <div className="fitness-stats">
                <h3>Fitness Stats</h3>
                <div className="stat-grid">
                    <div className="stat-item">
                        <span className="stat-value">{profile.workoutsCompleted || 0}</span>
                        <span className="stat-label">Workouts Completed</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{profile.totalWorkoutMinutes || 0}</span>
                        <span className="stat-label">Total Workout Minutes</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{profile.streakDays || 0}</span>
                        <span className="stat-label">Day Streak</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;