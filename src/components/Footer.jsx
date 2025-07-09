import 'leaflet/dist/leaflet.css';
import '@maptiler/leaflet-maptilersdk';

function Footer() {
    return (
    <footer style={{ padding: '1rem', background: '#1976d2', color: '#fff' }}>
      <h4>The Travelweb App©</h4>
      <nav>
        <span href="/contact" style={{ color: '#fff' }}>Contact</span>
      </nav>
    </footer>
  );
}

export default Footer;