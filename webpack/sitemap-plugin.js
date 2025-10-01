const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

class SitemapWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      baseUrl: options.baseUrl || 'https://aniongithub.github.io',
      routes: options.routes || [],
      articlesDataPath: options.articlesDataPath || null,
      priority: options.priority || 0.8,
      changefreq: options.changefreq || 'monthly',
      ...options
    };
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('SitemapWebpackPlugin', async (compilation, callback) => {
      try {
        await this.generateSitemap(compilation);
        callback();
      } catch (error) {
        compilation.errors.push(new Error(`SitemapWebpackPlugin: ${error.message}`));
        callback();
      }
    });
  }

  async generateSitemap(compilation) {
    const links = [];
    
    // Add static routes
    const staticRoutes = [
      { url: '/#/', changefreq: 'weekly', priority: 1.0 },
      { url: '/#/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/#/articles', changefreq: 'weekly', priority: 0.9 },
      { url: '/#/github', changefreq: 'weekly', priority: 0.8 }
    ];

    staticRoutes.forEach(route => {
      links.push({
        url: route.url,
        changefreq: route.changefreq || this.options.changefreq,
        priority: route.priority || this.options.priority
      });
    });

    // Add article routes if articles data exists
    if (this.options.articlesDataPath) {
      try {
        const articlesDataFullPath = path.resolve(process.cwd(), this.options.articlesDataPath);
        if (fs.existsSync(articlesDataFullPath)) {
          const articlesData = JSON.parse(fs.readFileSync(articlesDataFullPath, 'utf8'));
          
          if (Array.isArray(articlesData)) {
            articlesData.forEach(article => {
              // Convert filename to slug (remove .md extension)
              const slug = article.replace('.md', '');
              links.push({
                url: `/#/articles/${slug}`,
                changefreq: 'monthly',
                priority: 0.7
              });
            });
          }
        }
      } catch (error) {
        console.warn(`Could not read articles data from ${this.options.articlesDataPath}:`, error.message);
      }
    }

    // Create sitemap
    const sitemapStream = new SitemapStream({ 
      hostname: this.options.baseUrl,
      cacheTime: 600000, // 600 sec - cache purge period
    });

    // Add all links to sitemap
    links.forEach(link => sitemapStream.write(link));
    sitemapStream.end();

    // Generate XML
    const sitemapXml = await streamToPromise(sitemapStream);
    
    // Write sitemap to output directory
    const outputPath = path.join(compilation.outputOptions.path, 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemapXml.toString());
    
    console.log(`✓ Generated sitemap.xml with ${links.length} URLs`);
    links.forEach(link => {
      console.log(`  - ${this.options.baseUrl}${link.url}`);
    });
  }
}

module.exports = SitemapWebpackPlugin;
