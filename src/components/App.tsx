import React from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import Articles from './Articles';
import About from './About';
import ArticleDetail from './ArticleDetail';
import GitHub from './GitHub';
import SEO from './SEO';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '../contexts/ThemeContext';

const variants = {
  enter: { x: 50, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -50, opacity: 0 },
};

const AnimatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial="enter"
      animate="center"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.45 }}
    >
      {children}
    </motion.div>
  );
};

const App: React.FC = () => {
  const location = useLocation();

  // SEO content based on current route
  const getSEOProps = () => {
    const baseUrl = 'https://www.anionline.me/#';
    
    switch (location.pathname) {
      case '/':
        return {
          title: 'Ani Balasubramaniam\'s website',
          description: 'A Technical Leader with 30 years of professional experience and a highly specialized skill set for research/production AI/ML, simulation, real-time rendering, HPC/GPGPU, & game/video streaming, among other things',
          url: `${baseUrl}/`,
          type: 'website' as const
        };
      case '/about':
        return {
          title: 'About Ani - Software Developer Profile',
          description: 'Learn more about Ani, a passionate software developer with expertise in various programming languages and technologies. View resume and professional background.',
          url: `${baseUrl}/about`,
          type: 'profile' as const
        };
      case '/articles':
        return {
          title: 'Articles - Tech Insights by Ani',
          description: 'Read technical articles and insights on programming, software development, and technology trends written by Ani.',
          url: `${baseUrl}/articles`,
          type: 'website' as const
        };
      case '/github':
        return {
          title: 'GitHub Projects - Open Source Contributions by Ani',
          description: 'Explore Ani\'s open source projects, contributions, and GitHub activity. Discover innovative solutions and code repositories.',
          url: `${baseUrl}/github`,
          type: 'website' as const
        };
      default:
        if (location.pathname.startsWith('/articles/')) {
          const slug = location.pathname.split('/articles/')[1];
          return {
            title: `${slug} - Article by Ani`,
            description: `Read the article "${slug}" by Ani, covering insights on software development and technology.`,
            url: `${baseUrl}${location.pathname}`,
            type: 'article' as const
          };
        }
        return {
          title: 'Ani Balasubramaniam\'s website',
          description: 'A Technical Leader with 30 years of professional experience and a highly specialized skill set for research/production AI/ML, simulation, real-time rendering, HPC/GPGPU, & game/video streaming, among other things',
          url: `${baseUrl}/`,
          type: 'website' as const
        };
    }
  };

  return (
    <ThemeProvider>
      <SEO {...getSEOProps()} />
      <div className="metro-root min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-6 md:px-12 py-8">
          <div className={`relative ${location.pathname.startsWith('/articles/') ? 'overflow-visible' : 'overflow-hidden'}`}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                  <AnimatedRoute>
                    <Home />
                  </AnimatedRoute>
                } />
                <Route path="/articles" element={
                  <AnimatedRoute>
                    <Articles />
                  </AnimatedRoute>
                } />
                <Route path="/articles/:slug" element={
                  <AnimatedRoute>
                    <ArticleDetail />
                  </AnimatedRoute>
                } />
                <Route path="/about" element={
                  <AnimatedRoute>
                    <About />
                  </AnimatedRoute>
                } />
                <Route path="/github" element={
                  <AnimatedRoute>
                    <GitHub />
                  </AnimatedRoute>
                } />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App;