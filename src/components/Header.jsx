import React from "react";

function Header() {
    return (
    <header style={{ padding: '1rem', background: '#1976d2', color: '#fff' }}>
      <h1>Travelweb App</h1>
      <nav>
        <a href="/" style={{ color: '#fff', marginRight: '1rem' }}>Home</a>
        <a href="/Login" style={{ color: '#fff', marginRight: '1rem' }}>Login</a>
        </nav>
    </header>
  );
}

export default Header;