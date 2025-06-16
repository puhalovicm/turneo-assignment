export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your content</p>
      </div>
    </div>
  );
} 