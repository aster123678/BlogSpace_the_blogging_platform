import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await API.get('/posts');
        setPosts(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Latest Posts</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Ideas worth reading</p>
          </div>
          {user && (
            <Link to="/posts/create" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
              Write
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20"><div className="w-8 h-8 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin mx-auto"></div></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No posts yet. Be the first to write!</p>
            {user && <Link to="/posts/create" className="inline-block mt-4 px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-gray-800 transition-all">Write a post</Link>}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <article key={post._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {post.author?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{post.author?.name}</span>
                      <span className="text-gray-300 dark:text-gray-600">·</span>
                      <span className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}</span>
                    </div>
                    <Link to={`/posts/${post._id}`}>
                      <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{post.title}</h2>
                    </Link>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-xs text-gray-400">{post.readTime} min read</span>
                      {post.tags?.slice(0,3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;
