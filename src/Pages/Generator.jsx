import React, { useState } from "react";
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './Generator.css';

export default function Generator() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'system', content: "Welcome! Let's create your custom workout routine. First, could you tell me your fitness goals (e.g., building muscle, losing weight, improving endurance)?" }
    ]);
    const [loading, setLoading] = useState(false);

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
                // Headers
                const headerLevel = line.split('#').length - 1;
                formattedResponse += `${'#'.repeat(headerLevel)} ${line.replace(/#/g, '').trim()}\n`;
            } else if (line.match(/^\d+\.\s+.+$/)) {
                // Numbered exercise items
                if (!inList) {
                    formattedResponse += '\n';
                    inList = true;
                }
                formattedResponse += `${line}\n`;
            } else if (line.startsWith('-') || line.startsWith('○')) {
                // List items (using both '-' and '○' as potential list item markers)
                if (!inList) {
                    formattedResponse += '\n';
                    inList = true;
                }
                formattedResponse += `${line}\n`;
            } else if (line !== '') {
                // Regular text (non-empty lines only)
                if (inList) {
                    formattedResponse += '\n';
                    inList = false;
                }
                formattedResponse += `${line}\n`;
            }
        });
    
        return formattedResponse.trim();
    };

    const getAIResponse = async (userMessage) => {
        setLoading(true);
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4o-mini",
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
            return formatAIResponse(aiText);
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
                {loading && <li className="ai-message">AI is thinking...</li>}
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
        </div>
    );
}