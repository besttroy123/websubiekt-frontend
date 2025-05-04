import { Metadata } from 'next';
import { query } from '@/lib/db';
import InventoryTableWithRefresh from '@/app/inventory/InventoryTableWithRefresh';
import ClientOnly from '@/components/ClientOnly';

export const metadata: Metadata = {
  title: 'Stan magazynowy',
  description: 'Twój stan magazynowy sklepu.',
};

// Server component - will run on the server
export default async function InventoryPage() {
  let inventoryData = [];
  let error = null;

  try {
    // Connect to the database and fetch only the specified columns in the exact order
    const result = await query('SELECT ID_STOCK, NAZWA_PRODUKTU, OPCJE, CENA_SPRZEDAZY_BRUTTO, STAN_MAGAZYNOWY, EAN13, CENA_ZAKUPU_NETTO, CENA_ZAKUPU_BRUTTO, GRUPA_TOWAROWA FROM stan_magazynowy');
    inventoryData = result.rows;
  } catch (err) {
    console.error('Database query error:', err);
    error = err;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Stan magazynowy</h1>
      <div className="bg-gray-800 rounded-lg shadow p-3 md:p-6 min-h-[calc(100vh - 100px)] overflow-x-auto w-full">
        {error !== null && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            <p>Error connecting to the database. Please try again later.</p>
          </div>
        )}

        <ClientOnly>
          <div className="w-full overflow-x-auto">
            <InventoryTableWithRefresh initialData={inventoryData} />
          </div>
        </ClientOnly>
      </div>
    </div>
  );
}