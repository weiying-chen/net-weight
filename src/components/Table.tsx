import { Heading } from '@/components/Heading';

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="min-w-full">{children}</table>;
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-subtle">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-subtle">{children}</tbody>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-subtle">{children}</tr>;
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2 text-left">
      <Heading size="sm">{children}</Heading>
    </th>
  );
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2 text-sm">{children}</td>;
}
