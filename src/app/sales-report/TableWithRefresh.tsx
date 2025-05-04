'use client';

// Import useMemo and ArrowUp
import { useState, useEffect, useCallback, useMemo } from 'react'; 
import { RefreshCw, ArrowUp } from 'lucide-react'; 

// Update the interface to match the available fields in raport_sprzedazy
interface SalesDataItem {
  reference: string;
  date_add: string;
  product_name: string;
  unit_price_tax_incl: number;
  product_quantity: number;
  total_price_brutto: number;
  stock_quantity: number;
  rabat?: number; // Dodajemy opcjonalne pole rabat (zakładamy, że to liczba)
  [key: string]: any;
}

interface TableWithRefreshProps {
  dateFilter: string;
}

// Define SortDirection type
type SortDirection = 'asc' | 'desc' | null;

export default function TableWithRefresh({ dateFilter }: TableWithRefreshProps) {
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  // Change default sort key to date_add and direction to desc
  const [sortKey, setSortKey] = useState<keyof SalesDataItem | null>('date_add');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  // Dodajemy stan do śledzenia szerokości ekranu
  const [isMobile, setIsMobile] = useState(false);

  // Define columns in the specific order requested
  // Remove order_row_id and order_id from columns
  // Dodajemy 'rabat' do listy kolumn
  const columns = [
    'reference',
    'date_add',
    'product_name',
    'unit_price_tax_incl',
    'product_quantity',
    'rabat', // Dodana kolumna rabat
    'total_price_brutto',
    'stock_quantity'
  ];

  // Update column display names (remove the ones we don't need)
  const columnDisplayNames = {
    'reference': 'REFERENCE',
    'date_add': 'DATA',
    'product_name': 'PRODUKT',
    'unit_price_tax_incl': 'CENA JEDN.',
    'product_quantity': 'ILOŚĆ',
    'rabat': 'RABAT ', 
    'total_price_brutto': 'WARTOŚĆ BRUTTO',
    'stock_quantity': 'POZOSTAŁO'
  };

  // Create a memoized fetch function to avoid recreating it on each render
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch data with the appropriate filter
      const response = await fetch('/api/sales-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateFilter }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      setSalesData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } else {
        console.error('Unknown error:', err);
        setError('Wystąpił nieznany błąd');
      }
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  // Initial data load and client-side detection
  useEffect(() => {
    setIsClient(true);
    fetchData();
  }, [fetchData]);

  // Dodajemy efekt do wykrywania rozmiaru ekranu
  useEffect(() => {
    if (!isClient) return;
    
    // Funkcja sprawdzająca rozmiar ekranu
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px to typowy breakpoint dla urządzeń mobilnych
    };
    
    // Sprawdź przy pierwszym renderowaniu
    checkIfMobile();
    
    // Nasłuchuj na zmiany rozmiaru okna
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isClient]);

  // Set up auto-refresh interval
  useEffect(() => {
    if (!isClient) return;
    const intervalId = setInterval(() => {
      fetchData();
    }, 180000);
    return () => clearInterval(intervalId);
  }, [isClient, fetchData]);

  // Function to handle sorting
  const handleSort = (key: keyof SalesDataItem) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Memoize sorted data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) {
      return salesData;
    }

    // Identify numeric and date columns
    // Dodajemy 'rabat' do kolumn numerycznych
    const numericColumns: (keyof SalesDataItem)[] = [
      'unit_price_tax_incl',
      'product_quantity',
      'rabat', // Dodane pole rabat do sortowania numerycznego
      'total_price_brutto',
      'stock_quantity'
    ];
    const dateColumns: (keyof SalesDataItem)[] = ['date_add'];

    return [...salesData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      // Handle nulls
      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

      // Numeric sort
      if (numericColumns.includes(sortKey)) {
        const numA = Number(aValue);
        const numB = Number(bValue);
        if (numA < numB) return sortDirection === 'asc' ? -1 : 1;
        if (numA > numB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      } 
      // Date sort
      else if (dateColumns.includes(sortKey)) {
        const dateA = new Date(aValue).getTime(); // Compare timestamps
        const dateB = new Date(bValue).getTime();
        if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1;
        if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      } 
      // String sort (default)
      else {
        const strA = String(aValue);
        const strB = String(bValue);
        return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      }
    });
  }, [salesData, sortKey, sortDirection]);

  // Calculate total gross sales using useMemo
  const totalGrossSales = useMemo(() => {
    return sortedData.reduce((sum, item) => {
      // Add the item's total_price_brutto to the sum, handling potential nulls
      return sum + (Number(item.total_price_brutto) || 0); 
    }, 0);
  }, [sortedData]); // Recalculate only when sortedData changes

  // Helper function to render sortable table headers (unchanged logic, but will now include 'rabat')
  const renderSortableHeader = (key: keyof SalesDataItem, label: string) => (
    <th 
      className="px-6 py-3 border-b border-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
      onClick={() => handleSort(key)}
      // Note: The key prop needs to be applied where the map happens, not inside this helper
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

  // Funkcja pomocnicza do formatowania wartości komórki
  const formatCellValue = (column: string, value: any) => {
    if (value === null || value === undefined) return 'N/A';
    
    switch(column) {
      case 'date_add':
        return new Date(value).toLocaleDateString('en-CA');
      case 'unit_price_tax_incl':
      case 'total_price_brutto':
        return `${Number(value).toFixed(2).replace('.', ',')} zł`;
      case 'rabat':
        return value !== null && value !== undefined && Number(value) > 0
          ? `${Math.round(Number(value))}%`
          : '-';
      default:
        return String(value);
    }
  };

  // Renderowanie mobilnej wersji tabeli jako karty
  const renderMobileCards = () => (
    <div className="space-y-4">
      {sortedData.map((item, index) => (
        <div 
          key={index} 
          className={`p-4 rounded-lg ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} border border-gray-700`}
        >
          <div className="grid grid-cols-2 gap-2">
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="mb-2">
                <div className="text-xs text-gray-400 font-medium uppercase">
                  {columnDisplayNames[column as keyof typeof columnDisplayNames] || column}
                  {sortKey === column && (
                    <ArrowUp
                      size={12}
                      className={`ml-1 inline text-blue-400 transition-transform duration-200 ${
                        sortDirection === 'desc' ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>
                <div 
                  className="text-gray-300 font-medium"
                  onClick={() => handleSort(column as keyof SalesDataItem)}
                >
                  {formatCellValue(column, item[column])}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 min-h-[calc(100vh-12rem)] flex flex-col">
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
          onClick={fetchData}
          disabled={loading || !isClient}
          className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-70 rounded text-white transition-colors"
          title="Refresh data"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
          <p>Error fetching data: {error}</p>
        </div>
      )}

      {loading && !salesData.length ? (
        <div className="flex justify-center items-center flex-grow"> 
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !salesData.length ? (
        <div className="flex justify-center items-center h-[calc(100vh-18rem)] border border-gray-700 rounded-lg">
          <p className="text-gray-400 text-lg">No sales data available for the selected period.</p>
        </div>
      ) : (
        <> 
          {/* Wybieramy odpowiedni widok w zależności od rozmiaru ekranu */}
          <div className={`relative ${isMobile ? '' : 'overflow-auto h-[calc(100vh-18rem)]'} border border-gray-700 rounded-lg flex-grow`}>
            {isMobile ? (
              renderMobileCards()
            ) : (
              <table className="min-w-full bg-gray-800"> 
                <thead className="sticky top-0 bg-gray-700 z-10">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column}
                        className="px-6 py-3 border-b border-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                        onClick={() => handleSort(column as keyof SalesDataItem)}
                      >
                        <div className="flex items-center">
                          {columnDisplayNames[column as keyof typeof columnDisplayNames] || column}
                          {sortKey === column && (
                            <ArrowUp
                              size={14}
                              className={`ml-1 text-blue-400 transition-transform duration-200 ${
                                sortDirection === 'desc' ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((item, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`${rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700 transition-colors duration-150`}
                    >
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap border-b border-gray-700 text-gray-300">
                          {formatCellValue(column, item[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="mt-4 pt-4 pr-4 text-right">
            <span className="text-gray-300 font-semibold">Całkowita wartość sprzedaży brutto: </span>
            <span className="text-lg text-white font-bold">
              {totalGrossSales.toFixed(2).replace('.', ',')} zł
            </span>
          </div>
        </>
      )}
    </div>
  );
}
