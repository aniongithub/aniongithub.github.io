import React from 'react';

interface GitHubLinksItem {
  name: string;
  description: string | null;
  url: string;
  language?: string | null;
  all_languages?: string[];
  stars?: number;
  files?: string[];
  updated_at?: string;
}

interface GitHubLinksListProps {
  items: GitHubLinksItem[];
  type: 'repo' | 'gist';
}

const GitHubLinksList: React.FC<GitHubLinksListProps> = ({ items, type }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      {items.map((item, index) => (
        <a
          key={`${type}-${index}`}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block metro-tile"
        >
          <div className="metro-tile-content">
            <div className="metro-tile-text">
              <h3>{item.name}</h3>
              {item.description && (
                <p className="synopsis">
                  {item.description.length > 100 
                    ? `${item.description.substring(0, 100)}...` 
                    : item.description
                  }
                </p>
              )}
              <div className="meta">
                <div className="github-repo-languages">
                  {(item.all_languages || (item.language ? [item.language] : [])).slice(0, 3).map((lang, langIndex) => (
                    <span key={lang} className="author github-language-item">
                      <span className="github-language-dot" data-language={lang}></span>
                      {lang}
                    </span>
                  ))}
                </div>
                {type === 'repo' && item.updated_at && (
                  <span className="date">Updated {formatDate(item.updated_at)}</span>
                )}
                {type === 'gist' && item.files && (
                  <span className="date">{item.files.length} file{item.files.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            <div className="metro-tile-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24">
                <path d="M 3.640625,1.0253906 9.9824219,7.5 3.640625,13.974609 2.9257812,13.275391 8.5839843,7.5 2.9257812,1.7246094 Z" />
              </svg>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default GitHubLinksList;