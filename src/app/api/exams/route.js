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

    const todayStr = new Date().toISOString().split("T")[0];

    // Construct search-grounding prompt for exams
    const prompt = `Today's date is ${todayStr}. Find up to 8 genuine, real Indian government competitive exams, entrance exams, and recruitment exams that are relevant for this user profile:
- Name: ${name}
- State: ${state}
- Category/Caste Group: ${category}
- Family Annual Income: ${income}
- Profession: ${profession}
${profession === "Student" ? `- Current Course/Class: ${currentClass}\n- Previous Marks Percentage: ${percentage}%` : ""}

Rules:
1. Find REAL exams that are currently accepting applications or have upcoming dates in 2026.
2. Classify each exam as either "current" (registration open NOW or exam happening within 30 days from today) or "upcoming" (registration opening soon or exam scheduled beyond 30 days).
3. Formulate the response language STRICTLY in ${language === "hi" ? "Hindi (हिंदी script)" : "English"}.
4. Include the conducting body, exam dates, registration deadlines, and official portal URL.
5. Provide eligibility criteria specific to this user's profile.
6. Ensure the structure strictly matches the JSON schema provided.
7. Include both national-level exams and ${state}-specific state-level exams.`;

    const systemInstruction = `You are SCHEME GYAN AI, an expert assistant for Indian government exams and recruitment. Your goal is to help citizens find competitive exams, entrance tests, and government recruitment opportunities matching their profile. Use search grounding to ensure you do not make up exam names, dates, or URLs. All output must be formatted as structured JSON matching the requested schema. Ensure texts inside the JSON values are translated to ${language === "hi" ? "Hindi" : "English"}. Only use valid properties specified in the schema.`;

    const fallbackSystemInstruction = `You are SCHEME GYAN AI, an expert assistant for Indian government exams and recruitment. Your goal is to help citizens find competitive exams, entrance tests, and government recruitment opportunities matching their profile. Keep the search accurate and matching the requested profile. All output must be formatted as structured JSON matching the requested schema. Ensure texts inside the JSON values are translated to ${language === "hi" ? "Hindi" : "English"}. Only use valid properties specified in the schema.`;

    const responseSchema = {
      type: "OBJECT",
      properties: {
        exams: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING", description: "Official name of the exam (translated to requested language)" },
              badge: { type: "STRING", description: "2-3 words category badge like 'Engineering', 'Civil Services', 'Banking', 'Medical', 'State PSC', 'Railway'" },
              status: { type: "STRING", description: "Must be exactly 'current' or 'upcoming'" },
              conductingBody: { type: "STRING", description: "Organization conducting the exam (e.g. UPSC, SSC, NTA, State PSC)" },
              examDate: { type: "STRING", description: "Exam date or date range (e.g. 'June 15, 2026' or 'July-August 2026')" },
              registrationDeadline: { type: "STRING", description: "Last date to register/apply (e.g. 'June 30, 2026' or 'To be announced')" },
              description: { type: "STRING", description: "Brief summary of what the exam is for and key details (translated)" },
              eligibility: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "List of eligibility criteria (age, education, category relaxation, etc.)"
              },
              applyUrl: { type: "STRING", description: "Official registration/application portal URL" }
            },
            required: ["name", "badge", "status", "conductingBody", "examDate", "registrationDeadline", "description", "eligibility", "applyUrl"]
          }
        }
      },
      required: ["exams"]
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
        console.log(`[Exams] Trying model: ${option.name} (Search Grounding: ${option.useGrounding})...`);

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
          console.log(`[Exams] Success with model ${option.name} (Grounding: ${option.useGrounding})`);
          break;
        }
      } catch (err) {
        console.warn(`[Exams] Model ${option.name} (grounding=${option.useGrounding}) error:`, err.message || err);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("All Gemini models failed to generate exam content.");
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

    // Separate exams into current and upcoming
    const allExams = data.exams || [];
    const currentExams = allExams.filter((e) => e.status === "current");
    const upcomingExams = allExams.filter((e) => e.status === "upcoming");

    return NextResponse.json({
      currentExams,
      upcomingExams,
      groundingLinks,
      fallbackMode
    });
  } catch (error) {
    console.error("Exams API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
