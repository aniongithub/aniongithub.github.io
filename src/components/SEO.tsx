import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Ani Balasubramaniam's website",
  description = "A Technical Leader with 30 years of professional experience and a highly specialized skill set for research/production AI/ML, simulation, real-time rendering, HPC/GPGPU, & game/video streaming, among other things",
  url = "https://www.anionline.me/",
  image = "https://www.anionline.me/assets/Ani.JPEG",
  type = "website",
  publishedDate,
  modifiedDate,
  author = "Ani"
}) => {
  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? "Article" : type === 'profile' ? "Person" : "WebSite",
    ...(type === 'website' && {
      "name": title,
      "description": description,
      "url": url,
      "author": {
        "@type": "Person",
        "name": author,
        "url": "https://www.anionline.me/"
      }
    }),
    ...(type === 'profile' && {
      "name": author,
      "url": url,
      "image": image,
      "sameAs": [
        "https://github.com/aniongithub"
      ],
      "jobTitle": "Software Developer",
      "description": description
    }),
    ...(type === 'article' && {
      "headline": title,
      "description": description,
      "url": url,
      "image": image,
      "author": {
        "@type": "Person",
        "name": author
      },
      ...(publishedDate && { "datePublished": publishedDate }),
      ...(modifiedDate && { "dateModified": modifiedDate })
    })
  };

  React.useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDescription) ogDescription.setAttribute('content', description);
    if (ogUrl) ogUrl.setAttribute('content', url);
    if (ogImage) ogImage.setAttribute('content', image);
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    const twitterImage = document.querySelector('meta[property="twitter:image"]');
    
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    if (twitterDescription) twitterDescription.setAttribute('content', description);
    if (twitterUrl) twitterUrl.setAttribute('content', url);
    if (twitterImage) twitterImage.setAttribute('content', image);
    
    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    }
    
    // Add/update structured data
    let structuredDataScript = document.querySelector('#structured-data') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
    
    return () => {
      // Cleanup structured data on unmount
      const script = document.querySelector('#structured-data');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, url, image, type, publishedDate, modifiedDate, author, structuredData]);

  return null; // This component doesn't render anything
};

export default SEO;
