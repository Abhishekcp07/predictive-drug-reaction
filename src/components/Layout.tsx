
import { useEffect } from 'react';
import Header from './Header';
import { usePageTransition, PageTransition } from '@/utils/transitions';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isTransitioning } = usePageTransition();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 md:px-8">
        <PageTransition isTransitioning={isTransitioning}>
          <div className="container max-w-7xl mx-auto">
            {children}
          </div>
        </PageTransition>
      </main>
      <footer className="py-6 border-t border-border">
        <div className="container max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DruResponse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
