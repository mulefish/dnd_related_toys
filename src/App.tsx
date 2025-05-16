// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import TestPage from './pages/TestPage';
import './index.css';

export default function App() {
  return (
    <Router>
      <header className="app-header">
        <nav className="nav-links">
          <Link to="/Home">Home</Link>
          <Link to="/test">Test Page</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}
