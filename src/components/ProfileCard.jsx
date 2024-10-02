// ProfileCard.js
import React from 'react';
import './Profile.css';

const ProfileCard = ({ profile, isEditing, editedProfile, handleChange, handleSubmit, handleCancel, handleEdit }) => (
    <div className="profile-card">
        <div className="profile-header">
            <img src={profile.avatar || 'https://via.placeholder.com/150'} alt="Profile" className="profile-avatar" />
            <h2>{profile.username}</h2>
        </div>
        <div className="profile-email">
            <strong>Email:</strong> {profile.email}
        </div>
        {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label htmlFor="heightFeet">Height:</label>
                    <div className="height-inputs">
                        <input 
                            type="number" 
                            id="heightFeet" 
                            name="heightFeet" 
                            value={editedProfile.heightFeet} 
                            onChange={handleChange} 
                            min="0" 
                            max="8" 
                        /> ft
                        <input 
                            type="number" 
                            id="heightInches" 
                            name="heightInches" 
                            value={editedProfile.heightInches} 
                            onChange={handleChange} 
                            min="0" 
                            max="11" 
                        /> in
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="weightLbs">Weight (lbs):</label>
                    <input 
                        type="number" 
                        id="weightLbs" 
                        name="weightLbs" 
                        value={editedProfile.weightLbs} 
                        onChange={handleChange} 
                        min="0" 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fitnessGoal">Fitness Goal:</label>
                    <select 
                        id="fitnessGoal" 
                        name="fitnessGoal" 
                        value={editedProfile.fitnessGoal} 
                        onChange={handleChange}
                    >
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
                <p><strong>Height:</strong> {profile.heightFeet} ft {profile.heightInches} in</p>
                <p><strong>Weight:</strong> {profile.weightLbs} lbs</p>
                <p><strong>Fitness Goal:</strong> {profile.fitnessGoal}</p>
                <button onClick={handleEdit} className="edit-btn">Edit Profile</button>
            </div>
        )}
    </div>
);

export default ProfileCard;
