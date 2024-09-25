import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Routines.css';

export default function Routines() {
    const [routines, setRoutines] = useState([]);
    const [editingRoutine, setEditingRoutine] = useState(null);
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
            setRoutines(response.data); // Response will be an empty array if no routines are found
            setLoading(false);
        } catch (error) {
            console.error('Error fetching routines:', error);
            setError('Error fetching routines.');
            setLoading(false);
        }
    };

    const handleEdit = (routine) => {
        setEditingRoutine({ ...routine });
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:3000/api/routines/${editingRoutine._id}`, editingRoutine, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setEditingRoutine(null);
            fetchRoutines(); // Refresh the list of routines after save
        } catch (error) {
            console.error('Error updating routine:', error);
            setError('Error updating routine.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/routines/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchRoutines(); // Refresh the list of routines after deletion
        } catch (error) {
            console.error('Error deleting routine:', error);
            setError('Error deleting routine.');
        }
    };

    const handleExerciseChange = (index, key, value) => {
        const updatedExercises = [...editingRoutine.exercises];
        updatedExercises[index][key] = value;
        setEditingRoutine({ ...editingRoutine, exercises: updatedExercises });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="routines-container">
            <h1>My Routines</h1>
            {routines.length === 0 ? (
                <p>No routines found. Create your first routine to get started!</p>
            ) : (
                routines.map((routine) => (
                    <div key={routine._id} className="routine-card">
                        <h2>{routine.name}</h2>
                        <ul>
                            {routine.exercises.map((exercise, index) => (
                                <li key={index}>
                                    {exercise.name}: {exercise.sets} sets, {exercise.reps} reps
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handleEdit(routine)}>Edit</button>
                        <button onClick={() => handleDelete(routine._id)}>Delete</button>
                    </div>
                ))
            )}
            {editingRoutine && (
                <EditRoutineForm
                    routine={editingRoutine}
                    setEditingRoutine={setEditingRoutine}
                    handleSave={handleSave}
                    handleExerciseChange={handleExerciseChange}
                />
            )}
        </div>
    );
}

// Edit Routine Form Component
function EditRoutineForm({ routine, setEditingRoutine, handleSave, handleExerciseChange }) {
    return (
        <div className="edit-routine-modal">
            <h3>Edit Routine</h3>
            <input
                type="text"
                value={routine.name}
                onChange={(e) => setEditingRoutine({ ...routine, name: e.target.value })}
                placeholder="Routine Name"
            />
            {routine.exercises.map((exercise, index) => (
                <div key={index} className="exercise-inputs">
                    <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        placeholder="Exercise Name"
                    />
                    <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                        placeholder="Sets"
                    />
                    <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                        placeholder="Reps"
                    />
                </div>
            ))}
            <div className="modal-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditingRoutine(null)}>Cancel</button>
            </div>
        </div>
    );
}
