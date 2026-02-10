import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { readFileSync } from 'fs';
import { join } from 'path';

let wasmInitialized = false;

const TIER_COLORS = {
  1: { color: '#7C3AED', bg: '#F5F3FF', label: 'Category-Defining Launch' },
  2: { color: '#2563EB', bg: '#EFF6FF', label: 'Significant Features / Feature Set' },
  3: { color: '#059669', bg: '#ECFDF5', label: 'Small but Valuable Improvements' },
};

export default async function handler(req, res) {
  try {
    if (!wasmInitialized) {
      const wasmPath = join(process.cwd(), 'node_modules', '@resvg', 'resvg-wasm', 'index_bg.wasm');
      const wasmBuffer = readFileSync(wasmPath);
      await initWasm(wasmBuffer);
      wasmInitialized = true;
    }

    const tier = parseInt(req.query.tier || '1', 10);
    const name = req.query.name || 'Launch Plan';
    const t = TIER_COLORS[tier] || TIER_COLORS[1];
    const displayName = name.length > 60 ? name.slice(0, 57) + '...' : name;

    const [fontData, boldFontData] = await Promise.all([
      fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff').then(r => r.arrayBuffer()),
      fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff').then(r => r.arrayBuffer()),
    ]);

    const element = {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          background: `linear-gradient(135deg, ${t.bg} 0%, #FFFFFF 50%, ${t.bg} 100%)`,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      color: 'white',
                      fontSize: '22px',
                      fontWeight: 700,
                    },
                    children: '\u2605',
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '24px', fontWeight: 700, color: '#374151' },
                    children: 'AirOps Launch Tier Calculator',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            padding: '8px 20px',
                            borderRadius: '24px',
                            backgroundColor: `${t.color}18`,
                            color: t.color,
                            fontWeight: 700,
                            fontSize: '20px',
                            border: `2px solid ${t.color}40`,
                            marginRight: '14px',
                          },
                          children: `Tier ${tier}`,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', color: '#6B7280', fontWeight: 500 },
                          children: t.label,
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '52px',
                      fontWeight: 700,
                      color: '#111827',
                      lineHeight: 1.2,
                    },
                    children: displayName,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '16px', color: '#9CA3AF' },
                    children: 'airops.com',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '80px',
                      height: '4px',
                      borderRadius: '2px',
                      background: `linear-gradient(90deg, ${t.color}, ${t.color}40)`,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    };

    const svg = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fontData, weight: 400, style: 'normal' },
        { name: 'Inter', data: boldFontData, weight: 700, style: 'normal' },
      ],
    });

    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(Buffer.from(pngBuffer));
  } catch (err) {
    console.error('OG image error:', err);
    return res.status(500).json({ error: err.message });
  }
}
