import React from "react";
import './Header.css'

export default function Header() {
    return (
        <nav className="header">
            <h2 className="header-title">DrillFit.io</h2>
            <button className="profile-btn">Routines</button>
        </nav>
    )
}