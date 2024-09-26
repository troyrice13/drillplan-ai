import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Routines.css';

export default function Routines() {
    const [routines, setRoutines] = useState([]);
    const [isAddingRoutine, setIsAddingRoutine] = useState(false);
    const [newRoutine, setNewRoutine] = useState({ name: '', exercises: [] });
    const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/routines', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRoutines(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching routines:', error);
            setError('Error fetching routines. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoutine = async () => {
        if (newRoutine.name && newRoutine.exercises.length > 0) {
            try {
                const response = await axios.post('http://localhost:3000/api/routines', newRoutine, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setRoutines([...routines, response.data]);
                setIsAddingRoutine(false);
                setNewRoutine({ name: '', exercises: [] });
                setError('');
            } catch (error) {
                console.error('Error creating routine:', error);
                setError('Error creating routine. Please try again.');
            }
        } else {
            setError('Please provide a name and at least one exercise for the routine.');
        }
    };

    const addExerciseToRoutine = () => {
        if (newExercise.name && newExercise.sets && newExercise.reps) {
            setNewRoutine(prev => ({
                ...prev,
                exercises: [...prev.exercises, { ...newExercise, sets: parseInt(newExercise.sets), reps: parseInt(newExercise.reps) }]
            }));
            setNewExercise({ name: '', sets: '', reps: '' });
            setError('');
        } else {
            setError('Please fill in all exercise fields.');
        }
    };

    const removeExercise = (index) => {
        setNewRoutine(prev => ({
            ...prev,
            exercises: prev.exercises.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="routines-container">
            <h1>My Routines</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            {loading ? (
                <div className="loading">Loading routines...</div>
            ) : (
                <>
                    <button className="add-routine-btn" onClick={() => setIsAddingRoutine(true)}>
                        Add New Routine
                    </button>

                    {isAddingRoutine && (
                        <div className="overlay">
                            <div className="card-overlay">
                                <input
                                    type="text"
                                    value={newRoutine.name}
                                    onChange={(e) => setNewRoutine({...newRoutine, name: e.target.value})}
                                    placeholder="Enter routine name"
                                    className="routine-name-input"
                                />
                                <div className="add-exercise">
                                    <input
                                        type="text"
                                        value={newExercise.name}
                                        onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                                        placeholder="Exercise"
                                    />
                                    <input
                                        type="number"
                                        value={newExercise.sets}
                                        onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
                                        placeholder="Sets"
                                    />
                                    <input
                                        type="number"
                                        value={newExercise.reps}
                                        onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                                        placeholder="Reps"
                                    />
                                    <button onClick={addExerciseToRoutine} className="add-exercise-btn">Add</button>
                                </div>
                                {newRoutine.exercises.length > 0 && (
                                    <div className="exercise-list">
                                        <h3>Exercises:</h3>
                                        <ul>
                                            {newRoutine.exercises.map((exercise, index) => (
                                                <li key={index}>
                                                    {exercise.name}: {exercise.sets} sets, {exercise.reps} reps
                                                    <button onClick={() => removeExercise(index)} className="remove-exercise-btn">Remove</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="button-group">
                                    <button onClick={() => setIsAddingRoutine(false)} className="cancel-btn">Cancel</button>
                                    <button onClick={handleAddRoutine} className="save-btn">Save Routine</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {routines.length === 0 ? (
                        <div className="no-routines-message">
                            No routines yet. Add one now to get started!
                        </div>
                    ) : (
                        <div className="routines-list">
                            {routines.map((routine) => (
                                <div key={routine._id} className="routine-card">
                                    <h2>{routine.name}</h2>
                                    <ul>
                                        {routine.exercises.map((exercise, index) => (
                                            <li key={index}>{exercise.name}: {exercise.sets} sets, {exercise.reps} reps</li>
                                        ))}
                                    </ul>
                                    {/* Edit and Delete buttons would go here */}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}