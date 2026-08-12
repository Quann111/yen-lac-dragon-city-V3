import React from 'react';

const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g);
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={index}>{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) {
      return <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-royal-600 underline">{link[1]}</a>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const MarkdownContent: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => {
  const blocks = content.trim().split(/\n\s*\n/).filter(Boolean);

  return (
    <div className={`space-y-4 text-gray-700 leading-8 ${className}`}>
      {blocks.map((block, index) => {
        if (block.startsWith('### ')) return <h3 key={index} className="text-xl font-bold text-royal-900">{renderInline(block.slice(4))}</h3>;
        if (block.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-royal-900">{renderInline(block.slice(3))}</h2>;
        if (block.startsWith('- ')) {
          return (
            <ul key={index} className="list-disc pl-6 space-y-2">
              {block.split('\n').map((item, itemIndex) => <li key={itemIndex}>{renderInline(item.replace(/^[-*]\s+/, ''))}</li>)}
            </ul>
          );
        }
        return <p key={index}>{renderInline(block.replace(/\n/g, ' '))}</p>;
      })}
    </div>
  );
};

export default MarkdownContent;
