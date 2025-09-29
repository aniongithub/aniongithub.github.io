import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <section className="page">
      <div className="hero-section">
        <img src="assets/Ani.JPEG" alt="Ani" className="avatar" />
        <h1 className="display-title">
          <span className="thin-text">Hi! I'm </span>
          <span style={{ color: '#7054a5ff' }}>Ani</span>.
        </h1>
      </div>
      <h2><i>"If you love what you do, you’ll never work a day in your life."</i></h2>
      <h2>For more than <em>30 years</em> of programming, that’s been my truth. My passion for computers has carried me through decades building <em>AI</em>, <em>robotics</em>, <em>simulation</em>, <em>3D graphics</em>, <em>GPGPU</em> and more, <i>long</i> before they became buzzwords.</h2>

      {/* <h2>I started my journey in the early 90s, writing neural nets in C++ and building 3D engines simply for the joy of it. That same passion still drives me: designing platforms that are resilient, scalable, and built to last.</h2> */}

      <h2>This site is my way of sharing that journey. Insights shaped by decades of experience, craft, and the pursuit of excellence that no AI can impart.</h2>

      <h2><em>Welcome.</em></h2>
    </section>
  );
};

export default Home;