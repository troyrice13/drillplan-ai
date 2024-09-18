import React, { useState, useEffect } from "react";
import './Generator.css'

export default function Generator() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {sender: 'user', text:'hello'},
        {sender: 'ai', text:'hello'}
    ])

    const handleChange = (e) => {
        setInput(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (input.trim()) {
            setMessages([...messages, {sender: 'user', text: input}])
        }
        
        setInput('')
    }

    return (
        <div className="generator-container">
                <ul className="chatbox">
                    {messages.map((message, index) => (
                         <li key={index} className={message.sender === 'user' ? 'user-message' : 'ai-message'}>
                         {message.text}
                     </li>
                    ))}
                </ul>
            <form onSubmit={handleSubmit}>
                <input type="text" value={input} onChange={handleChange} className="input-box" />
                    <button type="submit">Go</button>
            </form>
        </div>
    )
}