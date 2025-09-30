import 'leaflet/dist/leaflet.css';
import '@maptiler/leaflet-maptilersdk';

function Footer() {
  return (
    <footer className="relative p-5 bg-slate-200 flex items-center text-black">
      <div className="flex-1 flex justify-start">
        {/* Empty div for left spacing or add left-side content here if needed */}
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h4>The Travelweb App©</h4>
      </div>
      <nav className="flex-1 flex justify-end">
        <a href="/impressum" className="text-black text-1xl hover:text-blue-700">Impressum</a>
      </nav>
    </footer>
  );
}

export default Footer;