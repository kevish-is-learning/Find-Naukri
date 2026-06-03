import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { profile, language } = await request.json();

    if (!profile) {
      return NextResponse.json({ error: "Profile is required" }, { status: 400 });
    }

    const { name, state, category, income, profession, currentClass, percentage } = profile;

    if (!state) {
      return NextResponse.json({ error: "State is required" }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is not defined. Please set it in .env.local." },
        { status: 500 }
      );
    }

    const client = new GoogleGenAI({ apiKey: key });

    // Construct search-grounding prompt
    const prompt = `Find up to 5 genuine, active, real Indian government schemes (Central Government and ${state} State Government) specifically matching this user profile:
- Name: ${name}
- State: ${state}
- Category/Caste Group: ${category}
- Family Annual Income: ${income}
- Profession: ${profession}
${profession === "Student" ? `- Current Course/Class: ${currentClass}\n- Previous Marks Percentage: ${percentage}%` : ""}

Rules:
1. Ensure the schemes are REAL, legally active in 2026, and fit the profile.
2. Formulate the response language STRICTLY in ${language === "hi" ? "Hindi (हिंदी script)" : "English"}.
3. Provide precise eligibility/qualification criteria (in 'eligibility' array), benefits and welfare support (in 'benefit' string), and actual documents required.
4. Try to find the exact official government portal URL (usually ends with .gov.in or .nic.in).
5. Ensure the structure strictly matches the JSON schema provided.`;

    const systemInstruction = `You are SCHEME GYAN AI, a helpful and precise assistant for Indian government schemes. Your goal is to guide citizens to high-relevance welfare schemes, scholarships, and initiatives matching their details. Use search grounding to ensure you do not make up URLs or names. All output must be formatted as structured JSON matching the requested schema. Ensure texts inside the JSON values (name, benefit, eligibility list, and documents list) are translated to ${language === "hi" ? "Hindi" : "English"}. Only use valid properties specified in the schema.`;

    const fallbackSystemInstruction = `You are SCHEME GYAN AI, a helpful and precise assistant for Indian government schemes. Your goal is to guide citizens to high-relevance welfare schemes, scholarships, and initiatives matching their details. Keep the database search accurate, active, and matching the requested profile. All output must be formatted as structured JSON matching the requested schema. Ensure texts inside the JSON values (name, benefit, eligibility list, and documents list) are translated to ${language === "hi" ? "Hindi" : "English"}. Only use valid properties specified in the schema.`;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        schemes: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING", description: "Official name of the scheme (translated to requested language)" },
              badge: { type: "STRING", description: "2-3 words category badge like 'Scholarship', 'Agriculture', 'Women's Wellness'" },
              benefit: { type: "STRING", description: "Clear summary of benefits and financial support (translated)" },
              eligibility: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "List of specific qualifications and eligibility criteria needed to apply (translated)"
              },
              documents: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "Explicitly needed documents (Aadhaar card, income slip, etc.)"
              },
              applyUrl: { type: "STRING", description: "Official clickable portal URL, e.g., 'https://myscheme.gov.in'" }
            },
            required: ["name", "badge", "benefit", "eligibility", "documents", "applyUrl"]
          }
        }
      },
      required: ["schemes"]
    };

    // Try a series of reliable models with and without search grounding
    const modelsToTry = [
      { name: "gemini-3.5-flash", useGrounding: true },
      { name: "gemini-3.1-flash-lite", useGrounding: true },
      { name: "gemini-flash-latest", useGrounding: true },
      { name: "gemini-3.5-flash", useGrounding: false },
      { name: "gemini-3.1-flash-lite", useGrounding: false },
      { name: "gemini-flash-latest", useGrounding: false }
    ];

    let response = null;
    let fallbackMode = false;
    let lastError = null;

    for (const option of modelsToTry) {
      try {
        console.log(`Trying model: ${option.name} (Search Grounding: ${option.useGrounding})...`);

        const config = {
          systemInstruction: option.useGrounding ? systemInstruction : fallbackSystemInstruction,
          responseMimeType: "application/json",
          responseSchema: responseSchema
        };

        if (option.useGrounding) {
          config.tools = [{ googleSearch: {} }];
        }

        let tempResponse = null;
        let attempts = 0;
        const maxAttempts = 2;

        while (attempts < maxAttempts) {
          try {
            attempts++;
            tempResponse = await client.models.generateContent({
              model: option.name,
              contents: prompt,
              config: config
            });
            break;
          } catch (err) {
            const errField = err.message || String(err);
            const isTemporary =
              errField.includes("demand") ||
              errField.includes("Spikes") ||
              errField.includes("RESOURCE_EXHAUSTED") ||
              errField.includes("503") ||
              errField.includes("limit");
            if (isTemporary && attempts < maxAttempts) {
              console.warn(`Temporary error on ${option.name}. Waiting 800ms before retry...`);
              await new Promise((resolve) => setTimeout(resolve, 800));
            } else {
              throw err;
            }
          }
        }

        if (tempResponse && tempResponse.text) {
          response = tempResponse;
          if (!option.useGrounding) {
            fallbackMode = true;
          }
          console.log(`Success with model ${option.name} (Grounding: ${option.useGrounding})`);
          break;
        }
      } catch (err) {
        console.warn(`Model ${option.name} (grounding=${option.useGrounding}) error:`, err.message || err);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("All Gemini models failed to generate content.");
    }

    const responseText = response.text;
    const data = JSON.parse(responseText);

    // Extract grounding URLs if available
    const groundingChunks = !fallbackMode
      ? response.candidates?.[0]?.groundingMetadata?.groundingChunks
      : null;

    const groundingLinks = groundingChunks
      ? groundingChunks
          .map((chunk) => {
            if (chunk.web?.uri) {
              return { title: chunk.web.title || chunk.web.uri, uri: chunk.web.uri };
            }
            return null;
          })
          .filter(Boolean)
      : [];

    return NextResponse.json({
      schemes: data.schemes || [],
      groundingLinks: groundingLinks,
      fallbackMode: fallbackMode
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
