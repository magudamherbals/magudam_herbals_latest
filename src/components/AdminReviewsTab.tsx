import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Save,
  X,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Review {
  id: string;
  name: string;
  city: string;
  stars: number;
  review: string;
  created_at: string;
  approved: boolean;
}

const StarDisplay = ({ value, size = 14 }: { value: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        fill={value >= s ? '#f59e0b' : 'none'}
        color={value >= s ? '#f59e0b' : '#d1d5db'}
        strokeWidth={1.5}
      />
    ))}
  </div>
);

const AdminReviewsTab = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      toast.error('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ approved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, approved: !currentStatus } : r))
      );
      toast.success(
        !currentStatus
          ? '✅ Review approved and published!'
          : '👁️ Review hidden from public page'
      );
    } catch (err) {
      toast.error('Failed to update review status');
    }
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditText(review.review);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id: string) => {
    if (!editText.trim()) return;
    setSavingId(id);
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ review: editText.trim() })
        .eq('id', id);

      if (error) throw error;

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, review: editText.trim() } : r))
      );
      setEditingId(null);
      toast.success('Review updated successfully');
    } catch (err) {
      toast.error('Failed to update review');
    } finally {
      setSavingId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const deleteReview = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', deleteId);
      if (error) throw error;
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
      toast.success('Review deleted');
    } catch (err) {
      toast.error('Failed to delete review');
    } finally {
      setDeleteId(null);
      setDeleteDialogOpen(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'pending' && !r.approved) ||
      (filter === 'approved' && r.approved);

    const searchLower = search.toLowerCase();
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(searchLower) ||
      r.city.toLowerCase().includes(searchLower) ||
      r.review.toLowerCase().includes(searchLower);

    return matchFilter && matchSearch;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;
  const approvedCount = reviews.filter((r) => r.approved).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold">Customer Reviews</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Approve, modify, or remove customer reviews
          </p>
        </div>
        <button
          onClick={fetchAllReviews}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: 'Total Reviews',
            value: reviews.length,
            icon: MessageSquare,
            color: 'bg-blue-100 text-blue-700',
          },
          {
            label: 'Pending Approval',
            value: pendingCount,
            icon: Clock,
            color: 'bg-amber-100 text-amber-700',
          },
          {
            label: 'Published',
            value: approvedCount,
            icon: CheckCircle,
            color: 'bg-green-100 text-green-700',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card-herbal p-4 text-center">
            <div
              className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}
            >
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, city, or review..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-herbal pl-10"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex rounded-xl overflow-hidden border border-border">
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground hover:bg-secondary'
              }`}
            >
              <Filter size={13} />
              {f === 'all' ? 'All' : f === 'pending' ? `Pending (${pendingCount})` : `Approved (${approvedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="mx-auto mb-4 opacity-30" size={48} />
          <p>{reviews.length === 0 ? 'No reviews yet' : 'No reviews match your filter'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={`card-herbal p-5 border-l-4 ${
                  review.approved
                    ? 'border-l-green-500'
                    : 'border-l-amber-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Review info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-semibold text-foreground">{review.name}</span>
                      <span className="text-muted-foreground text-sm">•</span>
                      <span className="text-muted-foreground text-sm">{review.city}</span>
                      <StarDisplay value={review.stars} />
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          review.approved
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {review.approved ? '✓ Published' : '⏳ Pending'}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      Submitted: {new Date(review.created_at).toLocaleString('en-IN')}
                    </p>

                    {/* Review text or edit area */}
                    {editingId === review.id ? (
                      <div className="mt-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          maxLength={500}
                          className="input-herbal resize-none text-sm"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveEdit(review.id)}
                            disabled={savingId === review.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                          >
                            {savingId === review.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm hover:bg-secondary/80 transition-colors"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-foreground/80 text-sm italic leading-relaxed">
                        "{review.review}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    {/* Approve/Hide toggle */}
                    <button
                      onClick={() => toggleApproval(review.id, review.approved)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        review.approved
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={review.approved ? 'Hide from public' : 'Approve & publish'}
                    >
                      {review.approved ? (
                        <>
                          <EyeOff size={14} /> Hide
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} /> Approve
                        </>
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() =>
                        editingId === review.id ? cancelEdit() : startEdit(review)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      title="Edit review text"
                    >
                      <Edit3 size={14} /> Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => confirmDelete(review.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteReview}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReviewsTab;
