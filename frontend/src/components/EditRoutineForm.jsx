import React from "react";

export default function EditRoutineForm({ routine, setEditingRoutine, handleSave, handleExerciseChange }) {
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
                        onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                        placeholder="Sets"
                        min="1"
                    />
                    <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        placeholder="Reps"
                        min="1"
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
