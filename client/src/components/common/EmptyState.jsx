const EmptyState = ({ title, description, action }) => (
  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-12 text-center">
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    {description ? <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">{description}</p> : null}
    {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
  </div>
);

export default EmptyState;