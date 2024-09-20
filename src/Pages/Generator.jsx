import React, { useState } from "react";
import axios from 'axios';
import './Generator.css';

export default function Generator() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'system', content: 'Welcome! Let’s create your custom workout routine. First, could you tell me your fitness goals (e.g., building muscle, losing weight, improving endurance)?' }
    ]);
    const [loading, setLoading] = useState(false);

    // Handle user input
    const handleChange = (e) => {
        setInput(e.target.value);
    };

    // Function to call GPT API
    const getAIResponse = async (userMessage) => {
        setLoading(true); // Show loading state
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // Ensure you use Vite's env variable format
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4o-mini", // Choose your model
                    max_tokens: 3000,
                    temperature: 1,
                    messages: [
                        ...messages,
                        { role: "user", content: userMessage }
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
            return aiText; // Return plain string
        } catch (error) {
            console.error("Error fetching AI response:", error);
            return "Sorry, I couldn't generate a response at this moment.";
        } finally {
            setLoading(false); // Remove loading state
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (input.trim()) {
            // Add user message to the chat
            setMessages([...messages, { role: 'user', content: input }]);

            // Call the AI and add the AI's response to the chat
            const aiResponse = await getAIResponse(input);
            setMessages(prevMessages => [
                ...prevMessages,
                { role: 'assistant', content: aiResponse } // Content should be plain string
            ]);

            setInput(''); // Clear the input field
        }
    };

    return (
        <div className="generator-container">
            <ul className="chatbox">
                {messages.map((message, index) => (
                    <li key={index} className={message.role === 'user' ? 'user-message' : 'ai-message'}>
                        {message.content}
                    </li>
                ))}
                {loading && <li className="ai-message">AI is thinking...</li>}
            </ul>
            <form className="generator-form" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={input} 
                    onChange={handleChange} 
                    className="input-box" 
                    placeholder="Type your message..."
                    disabled={loading} // Disable input while loading
                />
                <button type="submit" disabled={loading || input.trim() === ''}>Go</button>
            </form>
        </div>
    );
}
