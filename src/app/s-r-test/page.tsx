import { Metadata } from 'next';
import { query } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Raport sprzedaży',
  description: 'Raport sprzedaży Twojego sklepu.',
};

// Server component - will run on the server
export default async function SalesReportPage() {
  let salesData = [];
  let error = null;

  try {
    // Connect to the database and fetch only the specified fields from report_sales table
    const result = await query(`
      SELECT order_id, reference, 
      TO_CHAR(date_add, 'YYYY-MM-DD HH24:MI:SS') as date_add, 
      total_paid 
      FROM report_sales
    `);
    salesData = result.rows;
  } catch (err) {
    console.error('Database query error:', err);
    error = err;
  }

  // Define the specific columns we want to display
  const columns = ['order_id', 'reference', 'date_add', 'total_paid'];

  return (
    <div className="p-8 bg-gray-900 text-white">
      <h1 className="text-2xl font-semibold mb-6">Raport sprzedaży</h1>
      <div className="bg-gray-800 rounded-lg shadow p-6">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            <p>Error connecting to the database. Please try again later.</p>
          </div>
        )}

        {!error && salesData.length === 0 ? (
          <p className="text-gray-400">No sales data available.</p>
        ) : (
          <SalesTable salesData={salesData} columns={columns} />
        )}
      </div>
    </div>
  );
}

// Sample product data for the nested table
const sampleProducts = [
  { id: 1, name: 'Vodka', price: '50 zł' },
  { id: 2, name: 'Cognac', price: '233 zł' },
  { id: 3, name: 'Moonshine', price: '599,99 zł' },
];

// Client component for the interactive table
import SalesTable from './sales-table';