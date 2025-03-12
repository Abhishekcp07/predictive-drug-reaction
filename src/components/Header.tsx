
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FileText, Home, History, Menu, X } from 'lucide-react';
import { usePageTransition } from '@/utils/transitions';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { navigatePage } = usePageTransition();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = (path: string) => {
    navigatePage(path);
    setMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'New Prediction', icon: Home },
    { path: '/history', label: 'History', icon: History },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10',
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/');
            }}
          >
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-medium text-xl text-primary">DruResponse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.path);
                }}
                className={cn(
                  'flex items-center space-x-1 text-sm font-medium transition-colors duration-200',
                  isActive(link.path) 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 h-0.5 w-full bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="block md:hidden text-primary"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 bg-background/95 backdrop-blur-sm z-50 transition-all duration-300 md:hidden',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.path);
              }}
              className={cn(
                'flex items-center space-x-2 text-xl font-medium transition-colors duration-200',
                isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
