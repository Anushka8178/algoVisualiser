import { Link } from 'react-router-dom';

export default function NotFound(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white grid place-items-center p-6">
      <div className="text-center">
        <div className="text-7xl font-extrabold drop-shadow">404</div>
        <div className="mt-2 text-xl">Page not found</div>
        <Link to="/" className="inline-block mt-6 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50">Go Home</Link>
      </div>
    </div>
  );
}


