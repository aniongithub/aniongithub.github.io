import React from 'react';

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  all_languages?: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  homepage?: string;
}

interface GitHubFeaturedTileProps {
  repo: GitHubRepo;
}

const GitHubFeaturedTile: React.FC<GitHubFeaturedTileProps> = ({ repo }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <a 
      href={repo.html_url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="github-featured-tile"
    >
      <h3>{repo.name}</h3>
      {repo.description && (
        <p className="synopsis">{repo.description}</p>
      )}
      <div className="meta">
        <div className="github-repo-languages">
          {(repo.all_languages || (repo.language ? [repo.language] : [])).slice(0, 3).map((lang, index) => (
            <span key={lang} className="github-language-item">
              <span className="github-language-dot" data-language={lang}></span>
              {lang}
            </span>
          ))}
        </div>
        <span>Updated {formatDate(repo.updated_at)}</span>
      </div>
    </a>
  );
};

export default GitHubFeaturedTile;