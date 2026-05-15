import Button from './Button.jsx';

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 dark:border-navy-700">
      <div className="text-xs text-slate-500">
        Page <span className="font-medium">{page}</span> of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary" size="sm"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Prev
        </Button>
        <Button
          variant="secondary" size="sm"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
