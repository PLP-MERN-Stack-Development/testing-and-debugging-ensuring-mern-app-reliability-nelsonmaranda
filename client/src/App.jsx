import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Pages (simplified for this assignment)
const HomePage = () => (
  <div className="container">
    <h1>Welcome to MERN Testing Assignment</h1>
    <p>This is a comprehensive testing and debugging assignment for MERN stack applications.</p>
  </div>
);

/**
 * Main App Component
 * Wrapped in ErrorBoundary for error handling
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

