import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';
import articleFiles from '../data/articles.json';

interface Article {
  slug: string;
  title: string;
  synopsis: string;
  date: string;
  author: string;
}

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const loadedArticles: Article[] = [];

        for (const file of articleFiles) {
          try {
            const response = await fetch(`/content/${file}`);
            if (response.ok) {
              const markdown = await response.text();
              const { data } = matter(markdown);

              loadedArticles.push({
                slug: file.replace('.md', ''),
                title: data.title || 'Untitled',
                synopsis: data.synopsis || '',
                date: data.date || '',
                author: data.author || 'Anonymous'
              });
            }
          } catch (error) {
            console.warn(`Failed to load article: ${file}`, error);
          }
        }

        // Sort by date (newest first)
        loadedArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setArticles(loadedArticles);
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="metro-section">
        <div className="metro-loading">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="metro-section">
      {articles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <h2 className="metro-subtitle thin-text">Nothing here yet</h2>
            <p className="empty-state-message">
              New articles are coming soon. Check back later for fresh content and insights.
            </p>
          </div>
        </div>
      ) : (
        <div>
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/articles/${article.slug}`}
              className="block metro-tile"
            >
              <div className="metro-tile-content">
                <div className="metro-tile-text">
                  <h3>{article.title}</h3>
                  <p className="synopsis">{article.synopsis}</p>
                  <div className="meta">
                    <span className="author">By {article.author}</span>
                    <span className="date">{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="metro-tile-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24">
                    <path d="M 3.640625,1.0253906 9.9824219,7.5 3.640625,13.974609 2.9257812,13.275391 8.5839843,7.5 2.9257812,1.7246094 Z" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;