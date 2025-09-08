import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Map from '@/components/Map';
import { useTravelData } from '@/hooks/useTravelData';
import ErrorBanner from '@/components/ErrorBanner';

function App() {
  const travelData = useTravelData(1); // Default user ID = 1

  const isLoading = Object.values(travelData.loading).some(Boolean);

  return (
//    <RouterProvider router={router} />;
  //
    <div className="min-h-screen flex flex-col">
      <Header />
      {travelData.error && <ErrorBanner message={travelData.error} />}
      <main className="flex-grow relative">
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-gray-700">
            <span className="text-lg font-medium">Loading travel data...</span>
          </div>
        ) : (
          <Map travelData={travelData} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
