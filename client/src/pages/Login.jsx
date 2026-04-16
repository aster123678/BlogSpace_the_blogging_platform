import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-black dark:bg-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)'}}></div>
        <div className="relative z-10">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-black text-lg font-black">B</span>
          </div>
        </div>
        <div className="relative z-10">
          <blockquote className="text-white text-3xl font-light leading-relaxed mb-6">"The best way to predict the future is to write about it."</blockquote>
          <p className="text-gray-400 text-sm">— BlogSpace Community</p>
        </div>
        <div className="relative z-10 flex gap-2">
          {[...Array(3)].map((_,i) => <div key={i} className={`h-1 rounded-full ${i===0?'w-8 bg-white':'w-4 bg-gray-600'}`}></div>)}
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Welcome back.</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to continue your journey.</p>
          </div>
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"/>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
              </div>
              <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"/>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Signing in...</> : 'Sign in'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            Don't have an account?{' '}<Link to="/register" className="font-semibold text-black dark:text-white hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
