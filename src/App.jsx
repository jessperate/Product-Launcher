import { useState } from "react";

const TIER_DATA = {
  1: {
    name: "Tier 1",
    label: "Category-Defining Launch",
    color: "#7C3AED",
    bgColor: "#7C3AED15",
    borderColor: "#7C3AED40",
    cadence: "1/Quarter",
    definition: "Category-defining launches or major product layers (e.g., AirOps Next, Content Refresh).",
    examples: "AirOps Next, Content Refresh",
    leadTime: "Product deliverables due 1 week ahead. Marketing needs 3-4 weeks.",
    productDeliverables: [
      "Post in #0-product-announcements",
      "Update internal.airops.com with all materials",
      "Sales Demo plan (workspace with feature enabled for Sales to use)",
      "Live Demo on CX Standup",
      "Live Demo on Sales Standup",
      "MRD (must include Loom Demo Video)",
      "FAQs Notion Doc",
      "Pricing documentation",
      "Announce at All Hands 1x",
      "Announce at All Hands 2x (pre and post)",
    ],
    marketingDeliverables: [
      "Sales talk track / materials",
      "Update external Changelog",
      "Own Slack message draft, Blog, email, and coordinate with CX for Slack sharing with customers",
      "Social media posts",
      "Employee amplification guide",
      "Post in #0-general",
      "Customer Proof Points",
      "Support Talk Track",
      "Webinar",
    ],
    postLaunchProduct: [
      "Metabase dashboard to track usage and health of the feature (initial set up by launch day; ongoing monitoring post-launch)",
    ],
    postLaunchMarketing: [
      "In product banner / education (define copy + audience; use Intercom to self-serve)",
      "1 month post-launch: Success Stories / Case Studies",
      "Work with CX to pick customers to do live demo during customer standup",
    ],
  },
  2: {
    name: "Tier 2",
    label: "Significant Features / Feature Set",
    color: "#2563EB",
    bgColor: "#2563EB15",
    borderColor: "#2563EB40",
    cadence: "1-2/Month",
    definition: "Significant features or set of features (e.g., MCP, Offsite, Page360, Collaboration).",
    examples: "MCP, Offsite, Page360, Collaboration",
    leadTime: "Product deliverables due 1 week ahead. Marketing needs 2 weeks.",
    productDeliverables: [
      "Post in #0-product-announcements",
      "Update internal.airops.com with all materials",
      "Sales Demo plan (workspace with feature enabled for Sales to use)",
      "Live Demo on CX Standup",
      "Live Demo on Sales Standup",
      "MRD (must include Loom Demo Video)",
      "FAQs Notion Doc",
      "Pricing documentation",
      "Announce at All Hands 1x",
    ],
    marketingDeliverables: [
      "Sales talk track / materials",
      "Update external Changelog",
      "Own Slack message draft, Blog, email, and coordinate with CX for Slack sharing with customers",
      "Social media posts",
      "Employee amplification guide",
      "Post in #0-general",
      "Customer Proof Points",
      "Support Talk Track",
    ],
    postLaunchProduct: [
      "Metabase dashboard to track usage and health of the feature (initial set up by launch day; ongoing monitoring post-launch)",
    ],
    postLaunchMarketing: [
      "In product banner / education (define copy + audience; use Intercom to self-serve)",
      "1 month post-launch: Success Stories / Case Studies",
      "Work with CX to pick customers to do live demo during customer standup",
    ],
  },
  3: {
    name: "Tier 3",
    label: "Small but Valuable Improvements",
    color: "#059669",
    bgColor: "#05966915",
    borderColor: "#05966940",
    cadence: "As shipped; Roundup 1/Month",
    definition: "Small but valuable improvements (e.g., Suggestion Mode, Prompt Tags, WordPress Grid Integration, Favorites).",
    examples: "Suggestion Mode, Prompt Tags, WordPress Grid Integration, Favorites",
    leadTime: "Minimal. Individual features shipped as ready; bundled into monthly roundup.",
    productDeliverables: [
      "Post in #0-product-announcements",
      "Update internal.airops.com with all materials",
      "Sales Demo plan (workspace with feature enabled for Sales to use)",
      "Live Demo on CX Standup (OPTIONAL)",
      "Live Demo on Sales Standup (OPTIONAL)",
    ],
    marketingDeliverables: [
      "Sales talk track / materials",
      "Update external Changelog",
      "[ROUNDUPS] Own Slack message draft, Blog, email, and coordinate with CX for Slack sharing with customers",
    ],
    postLaunchProduct: [
      "Metabase dashboard to track usage and health of the feature (initial set up by launch day; ongoing monitoring post-launch)",
    ],
    postLaunchMarketing: [
      "In product banner / education (define copy + audience; use Intercom to self-serve)",
    ],
  },
};

