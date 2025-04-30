export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Strona nie została znaleziona</h2>
      <p className="text-gray-300 mb-8">Przepraszamy, nie mogliśmy znaleźć strony, której szukasz.</p>
      <a 
        href="/inventory" 
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
      >
        Wróć do strony głównej
      </a>
    </div>
  );
}
