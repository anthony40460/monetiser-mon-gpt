import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to MonetiserMonGPTs</h1>
      <p>Effortlessly monetize your custom GPTs with our simple paywall solution.</p>
      <div className="cta-buttons">
        <Link to="/register" className="btn btn-primary">Get Started</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
      </div>
      <section className="features">
        <h2>Our Features</h2>
        <ul>
          <li>Full API Integration</li>
          <li>Enhanced Security</li>
          <li>Analytics Dashboard</li>
          <li>Customizable Paywalls</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;