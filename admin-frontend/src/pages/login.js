import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../store/slices/authSlice';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await dispatch(loginAdmin(formData));
    if (result.payload?.success || result.payload?.token) {
      toast.success('Login successful!');
      router.push('/dashboard');
    } else if (result.payload) {
      toast.error(result.payload);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">RenewCred</h1>
          <p className="text-gray-600 mt-2">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="admin@renewcred.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isLoading ? <ClipLoader size={20} color="white" /> : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <p className="text-xs text-gray-600">Email: admin@renewcred.com</p>
          <p className="text-xs text-gray-600">Password: Admin@123</p>
        </div>
      </div>
    </div>
  );
}
