import React from 'react';
import githubData from '../data/github-data.json';
import GitHubProfileTile from './GitHubProfileTile';
import GitHubFeaturedTile from './GitHubFeaturedTile';
import GitHubLinksList from './GitHubLinksList';
import './GitHub.css';

const GitHub: React.FC = () => {
  return (
    <div className="metro-section">
      <div className="github-grid">
        {/* User Profile Tile */}
        <GitHubProfileTile user={githubData.user} stats={githubData.stats} />
        
        {/* Featured Repository Tiles */}
        <div className="github-pinned-repos">
          <h2 className="github-section-title">Featured Projects</h2>
          <div className="github-featured-grid">
            {githubData.pinnedRepos.map((repo) => (
              <GitHubFeaturedTile key={repo.name} repo={repo} />
            ))}
          </div>
        </div>

        {/* Other Repositories Links */}
        {githubData.otherRepos.length > 0 && (
          <div className="github-other-repos">
            <h2 className="github-section-title">Other Repositories</h2>
            <GitHubLinksList 
              items={githubData.otherRepos.map(repo => ({
                name: repo.name,
                description: repo.description || 'No description available',
                url: repo.html_url,
                language: repo.language,
                all_languages: repo.all_languages,
                stars: repo.stargazers_count
              }))}
              type="repo"
            />
          </div>
        )}

        {/* Public Gists Links */}
        {githubData.gists.length > 0 && (
          <div className="github-gists">
            <h2 className="github-section-title">Public Gists</h2>
            <GitHubLinksList 
              items={githubData.gists.map(gist => ({
                name: gist.files[0] || gist.id,
                description: gist.description || 'No description available',
                url: gist.html_url,
                files: gist.files
              }))}
              type="gist"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHub;