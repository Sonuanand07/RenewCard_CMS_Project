import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BlockRenderer from '../components/BlockRenderer';
import api from '../utils/api';

export default function DynamicPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/pages/public/${slug}`);
        setPage(response.data.page);
      } catch (err) {
        setError(err.message || 'Failed to fetch page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-700 rounded-lg text-center">
            <p>Error: {error}</p>
          </div>
        ) : page ? (
          <div>
            <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
            {page.description && <p className="text-gray-600 mb-8">{page.description}</p>}
            <BlockRenderer blocks={page.blocks} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Page not found</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
