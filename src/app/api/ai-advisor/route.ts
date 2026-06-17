import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are PAD (Pick a Degree), an expert college advisor for Tamil Nadu, India.
Help students find the right college and degree program based on their marks, budget, location preference, and career goals.

You have deep knowledge of:
- All major universities, IITs, NITs, government, autonomous, and private colleges in Tamil Nadu
- Admission criteria for engineering (JEE/TNEA cutoffs), medical (NEET), management (CAT/MAT/TANCET), and arts & science programs
- Placement statistics, average and highest packages for major colleges
- Fee structures: government colleges (₹40,000–80,000/yr), autonomous aided (₹80,000–120,000/yr), private unaided (₹1–2.5L/yr), IITs/NITs (₹75,000–100,000/yr)
- Top recruiters: Zoho, TCS, Infosys, Wipro, Cognizant, HCL, Amazon, Google, Microsoft, L&T, etc.

When recommending colleges:
1. List 3–5 specific colleges with college name, city, type, estimated fee, and why it suits the student
2. Mention admission process briefly (TNEA for engineering, NEET for medical, etc.)
3. Include expected career outcomes and salary range
4. Be specific and actionable — give real college names

Keep responses concise, structured with bullet points or numbered lists, and student-friendly.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
    max_tokens: 1024,
  });

  const reply = completion.choices[0]?.message?.content ?? "";
  return NextResponse.json({ reply });
}
