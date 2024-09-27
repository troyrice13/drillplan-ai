import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaDumbbell, FaChartLine } from "react-icons/fa";
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home">
            <section className="hero">
                <h1>Welcome to DrillFit.io</h1>
                <h2>Create Custom Workout Routines with AI</h2>
                <p>Get personalized workout plans tailored to your fitness goals and preferences, all with the help of our advanced AI technology.</p>
                <button className="cta-button" onClick={() => navigate('/generator')}>
                    Try Drill.AI Now
                </button>
            </section>

            <section className="features">
                <div className="feature">
                    <FaRobot className="feature-icon" />
                    <h3>AI-Powered Workouts</h3>
                    <p>Our advanced AI creates personalized routines based on your goals, preferences, and fitness level, ensuring you stay on track and motivated.</p>
                </div>
                <div className="feature">
                    <FaDumbbell className="feature-icon" />
                    <h3>Customizable Plans</h3>
                    <p>Easily modify and save your workout routines to fit your schedule, experience level, and specific goals. Flexibility is key to progress.</p>
                </div>
                <div className="feature">
                    <FaChartLine className="feature-icon" />
                    <h3>Track Your Progress</h3>
                    <p>Monitor your fitness journey with our built-in progress tracking and analytics tools, helping you to visualize your improvements and stay motivated.</p>
                </div>
            </section>

            <section className="how-it-works">
                <h2>How It Works</h2>
                <ol>
                    <li>Sign up for a free account and get started in minutes.</li>
                    <li>Provide us with your fitness goals and preferences.</li>
                    <li>Let our AI generate a personalized workout routine just for you.</li>
                    <li>Start your fitness journey with expert guidance and tracking.</li>
                </ol>
            </section>
        </div>
    );
}
