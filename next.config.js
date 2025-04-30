/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dodaj tę sekcję redirects
  async redirects() {
    return [
      {
        source: '/', // Ścieżka źródłowa (główna)
        destination: '/inventory', // Ścieżka docelowa
        permanent: true, // Ustawia przekierowanie jako stałe (308)
      },
    ]
  },
  // ... inne istniejące konfiguracje mogą pozostać tutaj ...
};

module.exports = nextConfig;