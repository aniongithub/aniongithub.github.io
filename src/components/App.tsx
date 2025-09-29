import React from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import Articles from './Articles';
import About from './About';
import ArticleDetail from './ArticleDetail';
import GitHub from './GitHub';
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

  return (
    <ThemeProvider>
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