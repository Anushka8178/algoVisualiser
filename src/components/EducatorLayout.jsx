import EducatorNavbar from './EducatorNavbar';

export default function EducatorLayout({ children, heading, subheading, accent }) {
  const gradient =
    accent === 'teal'
      ? 'from-teal-600 via-sky-600 to-indigo-700'
      : accent === 'violet'
      ? 'from-violet-600 via-fuchsia-600 to-rose-600'
      : 'from-slate-900 via-slate-900 to-slate-950';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} text-slate-100`}>
      <EducatorNavbar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-12 sm:px-8">
        {(heading || subheading) && (
          <header className="mb-10 space-y-2">
            {heading && <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm sm:text-4xl">{heading}</h1>}
            {subheading && <p className="max-w-3xl text-sm text-slate-200/80 sm:text-base">{subheading}</p>}
          </header>
        )}
        {children}
      </main>
    </div>
  );
}


