"use client";

import { useEffect, useRef, useState } from "react";

interface WordPressEmbedProps {
  slug: string;
}

export default function WordPressEmbed({ slug }: WordPressEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(800);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        // Try to access iframe content to adjust height
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          // Remove WordPress header, footer, and sidebar for cleaner embed
          const elementsToHide = [
            'header',
            'footer',
            'nav',
            '.site-header',
            '.site-footer',
            '#wpadminbar',
            'aside',
            '.sidebar',
            '.comments-area',
          ];

          elementsToHide.forEach(selector => {
            const elements = iframeDoc.querySelectorAll(selector);
            elements.forEach(el => {
              (el as HTMLElement).style.display = 'none';
            });
          });

          // Adjust height to content
          const contentHeight = iframeDoc.body.scrollHeight;
          setIframeHeight(contentHeight + 50);

          // Add custom styles for better integration
          const style = iframeDoc.createElement('style');
          style.textContent = `
            body {
              margin: 0 !important;
              padding: 20px !important;
              overflow-x: hidden !important;
            }
            .entry-content,
            .post-content,
            article {
              max-width: 100% !important;
              margin: 0 auto !important;
            }
          `;
          iframeDoc.head.appendChild(style);
        }
      } catch (e) {
        // Cross-origin restrictions - can't modify iframe content
        console.log("Cannot access iframe content due to CORS");
      }
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div className="wordpress-embed-container">
      <iframe
        ref={iframeRef}
        src={`https://blog.sparkonomy.com/${slug}/`}
        className="w-full border-0"
        style={{ height: `${iframeHeight}px` }}
        title="WordPress Blog Post"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}
