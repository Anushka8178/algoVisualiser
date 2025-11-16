import { Link } from 'react-router-dom';
import EducatorLayout from '../../components/EducatorLayout';

const cards = [
  { title: 'Students', to: '/educator/students', desc: 'Search students, inspect streaks and engagement insights.' },
  { title: 'Requests', to: '/educator/requests', desc: 'Review new algorithm requests and track resolution status.' },
  { title: 'My Algorithms', to: '/educator/algorithms', desc: 'Manage and refine the algorithms you have published.' },
  { title: 'Add Algorithm', to: '/educator/algorithms/new', desc: 'Publish new material, visualisations and metadata.' },
  { title: 'Resources', to: '/educator/resources', desc: 'Upload reading material, PDF links or quick notes.' },
  { title: 'Streaks', to: '/educator/streaks', desc: 'Keep an eye on cohort streaks and learning trends.' },
  { title: 'Messages', to: '/educator/messages', desc: 'Send targeted nudges or follow-up messages.' },
  { title: 'Notes', to: '/educator/notes', desc: 'Maintain personal teaching notes and to-dos.' },
];

export default function EducatorDashboard() {
  return (
    <EducatorLayout
      heading="Educator Command Center"
      subheading="Curate resources, respond to learner needs, and maintain high quality visualisations from one polished workspace."
      accent="violet"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <DashboardCard key={card.to} {...card} />
        ))}
      </div>
    </EducatorLayout>
  );
}

function DashboardCard({ title, desc, to }) {
  return (
    <Link
      to={to}
      className="group flex h-full flex-col justify-between rounded-3xl border border-white/15 bg-white/10 px-6 py-7 shadow-lg shadow-slate-900/20 backdrop-blur transition duration-200 hover:-translate-y-1 hover:bg-white/15 hover:shadow-slate-900/30"
    >
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
        <p className="mt-3 text-sm text-slate-100/80">{desc}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-100 transition group-hover:text-white">
        Open
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}

