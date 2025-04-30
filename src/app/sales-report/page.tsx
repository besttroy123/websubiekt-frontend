'use client';

import { useSearchParams } from 'next/navigation';
import TableWithRefresh from './TableWithRefresh';

// This component needs to be client-side since we're using state
export default function SalesReportPage() {
  const searchParams = useSearchParams();
  const dateFilter = searchParams.get('filter') || 'all';

  return (
    <div className="p-8 pt-24 bg-gray-900 text-white min-h-screen">
      <TableWithRefresh dateFilter={dateFilter} />
    </div>
  );
}