import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-400'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Start writing today.</h1>
            <p className="text-gray-500 dark:text-gray-400">Free forever. No credit card required.</p>
          </div>
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Min 6 characters" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"/>
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i<=strength?strengthColor[strength]:'bg-gray-200 dark:bg-gray-700'}`}></div>)}
                  </div>
                  <p className={`text-xs font-medium ${strength===1?'text-red-400':strength===2?'text-yellow-500':'text-green-500'}`}>{strengthLabel[strength]} password</p>
                </div>
              )}
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Creating account...</> : 'Create free account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}<Link to="/login" className="font-semibold text-black dark:text-white hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 bg-black dark:bg-gray-900 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 80% 50%, #10b981 0%, transparent 50%), radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%)'}}></div>
        <div className="relative z-10 text-center">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[{label:'Writers',value:'2.4K+'},{label:'Articles',value:'18K+'},{label:'Readers',value:'50K+'},{label:'Topics',value:'200+'}].map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm max-w-xs">Join thousands of writers sharing ideas that matter.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
