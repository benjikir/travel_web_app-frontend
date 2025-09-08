/*
//import Map from '@/components/Map';
import { useTravelData } from '@/hooks/useTravelData';
import ErrorBanner from '@/components/ErrorBanner';

//function HomePage() {
  const travelData = useTravelData(1); // Default user ID = 1
  const isLoading = Object.values(travelData.loading).some(Boolean); 

  return (
    <>
      {travelData.error && <ErrorBanner message={travelData.error} />}
      {isLoading ? (
        <div className="flex justify-center items-center h-full text-gray-700">
          <span className="text-lg font-medium">Loading travel data...</span>
        </div>
      ) : (
        <Map travelData={travelData} />
      )}
    </>
  );
}
export default HomePage;
*/