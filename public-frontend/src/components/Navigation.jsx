'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <span className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors">
              RenewCred
            </span>
          </Link>

          <div className="flex gap-6">
            <Link href="/">
              <span className="hover:text-primary cursor-pointer transition-colors">Home</span>
            </Link>
            <Link href="/about">
              <span className="hover:text-primary cursor-pointer transition-colors">About</span>
            </Link>
            <Link href="/features">
              <span className="hover:text-primary cursor-pointer transition-colors">Features</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
