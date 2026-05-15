export default function Loader({ label = 'Loading...', size = 'md' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-8">
      <span
        className={`inline-block ${sizes[size]} animate-spin rounded-full border-2 border-brand-600 border-r-transparent`}
      />
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}
