import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../contexts/ThemeContext';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { theme } = useTheme();

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        // Use theme from context
        const isDark = theme === 'dark';
        
        // Initialize mermaid with appropriate theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: isDark ? {
            // Dark theme colors
            primaryColor: '#2a2a2a',
            primaryTextColor: '#efe6d9',
            primaryBorderColor: '#B19CD9',
            lineColor: '#efe6d9',
            secondaryColor: '#333333',
            tertiaryColor: '#1a1a1a',
            background: '#000000',
            mainBkg: '#2a2a2a',
            secondBkg: '#333333',
            altBackground: '#1a1a1a',
            secondaryTextColor: '#efe6d9',
            tertiaryTextColor: '#efe6d9',
            gridColor: '#444444',
            sectionBkgColor: '#2a2a2a',
            altSectionBkgColor: '#333333',
            nodeBorder: '#B19CD9',
            clusterBkg: '#333333',
            clusterBorder: '#B19CD9',
            defaultLinkColor: '#efe6d9',
            titleColor: '#efe6d9',
            edgeLabelBackground: '#2a2a2a',
            nodeTextColor: '#efe6d9'
          } : {
            // Light theme colors
            primaryColor: '#E8E0F5',
            primaryTextColor: '#2c3e50',
            primaryBorderColor: '#8B5DBA',
            lineColor: '#2c3e50',
            secondaryColor: '#F0EBFF',
            tertiaryColor: '#ffffff',
            background: '#ffffff',
            mainBkg: '#F8F9FA',
            secondBkg: '#E8E0F5',
            altBackground: '#F0F0F0',
            secondaryTextColor: '#555555',
            tertiaryTextColor: '#777777',
            gridColor: '#cccccc',
            sectionBkgColor: '#F8F9FA',
            altSectionBkgColor: '#E8E0F5',
            nodeBorder: '#8B5DBA',
            clusterBkg: '#F0EBFF',
            clusterBorder: '#B19CD9',
            defaultLinkColor: '#2c3e50',
            titleColor: '#2c3e50',
            edgeLabelBackground: '#ffffff',
            nodeTextColor: '#2c3e50'
          }
        });

        const { svg: renderedSvg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
        setSvg(renderedSvg);
        setError('');
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError('Failed to render diagram');
      }
    };

    renderDiagram();
  }, [chart, theme]);

  if (error) {
    return (
      <div className="mermaid-error" style={{ 
        padding: '1rem', 
        border: '1px solid var(--color-border)', 
        borderRadius: '4px',
        backgroundColor: 'var(--color-background-surface)',
        color: 'var(--color-text-muted)'
      }}>
        <pre>{chart}</pre>
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-subtle)' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="mermaid-diagram" 
      style={{ 
        textAlign: 'center', 
        margin: '1.5rem 0',
        overflow: 'auto'
      }}
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

export default MermaidDiagram;