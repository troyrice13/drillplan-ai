import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import './Profile.css';

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
    const [isLoading, setIsLoading] = useState(true);
    const [editedProfile, setEditedProfile] = useState({
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
                heightFeet: feet.toString(),
                heightInches: inches.toString(),
                weightLbs: kgToLbs(fetchedProfile.weight || 0).toString(),
                fitnessGoal: fetchedProfile.fitnessGoal || '',
            });
            setError('');
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to fetch profile. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        setIsEditing(false);
        if (profile) {
            const { feet, inches } = cmToFeetInches(profile.height || 0);
            setEditedProfile({
                heightFeet: feet.toString(),
                heightInches: inches.toString(),
                weightLbs: kgToLbs(profile.weight || 0).toString(),
                fitnessGoal: profile.fitnessGoal || '',
            });
        }
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
                setProfile({
                    ...profile,
                    ...updatedData,
                    heightFeet: feet,
                    heightInches: inches,
                    weightLbs: kgToLbs(updatedData.weight || 0),
                });
                setEditedProfile({
                    heightFeet: feet.toString(),
                    heightInches: inches.toString(),
                    weightLbs: kgToLbs(updatedData.weight || 0).toString(),
                    fitnessGoal: updatedData.fitnessGoal,
                });
                setIsEditing(false);
                setError('');
                alert('Profile updated successfully!');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again later.');
        }
    };

    if (isLoading) return <div className="loading-message">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <ProfileCard 
                profile={profile} 
                isEditing={isEditing} 
                editedProfile={editedProfile} 
                handleChange={handleChange} 
                handleSubmit={handleSubmit} 
                handleCancel={handleCancel} 
                handleEdit={handleEdit} 
            />
        </div>
    );
}

export default Profile;
