import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import Map from "/src/components/Map"; 


function App() {
  return (
    <div className="min-h-screen flex flex-col"> {/* Added classes for overall layout */}
      <Header />
      <main className="flex-grow"> {/* Added flex-grow to make main fill available vertical space */}
        {/* The Map component now contains its own internal layout for map, locations, and trips */}
        <Map />
      </main>
      <Footer />
    </div>
  );
}

export default App;