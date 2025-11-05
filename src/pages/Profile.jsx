import Navbar from '../components/Navbar';

export default function Profile(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold drop-shadow mb-6">Your Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="w-20 h-20 rounded-full bg-white/90 text-purple-600 grid place-items-center text-2xl font-bold">U</div>
            <div className="mt-3 text-xl font-semibold">Student</div>
            <div className="text-white/80">email@example.com</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="text-sm text-white/80">Streak</div>
            <div className="text-3xl font-bold">🔥 12 days</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <div className="text-sm text-white/80">Algorithms Visualized</div>
            <div className="text-3xl font-bold">8</div>
          </div>
        </div>
        <div className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
          <div className="text-lg font-semibold mb-2">Recent Activity</div>
          <ul className="list-disc pl-5 text-white/90 space-y-1">
            <li>Visualized Quick Sort</li>
            <li>Added notes to BFS</li>
            <li>Maintained streak +1</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


