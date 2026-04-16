import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setPost(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate('/posts');
    } catch (err) { alert('Failed to delete'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin"></div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <p className="text-gray-500">Post not found.</p>
    </div>
  );

  const isOwner = user && post.author?._id === user._id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/posts" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          All Posts
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {post.author?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{post.author?.name}</p>
                <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})} · {post.readTime} min read</p>
              </div>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Link to={`/posts/edit/${post._id}`} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Edit</Link>
                <button onClick={handleDelete} className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Delete</button>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{post.title}</h1>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">{tag}</span>)}
            </div>
          )}

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-[15px]">{post.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
