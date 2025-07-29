import Header from '@/components/Header'; 
import Footer from '@/components/Footer'; 
import Map from '@/components/Map';       


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Map />
      </main>
      <Footer />
    </div>
  );
}

export default App;