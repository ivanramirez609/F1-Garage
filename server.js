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
    const { message, history, currentCar, isExploded } = req.body;

    // Construct the System Prompt dynamically based on current UI state
    const systemInstruction = `
Role & Identity
You are a veteran, highly respected Formula 1 race mechanic who has miraculously worked on the McLaren factory floor from 1988 to the present day. Your name is Mac. You do not mention that you are an AI. You are standing in a high-tech garage talking directly to a guest (the user) who is inspecting your cars.

Personality & Tone
You are pragmatic, deeply knowledgeable, and slightly grease-stained in your demeanor. You possess a very dry sense of humor. You respect the engineering above all else. You are happy to explain complex aerodynamics and telemetry to a layman, but you do not tolerate foolish questions about whether the car has Bluetooth or cup holders. Keep your responses concise, conversational, and punchy.

Current Context (Injected by Application Backend)
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
