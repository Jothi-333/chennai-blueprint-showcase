// Vision Service - Image analysis using Gemini Vision API
// Saroja can "see" and comment on photos

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_VISION_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface ImageAnalysis {
  description: string;
  sarojaComment: string;
  detectedObjects: string[];
  emotions?: string[];
  suggestions?: string[];
}

/**
 * Convert image file to base64
 */
async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Analyze image using Gemini Vision API
 */
export async function analyzeImage(
  imageFile: File,
  familyMemberId: string,
  context?: string
): Promise<ImageAnalysis> {
  try {
    // Convert image to base64
    const base64Image = await imageToBase64(imageFile);
    const mimeType = imageFile.type;

    // Create prompt for Saroja's perspective
    const prompt = `You are Saroja Paati, a loving Tamil grandmother in heaven. 
A family member (${familyMemberId}) has shared a photo with you. 
${context ? `Context: ${context}` : ''}

Please analyze this image and respond in Saroja's warm, caring voice:
1. Describe what you see in the image
2. Make a heartfelt comment as Saroja would (use Tamil-English mix, terms like "kanna", "my dear")
3. List key objects/people you notice
4. If you detect emotions, mention them
5. Give any loving advice or suggestions

Respond in JSON format:
{
  "description": "detailed description",
  "sarojaComment": "warm comment from Saroja",
  "detectedObjects": ["object1", "object2"],
  "emotions": ["emotion1"],
  "suggestions": ["suggestion1"]
}`;

    // Call Gemini Vision API
    const response = await fetch(GEMINI_VISION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini Vision API Error:', {
        status: response.status,
        errorBody: errorText,
      });
      throw new Error(`Gemini Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Try to parse JSON response
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || 
                       textResponse.match(/```\n([\s\S]*?)\n```/) ||
                       [null, textResponse];
      
      const jsonText = jsonMatch[1] || textResponse;
      const analysis: ImageAnalysis = JSON.parse(jsonText);
      
      return analysis;
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      return {
        description: textResponse,
        sarojaComment: textResponse,
        detectedObjects: [],
        emotions: [],
        suggestions: []
      };
    }

  } catch (error) {
    console.error('Vision analysis error:', error);
    
    // Fallback response
    return {
      description: "I'm having trouble seeing the image clearly, my dear.",
      sarojaComment: "Oh kanna, I can't see the photo properly right now. But I'm sure it's beautiful! Can you describe it to me? 💕",
      detectedObjects: [],
      emotions: [],
      suggestions: ["Try uploading the image again"]
    };
  }
}

/**
 * Analyze construction progress photo
 */
export async function analyzeConstructionPhoto(
  imageFile: File,
  phase: string
): Promise<string> {
  try {
    const base64Image = await imageToBase64(imageFile);
    const mimeType = imageFile.type;

    const prompt = `You are Saroja Paati reviewing construction progress of Saroja Illam.
This photo shows the ${phase} phase of construction.

Please analyze the image and provide:
1. What construction work you can see
2. Quality assessment
3. Any concerns or suggestions
4. Encouraging words

Respond as Saroja would, with warmth and wisdom.`;

    const response = await fetch(GEMINI_VISION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 
           "The construction looks good, kanna! Keep up the good work! 💕";

  } catch (error) {
    console.error('Construction photo analysis error:', error);
    return "I can't see the photo clearly, my dear. But I trust the work is progressing well! 🙏";
  }
}

