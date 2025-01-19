// components/Card.js
const Card = ({ title, value }) => {
    return (
      <div className="w-full p-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
          {value === 0 || value === null ? (
            <p className="text-gray-500 mt-2">No data available</p>
          ) : (
            <p className="text-2xl font-bold text-blue-600 mt-2">{value}</p>
          )}
        </div>
      </div>
    );
  };
  
  export default Card;
  