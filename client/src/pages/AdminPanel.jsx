import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import API from '../api/axios';

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, publishedPosts: 0, draftPosts: 0 });
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, postsRes, statsRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/admin/posts'),
          API.get('/admin/stats'),
        ]);
        setUsers(usersRes.data);
        setPosts(postsRes.data);
        setStats(statsRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their posts?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete user'); }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/admin/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) { alert('Failed to delete post'); }
  };

  const handleRoleChange = async (id, role) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/role`, { role });
      setUsers(users.map(u => u._id === id ? data : u));
    } catch (err) { alert('Failed to update role'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Admin Access</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Control Panel</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Signed in as <span className="font-semibold text-gray-700 dark:text-gray-300">{user?.email}</span></p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
            { label: 'Total Posts', value: stats.totalPosts, icon: '📄' },
            { label: 'Published', value: stats.publishedPosts, icon: '🌍' },
            { label: 'Drafts', value: stats.draftPosts, icon: '📋' },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:-translate-y-1 transition-transform duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            {['users', 'posts'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 text-sm font-bold capitalize transition-colors ${activeTab===tab?'bg-black dark:bg-white text-white dark:text-black':'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {tab === 'users' ? `👥 Users (${users.length})` : `📄 Posts (${posts.length})`}
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12"><div className="w-8 h-8 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin mx-auto"></div></div>
            ) : activeTab === 'users' ? (
              <div className="space-y-3">
                {users.length === 0 ? <p className="text-center text-gray-400 py-8">No users found.</p> : users.map(u => (
                  <div key={u._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name} {u._id === user._id && <span className="text-xs text-blue-500">(you)</span>}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} disabled={u._id === user._id} className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none disabled:opacity-50">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      {u._id !== user._id && (
                        <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {posts.length === 0 ? <p className="text-center text-gray-400 py-8">No posts found.</p> : posts.map(p => (
                  <div key={p._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{p.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${p.status==='published'?'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400':'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{p.status}</span>
                      </div>
                      <p className="text-xs text-gray-400">By {p.author?.name} · {new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleDeletePost(p._id)} className="ml-4 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-colors flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
