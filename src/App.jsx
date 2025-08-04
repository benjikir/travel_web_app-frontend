// src/App.jsx
import Header from '@/components/Header'; 
import Footer from '@/components/Footer'; 
import Map from '@/components/Map';
import { useTravelData } from '@/hooks/useTravelData';
import ErrorBanner from '@/components/ErrorBanner';

function App() {
  const travelData = useTravelData(1); // Default user ID = 1

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {travelData.error && <ErrorBanner message={travelData.error} />}
      <main className="flex-grow">
        <Map travelData={travelData} />
      </main>
      <Footer />
    </div>
  );
}

export default App;