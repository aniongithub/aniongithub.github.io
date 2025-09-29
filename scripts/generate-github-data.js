const fs = require('fs');
const path = require('path');

const username = 'aniongithub';
const outputFile = path.join(__dirname, '../src/data/github-data.json');

async function generateGitHubData() {
  // Require GitHub token
  const token = process.env.USER_GITHUB_TOKEN;
  if (!token) {
    throw new Error('USER_GITHUB_TOKEN environment variable is required');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'aniongithub-portfolio-generator'
  };

  try {
    // Ensure the output directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Fetching GitHub data for ${username}...`);

    // GraphQL query to get pinned repositories
    const graphqlQuery = {
      query: `
        query {
          user(login: "${username}") {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name
                  description
                  url
                  primaryLanguage {
                    name
                  }
                  stargazerCount
                  forkCount
                  updatedAt
                  pushedAt
                  repositoryTopics(first: 10) {
                    nodes {
                      topic {
                        name
                      }
                    }
                  }
                  homepageUrl
                  isArchived
                  languages(first: 10) {
                    edges {
                      size
                      node {
                        name
                      }
                    }
                  }
                }
              }
            }
            contributionsCollection(from: "${new Date().getFullYear()}-01-01T00:00:00Z", to: "${new Date().getFullYear()}-12-31T23:59:59Z") {
              totalCommitContributions
              totalPullRequestContributions
              totalIssueContributions
              totalRepositoryContributions
            }
            repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {
              nodes {
                name
                isFork
                languages(first: 10) {
                  edges {
                    size
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `
    };

    // Fetch pinned repositories using GraphQL
    const graphqlResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    });

    if (!graphqlResponse.ok) {
      throw new Error(`Failed to fetch GraphQL data: ${graphqlResponse.status}`);
    }

    const graphqlData = await graphqlResponse.json();
    if (graphqlData.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(graphqlData.errors)}`);
    }

    const pinnedRepos = graphqlData.data.user.pinnedItems.nodes.map(repo => ({
      name: repo.name,
      description: repo.description,
      html_url: repo.url,
      language: repo.primaryLanguage ? repo.primaryLanguage.name : null,
      all_languages: repo.languages ? repo.languages.edges
        .sort((a, b) => b.size - a.size)
        .slice(0, 3)
        .map(edge => edge.node.name) : [],
      stargazers_count: repo.stargazerCount,
      forks_count: repo.forkCount,
      updated_at: repo.pushedAt || repo.updatedAt,
      topics: repo.repositoryTopics ? repo.repositoryTopics.nodes.map(topic => topic.topic.name) : [],
      homepage: repo.homepageUrl || undefined,
      archived: repo.isArchived
    }));

    console.log(`✅ Fetched ${pinnedRepos.length} pinned repositories via GraphQL`);

    // Fetch user profile data
    const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user data: ${userResponse.status}`);
    }
    const userData = await userResponse.json();

    // Fetch repositories for "other repos" section
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`, { headers });
    if (!reposResponse.ok) {
      throw new Error(`Failed to fetch repos: ${reposResponse.status}`);
    }
    const reposData = await reposResponse.json();

    // Process repositories - filter out forks and pinned repos
    const pinnedRepoNames = new Set(pinnedRepos.map(repo => repo.name));
    const otherReposBase = reposData
      .filter(repo => !repo.fork && !pinnedRepoNames.has(repo.name))
      .sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at))
      .slice(0, 20); // Limit to 20 most recent

    // Fetch languages for the top other repos (to avoid too many API calls)
    const otherRepos = await Promise.all(
      otherReposBase.slice(0, 15).map(async (repo, index) => {
        try {
          // Add a small delay to avoid rate limiting
          if (index > 0) await new Promise(resolve => setTimeout(resolve, 100));
          
          const languagesResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`, { headers });
          let all_languages = [];
          
          if (languagesResponse.ok) {
            const languagesData = await languagesResponse.json();
            // Sort languages by size and take top 3
            all_languages = Object.entries(languagesData)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([lang]) => lang);
          } else {
            // Fallback to primary language if languages API fails
            all_languages = repo.language ? [repo.language] : [];
          }

          return {
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            language: repo.language,
            all_languages,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            updated_at: repo.pushed_at || repo.updated_at,
            topics: repo.topics || [],
            homepage: repo.homepage || undefined,
            archived: repo.archived
          };
        } catch (error) {
          console.warn(`Failed to fetch languages for ${repo.name}:`, error.message);
          // Return repo with fallback language
          return {
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            language: repo.language,
            all_languages: repo.language ? [repo.language] : [],
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            updated_at: repo.pushed_at || repo.updated_at,
            topics: repo.topics || [],
            homepage: repo.homepage || undefined,
            archived: repo.archived
          };
        }
      })
    ).then(results => {
      // Add remaining repos without language fetching to avoid hitting rate limits
      const remainingRepos = otherReposBase.slice(15).map(repo => ({
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        all_languages: repo.language ? [repo.language] : [],
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.pushed_at || repo.updated_at,
        topics: repo.topics || [],
        homepage: repo.homepage || undefined,
        archived: repo.archived
      }));
      
      return [...results, ...remainingRepos];
    });

    // Fetch public gists
    let gistsData = [];
    try {
      const gistsResponse = await fetch(`https://api.github.com/users/${username}/gists?per_page=50`, { headers });
      if (gistsResponse.ok) {
        gistsData = await gistsResponse.json();
      } else {
        console.warn(`Failed to fetch gists: ${gistsResponse.status}`);
      }
    } catch (error) {
      console.warn('Failed to fetch gists:', error.message);
    }

    // Process gists
    const processedGists = gistsData
      .filter(gist => gist.public)
      .map(gist => ({
        id: gist.id,
        description: gist.description || 'No description',
        html_url: gist.html_url,
        files: Object.keys(gist.files),
        created_at: gist.created_at,
        updated_at: gist.updated_at
      }))
      .slice(0, 10); // Limit to 10 most recent gists

    // Calculate top languages by total size across all repositories
    const languageSizes = {};
    
    // Process all repositories from GraphQL data (excluding forks)
    graphqlData.data.user.repositories.nodes
      .filter(repo => !repo.isFork)
      .forEach(repo => {
        if (repo.languages && repo.languages.edges) {
          repo.languages.edges.forEach(edge => {
            const langName = edge.node.name;
            const size = edge.size;
            if (languageSizes[langName]) {
              languageSizes[langName] += size;
            } else {
              languageSizes[langName] = size;
            }
          });
        }
      });
    
    // Sort languages by total size and get top 12
    const languages = Object.entries(languageSizes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 12)
      .map(([name]) => name);

    // Calculate total stars and forks from user's repos (not including forks)
    const ownRepos = reposData.filter(repo => !repo.fork);
    const totalStars = ownRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = ownRepos.reduce((sum, repo) => sum + repo.forks_count, 0);

    // Calculate total contributions for current year
    const currentYear = new Date().getFullYear();
    const contributionsThisYear = graphqlData.data.user.contributionsCollection;
    const totalContributionsThisYear = 
      contributionsThisYear.totalCommitContributions +
      contributionsThisYear.totalPullRequestContributions +
      contributionsThisYear.totalIssueContributions +
      contributionsThisYear.totalRepositoryContributions;

    const githubData = {
      user: {
        login: userData.login,
        name: userData.name,
        bio: userData.bio,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        blog: userData.blog,
        twitter_username: userData.twitter_username,
        public_repos: userData.public_repos,
        public_gists: userData.public_gists,
        followers: userData.followers,
        following: userData.following,
        created_at: userData.created_at
      },
      stats: {
        totalStars,
        totalForks,
        totalRepos: userData.public_repos,
        totalGists: userData.public_gists,
        languages: languages.slice(0, 12),
        contributionsThisYear: totalContributionsThisYear,
        currentYear: currentYear
      },
      pinnedRepos,
      otherRepos,
      gists: processedGists,
      lastUpdated: new Date().toISOString()
    };

    // Write the GitHub data to JSON
    fs.writeFileSync(outputFile, JSON.stringify(githubData, null, 2));
    
    console.log(`✅ Generated GitHub data:`);
    console.log(`  - Profile: ${githubData.user.name} (@${githubData.user.login})`);
    console.log(`  - Pinned Repos: ${githubData.pinnedRepos.length}`);
    console.log(`  - Other Repos: ${githubData.otherRepos.length}`);
    console.log(`  - Stars Earned: ${githubData.stats.totalStars}`);
    console.log(`  - Gists: ${githubData.gists.length}`);
    console.log(`  - Languages: ${githubData.stats.languages.join(', ')}`);
    
  } catch (error) {
    console.error('Failed to generate GitHub data:', error);
    process.exit(1);
  }
}

generateGitHubData();