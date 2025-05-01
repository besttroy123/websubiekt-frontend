'use client';

import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, ArrowUp } from 'lucide-react'; 

// Update the InventoryItem interface to include the new fields
interface InventoryItem {
  id_stock: number | null;
  nazwa_produktu: string | null;
  opcje: string | null;
  cena_sprzedazy_brutto: number | null;
  stan_magazynowy: number | null;
  ean13: string | null;
  cena_zakupu_netto: number | null; // New field
  cena_zakupu_brutto: number | null; // New field
  grupa_towarowa: string | null; // Nowe pole dla grupy towarowej
}

type SortDirection = 'asc' | 'desc' | null;

export default function InventoryTableWithRefresh({ initialData }: { initialData: InventoryItem[] }) {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  // Add state for sorting
  const [sortKey, setSortKey] = useState<keyof InventoryItem | null>('nazwa_produktu'); // Zmieniono domyślne sortowanie na nazwę produktu
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc'); // Default ascending

  // This effect runs only on the client after hydration is complete
  useEffect(() => {
    setIsClient(true);
    setLastUpdated(new Date());
  }, []);


  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data');
      }
      const data = await response.json();
      setInventoryData(data); // Update inventory data
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only set up the interval after hydration is complete
    if (!isClient) return;
    
    // Set up interval to refresh data every 60 seconds
    const intervalId = setInterval(() => {
      fetchInventoryData();
    }, 180000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [isClient]);


  // Function to handle sorting
  const handleSort = (key: keyof InventoryItem) => {
    if (sortKey === key) {
      // Toggle direction if same key is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new key and default to ascending
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Memoize sorted data to avoid re-sorting on every render
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) {
      return inventoryData; // Return unsorted if no sort key/direction
    }

    return [...inventoryData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      // Handle null or undefined values first
      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

      // Check if the column should be sorted numerically
      if (sortKey === 'id_stock' || sortKey === 'cena_sprzedazy_brutto' || 
          sortKey === 'stan_magazynowy' || sortKey === 'cena_zakupu_netto' || 
          sortKey === 'cena_zakupu_brutto') {
        // Perform numeric comparison
        const numA = Number(aValue);
        const numB = Number(bValue);
        if (numA < numB) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (numA > numB) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      } else {
        // Perform string comparison for other columns
        const strA = String(aValue);
        const strB = String(bValue);
        // Use localeCompare for better string sorting
        return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      }
    });
  }, [inventoryData, sortKey, sortDirection]);


  // Helper function to render sortable table headers
  const renderSortableHeader = (key: keyof InventoryItem, label: string) => (
    <th 
      className="px-6 py-3 border-b border-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
      onClick={() => handleSort(key)}
    >
      <div className="flex items-center">
        {label}
        {sortKey === key && (
          <ArrowUp
            size={14}
            className={`ml-1 text-blue-400 transition-transform duration-200 ${
              sortDirection === 'desc' ? 'rotate-180' : ''
            }`}
          />
        )}
      </div>
    </th>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">
          {loading ? (
            <span className="text-blue-400">Refreshing data...</span>
          ) : isClient && lastUpdated ? (
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          ) : (
            <span>Loading...</span>
          )}
        </div>
        <button
          onClick={fetchInventoryData}
          disabled={loading || !isClient}
          className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-70 rounded text-white transition-colors"
          title="Refresh data"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>


      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
          <p>Error fetching inventory data: {error.message}</p>
        </div>
      )}


      {!error && inventoryData.length === 0 ? (
        <p className="text-gray-400">No inventory data available.</p>
      ) : (
        <div className="overflow-auto max-h-[calc(100vh-200px)] border border-gray-700 rounded-lg">
          <table className="min-w-full bg-gray-800">
            <thead className="sticky top-0 bg-gray-700 z-10">
              <tr>
                {/* Usunięto kolumnę ID */}
                {renderSortableHeader('nazwa_produktu', 'NAZWA PRODUKTU')}
                {renderSortableHeader('opcje', 'OPCJE')}
                {renderSortableHeader('grupa_towarowa', 'GRUPA TOWAROWA')}
                {renderSortableHeader('cena_sprzedazy_brutto', 'CENA SPRZEDAŻY BRUTTO')}
                {renderSortableHeader('cena_zakupu_netto', 'CENA ZAKUPU NETTO')}
                {renderSortableHeader('cena_zakupu_brutto', 'CENA ZAKUPU BRUTTO')}
                {renderSortableHeader('stan_magazynowy', 'STAN MAGAZYNOWY')}
                {renderSortableHeader('ean13', 'EAN13')}
              </tr>
            </thead>
            <tbody>
              {/* Map over sortedData */}
              {sortedData.map((item, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700 transition-colors duration-150`}>
                  {/* Usunięto komórkę z ID */}
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700 text-gray-300">{item.nazwa_produktu !== null ? String(item.nazwa_produktu) : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700 text-gray-300">{item.opcje !== null && item.opcje !== '' ? String(item.opcje) : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700 text-gray-300">{item.grupa_towarowa !== null ? String(item.grupa_towarowa) : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700 text-gray-300">{item.cena_sprzedazy_brutto !== null ? `${Number(item.cena_sprzedazy_brutto).toFixed(2).replace('.', ',')} zł` : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700 text-gray-300">{item.cena_zakupu_netto !== null ? `${Number(item.cena_zakupu_netto).toFixed(2).replace('.', ',')} zł` : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700 text-gray-300">{item.cena_zakupu_brutto !== null ? `${Number(item.cena_zakupu_brutto).toFixed(2).replace('.', ',')} zł` : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700 text-gray-300">{item.stan_magazynowy !== null ? String(item.stan_magazynowy) : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-700 text-gray-300">{item.ean13 !== null && item.ean13 !== '' ? String(item.ean13) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
