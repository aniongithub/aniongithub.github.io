import React from 'react';

interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  blog: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubStats {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  totalGists: number;
  languages: string[];
  contributionsThisYear: number;
  currentYear: number;
}

interface GitHubProfileTileProps {
  user: GitHubUser;
  stats: GitHubStats;
}

const GitHubProfileTile: React.FC<GitHubProfileTileProps> = ({ user, stats }) => {
  return (
    <a 
      href={user.html_url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="github-profile-tile"
    >
      <div className="github-profile-content">
        <img 
          src={user.avatar_url} 
          alt={`${user.name}'s avatar`}
          className="github-profile-avatar"
        />
        <div className="github-profile-info">
          <h2 className="github-profile-title">{user.name} (@{user.login})</h2>
          {user.bio && (
            <p className="github-profile-bio">{user.bio}</p>
          )}
          <div className="github-profile-stats">
            {stats.totalStars} Stars Earned • {stats.totalRepos} Repositories • {user.followers} Followers • {stats.contributionsThisYear} public contributions in {stats.currentYear}
          </div>
          {stats.languages.length > 0 && (
            <div className="github-languages">
              <div className="github-languages-list">
                {stats.languages.slice(0, 8).map((language) => (
                  <span key={language} className="github-language-tag">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default GitHubProfileTile;