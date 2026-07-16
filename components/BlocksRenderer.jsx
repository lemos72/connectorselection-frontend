// -----------------------------------------------------------------------------
// BlocksRenderer
// -----------------------------------------------------------------------------
// Strapi's rich-text fields come as a structured "blocks" array, e.g.:
//   [{ type: "paragraph", children: [{ type: "text", text: "Hello" }] }]
// This component walks that structure and renders semantic HTML.
// It handles the common block/inline types Strapi produces.
//
// KNOWN DATA ISSUE: some articles were authored as raw HTML and pasted
// directly into Strapi's rich text field. Strapi stores that HTML as
// literal *text* inside paragraph blocks (often one block per line, so a
// <ul> opening tag, each <li>, and the closing tag can each land in their
// own separate block). Left alone, this renderer would print the tags as
// visible text instead of parsing them as markup. The detection below
// catches that case and reconstructs + renders the original HTML instead.
// -----------------------------------------------------------------------------

import Link from 'next/link';

// Matches an opening or closing tag for the common tags HTML-paste content
// actually uses. Deliberately narrow (vs. a generic "<...>" match) so we
// don't misfire on genuine text that happens to contain a "<" or ">".
const HTML_TAG_PATTERN =
  /<\/?(h[1-6]|p|ul|ol|li|strong|em|b|i|u|s|br|a|div|span|blockquote|code|pre)\b[^>]*>/i;

// Pull every leaf text string out of a blocks array, in document order,
// ignoring the block/inline type wrappers entirely. Used both to detect
// raw-HTML content and to reconstruct it for rendering.
function collectRawText(nodes) {
  let out = '';
  for (const n of nodes || []) {
    if (typeof n.text === 'string') out += n.text;
    if (n.children) out += collectRawText(n.children);
  }
  return out;
}

function looksLikeRawHTML(content) {
  const text = collectRawText(content).trim();
  return HTML_TAG_PATTERN.test(text);
}

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

  // If somehow a plain string was passed, it may itself be raw HTML
  // (e.g. pasted directly into a plain-text field rather than blocks).
  if (typeof content === 'string') {
    if (HTML_TAG_PATTERN.test(content)) {
      return (
        <div
          className="cs-prose"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return <p className="cs-p">{content}</p>;
  }

  if (!Array.isArray(content)) return null;

  // Content authored as raw HTML but pasted into Strapi's blocks editor:
  // each line often lands as its own paragraph block (a <ul>, each <li>,
  // and the closing tag as separate blocks). Reassemble the original HTML
  // by concatenating every leaf text node back together, in order, and
  // render it once so tags nest correctly again.
  if (looksLikeRawHTML(content)) {
    const html = collectRawText(content);
    return (
      <div
        className="cs-prose"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="cs-prose">
      {content.map((block, i) => renderBlock(block, `b-${i}`))}
    </div>
  );
}

// Helper: extract a plain-text preview from a blocks array (for meta/excerpt fallback).
export function blocksToPlainText(content, maxLen = 200) {
  if (!content) return '';
  if (typeof content === 'string') {
    // Strip tags if this turns out to be raw HTML, so meta descriptions
    // don't end up with literal markup in them.
    const stripped = content.replace(/<[^>]+>/g, ' ');
    return stripped.replace(/\s+/g, ' ').trim().slice(0, maxLen);
  }
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
  // Strip tags here too, in case this was raw-HTML-in-blocks content.
  const stripped = out.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  return stripped.trim().slice(0, maxLen);
}