const TIERING_CONTEXT = `You are a senior product marketing expert at AirOps. Analyze this MRD (Market Requirements Document) and recommend the best launch tier (1, 2, or 3). You MUST recommend exactly one tier and explain why.

TIERING FRAMEWORK (from AirOps Launch Tier Requirements):

- Tier 1 (Category-Defining Launch): Category-defining launches or major product layers. Cadence: 1/Quarter. Examples: AirOps Next, Content Refresh. These are the biggest launches that redefine how AirOps talks to the market. Requires everything in Tier 2 PLUS: All Hands announcement 2x (pre and post), Webinar. Full enablement stack including MRD with Loom demo, FAQs doc, pricing, sales demo plan, CX + Sales standups, employee amplification, customer proof points, social media, and post-launch success stories.

- Tier 2 (Significant Features / Feature Set): Significant features or set of features. Cadence: 1-2/Month. Examples: MCP, Offsite, Page360, Collaboration. Strong value with a compelling bundled story. Requires everything in Tier 3 PLUS: MRD (must include Loom Demo Video), FAQs Notion Doc, Pricing, All Hands announcement 1x, Social media posts, Employee amplification guide, Post in #0-general, Customer Proof Points, Support Talk Track. Post-launch: Success Stories/Case Studies at 1 month, customer live demos during standup.

- Tier 3 (Small but Valuable Improvements): Small but valuable improvements. Cadence: As shipped for individual features; Roundup 1/Month. Examples: Suggestion Mode, Prompt Tags, WordPress Grid Integration, Favorites. Requires: Post in #0-product-announcements, Update internal.airops.com, Sales Demo plan, CX/Sales standup demos (optional), Sales talk track/materials, Update external Changelog. Roundups: Own Slack message draft, Blog, email, coordinate with CX for customer sharing. Post-launch: Metabase dashboard, in-product education via Intercom.

HOW TO DECIDE THE TIER - evaluate these factors and explain your thinking:
1. SCOPE: Is this a category-defining moment (Tier 1), a significant new feature or feature set (Tier 2), or a small but valuable improvement (Tier 3)?
2. CADENCE FIT: Does this happen roughly quarterly (Tier 1), monthly (Tier 2), or on an ongoing/weekly basis (Tier 3)?
3. ENABLEMENT NEEDS: Does this need a webinar + full All Hands (Tier 1), MRD with Loom demo + FAQs + pricing docs (Tier 2), or just a changelog update + sales talk track (Tier 3)?
4. MARKETING WEIGHT: Does this warrant a full external campaign with customer proof points + employee amplification + social (Tier 1/2), or is it best bundled into a monthly roundup (Tier 3)?
5. POST-LAUNCH: Does this need success stories and customer demos at 1 month (Tier 1/2), or just usage tracking and in-product education (Tier 3)?

IMPORTANT: Your reasoning should be specific and reference the actual MRD content. Don't be generic. Explain exactly which signals in the MRD drove your tier recommendation and why the adjacent tiers are not the right fit. For example: "This is Tier 2 rather than Tier 1 because while it's a significant new capability, it doesn't redefine the category or warrant a webinar. It's above Tier 3 because it requires its own MRD, pricing documentation, and customer proof points."

Also provide a rich strategic analysis. Think like a senior PMM:
- GTM OPPORTUNITIES: Co-marketing with partners/customers, creative campaign angles, event tie-ins, analyst briefings, community activations, competitive moments
- NARRATIVE ANGLES: How this strengthens AirOps' category story, what makes this unique vs competitors, what trend or market shift this taps into
- CREATIVE HOOKS: Social-first ideas, visual storytelling opportunities, demo moments that would land well, surprise/delight angles
- RISKS OR WATCHOUTS: Dependencies, timing conflicts, messaging pitfalls, audience confusion

Respond ONLY with valid JSON (no markdown, no backticks):
{"tier": 1, "featureName": "extracted feature name", "reasoning": "3-4 sentence explanation of why this tier and not the adjacent tiers, referencing specific MRD content", "signals": ["signal 1", "signal 2", "signal 3"], "gtmOpportunities": ["opportunity 1 - be specific and actionable", "opportunity 2"], "narrativeAngles": ["angle 1 - tie to market context", "angle 2"], "creativeHooks": ["hook 1 - specific campaign or content idea", "hook 2"], "risks": ["risk 1", "risk 2"]}`;


