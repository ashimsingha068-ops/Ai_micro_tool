import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

function apiServerPlugin(): Plugin {
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  function getFallbackTitles(input: string, tone = 'Viral / High CTR', platform = 'YouTube') {
    const clean = input.trim() || 'Content Creator Growth Secrets';
    return [
      `I Tried ${clean} (And It Actually Worked!)`,
      `The Truth About ${clean} Nobody Tells You In 2026`,
      `Stop Doing This Huge Mistake With ${clean}! [Watch First]`,
      `How I Mastered ${clean} in 7 Days (Step-by-Step Guide)`,
      `Top 5 Secrets for ${clean} That Changed My Entire Strategy`,
      `Why 99% Of Creators Fail at ${clean} (Full Breakdown)`,
    ];
  }

  function getFallbackBios(input: string, vibe = 'Creator / Influencer', platform = 'Instagram') {
    const clean = input.trim() || 'Content Creator & Video Storyteller';
    return [
      `✨ Creating impactful videos about ${clean}\n🚀 Helping you grow 1% better every day\n👇 Explore my latest tools & links`,
      `⚡ ${clean}\n🎯 Weekly insights, tutorials & behind-the-scenes\n📩 Collabs: DMs open | Link below 🔗`,
      `💡 Mastering ${clean} for the modern digital era\n📈 Building in public | 0 to 100k journey\n👇 Start learning here`,
      `🎬 Video Creator | Obsessed with ${clean}\n🔥 New videos dropped every Tuesday\n👇 Watch the newest episode`,
      `☕ Passion turned into craft | ${clean}\n🌟 Leveling up your creator journey\n🔗 Tap the link below`,
    ];
  }

  function getFallbackHashtags(input: string) {
    const words = input.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const base = words[0] || 'creator';
    const second = words[1] || 'video';
    return {
      highReach: [
        `#${base}`,
        `#trending`,
        `#viral`,
        `#contentcreator`,
        `#explorepage`,
        `#youtube`,
        `#fyp`,
        `#reels`,
        `#videoviral`,
        `#growth`,
      ],
      targeted: [
        `#${base}tips`,
        `#${base}creator`,
        `#${second}life`,
        `#creatoreconomy`,
        `#socialmediagrowth`,
        `#digitalcreator`,
        `#videotips`,
        `#creatorsofinstagram`,
        `#onlinegrowth`,
        `#contentstrategy`,
      ],
      niche: [
        `#${base}hacks`,
        `#howtogrow${base}`,
        `#best${base}`,
        `#${base}community`,
        `#${second}guide`,
        `#learneveryday`,
        `#creatorsunite`,
        `#growyourchannel`,
        `#contentstrategy2026`,
        `#aimicrotool`,
      ],
    };
  }

  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          let parsed: any = {};
          try {
            parsed = body ? JSON.parse(body) : {};
          } catch {
            parsed = {};
          }

          if (req.url === '/api/generate-titles') {
            const { prompt, tone = 'Viral / High CTR', platform = 'YouTube' } = parsed;
            if (!prompt) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Please provide prompt text about your video.' }));
            }

            if (!ai) {
              return res.end(JSON.stringify({ titles: getFallbackTitles(prompt, tone, platform), source: 'smart-template' }));
            }

            try {
              const response = await ai.models.generateContent({
                model: 'gemini-3.7-flash',
                contents: `You are a world-class YouTube and video SEO expert and title engineer.
Analyze the user's video topic and create 6 catchy, high-CTR, SEO-optimized titles tailored for ${platform}.
Tone/Style requested: ${tone}.
Video Topic: "${prompt}"

Format requirements:
Return ONLY a valid JSON array of strings, for example:
["Title 1", "Title 2", "Title 3", "Title 4", "Title 5", "Title 6"]
Do not wrap in backticks or markdown, just the raw JSON array.`,
                config: {
                  temperature: 0.8,
                  responseMimeType: 'application/json',
                },
              });

              const text = response.text?.trim() || '[]';
              let titles = JSON.parse(text);
              if (!Array.isArray(titles) || titles.length === 0) {
                titles = getFallbackTitles(prompt, tone, platform);
              }
              return res.end(JSON.stringify({ titles, source: 'gemini-3.7-flash' }));
            } catch (err) {
              return res.end(JSON.stringify({ titles: getFallbackTitles(prompt, tone, platform), source: 'smart-fallback' }));
            }
          }

          if (req.url === '/api/generate-bios') {
            const { prompt, vibe = 'Creator / Influencer', platform = 'Instagram', includeEmojis = true } = parsed;
            if (!prompt) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Please provide details about yourself.' }));
            }

            if (!ai) {
              return res.end(JSON.stringify({ bios: getFallbackBios(prompt, vibe, platform), source: 'smart-template' }));
            }

            try {
              const response = await ai.models.generateContent({
                model: 'gemini-3.7-flash',
                contents: `You are an elite social media brand strategist.
Create 5 compelling, concise, and conversion-ready profile bios for ${platform}.
Vibe: ${vibe}
Include emojis: ${includeEmojis ? 'Yes' : 'No'}
User context / about self: "${prompt}"

Each bio should fit platform constraints (punchy lines, clear hook and CTA).
Return ONLY a valid JSON array of strings.
Example: ["Bio 1", "Bio 2", "Bio 3", "Bio 4", "Bio 5"]
Do not include markdown codeblocks or extra text.`,
                config: {
                  temperature: 0.85,
                  responseMimeType: 'application/json',
                },
              });

              const text = response.text?.trim() || '[]';
              let bios = JSON.parse(text);
              if (!Array.isArray(bios) || bios.length === 0) {
                bios = getFallbackBios(prompt, vibe, platform);
              }
              return res.end(JSON.stringify({ bios, source: 'gemini-3.7-flash' }));
            } catch (err) {
              return res.end(JSON.stringify({ bios: getFallbackBios(prompt, vibe, platform), source: 'smart-fallback' }));
            }
          }

          if (req.url === '/api/generate-hashtags') {
            const { prompt, platform = 'Instagram', focus = 'Balanced' } = parsed;
            if (!prompt) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Please provide context for hashtags.' }));
            }

            if (!ai) {
              return res.end(JSON.stringify({ hashtags: getFallbackHashtags(prompt), source: 'smart-template' }));
            }

            try {
              const response = await ai.models.generateContent({
                model: 'gemini-3.7-flash',
                contents: `You are a social media hashtag researcher and SEO algorithm specialist.
Generate 30 high-performing hashtags for ${platform} based on: "${prompt}".
Focus: ${focus}

Group them into three strategic categories:
1. highReach: 10 viral / broad / high-volume hashtags
2. targeted: 10 medium-competition / category-specific hashtags
3. niche: 10 hyper-targeted / low-competition / community hashtags

Return ONLY a valid JSON object matching this schema:
{
  "highReach": ["#tag1", "#tag2", ...],
  "targeted": ["#tag11", "#tag12", ...],
  "niche": ["#tag21", "#tag22", ...]
}`,
                config: {
                  temperature: 0.7,
                  responseMimeType: 'application/json',
                },
              });

              const text = response.text?.trim() || '{}';
              let hashtags = JSON.parse(text);
              if (!hashtags.highReach || !hashtags.targeted || !hashtags.niche) {
                hashtags = getFallbackHashtags(prompt);
              }
              return res.end(JSON.stringify({ hashtags, source: 'gemini-3.7-flash' }));
            } catch (err) {
              return res.end(JSON.stringify({ hashtags: getFallbackHashtags(prompt), source: 'smart-fallback' }));
            }
          }

          if (req.url === '/api/contact') {
            const { name, email, message } = parsed;
            if (!name || !email || !message) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Please fill in all fields (Name, Email, Message).' }));
            }
            return res.end(JSON.stringify({ success: true, message: 'Thank you! Your message has been received successfully.' }));
          }

          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'Endpoint not found' }));
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
