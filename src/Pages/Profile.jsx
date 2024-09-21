import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import './Profile.css'

export default function Profile() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        height: '',
        weight: '',
        fitnessGoal: '',
        preferredWorkoutTypes: [],
    });

    useEffect(() => {
        fetchProfile();
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProfile(res.data);
        } catch (err) {
            console.error('Error fetching profile: ', err)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleWorkoutTypeChange = (e) => {
        const { value, checked } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            preferredWorkoutTypes: checked
            ? [...prevProfile.preferredWorkoutTypes, value]
            : prevProfile.preferredWorkoutTypes.filter(type => type !== value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put('http://localhost:3000/api/profile', profile, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Profile updated successsfully!')
        } catch (err) {
            console.error('Failed to update profile ', err);
            alert('Failed to update profile, please try again.')
        }
    };

    return (
        <div className="profile-container">
          <h1>User Profile</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={profile.username}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="height">Height (cm):</label>
              <input
                type="number"
                id="height"
                name="height"
                value={profile.height}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="weight">Weight (kg):</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={profile.weight}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="fitnessGoal">Fitness Goal:</label>
              <select
                id="fitnessGoal"
                name="fitnessGoal"
                value={profile.fitnessGoal}
                onChange={handleChange}
              >
                <option value="">Select a goal</option>
                <option value="muscle growth">Muscle Growth</option>
                <option value="lean muscle">Lean Muscle</option>
                <option value="weight loss">Weight Loss</option>
                <option value="general fitness">General Fitness</option>
              </select>
            </div>
            <div>
              <label>Preferred Workout Types:</label>
              {['Cardio', 'Strength Training', 'Yoga', 'HIIT'].map(type => (
                <div key={type}>
                  <input
                    type="checkbox"
                    id={type}
                    name="preferredWorkoutTypes"
                    value={type}
                    checked={profile.preferredWorkoutTypes.includes(type)}
                    onChange={handleWorkoutTypeChange}
                  />
                  <label htmlFor={type}>{type}</label>
                </div>
              ))}
            </div>
            <button type="submit">Update Profile</button>
          </form>
        </div>
      );
}