import React from 'react';

// YouTube URL patterns
const YOUTUBE_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

interface YouTubeEmbedProps {
  href: string;
  children: React.ReactNode;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ href, children }) => {
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

export default YouTubeEmbed;