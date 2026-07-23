'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useRouter } from 'next/router';

export default function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">RenewCred CMS</h1>
        </div>

        <nav className="mt-8">
          <Link href="/dashboard">
            <span className="block px-6 py-3 hover:bg-primary transition-colors cursor-pointer">
              Dashboard
            </span>
          </Link>
          <Link href="/pages">
            <span className="block px-6 py-3 hover:bg-primary transition-colors cursor-pointer">
              Pages
            </span>
          </Link>
          <Link href="/pages/create">
            <span className="block px-6 py-3 hover:bg-primary transition-colors cursor-pointer">
              Create Page
            </span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700">
          <p className="text-sm text-gray-300 mb-4">{admin?.email}</p>
          <button
            onClick={handleLogout}
            className="btn-primary w-full text-center"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
