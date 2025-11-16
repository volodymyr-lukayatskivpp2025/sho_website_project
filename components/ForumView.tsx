import { useState, useEffect } from 'react';
import { mockPosts } from '../data/mockData';
import { Post, Comment } from '../types';
import { Plus, ThumbsUp, MessageCircle, Send, Filter, TrendingUp } from 'lucide-react';
import { CreatePostDialog } from './CreatePostDialog';

interface ForumViewProps {
  currentUser: string;
  userAvatar: string;
}

export function ForumView({ currentUser, userAvatar }: ForumViewProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [filterCategory, setFilterCategory] = useState<string>('Усі');

  useEffect(() => {
    const saved = localStorage.getItem('forumPosts');
    setPosts(saved ? JSON.parse(saved) : mockPosts);
  }, []);

  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem('forumPosts', JSON.stringify(newPosts));
  };

  const addPost = (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    savePosts([newPost, ...posts]);
  };

  const toggleLike = (postId: string) => {
    savePosts(
      posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const toggleCommentLike = (postId: string, commentId: string) => {
    savePosts(
      posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, likes: comment.likes + 1 }
                : comment
            )
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string) => {
    const commentText = commentTexts[postId]?.trim();
    if (!commentText) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author: currentUser,
      avatar: userAvatar,
      content: commentText,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    savePosts(
      posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );

    setCommentTexts({ ...commentTexts, [postId]: '' });
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'щойно';
    if (diffMins < 60) return `${diffMins} хв тому`;
    if (diffHours < 24) return `${diffHours} год тому`;
    if (diffDays < 7) return `${diffDays} дн тому`;
    return date.toLocaleDateString('uk-UA');
  };

  const categories = ['Усі', 'Програмування', 'Математика', 'Фізика', 'Оголошення', 'Інше'];

  const filteredPosts = posts.filter(post =>
    filterCategory === 'Усі' || post.category === filterCategory
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-violet-700 dark:text-violet-300 mb-4">ШО там?</h2>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                filterCategory === cat
                  ? 'bg-violet-400 dark:bg-violet-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-400 dark:bg-teal-600 text-white rounded-lg hover:bg-teal-500 dark:hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Створити пост
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Немає постів у цій категорії</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-700 border border-violet-200 dark:border-violet-800 rounded-xl p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">{post.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-gray-900 dark:text-gray-100">{post.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {post.author} • {formatTimeAgo(post.createdAt)}
                      </p>
                    </div>
                    <span className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              {expandedPost === post.id && (
                <div className="mt-4 pt-4 border-t border-violet-200 dark:border-violet-800 space-y-3">
                  {post.comments.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-3 bg-violet-50 dark:bg-violet-900/20 p-3 rounded-lg">
                          <div className="text-2xl">{comment.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-gray-900 dark:text-gray-100">{comment.author}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                            <button
                              onClick={() => toggleCommentLike(post.id, comment.id)}
                              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 text-xs"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{comment.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentTexts[post.id] || ''}
                      onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          addComment(post.id);
                        }
                      }}
                      placeholder="Напишіть коментар..."
                      className="flex-1 px-4 py-2 border border-violet-200 dark:border-violet-700 dark:bg-gray-600 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 text-sm"
                    />
                    <button
                      onClick={() => addComment(post.id)}
                      className="px-4 py-2 bg-violet-400 dark:bg-violet-600 text-white rounded-lg hover:bg-violet-500 dark:hover:bg-violet-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Post Dialog */}
      {showCreateDialog && (
        <CreatePostDialog
          onClose={() => setShowCreateDialog(false)}
          onAdd={addPost}
          currentUser={currentUser}
          userAvatar={userAvatar}
          categories={categories.filter(c => c !== 'Усі')}
        />
      )}
    </div>
  );
}