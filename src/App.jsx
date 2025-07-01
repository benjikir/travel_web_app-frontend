import React from 'react';
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import './App.css';

function App() {
  return (
    <>
      <Header />
      <main>
        <div className="main-content">
          <h2>The Travelweb App is currently in progress!</h2>
          {/* The Travelweb App is finally launched! */}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;