import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support up to 25MB for high-resolution image analysis
app.use(express.json({ limit: '25mb' }));

// Shared server-side Gemini client with required User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface AnalysisResponseData {
  primaryIdentification: string;
  category: string;
  confidenceLevel: 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE' | 'INCONCLUSIVE';
  imageQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Insufficient';
  qualityDetails: string;
  qualityWarning: string | null;
  description: string;
  sceneContext: string;
  visibleEvidence: string[];
  whyThisResult: string;
  attributes: {
    colorPalette: string[];
    shapeGeometry: string;
    texture: string;
    approximateSizeCategory: string;
    patterns: string;
    materials: string;
    distinctiveCharacteristics: string[];
  };
  detectedObjects: Array<{
    id: string;
    name: string;
    confidence: 'High' | 'Medium' | 'Low';
    description: string;
  }>;
  possibleAlternatives: Array<{
    label: string;
    whyPossible: string;
  }>;
  ambiguityWarning: string | null;
  inconclusiveReason: string | null;
}

// Visual analysis endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', forcedAnalysis = false } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: 'No image data provided. Please upload a valid image.',
      });
    }

    // Sanitize base64 string
    const cleanedBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please ensure the API key is set in environment secrets.',
      });
    }

    const systemPrompt = `You are AURA VISION, an elite, scientific-grade multimodal visual intelligence system.
Your mission is uncompromising accuracy, deep visual reasoning, and absolute UNCERTAINTY SAFETY.

CRITICAL UNCERTAINTY SAFETY MANDATE:
1. NEVER force a classification when visual evidence is insufficient or ambiguous.
2. If an image is severely blurred, extremely dark, overexposed, low-resolution, heavily cropped, obstructed, or visually ambiguous:
   - Set confidenceLevel to "INCONCLUSIVE" or "LOW CONFIDENCE".
   - If evidence is too weak to identify what is visible with reasonable certainty, set primaryIdentification to "Analysis inconclusive", confidenceLevel to "INCONCLUSIVE", and clearly explain why in inconclusiveReason.
   - Example inconclusive message: "The image does not contain enough reliable visual evidence for a confident identification. Reason: Severe motion blur and low illumination obscure critical structural features."
3. Prefer "I cannot confidently identify this image" over a confidently wrong answer.
4. Specificity over vague labels:
   - If a baby photograph is present, identify it specifically as "Human infant", not just "Human".
   - If a Bengal tiger is present, identify it as "Bengal tiger" or "Tiger", NEVER simply "Cat".
   - If a person is riding a bicycle, identify the scene as "Person riding a bicycle" and detect both entities in detectedObjects.
5. In "whyThisResult", expose ONLY observable physical visual evidence (e.g. "Identified as a tiger because the image visibly shows a large feline body structure, distinctive dark vertical striping, and tiger-like facial markings"). Never expose internal chain-of-thought or model architecture details.
6. Evaluate image quality objectively: "Excellent", "Good", "Fair", "Poor", or "Insufficient". If Poor or Insufficient, populate qualityWarning with an actionable warning.
7. If multiple distinct objects are present, enumerate them in detectedObjects with individual confidence ratings.
8. Only suggest possibleAlternatives if genuine ambiguity exists. Otherwise return an empty array.`;

    const userPrompt = forcedAnalysis
      ? `Analyze this image thoroughly despite degraded image quality, strictly preserving uncertainty boundaries and explicitly identifying limitations.`
      : `Perform complete multi-stage visual intelligence analysis on this image: inspect image quality, assess confidence, extract observable evidence, detect distinct objects, and identify what is visible.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanedBase64,
            },
          },
          {
            text: userPrompt,
          },
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryIdentification: {
              type: Type.STRING,
              description: 'Concise human-readable identification of what is visible, or "Analysis inconclusive"',
            },
            category: {
              type: Type.STRING,
              description: 'High-level category: Human, Animal, Vehicle, Plant, Food, Building, Landscape, Electronic, Object, Document, Artwork, Scene, or Other',
            },
            confidenceLevel: {
              type: Type.STRING,
              description: 'Exact confidence level: HIGH CONFIDENCE, MEDIUM CONFIDENCE, LOW CONFIDENCE, or INCONCLUSIVE',
            },
            imageQuality: {
              type: Type.STRING,
              description: 'Image quality rating: Excellent, Good, Fair, Poor, or Insufficient',
            },
            qualityDetails: {
              type: Type.STRING,
              description: 'Objective assessment of lighting, sharpness, resolution, and visible artifacts',
            },
            qualityWarning: {
              type: Type.STRING,
              description: 'Warning string if image quality is Poor or Insufficient, otherwise empty string',
            },
            description: {
              type: Type.STRING,
              description: 'Clear, concise description of what is depicted in the image',
            },
            sceneContext: {
              type: Type.STRING,
              description: 'Contextual setting, environment, actions, or lighting conditions in the scene',
            },
            visibleEvidence: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 5 observable visual facts supporting the identification (e.g. stripes, body contours)',
            },
            whyThisResult: {
              type: Type.STRING,
              description: 'Concise evidence-based explanation for user (observable visual facts only)',
            },
            attributes: {
              type: Type.OBJECT,
              properties: {
                colorPalette: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Key dominant colors observed',
                },
                shapeGeometry: {
                  type: Type.STRING,
                  description: 'Primary geometric forms and silhouettes',
                },
                texture: {
                  type: Type.STRING,
                  description: 'Surface textures observed (e.g. fur, polished metal, smooth skin)',
                },
                approximateSizeCategory: {
                  type: Type.STRING,
                  description: 'Approximate scale (e.g. Microscopic, Miniature, Handheld, Human-scale, Architectural, Macro/Geographic)',
                },
                patterns: {
                  type: Type.STRING,
                  description: 'Observable repeating visual patterns or markings',
                },
                materials: {
                  type: Type.STRING,
                  description: 'Apparent materials (e.g. organic tissue, steel, glass, cotton fabric)',
                },
                distinctiveCharacteristics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Notable diagnostic visual markers',
                },
              },
              required: [
                'colorPalette',
                'shapeGeometry',
                'texture',
                'approximateSizeCategory',
                'patterns',
                'materials',
                'distinctiveCharacteristics',
              ],
            },
            detectedObjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  confidence: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['id', 'name', 'confidence', 'description'],
              },
              description: 'List of individually identified entities in the frame',
            },
            possibleAlternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  whyPossible: { type: Type.STRING },
                },
                required: ['label', 'whyPossible'],
              },
              description: 'Plausible alternative readings if visual ambiguity exists, else empty list',
            },
            ambiguityWarning: {
              type: Type.STRING,
              description: 'Explanation if the subject is ambiguous or partially obscured, otherwise empty string',
            },
            inconclusiveReason: {
              type: Type.STRING,
              description: 'Specific reason if identification is inconclusive, otherwise empty string',
            },
          },
          required: [
            'primaryIdentification',
            'category',
            'confidenceLevel',
            'imageQuality',
            'qualityDetails',
            'description',
            'sceneContext',
            'visibleEvidence',
            'whyThisResult',
            'attributes',
            'detectedObjects',
          ],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty response received from visual intelligence engine');
    }

    let parsed: AnalysisResponseData;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error('Failed to parse JSON response:', rawText);
      return res.status(502).json({
        error: 'Analysis could not be completed reliably due to unformatted model response. Please try again.',
      });
    }

    // Normalize confidence level to strict enum
    const validConfidences = ['HIGH CONFIDENCE', 'MEDIUM CONFIDENCE', 'LOW CONFIDENCE', 'INCONCLUSIVE'];
    if (!validConfidences.includes(parsed.confidenceLevel)) {
      parsed.confidenceLevel = 'MEDIUM CONFIDENCE';
    }

    // Normalize quality
    const validQualities = ['Excellent', 'Good', 'Fair', 'Poor', 'Insufficient'];
    if (!validQualities.includes(parsed.imageQuality)) {
      parsed.imageQuality = 'Fair';
    }

    return res.json({
      success: true,
      data: parsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Visual analysis error:', error);
    return res.status(500).json({
      error: error?.message || 'Visual analysis pipeline encountered an error. Please try again.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    product: 'AURA VISION',
    geminiConfigured: !!apiKey,
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AURA VISION] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
