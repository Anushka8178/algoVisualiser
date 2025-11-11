import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

export default function EducatorDashboard(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-fuchsia-600 to-rose-500 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold drop-shadow">Educator Console</h1>
        <p className="text-white/90">Manage students, resources, requests, and messages</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Students" to="/educator/students" desc="Search and view students, streaks, engagement" />
          <Card title="Requests" to="/educator/requests" desc="Review and complete student algorithm requests" />
          <Card title="My Algorithms" to="/educator/algorithms" desc="View, edit, and manage your published algorithms" />
          <Card title="Add Algorithm" to="/educator/algorithms/new" desc="Publish new algorithms and visualizations" />
          <Card title="Resources" to="/educator/resources" desc="Upload PDF links, notes, and downloadable files" />
          <Card title="Streaks" to="/educator/streaks" desc="View learning streaks" />
          <Card title="Messages" to="/educator/messages" desc="Send 1:1 messages to students" />
          <Card title="Notes" to="/educator/notes" desc="Manage educator notes" />
        </div>
      </div>
    </div>
  );
}

function Card({ title, desc, to }){
  return (
    <Link to={to} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 shadow-lg hover:scale-[1.01] transition">
      <div className="text-2xl font-semibold">{title}</div>
      <div className="text-white/90 mt-2">{desc}</div>
    </Link>
  );
}


