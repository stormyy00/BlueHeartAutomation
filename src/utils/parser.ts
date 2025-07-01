type ContentNodeProps = {
  type?: string;
  content?: ContentNodeProps[];
  text?: string;
  marks?: Array<{ type: string }>;
};

export const contentToHtml = (content: ContentNodeProps[]): string => {
  if (!Array.isArray(content)) return "";

  let html = "";

  const parseNode = (node: ContentNodeProps | undefined): string => {
    if (!node) return "";

    if (node.type === "paragraph") {
      let inner = "";
      if (node.content) {
        for (const child of node.content) {
          inner += parseNode(child);
        }
      }
      return `<p style="color: black !important; margin: 0 0 12px 0;">${inner}</p>`;
    }

    if (node.type === "text") {
      let text = node.text || "";
      if (node.marks && node.marks.length) {
        for (const mark of node.marks) {
          if (mark.type === "bold") text = `<b>${text}</b>`;
          if (mark.type === "italic") text = `<i>${text}</i>`;
        }
      }
      return text.replace(/\n/g, "<br />");
    }

    if (node.type === "bulletList") {
      let items = "";
      if (node.content) {
        for (const item of node.content) {
          items += parseNode(item);
        }
      }
      return `<ul style="margin: 0 0 12px 18px;">${items}</ul>`;
    }

    if (node.type === "listItem") {
      let itemHtml = "";
      if (node.content) {
        for (const itemChild of node.content) {
          itemHtml += parseNode(itemChild);
        }
      }
      return `<li>${itemHtml}</li>`;
    }

    if (node.content) {
      let children = "";
      for (const child of node.content) {
        children += parseNode(child);
      }
      return children;
    }

    return "";
  };

  for (const node of content) {
    html += parseNode(node);
  }

  return html;
};
