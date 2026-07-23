import AdminLayout from '../components/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { listPages } from '../store/slices/pagesSlice';
import Link from 'next/link';
import { formatDate, getStatusColor } from '../utils/helpers';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { pages, pagination } = useSelector((state) => state.pages);

  useEffect(() => {
    dispatch(listPages({ status: 'published', limit: 5 }));
  }, [dispatch]);

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="section-title">Dashboard</h1>
            <p className="text-gray-600">Welcome to RenewCred CMS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-gray-600 text-sm font-medium">Total Pages</h3>
              <p className="text-3xl font-bold text-primary mt-2">{pagination.total}</p>
            </div>
            <div className="card">
              <h3 className="text-gray-600 text-sm font-medium">Published</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{pages.length}</p>
            </div>
            <div className="card">
              <h3 className="text-gray-600 text-sm font-medium">Quick Action</h3>
              <Link href="/pages/create">
                <span className="text-primary hover:underline cursor-pointer font-medium mt-2 block">
                  Create New Page →
                </span>
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Recent Published Pages</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Slug</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Published</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.length > 0 ? (
                    pages.map((page) => (
                      <tr key={page._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{page.title}</td>
                        <td className="py-3 px-4 text-gray-600">/{page.slug}</td>
                        <td className="py-3 px-4 text-sm">
                          {formatDate(page.publishedAt)}
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/pages/${page._id}/edit`}>
                            <span className="text-primary hover:underline cursor-pointer text-sm font-medium">
                              Edit
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        No published pages yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
