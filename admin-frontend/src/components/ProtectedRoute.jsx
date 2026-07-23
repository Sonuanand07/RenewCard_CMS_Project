'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#BE202E" size={50} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
