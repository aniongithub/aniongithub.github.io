import React, { useState, useEffect } from 'react';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { motion, AnimatePresence } from 'framer-motion';
import './ArticlePivot.css';
import '../styles/markdown.css';

interface Article {
  slug: string;
  title: string;
  synopsis: string;
  date: string;
  author: string;
  content: string;
}

interface ArticlePivotProps {
  articles: Article[];
}

const ArticlePivot: React.FC<ArticlePivotProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const navigateToArticle = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const getPivotItemClass = (index: number) => {
    if (index === currentIndex) return 'pivot-item active';
    if (Math.abs(index - currentIndex) === 1) return 'pivot-item adjacent';
    return 'pivot-item distant';
  };

  if (articles.length === 0) {
    return <div className="no-articles">No articles found.</div>;
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="article-pivot">
      <div className="pivot-navigation">
        {articles.map((article, index) => (
          <div
            key={article.slug}
            className={getPivotItemClass(index)}
            onClick={() => navigateToArticle(index)}
          >
            <h3 className="pivot-title">{article.title}</h3>
            <p className="pivot-synopsis">{article.synopsis}</p>
            <div className="pivot-meta">
              {typeof article.date === 'string' ? article.date : new Date(article.date).toLocaleDateString()} • {article.author}
            </div>
          </div>
        ))}
      </div>

      <div className="article-content">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="metro-markdown prose max-w-none"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            >
              {currentArticle.content}
            </ReactMarkdown>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ArticlePivot;