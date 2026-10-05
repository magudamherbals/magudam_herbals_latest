import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { key: 'nav.home', href: '#' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.products', href: '#products' },
    { key: 'nav.contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max">
        <div className="flex items-center justify-between h-20 px-4 md:px-8">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group select-none">
            {/* Logo ring */}
            <div className={`relative flex-shrink-0 rounded-full p-0.5 transition-all duration-300 ${
              isScrolled
                ? 'bg-gradient-to-br from-primary via-accent to-primary shadow-md'
                : 'bg-gradient-to-br from-primary-foreground/40 via-accent/60 to-primary-foreground/20'
            }`}>
              <div className={`rounded-full p-0.5 ${isScrolled ? 'bg-background' : 'bg-primary/40'}`}>
                <img
                  src='./magudam_logo_1.png'
                  className='h-10 w-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-105'
                  alt="Magudam Herbals logo"
                />
              </div>
              {/* Subtle glow dot */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent border-2 border-background animate-pulse" />
            </div>

            {/* Brand text */}
            <div className="flex flex-col leading-none">
              <span className={`font-display text-lg font-extrabold tracking-wide transition-all duration-300 ${
                isScrolled
                  ? 'bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent'
                  : 'text-primary-foreground drop-shadow-sm'
              }`}>
                MAGUDAM
              </span>
              <span className={`font-display text-[11px] font-semibold tracking-[0.25em] uppercase transition-colors duration-300 ${
                isScrolled ? 'text-accent' : 'text-primary-foreground/70'
              }`}>
                Herbals
              </span>
            </div>
          </a>


          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className={`font-medium transition-colors duration-300 hover:text-accent ${
                  isScrolled ? 'text-foreground' : 'text-primary-foreground'
                }`}
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              title="Switch language"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-300 ${
                isScrolled
                  ? 'border-border text-foreground hover:bg-secondary'
                  : 'border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10'
              }`}
            >
              <span className="text-base">{language === 'en' ? '🇮🇳' : '🇬🇧'}</span>
              <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-full transition-colors ${
                isScrolled
                  ? 'hover:bg-secondary'
                  : 'hover:bg-primary-foreground/10'
              }`}
            >
              <ShoppingBag
                className={`transition-colors duration-300 ${
                  isScrolled ? 'text-foreground' : 'text-primary-foreground'
                }`}
                size={24}
              />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${
                isScrolled
                  ? 'hover:bg-secondary'
                  : 'hover:bg-primary-foreground/10'
              }`}
            >
              {isMobileMenuOpen ? (
                <X
                  className={isScrolled ? 'text-foreground' : 'text-primary-foreground'}
                  size={24}
                />
              ) : (
                <Menu
                  className={isScrolled ? 'text-foreground' : 'text-primary-foreground'}
                  size={24}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <nav className="container-max py-6 px-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t(link.key)}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
