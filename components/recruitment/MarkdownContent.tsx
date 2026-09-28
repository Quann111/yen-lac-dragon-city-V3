import React from 'react';

const IMAGE_RE = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/;

const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[u\][^[]+\[\/u\]|\[[^\]]+\]\(https?:\/\/[^)]+\))/g);
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={index}>{bold[1]}</strong>;
    const underline = part.match(/^\[u\]([^[]+)\[\/u\]$/);
    if (underline) return <u key={index}>{underline[1]}</u>;
    const italic = part.match(/^\*([^*]+)\*$/);
    if (italic) return <em key={index}>{italic[1]}</em>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) {
      return <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-royal-600 underline">{link[1]}</a>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const MarkdownContent: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => {
  const blocks = content.replace(/\r/g, '').trim().split(/\n\s*\n/).filter(Boolean);

  return (
    <div className={`space-y-4 text-gray-700 leading-8 ${className}`}>
      {blocks.map((block, index) => {
        const image = block.match(IMAGE_RE);
        if (image) {
          const [, alt, url, caption] = image;
          return (
            <figure key={index} className="mx-auto max-w-xl space-y-3">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-lg ring-1 ring-black/5">
                <img src={url} alt={alt} className="w-full rounded-lg" />
              </div>
              {caption && <figcaption className="text-center text-sm font-semibold uppercase tracking-wide text-gray-500">{caption}</figcaption>}
            </figure>
          );
        }
        if (block.startsWith('### ')) return <h3 key={index} className="text-xl font-bold text-royal-900">{renderInline(block.slice(4))}</h3>;
        if (block.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-royal-900">{renderInline(block.slice(3))}</h2>;
        if (block.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-gold-400 pl-5 text-gray-600 italic space-y-2">
              {block.split('\n').map((line, lineIndex) => <p key={lineIndex}>{renderInline(line.replace(/^>\s?/, ''))}</p>)}
            </blockquote>
          );
        }
        if (block.startsWith('- ')) {
          return (
            <ul key={index} className="list-disc pl-6 space-y-2">
              {block.split('\n').map((item, itemIndex) => <li key={itemIndex}>{renderInline(item.replace(/^[-*]\s+/, ''))}</li>)}
            </ul>
          );
        }
        if (/^\d+\.\s/.test(block)) {
          return (
            <ol key={index} className="list-decimal pl-6 space-y-2">
              {block.split('\n').map((item, itemIndex) => <li key={itemIndex}>{renderInline(item.replace(/^\d+\.\s+/, ''))}</li>)}
            </ol>
          );
        }
        return <p key={index}>{renderInline(block.replace(/\n/g, ' '))}</p>;
      })}
    </div>
  );
};

export default MarkdownContent;
