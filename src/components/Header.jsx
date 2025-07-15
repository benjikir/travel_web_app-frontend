import 'leaflet/dist/leaflet.css';
import '@maptiler/leaflet-maptilersdk';

function Header() {
  return (
    <header className="relative p-8  bg-sky-100 text-white">
      <nav className="flex items-center justify-between">
        <a href="/" className="text-black text-lg  hover:text-blue-200">Home</a>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold mb-0 text-gray-700">Travelweb App</h1>
        <a href="/Login" className="text-black text-lg hover:text-blue-200">Login</a>
      </nav>
    </header>
  );
}

export default Header;