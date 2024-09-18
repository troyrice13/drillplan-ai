import React, { useState, useEffect } from "react";
import './Generator.css'

export default function Generator() {
    const [input, setInput] = useState('');

    const handleChange = (e) => {
        setInput(e.target.value)
    }
    return (
        <div className="generator-container">
            <input type="text" value={input} onChange={handleChange} className="input-box" />
        </div>
    )
}