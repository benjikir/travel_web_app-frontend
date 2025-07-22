const TOTAL_COUNTRIES = 195;

const CountryCounter = ({ selectedCount }) => {
  return (
    <div className="bg-slate-100 text-black p-3 rounded-lg shadow-lg text-base font-semibold z-10">
      {selectedCount}/{TOTAL_COUNTRIES} Countries Collected 
    </div>
  );
};

export default CountryCounter;