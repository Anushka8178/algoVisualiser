import Navbar from '../components/Navbar';

const data = [
  { rank:1, name:'Alice', streak:42 },
  { rank:2, name:'Bob', streak:38 },
  { rank:3, name:'Cara', streak:35 },
  { rank:4, name:'You', streak:12, isYou:true },
  { rank:5, name:'Dan', streak:10 },
];

export default function Leaderboard(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold drop-shadow mb-6">Leaderboard</h1>
        <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 overflow-hidden">
          <div className="grid grid-cols-3 px-4 py-3 text-sm text-white/80 border-b border-white/20">
            <div>Rank</div>
            <div>User</div>
            <div className="text-right">Streak</div>
          </div>
          <div className="divide-y divide-white/10">
            {data.map(row => (
              <div key={row.rank} className={`grid grid-cols-3 px-4 py-3 ${row.isYou? 'bg-white/10' : ''}`}>
                <div>{medal(row.rank)} {row.rank}</div>
                <div className={`${row.isYou? 'font-semibold' : ''}`}>{row.name}</div>
                <div className="text-right">🔥 {row.streak}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function medal(rank){
  if(rank===1) return '🥇';
  if(rank===2) return '🥈';
  if(rank===3) return '🥉';
  return '';
}


