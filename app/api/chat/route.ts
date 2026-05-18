import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta configurar la clave de Groq en el servidor." },
        { status: 500 }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No se recibió un historial de conversación válido." },
        { status: 400 }
      );
    }

    // El servidor local hace la llamada a Groq (los servidores no tienen bloqueos de navegador)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
      }),
    });

    if (!response.ok) {
      let groqMessage = "No pudimos procesar tu mensaje en este momento.";

      try {
        const errorData = await response.json();
        const upstreamMessage = errorData?.error?.message;
        if (typeof upstreamMessage === "string" && upstreamMessage.trim()) {
          groqMessage = upstreamMessage;
        }
      } catch {
        // Si Groq no devuelve JSON válido, mantenemos un mensaje amigable.
      }

      return NextResponse.json({ error: groqMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch {
    return NextResponse.json(
      { error: "Ocurrió un error interno al procesar tu solicitud." },
      { status: 500 }
    );
  }
}