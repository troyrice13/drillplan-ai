import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home">
            <section className="hero">
                <h1>Welcome to DrillFit.io</h1>
                <h2>Create Custom Workout Routines with AI</h2>
                <p>Get personalized workout plans tailored to your fitness goals and preferences.</p>
                <button className="cta-button" onClick={() => navigate('/generator')}>
                    Try Drill.AI Now
                </button>
            </section>

            <section className="features">
                <div className="feature">
                    <i className="fas fa-robot"></i>
                    <h3>AI-Powered Workouts</h3>
                    <p>Our advanced AI creates personalized routines based on your goals and fitness level.</p>
                </div>
                <div className="feature">
                    <i className="fas fa-dumbbell"></i>
                    <h3>Customizable Plans</h3>
                    <p>Easily adjust and save your workout routines to fit your schedule and preferences.</p>
                </div>
                <div className="feature">
                    <i className="fas fa-chart-line"></i>
                    <h3>Track Your Progress</h3>
                    <p>Monitor your fitness journey with built-in progress tracking and analytics.</p>
                </div>
            </section>

            <section className="how-it-works">
                <h2>How It Works</h2>
                <ol>
                    <li>Sign up for a free account</li>
                    <li>Tell us about your fitness goals and preferences</li>
                    <li>Let our AI generate a custom workout routine</li>
                    <li>Start your fitness journey with personalized guidance</li>
                </ol>
            </section>
        </div>
    );
}