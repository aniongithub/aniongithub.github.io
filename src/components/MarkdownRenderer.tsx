import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

import '../styles/markdown.css';

// YouTube URL patterns
const YOUTUBE_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

// Custom component for YouTube links
const YouTubeEmbed: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const match = href.match(YOUTUBE_REGEX);
  
  if (match && match[1]) {
    const videoId = match[1];
    return (
      <div className="youtube-embed" style={{ 
        position: 'relative', 
        paddingBottom: '56.25%', 
        height: 0, 
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        <iframe
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  
  // If not a YouTube link, render as normal link
  return <a href={href}>{children}</a>;
};

interface Props {
  src: string; // path to markdown file (served from webpack copy)
}

const MarkdownRenderer: React.FC<Props> = ({ src }) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    fetch(src)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load markdown');
        return res.text();
      })
      .then(txt => mounted && setContent(txt))
      .catch(err => {
        console.error(err);
        if (mounted) setContent('# Error\nCould not load content.');
      });
    return () => { mounted = false };
  }, [src]);

  return (
    <div className="metro-markdown prose max-w-none">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          a: ({ href, children }) => <YouTubeEmbed href={href || ''} children={children} />
        }}
      />
    </div>
  );
}

export default MarkdownRenderer;
