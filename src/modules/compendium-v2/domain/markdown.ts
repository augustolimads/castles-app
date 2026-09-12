function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function applyInlineMarkdown(value: string): string {
  return value
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer" class="underline">$1</a>',
    );
}

export function markdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");

  const html = lines
    .map((line) => {
      const escaped = escapeHtml(line);

      if (escaped.startsWith("### "))
        return `<h3>${applyInlineMarkdown(escaped.slice(4))}</h3>`;
      if (escaped.startsWith("## "))
        return `<h2>${applyInlineMarkdown(escaped.slice(3))}</h2>`;
      if (escaped.startsWith("# "))
        return `<h1>${applyInlineMarkdown(escaped.slice(2))}</h1>`;
      if (escaped.startsWith("- "))
        return `<li>${applyInlineMarkdown(escaped.slice(2))}</li>`;
      if (escaped.trim() === "") return "<br />";
      return `<p>${applyInlineMarkdown(escaped)}</p>`;
    })
    .join("");

  return html.replace(/(<li>.*?<\/li>)+/g, (match) => `<ul>${match}</ul>`);
}
