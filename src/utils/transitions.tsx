
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Transition duration in milliseconds
const TRANSITION_DURATION = 400;

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigatePage = (path: string) => {
    if (path === location.pathname) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(path);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, TRANSITION_DURATION);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return {
    isTransitioning,
    navigatePage,
    currentPath: location.pathname
  };
};

interface PageTransitionProps {
  children: React.ReactNode;
  isTransitioning: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  isTransitioning 
}) => {
  return (
    <div
      className={`transition-all duration-400 ease-in-out ${
        isTransitioning
          ? "opacity-0 transform translate-y-4"
          : "opacity-100 transform translate-y-0"
      }`}
    >
      {children}
    </div>
  );
};
