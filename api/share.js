const TIER_LABELS = {
  1: 'Category-Defining Launch',
  2: 'Significant Features / Feature Set',
  3: 'Small but Valuable Improvements',
};

export default function handler(req, res) {
  const { tier, name, r } = req.query;

  if (!tier || !name || !r) {
    return res.redirect(302, '/');
  }

  const tierLabel = TIER_LABELS[tier] || '';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `${protocol}://${host}`;
  const ogImageUrl = `${origin}/api/og?tier=${encodeURIComponent(tier)}&name=${encodeURIComponent(name)}`;
  const title = `${name} - Tier ${tier} Launch Plan`;
  const description = `${tierLabel}. View the full launch tier analysis and checklist.`;
  const appUrl = `${origin}/#${r}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${appUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImageUrl}" />
  <meta http-equiv="refresh" content="0;url=${appUrl}" />
</head>
<body>
  <script>window.location.replace("${appUrl}");</script>
  <p>Redirecting to <a href="${appUrl}">launch plan</a>...</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(html);
}
