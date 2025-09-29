import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import matter from 'gray-matter';
import YouTubeEmbed from './YouTubeEmbed';
import MermaidDiagram from './MermaidDiagram';
import './ArticleDetail.css';

interface ArticleFrontMatter {
  title: string;
  synopsis: string;
  date: string;
  author: string;
}

interface Article {
  slug: string;
  frontMatter: ArticleFrontMatter;
  content: string;
}

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) {
        setError('No article specified');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/content/${slug}.md`);
        if (!response.ok) {
          throw new Error('Article not found');
        }
        
        const markdownContent = await response.text();
        const { data: frontMatter, content } = matter(markdownContent);
        
        setArticle({
          slug,
          frontMatter: frontMatter as ArticleFrontMatter,
          content
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="metro-section">
        <div className="text-center py-12">
          <div className="metro-loading">Loading article...</div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="metro-section">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            {error || 'Article not found'}
          </div>
          <button
            onClick={() => navigate('/articles')}
            className="metro-button"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="metro-section">
      <button
        onClick={() => navigate('/articles')}
        className="back-arrow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24">
          <path d="M 9.2675781 1.0253906 L 2.9257812 7.5 L 9.2675781 13.974609 L 9.9824219 13.275391 L 4.3242188 7.5 L 9.9824219 1.7246094 L 9.2675781 1.0253906 z" font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible"/>
        </svg>
      </button>

      <article>
        <div className="article-content">
          <ReactMarkdown
            className="metro-markdown"
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeRaw, 
              [rehypeHighlight, { 
                ignoreMissing: true,
                detect: true 
              }]
            ]}
            components={{
              a: ({ href, children }) => <YouTubeEmbed href={href || ''} children={children} />,
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const language = match?.[1];
                
                if (language === 'mermaid') {
                  return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                }
                
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
