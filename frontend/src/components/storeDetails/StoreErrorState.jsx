const StoreErrorState = ({ error, onBack }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-8">
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm"
          >
            Back to Stores
          </button>
        </div>
      </main>
    </div>
  );
};

export default StoreErrorState;