const isNotionUrl = (text) => {
  const t = text.trim();
  return t.match(/^https?:\/\/(www\.)?notion\.(so|site)\//) !== null;
};

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NotionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.2 2.4C3.6 2.7 3.8 2.7 4.4 2.7L11.2 2.2C11.4 2.2 11.2 2 11.2 2L10.4 1.4C10.2 1.2 9.8 1 9.4 1L3 1.6C2.6 1.6 2.6 1.8 2.8 2L3.2 2.4ZM3.8 4V12.8C3.8 13.2 4 13.4 4.4 13.4L11.6 13C12 13 12.2 12.8 12.2 12.4V3.8C12.2 3.4 12 3.2 11.8 3.2L4.4 3.6C4 3.6 3.8 3.8 3.8 4ZM10.8 4.4C10.8 4.6 10.6 4.8 10.4 4.8L5.2 5C5 5 4.8 4.8 4.8 4.6V4.2C4.8 4 5 3.8 5.2 3.8L10.4 3.6C10.6 3.6 10.8 3.8 10.8 4V4.4Z" fill="#374151"/>
  </svg>
);

const AsanaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="2.8" fill="#F06A6A"/>
    <circle cx="4" cy="11" r="2.8" fill="#F06A6A"/>
    <circle cx="12" cy="11" r="2.8" fill="#F06A6A"/>
  </svg>
);

function TierBadge({ tier }) {
  const d = TIER_DATA[tier];
  return (
    <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: d.bgColor, color: d.color, fontWeight: 700, fontSize: 13, border: `1px solid ${d.borderColor}` }}>
      {d.name}
    </span>
  );
}

function Checklist({ items, checked, onToggle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 14, lineHeight: 1.5, color: checked[i] ? "#9CA3AF" : "#374151" }}>
          <div onClick={(e) => { e.preventDefault(); onToggle(i); }} style={{ width: 20, height: 20, minWidth: 20, borderRadius: 4, border: checked[i] ? "2px solid #7C3AED" : "2px solid #D1D5DB", background: checked[i] ? "#7C3AED" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, transition: "all 0.15s", color: "#fff" }}>
            {checked[i] && <CheckIcon />}
          </div>
          <span style={{ textDecoration: checked[i] ? "line-through" : "none" }}>{item}</span>
        </label>
      ))}
    </div>
  );
}

function WorkflowStep({ stepNumber, title, description, items, checked, onToggle, color }) {
  const [expanded, setExpanded] = useState(stepNumber === 1);
  const completedCount = checked.filter(Boolean).length;
  const allDone = completedCount === items.length;
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
      <button onClick={() => setExpanded(!expanded)} style={{ width: "100%", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, border: "none", background: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ width: 32, height: 32, minWidth: 32, borderRadius: "50%", background: allDone ? "#05966920" : `${color}15`, color: allDone ? "#059669" : color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
          {allDone ? <CheckIcon /> : stepNumber}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: "#111" }}>{title}</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{completedCount}/{items.length} complete</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#9CA3AF" }}>
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>
      {expanded && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #F3F4F6" }}>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "12px 0 16px" }}>{description}</p>
          <Checklist items={items} checked={checked} onToggle={onToggle} />
        </div>
      )}
    </div>
  );
}

