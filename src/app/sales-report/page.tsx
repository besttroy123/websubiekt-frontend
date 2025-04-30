'use client';

import { useSearchParams } from 'next/navigation';
import TableWithRefresh from './TableWithRefresh';
import { Suspense } from 'react';

// Komponent, który używa useSearchParams
function SalesReportContent() {
  const searchParams = useSearchParams();
  const dateFilter = searchParams.get('filter') || 'all';

  return <TableWithRefresh dateFilter={dateFilter} />;
}

// Komponent zastępczy podczas ładowania
function SalesReportFallback() {
  return <div className="animate-pulse bg-gray-700 h-screen w-full rounded"></div>;
}

// Główny komponent strony
export default function SalesReportPage() {
  return (
    <div className="p-8 pt-24 bg-gray-900 text-white min-h-screen">
      <Suspense fallback={<SalesReportFallback />}>
        <SalesReportContent />
      </Suspense>
    </div>
  );
}
