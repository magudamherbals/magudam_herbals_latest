import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Send, Leaf, MessageSquarePlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

interface Review {
  id: string;
  name: string;
  city: string;
  stars: number;
  review: string;
  created_at: string;
  approved: boolean;
}

const StarRating = ({
  value,
  onChange,
  readOnly = false,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readOnly ? 'button' : 'button'}
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`transition-transform duration-150 ${!readOnly ? 'hover:scale-125 cursor-pointer' : 'cursor-default'
            }`}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <Star
            size={size}
            fill={(hovered || value) >= star ? '#f59e0b' : 'none'}
            color={(hovered || value) >= star ? '#f59e0b' : '#d1d5db'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewCard = ({ review, index }: { review: Review; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="relative bg-card rounded-2xl p-6 md:p-8 flex flex-col gap-4 h-full"
    style={{ boxShadow: 'var(--shadow-card)' }}
  >
    {/* Decorative leaf */}
    <div className="absolute top-4 right-4 opacity-10">
      <Leaf size={48} className="text-primary rotate-45" />
    </div>

    {/* Quote icon */}
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      <Quote size={18} className="text-primary" />
    </div>

    {/* Stars */}
    <StarRating value={review.stars} readOnly size={18} />

    {/* Review text */}
    <p className="text-foreground/80 leading-relaxed flex-1 italic text-sm md:text-base">
      "{review.review}"
    </p>

    {/* Divider */}
    <div className="border-t border-border pt-4">
      <p className="font-semibold text-foreground text-sm">{review.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{review.city}</p>
    </div>
  </motion.div>
);

const REVIEWS_PER_PAGE = 3;

const ReviewSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    city: '',
    stars: 0,
    review: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  // Auto-slide every 3 seconds, pause on hover
  const AUTO_SLIDE_MS = 3000;
  useEffect(() => {
    if (loading || reviews.length === 0) return;
    const totalPgs = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
    if (totalPgs <= 1) return;
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentPage((p) => (p + 1) % totalPgs);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [loading, reviews.length, isHovered]);

  const fetchApprovedReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const visibleReviews = reviews.slice(
    currentPage * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE + REVIEWS_PER_PAGE
  );

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = t('reviews.errName');
    if (!form.city.trim()) errors.city = t('reviews.errCity');
    if (form.stars === 0) errors.stars = t('reviews.errStars');
    if (!form.review.trim()) errors.review = t('reviews.errReview');
    if (form.review.trim().length < 10) errors.review = t('reviews.errReviewMin');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setSubmitting(true);

    try {
      const { error } = await supabase.from('reviews').insert([
        {
          name: form.name.trim(),
          city: form.city.trim(),
          stars: form.stars,
          review: form.review.trim(),
          approved: false,
        },
      ]);

      if (error) throw error;

      toast.success(t('reviews.success'));
      setForm({ name: '', city: '', stars: 0, review: '' });
      setShowForm(false);
    } catch (err) {
      toast.error(t('reviews.error'));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <section id="reviews" className="section-padding leaf-pattern" ref={ref}>
      <div className="container-max">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            {t('reviews.badge')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('reviews.heading1')}
            <span className="text-gradient" style={{ backgroundImage: 'var(--gradient-gold)' }}>
              {t('reviews.heading2')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('reviews.subheading')}
          </p>

          {/* Aggregate stats */}
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={20}
                    fill={parseFloat(avgRating) >= s ? '#f59e0b' : 'none'}
                    color={parseFloat(avgRating) >= s ? '#f59e0b' : '#d1d5db'}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="font-bold text-foreground text-lg">{avgRating}</span>
              <span className="text-muted-foreground text-sm">
                ({reviews.length} {reviews.length === 1 ? t('reviews.verifiedReview') : t('reviews.verifiedReviews')})
              </span>
            </div>
          )}
        </motion.div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="text-center py-16 text-muted-foreground"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquarePlus size={36} className="text-primary" />
            </div>
            <p className="text-lg font-medium mb-2">{t('reviews.emptyTitle')}</p>
            <p className="text-sm">{t('reviews.emptyDesc')}</p>
          </motion.div>
        ) : (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {visibleReviews.map((review, idx) => (
                  <ReviewCard key={review.id} review={review} index={idx} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination + progress */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mb-10">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentPage((p) => (p - 1 + totalPages) % totalPages)}
                    className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex gap-2 items-center">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`rounded-full transition-all duration-300 ${i === currentPage
                          ? 'bg-primary w-6 h-2.5'
                          : 'bg-border hover:bg-primary/40 w-2.5 h-2.5'
                          }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => (p + 1) % totalPages)}
                    className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Auto-slide progress bar */}
                {!isHovered && (
                  <div className="w-48 h-0.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                      key={currentPage}
                      className="h-full bg-primary rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: AUTO_SLIDE_MS / 1000, ease: 'linear' }}
                    />
                  </div>
                )}
                {isHovered && (
                  <p className="text-xs text-muted-foreground">{t('reviews.autoSlidePaused')}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Write Review CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold)' }}
          >
            <MessageSquarePlus size={20} />
            {showForm ? t('reviews.closeForm') : t('reviews.writeReview')}
          </button>
        </motion.div>

        {/* Review Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="max-w-2xl mx-auto">
                <div
                  className="rounded-3xl p-8 md:p-10"
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(145 45% 22% / 0.05) 0%, hsl(42 85% 55% / 0.06) 100%)',
                    border: '1px solid hsl(var(--border))',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Leaf size={26} className="text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                      {t('reviews.formTitle')}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t('reviews.formSubtitle')}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name & City row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-1.5 block">
                          {t('reviews.yourName')} <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder={t('reviews.namePlaceholder')}
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="input-herbal"
                          maxLength={60}
                        />
                        {formErrors.name && (
                          <p className="text-xs text-destructive mt-1">{formErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-1.5 block">
                          {t('reviews.city')} <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder={t('reviews.cityPlaceholder')}
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="input-herbal"
                          maxLength={60}
                        />
                        {formErrors.city && (
                          <p className="text-xs text-destructive mt-1">{formErrors.city}</p>
                        )}
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        {t('reviews.yourRating')} <span className="text-destructive">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <StarRating
                          value={form.stars}
                          onChange={(v) => setForm({ ...form, stars: v })}
                          size={28}
                        />
                        {form.stars > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {t(`reviews.rating.${form.stars}`)}
                          </span>
                        )}
                      </div>
                      {formErrors.stars && (
                        <p className="text-xs text-destructive mt-1">{formErrors.stars}</p>
                      )}
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-1.5 block">
                        {t('reviews.yourReview')} <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        placeholder={t('reviews.reviewPlaceholder')}
                        value={form.review}
                        onChange={(e) => setForm({ ...form, review: e.target.value })}
                        rows={4}
                        maxLength={500}
                        className="input-herbal resize-none"
                      />
                      <div className="flex justify-between items-center mt-1">
                        {formErrors.review ? (
                          <p className="text-xs text-destructive">{formErrors.review}</p>
                        ) : (
                          <span />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {form.review.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                      {submitting ? t('reviews.submitting') : t('reviews.submit')}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ReviewSection;
