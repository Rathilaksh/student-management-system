import { FiArrowUpRight } from 'react-icons/fi';

const StatCard = ({ label, value, icon: Icon, tone = 'brand', helperText }) => {
  const toneStyles = {
    brand: 'bg-brand-50 text-brand-700 ring-brand-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200'
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          {helperText ? <p className="mt-2 text-xs text-slate-500">{helperText}</p> : null}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${toneStyles[tone] || toneStyles.brand}`}>
          {Icon ? <Icon className="text-xl" /> : <FiArrowUpRight className="text-xl" />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;