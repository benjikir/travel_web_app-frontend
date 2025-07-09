import 'leaflet/dist/leaflet.css';
import '@maptiler/leaflet-maptilersdk';


function Header() {
    return (
    <header style={{ padding: '1rem', background: '#1976d2', color: '#fff' }}>
      <h1>Travelweb App</h1>
      <nav className="flex justify-between items-center"> 

        <a href="/" className="text-black text-2xl">Home</a>
        <a href="/Login" className="text-white">Login</a>
        </nav>
    </header>
  );
}

export default Header;