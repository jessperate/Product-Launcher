export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const accessToken = process.env.ASANA_ACCESS_TOKEN;
  const workspaceId = process.env.ASANA_WORKSPACE_ID;

  if (!accessToken) {
    return res.status(500).json({ error: "ASANA_ACCESS_TOKEN not configured" });
  }
  if (!workspaceId) {
    return res.status(500).json({ error: "ASANA_WORKSPACE_ID not configured" });
  }

  try {
    const { projectName, sections } = req.body;
    if (!projectName || !sections || !Array.isArray(sections)) {
      return res.status(400).json({ error: "projectName and sections array are required" });
    }

    const asanaFetch = (path, body) =>
      fetch(`https://app.asana.com/api/1.0${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: body }),
      }).then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          const msg = data.errors?.[0]?.message || "Asana API error";
          throw new Error(msg);
        }
        return data.data;
      });

    // 1. Create the project
    const project = await asanaFetch("/projects", {
      name: projectName,
      workspace: workspaceId,
      layout: "list",
    });

    // 2. Create sections and tasks
    for (const section of sections) {
      const createdSection = await asanaFetch(
        `/projects/${project.gid}/sections`,
        { name: section.name }
      );

      for (const taskName of section.tasks) {
        await asanaFetch("/tasks", {
          name: taskName,
          projects: [project.gid],
          memberships: [
            { project: project.gid, section: createdSection.gid },
          ],
        });
      }
    }

    const url = `https://app.asana.com/0/${project.gid}/list`;

    return res.status(200).json({ success: true, url });
  } catch (err) {
    console.error("Asana export error:", err);
    return res.status(500).json({
      error: err.message || "Failed to export to Asana",
    });
  }
}
