const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="flex min-h-screen items-center justify-center bg-hero-pattern px-4">
    <div className="rounded-3xl border border-white/60 bg-white px-8 py-10 text-center shadow-card">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  </div>
);

export default LoadingScreen;