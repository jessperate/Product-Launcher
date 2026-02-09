function extractPageId(url) {
  // Handle URLs like:
  // https://www.notion.so/workspace/Page-Title-abc123def456
  // https://notion.so/abc123def456
  // https://www.notion.so/abc123def456?v=...
  const cleaned = url.split("?")[0].split("#")[0];
  const parts = cleaned.split("/").pop().split("-");
  const lastPart = parts[parts.length - 1];
  // Notion page IDs are 32 hex characters
  if (/^[a-f0-9]{32}$/.test(lastPart)) {
    return lastPart.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  }
  // Maybe the whole last segment is the ID
  const noHyphens = lastPart.replace(/-/g, "");
  if (/^[a-f0-9]{32}$/.test(noHyphens)) {
    return noHyphens.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  }
  return null;
}

async function getPageTitle(pageId, token) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
    },
  });
  if (!res.ok) return null;
  const page = await res.json();
  const titleProp = Object.values(page.properties || {}).find((p) => p.type === "title");
  if (titleProp?.title?.[0]?.plain_text) {
    return titleProp.title[0].plain_text;
  }
  return null;
}

async function getBlockChildren(blockId, token) {
  let allBlocks = [];
  let cursor = undefined;
  do {
    const url = `https://api.notion.com/v1/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`;
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
      },
    });
    if (!res.ok) break;
    const data = await res.json();
    allBlocks = allBlocks.concat(data.results || []);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return allBlocks;
}

function richTextToPlain(richTextArray) {
  if (!richTextArray) return "";
  return richTextArray.map((rt) => rt.plain_text || "").join("");
}

function blockToText(block) {
  const type = block.type;
  const data = block[type];
  if (!data) return "";

  switch (type) {
    case "paragraph":
      return richTextToPlain(data.rich_text);
    case "heading_1":
      return `# ${richTextToPlain(data.rich_text)}`;
    case "heading_2":
      return `## ${richTextToPlain(data.rich_text)}`;
    case "heading_3":
      return `### ${richTextToPlain(data.rich_text)}`;
    case "bulleted_list_item":
      return `- ${richTextToPlain(data.rich_text)}`;
    case "numbered_list_item":
      return `1. ${richTextToPlain(data.rich_text)}`;
    case "to_do":
      return `[${data.checked ? "x" : " "}] ${richTextToPlain(data.rich_text)}`;
    case "toggle":
      return richTextToPlain(data.rich_text);
    case "quote":
      return `> ${richTextToPlain(data.rich_text)}`;
    case "callout":
      return `> ${richTextToPlain(data.rich_text)}`;
    case "code":
      return `\`\`\`\n${richTextToPlain(data.rich_text)}\n\`\`\``;
    case "divider":
      return "---";
    case "table_row":
      return (data.cells || []).map((cell) => richTextToPlain(cell)).join(" | ");
    default:
      if (data.rich_text) return richTextToPlain(data.rich_text);
      return "";
  }
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
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const pageId = extractPageId(url);
    if (!pageId) {
      return res.status(400).json({ error: "Could not extract page ID from URL" });
    }

    const [title, blocks] = await Promise.all([
      getPageTitle(pageId, notionToken),
      getBlockChildren(pageId, notionToken),
    ]);

    const lines = [];
    if (title) lines.push(`# ${title}\n`);

    for (const block of blocks) {
      const text = blockToText(block);
      if (text) lines.push(text);

      // Fetch children for blocks that have them (toggles, etc.)
      if (block.has_children) {
        const children = await getBlockChildren(block.id, notionToken);
        for (const child of children) {
          const childText = blockToText(child);
          if (childText) lines.push(`  ${childText}`);
        }
      }
    }

    const content = lines.join("\n");

    if (!content.trim()) {
      return res.status(404).json({ error: "Page appears to be empty or inaccessible. Make sure the integration has access to this page." });
    }

    return res.status(200).json({ content, title: title || "Untitled" });
  } catch (err) {
    console.error("Notion fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch Notion page" });
  }
}
