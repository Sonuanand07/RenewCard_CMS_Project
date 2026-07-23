'use client';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RenewCred</h3>
            <p className="text-gray-300">
              Build your credit with confidence. Your trusted partner in financial wellness.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="/features" className="hover:text-primary transition-colors">Features</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-300">Email: info@renewcred.com</p>
            <p className="text-gray-300">Phone: 1-800-CREDIT</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 RenewCred. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
