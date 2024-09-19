import React from "react";
import './Header.css';
import { useNavigate } from "react-router-dom";

export default function Header() {
const navigate = useNavigate()

    return (
        <nav className="header">
            <h2 className="header-title"
            onClick={() => navigate('/')}
            >DrillFit.io
            </h2>
            <button className="profile-btn">Routines</button>
        </nav>
    )
}