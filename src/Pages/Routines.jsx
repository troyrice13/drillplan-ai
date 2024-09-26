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
    const [editingRoutine, setEditingRoutine] = useState(null);

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

    const handleEditRoutine = async () => {
        if (editingRoutine.name && editingRoutine.exercises.length > 0) {
            const updatedRoutines = routines.map(r =>
                r._id === editingRoutine._id ? { ...r, ...editingRoutine } : r
            );
            setRoutines(updatedRoutines);
    
            try {
                const { _id, userId, ...routineWithoutIdAndUserId } = editingRoutine;
                const response = await axios.put(
                    `http://localhost:3000/api/routines/${editingRoutine._id}`,
                    routineWithoutIdAndUserId,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                );
    
                setRoutines(routines.map(r => r._id === editingRoutine._id ? response.data : r));
                setEditingRoutine(null);
                setError('');
            } catch (error) {
                console.error('Error updating routine:', error.response?.data || error.message);
                setError('Error updating routine. Please try again.');
                fetchRoutines(); 
            }
        } else {
            setError('Please provide a name and at least one exercise for the routine.');
        }
    };    
    

    const handleDeleteRoutine = async (routineId) => {
        try {
            await axios.delete(`http://localhost:3000/api/routines/${routineId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRoutines(routines.filter(r => r._id !== routineId));
            setError('');
        } catch (error) {
            console.error('Error deleting routine:', error);
            setError('Error deleting routine. Please try again.');
        }
    };

    const addExerciseToRoutine = (routine, setRoutine) => {
        if (newExercise.name && newExercise.sets && newExercise.reps) {
            setRoutine(prev => ({
                ...prev,
                exercises: [...prev.exercises, { ...newExercise, sets: parseInt(newExercise.sets), reps: parseInt(newExercise.reps) }]
            }));
            setNewExercise({ name: '', sets: '', reps: '' });
            setError('');
        } else {
            setError('Please fill in all exercise fields.');
        }
    };

    const removeExercise = (routine, setRoutine, index) => {
        setRoutine(prev => ({
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
                                    <button onClick={() => addExerciseToRoutine(newRoutine, setNewRoutine)} className="add-exercise-btn">Add</button>
                                </div>
                                {newRoutine.exercises.length > 0 && (
                                    <div className="exercise-list">
                                        <h3>Exercises:</h3>
                                        <ul>
                                            {newRoutine.exercises.map((exercise, index) => (
                                                <li key={index}>
                                                    {exercise.name}: {exercise.sets} sets, {exercise.reps} reps
                                                    <button onClick={() => removeExercise(newRoutine, setNewRoutine, index)} className="remove-exercise-btn">Remove</button>
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

                    {editingRoutine && (
                        <div className="overlay">
                            <div className="card-overlay">
                                <input
                                    type="text"
                                    value={editingRoutine.name}
                                    onChange={(e) => setEditingRoutine({...editingRoutine, name: e.target.value})}
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
                                    <button onClick={() => addExerciseToRoutine(editingRoutine, setEditingRoutine)} className="add-exercise-btn">Add</button>
                                </div>
                                {editingRoutine.exercises.length > 0 && (
                                    <div className="exercise-list">
                                        <h3>Exercises:</h3>
                                        <ul>
                                            {editingRoutine.exercises.map((exercise, index) => (
                                                <li key={index}>
                                                    {exercise.name}: {exercise.sets} sets, {exercise.reps} reps
                                                    <button onClick={() => removeExercise(editingRoutine, setEditingRoutine, index)} className="remove-exercise-btn">Remove</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="button-group">
                                    <button onClick={() => setEditingRoutine(null)} className="cancel-btn">Cancel</button>
                                    <button onClick={handleEditRoutine} className="save-btn">Save Changes</button>
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
                                            <li key={`${routine._id}-${index}`}>{exercise.name}: {exercise.sets} sets, {exercise.reps} reps</li>
                                        ))}
                                    </ul>
                                    <div className="button-group">
                                        <button onClick={() => setEditingRoutine(routine)} className="edit-btn">Edit</button>
                                        <button onClick={() => handleDeleteRoutine(routine._id)} className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}