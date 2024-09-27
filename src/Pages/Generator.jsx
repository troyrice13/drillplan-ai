import React, { useState } from "react";
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './Generator.css';

export default function Generator() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'system', content: "Welcome! Let's create your custom workout routine. First, could you tell me your fitness goals (e.g., building muscle, losing weight, improving endurance)? If you have any preferences for the types of exercises or equipment, let me know as well." }
    ]);
    const [loading, setLoading] = useState(false);
    const [generatedRoutine, setGeneratedRoutine] = useState(null);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const formatAIResponse = (response) => {
        const lines = response.split('\n');
        let formattedResponse = '';
        let inList = false;

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('#')) {
                const headerLevel = line.split('#').length - 1;
                formattedResponse += `${'#'.repeat(headerLevel)} ${line.replace(/#/g, '').trim()}\n`;
            } else if (line.match(/^\d+\.\s+.+$/)) {
                if (!inList) {
                    formattedResponse += '\n';
                    inList = true;
                }
                formattedResponse += `${line}\n`;
            } else if (line.startsWith('-') || line.startsWith('○')) {
                if (!inList) {
                    formattedResponse += '\n';
                    inList = true;
                }
                formattedResponse += `${line}\n`;
            } else if (line !== '') {
                if (inList) {
                    formattedResponse += '\n';
                    inList = false;
                }
                formattedResponse += `${line}\n`;
            }
        });

        return formattedResponse.trim();
    };

    const formatAIResponseToRoutine = (formattedResponse) => {
        const lines = formattedResponse.split('\n');
        let routine = { name: "", exercises: [] };
        let currentExercise = null;
    
        lines.forEach(line => {
            line = line.trim();
    
            if (!line) return;
    
            if (line.startsWith('- **') && line.endsWith('**') && routine.name === "") {
                routine.name = line.replace(/[-*]/g, '').replace(/\*\*/g, '').trim();
                return;
            }
    

            if (line.startsWith('- **') && line.endsWith('**')) {
                currentExercise = {
                    name: line.replace(/[-*]/g, '').replace(/\*\*/g, '').trim(),
                    sets: 0,
                    reps: 0,
                    weight: 0
                };
                routine.exercises.push(currentExercise);
                return;
            }
    

            const setsMatch = line.match(/Sets:\s*(\d+)/i);
            const repsMatch = line.match(/Reps:\s*(\d+)/i);
            const weightMatch = line.match(/Weight:\s*(\d+)/i);
    
            if (currentExercise) {
                if (setsMatch) {
                    currentExercise.sets = parseInt(setsMatch[1]);
                }
                if (repsMatch) {
                    currentExercise.reps = parseInt(repsMatch[1]);
                }
                if (weightMatch) {
                    currentExercise.weight = parseInt(weightMatch[1]);
                }
            }
        });
    

        if (!routine.name || routine.exercises.length === 0) {
            console.error("Routine parsing failed: Missing routine name or exercises.");
            return null;
        }
 
        routine.exercises = routine.exercises.filter(exercise => {
            if (!exercise.name || !exercise.sets || !exercise.reps) {
                console.error("Incomplete exercise details:", exercise);
                return false;
            }
            return true;
        });
    
        console.log("Parsed Routine:", routine);
        return routine;
    };
    


    const saveRoutineToBackend = async (routine) => {
        try {
            const response = await axios.post('http://localhost:3000/api/routines', routine, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert("AI-generated workout routine has been saved successfully!");
            return response.data;
        } catch (error) {
            console.error('Error saving AI-generated routine:', error);
            alert("Failed to save AI-generated workout routine.");
            return null;
        }
    };

    const getAIResponse = async (userMessage) => {
        setLoading(true);
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        try {
            const structuredPrompt = `
            You are a personal trainer assistant. Provide workout routines in a structured format, while being conversational and friendly. Here is an example format to follow for each exercise:

            - **Routine Name**
              - **Exercise Name**
                - Sets: X
                - Reps: Y
                - Rest: Z seconds

            Include any necessary context in your responses to keep the conversation engaging. If the user asks for details about an exercise, provide a brief description.

            User request: "${userMessage}"
            `;

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4o-mini",
                    max_tokens: 3000,
                    temperature: 1,
                    messages: [
                        { role: "system", content: structuredPrompt }
                    ],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            const aiText = response.data.choices[0].message.content;
            console.log("AI Response:", aiText); 

            const formattedResponse = formatAIResponse(aiText);

            const generatedRoutine = formatAIResponseToRoutine(formattedResponse);

            console.log("Generated Routine:", generatedRoutine);
            setGeneratedRoutine(generatedRoutine); 

            return formattedResponse;
        } catch (error) {
            console.error("Error fetching AI response:", error);
            return "Sorry, I couldn't generate a response at this moment.";
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (input.trim()) {
            setMessages([...messages, { role: 'user', content: input }]);
            const aiResponse = await getAIResponse(input);
            setMessages(prevMessages => [
                ...prevMessages,
                { role: 'assistant', content: aiResponse }
            ]);
            setInput('');
        }
    };

    const handleSaveRoutine = async () => {
        if (generatedRoutine) {
            await saveRoutineToBackend(generatedRoutine);
            setGeneratedRoutine(null); 
        }
    };

    return (
        <div className="generator-container">
            <ul className="chatbox">
                {messages.map((message, index) => (
                    <li key={index} className={message.role === 'user' ? 'user-message' : 'ai-message'}>
                        {message.role === 'assistant' ? (
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        ) : (
                            message.content
                        )}
                    </li>
                ))}
                {loading && <li className="ai-message">AI is thinking... Here are some tips for better results: mention specific muscle groups or workout goals.</li>}
            </ul>
            <form className="generator-form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={input} 
                    onChange={handleChange} 
                    className="input-box" 
                    placeholder="Type your message..."
                    disabled={loading}
                />
                <button type="submit" disabled={loading || input.trim() === ''}>Go</button>
            </form>

            {generatedRoutine && (
                <div className="save-routine-container">
                    <h3>Generated Routine:</h3>
                    <ul>
                        {generatedRoutine.exercises.map((exercise, index) => (
                            <li key={index}>{exercise.name}: {exercise.sets} sets, {exercise.reps} reps, Rest: {exercise.rest}</li>
                        ))}
                    </ul>
                    <button className="save-routine-btn" onClick={handleSaveRoutine}>Save Routine</button>
                </div>
            )}
        </div>
    );
}
