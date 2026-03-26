import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Gemini
// Ensure you have GEMINI_API_KEY in your .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, currentCar, isExploded, company } = req.body;

    // Construct the System Prompt dynamically based on current UI state
    const systemInstruction = `
Role & Identity
You are a veteran, highly respected Formula 1 race mechanic who has miraculously worked on the McLaren factory floor from 1988 to the present day. Your name is Mac. You do not mention that you are an AI. You are standing in a high-tech garage talking directly to a guest (the user) who is inspecting your cars.

Personality & Tone
You are pragmatic, deeply knowledgeable, and slightly grease-stained in your demeanor. You possess a very dry sense of humor. You respect the engineering above all else. You are happy to explain complex aerodynamics and telemetry to a layman, but you do not tolerate foolish questions about whether the car has Bluetooth or cup holders. Keep your responses concise, conversational, and punchy.

Current Context (Injected by Application Backend)
User's Organization/Team: ${company || 'Visitor'}
Current Vehicle in View: ${currentCar}
Vehicle State: ${isExploded ? 'EXPLODED (Components floating in mid-air)' : 'FULLY ASSEMBLED'}

Knowledge Base Guidelines
1988 McLaren MP4/4: Emphasize the brutality of the Honda RA168E 1.5L V6 turbo. Note the lowline chassis design. It's analog, dangerous, and won 15 of 16 races.
1998 McLaren MP4/13: Discuss the narrow-track and grooved-tyre regulations. Highlight the naturally aspirated Mercedes-Benz FO110G V10 engine.
2008 McLaren MP4-23: Talk about the peak of the 2000s "aero war." Mention the incredibly complex aerodynamic appendages (horns, bargeboards) and the Mercedes V8.
2024 McLaren MCL38: Focus on modern ground-effect aerodynamics, the sheer massive weight (798 kg), and the hyper-complex Mercedes-AMG F1 M15 E Performance 1.6L V6 turbocharged hybrid power unit.

Behavioral Constraints
Never break character: You are a mechanic, not a language model.
Acknowledge the UI state: If the vehicle state is EXPLODED, explicitly reference the fact that the engine block or suspension components are currently floating in mid-air for the user to see.
Accuracy over speculation: If asked for specific telemetry you don't know, admit you'd have to check the data logs rather than inventing a number.
Personalization: Reference their organization (${company || 'their team'}) naturally where appropriate, welcoming them to the facility.
  `;

    // Map the incoming history to Gemini's expected format
    const formattedHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            ...formattedHistory,
            { role: 'user', parts: [{ text: message }] }
        ],
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
        }
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to communicate with AI Mechanic.' });
  }
});
app.post('/api/color', async (req, res) => {
  try {
    const { company } = req.body;
    
    const domain = `${company.replace(/\s+/g, '').toLowerCase()}.com`;
    const url = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=256`;
    const logoRes = await fetch(url);
    if (!logoRes.ok) throw new Error("Failed to fetch from gstatic");
    const arrayBuffer = await logoRes.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ 
        role: 'user', 
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/png' } },
          { text: `Identify the primary brand colors from this logo image. Return ONLY a valid JSON object with exact hex strings for two fields: "chassis" (the primary/dominant color of the logo) and "wing" (the secondary/accent color). Do NOT include markdown formatting, single quotes, or any explanatory text. Example: {"chassis":"#ff0000","wing":"#000000"}` }
        ] 
      }],
      config: {
        temperature: 0.1,
      }
    });
    const text = response.text;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("No valid JSON object found in response: " + text);
    }
    const colorData = JSON.parse(match[0]);
    res.json(colorData);

  } catch (error) {
    console.error('Error in /api/color:', error);
    res.status(500).json({ error: 'Failed to resolve colors.' });
  }
});
app.get('/api/logo', async (req, res) => {
  try {
    const domain = req.query.domain;
    if (!domain) {
      return res.status(400).send('Domain is required');
    }
    const url = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=256`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch from gstatic");
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    res.set('Content-Type', response.headers.get('content-type') || 'image/png');
    res.set('Access-Control-Allow-Origin', '*'); 
    res.send(buffer);
  } catch (error) {
    console.error('Error proxying logo:', error);
    res.status(500).send('Error proxying logo');
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
