function markdownToBlocks(md) {
  const blocks = [];
  const lines = md.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Headings
    if (line.startsWith("### ")) {
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: { rich_text: [{ type: "text", text: { content: line.slice(4) } }] },
      });
    } else if (line.startsWith("## ")) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: [{ type: "text", text: { content: line.slice(3) } }] },
      });
    } else if (line.startsWith("# ")) {
      blocks.push({
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] },
      });
    }
    // Divider
    else if (line.trim() === "---") {
      blocks.push({ object: "block", type: "divider", divider: {} });
    }
    // To-do items
    else if (line.startsWith("- [ ] ")) {
      blocks.push({
        object: "block",
        type: "to_do",
        to_do: { rich_text: [{ type: "text", text: { content: line.slice(6) } }], checked: false },
      });
    } else if (line.startsWith("- [x] ")) {
      blocks.push({
        object: "block",
        type: "to_do",
        to_do: { rich_text: [{ type: "text", text: { content: line.slice(6) } }], checked: true },
      });
    }
    // Bullet items
    else if (line.startsWith("- ")) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] },
      });
    }
    // Blockquote
    else if (line.startsWith("> ")) {
      blocks.push({
        object: "block",
        type: "quote",
        quote: { rich_text: parseRichText(line.slice(2)) },
      });
    }
    // Regular paragraph
    else {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: parseRichText(line) },
      });
    }
  }

  return blocks;
}

function parseRichText(text) {
  const parts = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", text: { content: text.slice(lastIndex, match.index) } });
    }
    parts.push({
      type: "text",
      text: { content: match[1] },
      annotations: { bold: true },
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", text: { content: text.slice(lastIndex) } });
  }

  return parts.length > 0 ? parts : [{ type: "text", text: { content: text } }];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    return res.status(500).json({ error: "NOTION_TOKEN not configured" });
  }

  try {
    const { title, markdown } = req.body;
    if (!title || !markdown) {
      return res.status(400).json({ error: "Title and markdown are required" });
    }

    const blocks = markdownToBlocks(markdown);

    // Notion API limits to 100 blocks per request, so batch if needed
    const firstBatch = blocks.slice(0, 100);

    const createRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { type: "page_id", page_id: "31652fbd-3daa-44ba-92a0-2b249c40e16f" },
        properties: {
          title: { title: [{ type: "text", text: { content: title } }] },
        },
        children: firstBatch,
      }),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      console.error("Notion create error:", createData);
      return res.status(createRes.status).json({
        error: createData.message || "Failed to create Notion page",
      });
    }

    // Append remaining blocks if more than 100
    if (blocks.length > 100) {
      const pageId = createData.id;
      for (let i = 100; i < blocks.length; i += 100) {
        const batch = blocks.slice(i, i + 100);
        await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${notionToken}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ children: batch }),
        });
      }
    }

    return res.status(200).json({
      success: true,
      url: createData.url,
    });
  } catch (err) {
    console.error("Notion export error:", err);
    return res.status(500).json({ error: "Failed to export to Notion" });
  }
}
