import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Routines.css';

export default function Routines() {
    const [routines, setRoutines] = useState([]);
    const [editingRoutine, setEditingRoutine] = useState(null);

    useEffect(() => {
        fetchRoutines();
    }, []);

    const fetchRoutines = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/routines', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRoutines(response.data);
        } catch (error) {
            console.error('Error fetching routines:', error);
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
            fetchRoutines();
        } catch (error) {
            console.error('Error updating routine:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/routines/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchRoutines();
        } catch (error) {
            console.error('Error deleting routine:', error);
        }
    };

    return (
        <div className="routines-container">
            <h1>My Routines</h1>
            {routines.map(routine => (
                <div key={routine._id} className="routine-card">
                    <h2>{routine.name}</h2>
                    <ul>
                        {routine.exercises.map((exercise, index) => (
                            <li key={index}>{exercise.name}: {exercise.sets} sets, {exercise.reps} reps</li>
                        ))}
                    </ul>
                    <button onClick={() => handleEdit(routine)}>Edit</button>
                    <button onClick={() => handleDelete(routine._id)}>Delete</button>
                </div>
            ))}
            {editingRoutine && (
                <div className="edit-routine-modal">
                    <input
                        value={editingRoutine.name}
                        onChange={(e) => setEditingRoutine({ ...editingRoutine, name: e.target.value })}
                    />
                    {editingRoutine.exercises.map((exercise, index) => (
                        <div key={index}>
                            <input
                                value={exercise.name}
                                onChange={(e) => {
                                    const newExercises = [...editingRoutine.exercises];
                                    newExercises[index].name = e.target.value;
                                    setEditingRoutine({ ...editingRoutine, exercises: newExercises });
                                }}
                            />
                            <input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) => {
                                    const newExercises = [...editingRoutine.exercises];
                                    newExercises[index].sets = parseInt(e.target.value);
                                    setEditingRoutine({ ...editingRoutine, exercises: newExercises });
                                }}
                            />
                            <input
                                type="number"
                                value={exercise.reps}
                                onChange={(e) => {
                                    const newExercises = [...editingRoutine.exercises];
                                    newExercises[index].reps = parseInt(e.target.value);
                                    setEditingRoutine({ ...editingRoutine, exercises: newExercises });
                                }}
                            />
                        </div>
                    ))}
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditingRoutine(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
}