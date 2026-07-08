// -----------------------------------------------------------------------------
// BlocksRenderer
// -----------------------------------------------------------------------------
// Strapi's rich-text fields come as a structured "blocks" array, e.g.:
//   [{ type: "paragraph", children: [{ type: "text", text: "Hello" }] }]
// This component walks that structure and renders semantic HTML.
// It handles the common block/inline types Strapi produces.
// -----------------------------------------------------------------------------

import Link from 'next/link';

function renderInline(node, key) {
  // Plain text leaf, possibly with marks (bold/italic/etc.)
  if (node.type === 'text' || typeof node.text === 'string') {
    let el = node.text;
    if (node.bold) el = <strong key={key}>{el}</strong>;
    if (node.italic) el = <em key={key}>{el}</em>;
    if (node.underline) el = <u key={key}>{el}</u>;
    if (node.strikethrough) el = <s key={key}>{el}</s>;
    if (node.code)
      el = (
        <code key={key} className="cs-inline-code">
          {el}
        </code>
      );
    return <span key={key}>{el}</span>;
  }

  if (node.type === 'link') {
    return (
      <Link key={key} href={node.url || '#'} className="cs-link">
        {(node.children || []).map((c, i) => renderInline(c, `${key}-${i}`))}
      </Link>
    );
  }

  return null;
}

function renderChildren(children, keyPrefix) {
  return (children || []).map((c, i) => renderInline(c, `${keyPrefix}-${i}`));
}

function renderBlock(block, key) {
  switch (block.type) {
    case 'heading': {
      const level = block.level || 2;
      const Tag = `h${Math.min(Math.max(level, 1), 6)}`;
      return (
        <Tag key={key} className={`cs-h cs-h${level}`}>
          {renderChildren(block.children, key)}
        </Tag>
      );
    }
    case 'paragraph':
      return (
        <p key={key} className="cs-p">
          {renderChildren(block.children, key)}
        </p>
      );
    case 'list': {
      const Tag = block.format === 'ordered' ? 'ol' : 'ul';
      return (
        <Tag key={key} className="cs-list">
          {(block.children || []).map((item, i) => (
            <li key={`${key}-${i}`}>{renderChildren(item.children, `${key}-${i}`)}</li>
          ))}
        </Tag>
      );
    }
    case 'quote':
      return (
        <blockquote key={key} className="cs-quote">
          {renderChildren(block.children, key)}
        </blockquote>
      );
    case 'code':
      return (
        <pre key={key} className="cs-code">
          <code>{renderChildren(block.children, key)}</code>
        </pre>
      );
    default:
      // Unknown block: render its children as a paragraph fallback.
      if (block.children) {
        return (
          <p key={key} className="cs-p">
            {renderChildren(block.children, key)}
          </p>
        );
      }
      return null;
  }
}

export default function BlocksRenderer({ content }) {
  if (!content) return null;

  // If somehow a plain string was passed, render it directly.
  if (typeof content === 'string') {
    return <p className="cs-p">{content}</p>;
  }

  if (!Array.isArray(content)) return null;

  return (
    <div className="cs-prose">
      {content.map((block, i) => renderBlock(block, `b-${i}`))}
    </div>
  );
}

// Helper: extract a plain-text preview from a blocks array (for meta/excerpt fallback).
export function blocksToPlainText(content, maxLen = 200) {
  if (!content) return '';
  if (typeof content === 'string') return content.slice(0, maxLen);
  if (!Array.isArray(content)) return '';
  let out = '';
  const walk = (nodes) => {
    for (const n of nodes || []) {
      if (typeof n.text === 'string') out += n.text + ' ';
      if (n.children) walk(n.children);
      if (out.length > maxLen) break;
    }
  };
  walk(content);
  return out.trim().slice(0, maxLen);
}
