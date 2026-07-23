import AdminLayout from '../components/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { listPages, deletePage } from '../store/slices/pagesSlice';
import Link from 'next/link';
import { formatDate, getStatusColor, truncate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function PagesPage() {
  const dispatch = useDispatch();
  const { pages, pagination, isLoading } = useSelector((state) => state.pages);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(listPages({ search, status, page, limit: 10 }));
  }, [dispatch, search, status, page]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      dispatch(deletePage(id)).then((result) => {
        if (result.payload) {
          toast.success('Page deleted successfully');
        } else {
          toast.error('Failed to delete page');
        }
      });
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="section-title">Pages Management</h1>
            <Link href="/pages/create">
              <span className="btn-primary cursor-pointer">Create Page</span>
            </Link>
          </div>

          {/* Filters */}
          <div className="card flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search pages..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="input-field"
              >
                <option value="">All</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Pages Table */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Slug</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.length > 0 ? (
                  pages.map((page) => (
                    <tr key={page._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{truncate(page.title, 30)}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">/{page.slug}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                          {page.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(page.createdAt)}
                      </td>
                      <td className="py-3 px-4 flex gap-3">
                        <Link href={`/pages/${page._id}/edit`}>
                          <span className="text-primary hover:underline cursor-pointer text-sm font-medium">
                            Edit
                          </span>
                        </Link>
                        <Link href={`/pages/${page._id}`}>
                          <span className="text-blue-600 hover:underline cursor-pointer text-sm font-medium">
                            View
                          </span>
                        </Link>
                        <button
                          onClick={() => handleDelete(page._id)}
                          className="text-red-600 hover:underline text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      {isLoading ? 'Loading...' : 'No pages found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded ${
                    page === p
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
