'use client'; // This component uses a browser-only property

export default function HtmlRenderer({ htmlString }) {
  if (!htmlString) return null;
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}