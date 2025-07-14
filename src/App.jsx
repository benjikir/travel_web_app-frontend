import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import Map from "/src/components/Map";



function App() {
  return (
    <>
      <Header />
      <main>
        <div className="main-content">
          <Map />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;