function StrategicSection({ icon, title, items, accentColor }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.03em" }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
            <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: accentColor, marginTop: 7, opacity: 0.6 }} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportToNotion({ tier, featureName, reasoning, signals, gtmOpportunities, narrativeAngles, creativeHooks, risks, originalMrd, data, steps }) {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(null);
  const [exportError, setExportError] = useState(null);

  const buildMarkdown = () => {
    let md = "";
    if (originalMrd) {
      md += `## Original MRD\n\n`;
      md += `${originalMrd}\n\n`;
      md += `---\n\n`;
    }
    md += `> **${data.name} - ${data.label}** | Cadence: ${data.cadence}\n\n`;
    md += `${data.definition}\n\n`;

    md += `## Strategic Analysis\n\n`;
    md += `${reasoning}\n\n`;
    if (signals.length > 0) {
      md += `**Key Signals:** ${signals.join(" | ")}\n\n`;
    }

    if (gtmOpportunities?.length > 0) {
      md += `### GTM Opportunities\n\n`;
      md += gtmOpportunities.map((o) => `- ${o}`).join("\n") + "\n\n";
    }
    if (narrativeAngles?.length > 0) {
      md += `### Narrative Angles\n\n`;
      md += narrativeAngles.map((a) => `- ${a}`).join("\n") + "\n\n";
    }
    if (creativeHooks?.length > 0) {
      md += `### Creative Hooks\n\n`;
      md += creativeHooks.map((h) => `- ${h}`).join("\n") + "\n\n";
    }
    if (risks?.length > 0) {
      md += `### Risks & Watchouts\n\n`;
      md += risks.map((r) => `- ${r}`).join("\n") + "\n\n";
    }

    md += `---\n\n`;
    md += `## Launch Details\n\n`;
    md += `**Lead Time:** ${data.leadTime}\n\n`;
    md += `**Cadence:** ${data.cadence}\n\n`;
    md += `**Examples:** ${data.examples}\n\n`;

    md += `---\n\n`;
    steps.forEach((step, i) => {
      md += `## ${i + 1}. ${step.title}\n\n`;
      md += `${step.desc}\n\n`;
      md += step.items.map((item) => `- [ ] ${item}`).join("\n") + "\n\n";
    });

    return md;
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const content = buildMarkdown();
      const response = await fetch("/api/notion-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${featureName} - Launch Plan (${TIER_DATA[tier].name})`,
          markdown: content,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        setExportError(resData.error || "Could not create the Notion page.");
      } else if (resData.success && resData.url) {
        setExported(resData.url);
      } else {
        setExported("created");
      }
    } catch (err) {
      console.error("Export error:", err);
      setExportError("Something went wrong exporting to Notion. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (exported) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M15 5.25L7.5 12.75L3 8.25" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: 14, color: "#059669", fontWeight: 500 }}>
          Exported to Notion!
        </span>
        {exported !== "created" && (
          <a href={exported} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#2563EB", fontWeight: 500, marginLeft: "auto" }}>
            Open page &rarr;
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      {exportError && (
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13, marginBottom: 10, lineHeight: 1.4 }}>
          {exportError}
        </div>
      )}
      <button
        onClick={handleExport}
        disabled={exporting}
        style={{
          padding: "10px 18px", borderRadius: 10, border: "1px solid #E5E7EB",
          background: exporting ? "#F9FAFB" : "#fff",
          color: exporting ? "#9CA3AF" : "#374151",
          fontWeight: 600, fontSize: 14,
          cursor: exporting ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
        }}
      >
        {exporting ? (
          <>
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #E5E7EB", borderTopColor: "#7C3AED", animation: "spin 0.8s linear infinite" }} />
            Exporting...
          </>
        ) : (
          <>
            <NotionIcon /> Export to Notion
          </>
        )}
      </button>
    </div>
  );
}

function ExportToAsana({ tier, featureName, steps }) {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(null);
  const [exportError, setExportError] = useState(null);

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const sections = steps.map((step) => ({
        name: step.title,
        tasks: step.items,
      }));
      const response = await fetch("/api/asana-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: `${featureName} - Launch Plan (${TIER_DATA[tier].name})`,
          sections,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        setExportError(resData.error || "Could not create the Asana project.");
      } else if (resData.success && resData.url) {
        setExported(resData.url);
      } else {
        setExported("created");
      }
    } catch (err) {
      console.error("Asana export error:", err);
      setExportError("Something went wrong exporting to Asana. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (exported) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M15 5.25L7.5 12.75L3 8.25" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: 14, color: "#059669", fontWeight: 500 }}>
          Created in Asana!
        </span>
        {exported !== "created" && (
          <a href={exported} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#2563EB", fontWeight: 500, marginLeft: "auto" }}>
            Open project &rarr;
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      {exportError && (
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13, marginBottom: 10, lineHeight: 1.4 }}>
          {exportError}
        </div>
      )}
      <button
        onClick={handleExport}
        disabled={exporting}
        style={{
          padding: "10px 18px", borderRadius: 10, border: "1px solid #E5E7EB",
          background: exporting ? "#F9FAFB" : "#fff",
          color: exporting ? "#9CA3AF" : "#374151",
          fontWeight: 600, fontSize: 14,
          cursor: exporting ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
        }}
      >
        {exporting ? (
          <>
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #E5E7EB", borderTopColor: "#F06A6A", animation: "spin 0.8s linear infinite" }} />
            Creating project...
          </>
        ) : (
          <>
            <AsanaIcon /> Create Asana Project
          </>
        )}
      </button>
    </div>
  );
}

