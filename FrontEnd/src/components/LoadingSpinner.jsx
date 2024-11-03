
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
        </div>
        <p className="text-lg font-semibold text-gray-600">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
