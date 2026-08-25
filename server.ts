import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with user-agent for telemetry as required
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

// Fallback high-quality generators in case API key is missing or model request fails
function getFallbackTitles(input: string, tone = 'Viral / High CTR', platform = 'YouTube') {
  const clean = input.trim();
  return [
    `I Tried ${clean || 'This Secret Method'} (And It Actually Worked!)`,
    `The Truth About ${clean || 'Creating Content'} Nobody Tells You`,
    `Stop Doing ${clean || 'This Mistake'} In 2026! [Watch Before You Start]`,
    `How I Mastered ${clean || 'This Skill'} in 7 Days (Step-by-Step)`,
    `Top 5 Secrets for ${clean || 'Maximum Growth'} That Changed Everything`,
    `Why 99% Of People Fail at ${clean || 'This'} (Full Breakdown)`,
    `Is ${clean || 'This Trend'} Really Worth It? Honest Review`,
  ];
}

function getFallbackBios(input: string, vibe = 'Creator / Influencer', platform = 'Instagram') {
  const clean = input.trim() || 'Content Creator & Digital Builder';
  return [
    `✨ Creating impactful content about ${clean}\n🚀 Helping you grow 1% better every day\n👇 Check out my latest work & links`,
    `⚡ ${clean}\n🎯 Daily insights, tips & behind-the-scenes\n📩 DMs open for collabs | Link in bio 🔗`,
    `💡 Simplifying ${clean} for the modern creator\n📈 0 to 100k journey | Building in public\n👇 Start here`,
    `🎬 Video Creator | Obsessed with ${clean}\n🔥 New videos every week\n👇 Watch my newest episode`,
    `☕ Turning passion into reality | ${clean}\n🌟 Join 50k+ creators leveling up\n🔗 Tap the link below`,
  ];
}

function getFallbackHashtags(input: string, platform = 'Instagram') {
  const words = input.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const baseTag = words[0] || 'contentcreator';
  const secondTag = words[1] || 'creator';

  return {
    highReach: [
      `#${baseTag}`,
      `#trending`,
      `#viral`,
      `#creator`,
      `#explorepage`,
      `#contentcreator`,
      `#youtube`,
      `#video`,
      `#fyp`,
      `#growth`,
    ],
    targeted: [
      `#${baseTag}tips`,
      `#${baseTag}creator`,
      `#${secondTag}life`,
      `#creatoreconomy`,
      `#socialmediagrowth`,
      `#digitalcreator`,
      `#videotips`,
      `#creatorsofinstagram`,
      `#onlinegrowth`,
      `#contentstrategy`,
    ],
    niche: [
      `#${baseTag}hacks`,
      `#howtogrow${baseTag}`,
      `#best${baseTag}`,
      `#${baseTag}community`,
      `#${secondTag}guide`,
      `#learneveryday`,
      `#creatorsunite`,
      `#growyourchannel`,
      `#contentstrategy2026`,
      `#aimicrotool`,
    ],
  };
}

// API endpoint for Title Generation
app.post('/api/generate-titles', async (req, res) => {
  const { prompt, tone = 'Viral / High CTR', platform = 'YouTube' } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Please provide prompt text about your video.' });
  }

  if (!ai) {
    const fallback = getFallbackTitles(prompt, tone, platform);
    return res.json({ titles: fallback, source: 'smart-template' });
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
    let titles: string[] = [];
    try {
      titles = JSON.parse(text);
    } catch {
      titles = getFallbackTitles(prompt, tone, platform);
    }

    if (!Array.isArray(titles) || titles.length === 0) {
      titles = getFallbackTitles(prompt, tone, platform);
    }

    return res.json({ titles, source: 'gemini-3.7-flash' });
  } catch (error: any) {
    console.error('Error generating titles with Gemini:', error);
    const fallback = getFallbackTitles(prompt, tone, platform);
    return res.json({ titles: fallback, source: 'smart-fallback' });
  }
});

// API endpoint for Bio Generation
app.post('/api/generate-bios', async (req, res) => {
  const { prompt, vibe = 'Creator / Influencer', platform = 'Instagram', includeEmojis = true } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Please provide details about yourself.' });
  }

  if (!ai) {
    const fallback = getFallbackBios(prompt, vibe, platform);
    return res.json({ bios: fallback, source: 'smart-template' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `You are an elite social media brand strategist.
Create 5 compelling, concise, and conversion-ready profile bios for ${platform}.
Vibe: ${vibe}
Include emojis: ${includeEmojis ? 'Yes' : 'No'}
User context / about self: "${prompt}"

Each bio should fit platform constraints (under 150 characters for Instagram/TikTok, punchy lines, clear hook and CTA).
Return ONLY a valid JSON array of strings.
Example: ["Bio 1", "Bio 2", "Bio 3", "Bio 4", "Bio 5"]
Do not include markdown codeblocks or extra text.`,
      config: {
        temperature: 0.85,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '[]';
    let bios: string[] = [];
    try {
      bios = JSON.parse(text);
    } catch {
      bios = getFallbackBios(prompt, vibe, platform);
    }

    if (!Array.isArray(bios) || bios.length === 0) {
      bios = getFallbackBios(prompt, vibe, platform);
    }

    return res.json({ bios, source: 'gemini-3.7-flash' });
  } catch (error: any) {
    console.error('Error generating bios with Gemini:', error);
    const fallback = getFallbackBios(prompt, vibe, platform);
    return res.json({ bios: fallback, source: 'smart-fallback' });
  }
});

// API endpoint for Hashtag Generation
app.post('/api/generate-hashtags', async (req, res) => {
  const { prompt, platform = 'Instagram', focus = 'Balanced' } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Please provide context for hashtags.' });
  }

  if (!ai) {
    const fallback = getFallbackHashtags(prompt, platform);
    return res.json({ hashtags: fallback, source: 'smart-template' });
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
}
All items MUST start with '#' and contain no spaces or special characters.`,
      config: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    let result: any = {};
    try {
      result = JSON.parse(text);
    } catch {
      result = getFallbackHashtags(prompt, platform);
    }

    if (!result.highReach || !result.targeted || !result.niche) {
      result = getFallbackHashtags(prompt, platform);
    }

    return res.json({ hashtags: result, source: 'gemini-3.7-flash' });
  } catch (error: any) {
    console.error('Error generating hashtags with Gemini:', error);
    const fallback = getFallbackHashtags(prompt, platform);
    return res.json({ hashtags: fallback, source: 'smart-fallback' });
  }
});

// API endpoint for Contact form
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all fields (Name, Email, Message).' });
  }

  console.log(`[Contact Message Received] From: ${name} (${email}) - Message: ${message}`);
  return res.json({ success: true, message: 'Thank you! Your message has been received successfully.' });
});

// Serve static assets in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI Micro-Tool Server running on port ${PORT}`);
});