function AnalysisCard({ reasoning, signals, tier, onOverride, gtmOpportunities, narrativeAngles, creativeHooks, risks }) {
  const d = TIER_DATA[tier];
  const [expanded, setExpanded] = useState(true);
  return (
    <div style={{ borderRadius: 12, background: "#fff", border: `1px solid ${d.borderColor}`, marginBottom: 24, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", background: d.bgColor, borderBottom: `1px solid ${d.borderColor}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1L11.5 6.5L17 7.5L13 11.5L14 17L9 14.5L4 17L5 11.5L1 7.5L6.5 6.5L9 1Z" fill={d.color} opacity="0.6"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 700, color: d.color }}>Strategic Analysis</span>
          </div>
          <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "10px 0 8px" }}>{reasoning}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {signals.map((s, i) => (
            <span key={i} style={{ padding: "4px 10px", borderRadius: 6, background: "#fff", fontSize: 12, color: "#6B7280", border: "1px solid #E5E7EB" }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Strategic sections */}
      {expanded && (
        <div style={{ padding: "4px 20px 20px" }}>
          <StrategicSection icon="🚀" title="GTM Opportunities" items={gtmOpportunities} accentColor="#7C3AED" />
          <StrategicSection icon="📖" title="Narrative Angles" items={narrativeAngles} accentColor="#2563EB" />
          <StrategicSection icon="🎨" title="Creative Hooks" items={creativeHooks} accentColor="#D97706" />
          <StrategicSection icon="⚠️" title="Risks & Watchouts" items={risks} accentColor="#DC2626" />
        </div>
      )}

      {/* Override */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #F3F4F6", fontSize: 13, color: "#6B7280" }}>
        Not the right tier?{" "}
        {[1, 2, 3].filter((t) => t !== tier).map((t) => (
          <button key={t} onClick={() => onOverride(t)} style={{ background: "none", border: "none", color: TIER_DATA[t].color, fontWeight: 600, cursor: "pointer", fontSize: 13, padding: "0 4px", textDecoration: "underline" }}>
            Tier {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function CopyLinkButton({ result }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const shareUrl = buildShareUrl(result);
    navigator.clipboard.writeText(shareUrl || window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handleCopy} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #E5E7EB", background: copied ? "#F0FDF4" : "#fff", cursor: "pointer", fontSize: 13, color: copied ? "#059669" : "#6B7280", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
      {copied ? (
        <><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Copied!</>
      ) : (
        <><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5 2H11C12.1 2 13 2.9 13 4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><rect x="3" y="4" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg> Copy link</>
      )}
    </button>
  );
}

function Results({ tier, featureName, reasoning, signals, gtmOpportunities, narrativeAngles, creativeHooks, risks, originalMrd, onReset, onOverride }) {
  const data = TIER_DATA[tier];
  const steps = [
    { title: "Product Deliverables", desc: "Product deliverables due 1 week ahead of launch.", items: data.productDeliverables },
    { title: "Marketing Deliverables", desc: "Marketing deliverables to drive enablement pre- and during launch.", items: data.marketingDeliverables },
    { title: "Post-Launch: Product", desc: "Product deliverables to drive adoption after launch.", items: data.postLaunchProduct },
    { title: "Post-Launch: Marketing", desc: "Marketing deliverables to drive adoption after launch.", items: data.postLaunchMarketing },
  ];
  const [checkedState, setCheckedState] = useState(steps.map((s) => s.items.map(() => false)));
  const toggleItem = (si, ii) => {
    setCheckedState((p) => { const n = p.map((s) => [...s]); n[si][ii] = !n[si][ii]; return n; });
  };
  const totalItems = steps.reduce((s, st) => s + st.items.length, 0);
  const totalChecked = checkedState.reduce((s, st) => s + st.filter(Boolean).length, 0);
  const pct = Math.round((totalChecked / totalItems) * 100);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <TierBadge tier={tier} />
            <span style={{ fontSize: 13, color: "#6B7280" }}>{data.cadence}</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111", margin: "8px 0 4px" }}>{featureName || "Your Launch"}</h1>
          <p style={{ fontSize: 15, color: "#6B7280", margin: 0, maxWidth: 520, lineHeight: 1.5 }}>{data.label} -- {data.definition}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <CopyLinkButton result={{ tier, featureName, reasoning, signals, gtmOpportunities, narrativeAngles, creativeHooks, risks }} />
          <button onClick={onReset} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Start over</button>
        </div>
      </div>
      <AnalysisCard reasoning={reasoning} signals={signals} tier={tier} onOverride={onOverride} gtmOpportunities={gtmOpportunities} narrativeAngles={narrativeAngles} creativeHooks={creativeHooks} risks={risks} />
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <ExportToNotion
          tier={tier}
          featureName={featureName}
          reasoning={reasoning}
          signals={signals}
          gtmOpportunities={gtmOpportunities}
          narrativeAngles={narrativeAngles}
          creativeHooks={creativeHooks}
          risks={risks}
          originalMrd={originalMrd}
          data={data}
          steps={steps}
        />
        <ExportToAsana
          tier={tier}
          featureName={featureName}
          steps={steps}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Lead Time", val: data.leadTime },
          { label: "Cadence", val: data.cadence },
          { label: "Examples", val: data.examples },
        ].map((c, i) => (
          <div key={i} style={{ padding: "14px 16px", borderRadius: 10, background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 14, color: "#111", lineHeight: 1.4 }}>{c.val}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Launch Progress</span>
          <span style={{ fontSize: 13, color: "#6B7280" }}>{totalChecked}/{totalItems} tasks ({pct}%)</span>
        </div>
        <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#E5E7EB" }}>
          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: pct === 100 ? "#059669" : data.color, transition: "width 0.3s" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((step, i) => (
          <WorkflowStep key={`${tier}-${i}`} stepNumber={i + 1} title={step.title} description={step.desc} items={step.items} checked={checkedState[i]} onToggle={(ii) => toggleItem(i, ii)} color={data.color} />
        ))}
      </div>
    </div>
  );
}

function LoadingState({ isNotion }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ display: "inline-block", width: 48, height: 48, borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#7C3AED", animation: "spin 0.8s linear infinite", marginBottom: 20 }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 6 }}>
        {isNotion ? "Fetching from Notion and analyzing..." : "Analyzing your MRD..."}
      </h3>
      <p style={{ fontSize: 14, color: "#6B7280" }}>
        {isNotion ? "Pulling page content, then evaluating scope, audience, and narrative impact." : "Evaluating scope, audience, narrative impact, and more."}
      </p>
    </div>
  );
}

function encodeShareData(data) {
  try {
    const json = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(json)));
  } catch { return null; }
}

function decodeShareData(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch { return null; }
}

function buildShareUrl(data) {
  const encoded = encodeShareData(data);
  if (!encoded) return null;
  return `${window.location.origin}/api/share?tier=${encodeURIComponent(data.tier)}&name=${encodeURIComponent(data.featureName)}&r=${encodeURIComponent(encoded)}`;
}

function updateBrowserUrl(data) {
  const encoded = encodeShareData(data);
  if (encoded) window.history.replaceState(null, "", `#${encoded}`);
}

function loadFromUrl() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    const decoded = decodeShareData(hash);
    if (decoded?.tier && decoded?.featureName) return decoded;
  }
  return null;
}

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(loadFromUrl);

  const inputIsNotion = isNotionUrl(input);
  const hasInput = input.trim().length > 0;

  const parseResult = (data) => {
    const text = data.content
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    return JSON.parse(jsonMatch[0]);
  };

  const analyzeText = async () => {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        max_tokens: 1000,
        messages: [{ role: "user", content: `${TIERING_CONTEXT}\n\nHere is the MRD to analyze:\n\n${input}` }],
      }),
    });
    return parseResult(await response.json());
  };

  const analyzeNotionUrl = async () => {
    // Fetch page content via Notion API
    const fetchRes = await fetch("/api/notion-fetch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: input }),
    });
    const fetchData = await fetchRes.json();
    if (!fetchRes.ok) {
      throw new Error(fetchData.error || "Failed to fetch Notion page");
    }

    // Analyze fetched content with Claude
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        max_tokens: 1000,
        messages: [{ role: "user", content: `${TIERING_CONTEXT}\n\nHere is the MRD content fetched from Notion:\n\n${fetchData.content}` }],
      }),
    });
    return parseResult(await response.json());
  };

  const handleAnalyze = async () => {
    if (!hasInput) return;
    setLoading(true);
    setError(null);
    try {
      const parsed = inputIsNotion ? await analyzeNotionUrl() : await analyzeText();
      const resultData = {
        tier: parsed.tier,
        featureName: parsed.featureName || "Untitled Launch",
        reasoning: parsed.reasoning || "",
        signals: parsed.signals || [],
        gtmOpportunities: parsed.gtmOpportunities || [],
        narrativeAngles: parsed.narrativeAngles || [],
        creativeHooks: parsed.creativeHooks || [],
        risks: parsed.risks || [],
      };
      setResult(resultData);
      updateBrowserUrl(resultData);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(inputIsNotion
        ? "Could not fetch or analyze the Notion page. Make sure the link is accessible and try again, or paste the MRD content directly."
        : "Something went wrong analyzing the MRD. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
        <LoadingState isNotion={inputIsNotion} />
      </div>
    );
  }

  if (result) {
    return (
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
        <Results
          tier={result.tier}
          featureName={result.featureName}
          reasoning={result.reasoning}
          signals={result.signals}
          gtmOpportunities={result.gtmOpportunities}
          narrativeAngles={result.narrativeAngles}
          creativeHooks={result.creativeHooks}
          risks={result.risks}
          originalMrd={input}
          onReset={() => { setInput(""); setResult(null); setError(null); window.history.replaceState(null, "", window.location.pathname); }}
          onOverride={(t) => {
            setResult((p) => {
              const updated = { ...p, tier: t };
              updateBrowserUrl(updated);
              return updated;
            });
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', maxWidth: 620, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #7C3AED, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" fill="#fff"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0 }}>Launch Tier Calculator</h1>
        </div>
        <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
          Paste a Notion link or MRD content below. We'll analyze it to recommend the right launch tier, then guide you through pricing, MRD approval, enablement, and marketing activation.
        </p>
      </div>

      {/* Input mode indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500,
          background: inputIsNotion ? "#EEF2FF" : "#F9FAFB",
          color: inputIsNotion ? "#4F46E5" : "#6B7280",
          border: inputIsNotion ? "1px solid #C7D2FE" : "1px solid #E5E7EB",
          transition: "all 0.2s",
        }}>
          {inputIsNotion ? <NotionIcon /> : null}
          {inputIsNotion ? "Notion link detected" : "Paste a Notion link or MRD text"}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"https://www.notion.so/your-mrd-page...\n\nor paste the full MRD content directly:\n\n- Feature name and description\n- Target audience / persona\n- Problem statement\n- Success metrics\n- Competitive context"}
          style={{
            width: "100%",
            minHeight: inputIsNotion ? 80 : 220,
            padding: "14px 16px",
            borderRadius: 10,
            border: inputIsNotion ? "2px solid #C7D2FE" : "2px solid #E5E7EB",
            fontSize: 14,
            lineHeight: 1.6,
            outline: "none",
            boxSizing: "border-box",
            resize: "vertical",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#7C3AED")}
          onBlur={(e) => (e.target.style.borderColor = inputIsNotion ? "#C7D2FE" : "#E5E7EB")}
        />
        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>
          {inputIsNotion
            ? "We'll fetch the page content from Notion automatically."
            : hasInput
              ? `${input.length.toLocaleString()} characters`
              : "The more detail you include, the better the recommendation."}
        </div>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!hasInput}
        style={{
          padding: "12px 24px", borderRadius: 10, border: "none",
          background: hasInput ? "#7C3AED" : "#E5E7EB",
          color: hasInput ? "#fff" : "#9CA3AF",
          fontWeight: 600, fontSize: 15,
          cursor: hasInput ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s",
        }}
      >
        {inputIsNotion ? "Fetch and analyze" : "Analyze and tier this launch"} <ArrowRight />
      </button>

      <div style={{ marginTop: 32, padding: "20px", borderRadius: 12, background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Tier Overview</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((t) => {
            const d = TIER_DATA[t];
            return (
              <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <TierBadge tier={t} />
                <div>
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{d.label}</span>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}> -- {d.cadence}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
