import React, { useState } from "react";
import './Home.css'
import Login from "./Login";

export default function Home(){
    return (
        <div className="home">
            <h1>Welcome to DrillFit.io!</h1>
            <h2>Create custom workout routines with ai!</h2>
        </div>
    )
}