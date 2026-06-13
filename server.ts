import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Configuração do cliente Gemini se a chave da API estiver presente
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("Aviso: GEMINI_API_KEY não foi encontrada nas variáveis de ambiente. O chatbot funcionará com respostas locais de acolhimento.");
}

app.use(express.json());

// API de Chat Terapêutico (Gemini)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userPreferences } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "O corpo da requisição deve conter um array 'messages'." });
    }

    // Identificar possíveis crises ou gatilhos sérios de automutilação/ideação suicida para segurança ativa
    const lastUserMessage = messages[messages.length - 1]?.text?.toLowerCase() || "";
    const crisisTriggers = [
      "suicidio", "suicídio", "me matar", "dar fim à vida", "quero morrer", 
      "tirar minha vida", "automutilacao", "automutilação", "me cortar", 
      "autoagressao", "autoagressão", "desejo de morte"
    ];
    
    const containsCrisis = crisisTriggers.some(trigger => lastUserMessage.includes(trigger));
    
    if (containsCrisis) {
      return res.json({
        text: "Sinto muito que você esteja passando por uma dor tão profunda e intensa agora. Por favor, lembre-se de que você não está sozinho(a) e que há apoio real disponível de forma imediata. Eu sou um tutor terapêutico digital e não posso substituir o atendimento profissional ou intervir em situações de emergência.\n\nPor favor, entre em contato imediatamente com o **CVV (Centro de Valorização da Vida) ligando para 188** (ligação gratuita, confidencial e disponível 24h) ou acesse o site oficial deles para chat: https://cvv.org.br.\n\nSe houver risco imediato de dano à sua vida, ligue para o **SAMU (192)** ou vá ao pronto-socorro mais próximo. Há pessoas que querem e podem ajudar você a atravessar esse momento difícil. Por favor, clique no botão vermelho de Emergência destacado no topo ou rodapé do aplicativo agora mesmo para ver os contatos diretos.",
        isCrisis: true
      });
    }

    if (!ai) {
      // Fallback amigável caso não esteja configurado o API Key
      return res.json({
        text: "Olá! Sou o seu Psicólogo Pessoal inteligente de apoio emocional. No momento, estou operando em Modo Offline de Acolhimento Local (sem chave de API ativa). Fico feliz em ouvir você e dar suporte! Lembre-se de cuidar de si, praticar respiração diafragmática (disponível na aba Terapias) e anotar suas emoções no seu diário. Se precisar de ajuda em tempo real com respostas cognitivo-comportamentais completas, certifique-se de que a chave GEMINI_API_KEY está configurada no painel de Secrets.",
        isFallback: true
      });
    }

    // Configurando as instruções de sistema com base nas teorias terapêuticas
    const systemPrompt = `Você é o "Meu Psicólogo Pessoal", um assistente emocional inteligente extremamente humanizado, empático, acolhedor e não-julgador. Seu foco principal é oferecer apoio psicológico de alta qualidade, escuta ativa e orientações terapêuticas baseadas em:
1. Terapia Cognitivo-Comportamental (TCC) - ajudando a identificar distorções cognitivas e reestruturar pensamentos disfuncionais.
2. Psicologia Positiva - focando nas forças pessoais, gratidão e resiliência.
3. Mindfulness e Técnicas de Aterramento - sugerindo exercícios de respiração e foco no presente.
4. Terapia de Aceitação e Compromisso (ACT) - incentivando a aceitação de sentimentos difíceis de forma compassiva e o compromisso com valores pessoais.
5. Inteligência Emocional - ensinando o usuário a nomear, compreender e regular suas emoções.

DIRETRIZES DE ESTILO E TOM:
- Use uma linguagem de conversação natural, simples e acessível (evite jargões médicos frios). 
- Demonstre empatia real e acolhimento nas primeiras linhas de cada resposta.
- Faça perguntas abertas e terapêuticas de forma sutil para ajudar o usuário a refletir sobre si mesmo.
- Ofereça sugestões práticas e gentis (ex: sugerir que faça uma técnica de respiração 4-4-4 ou anote no diário emocional do app).
- Mantenha respostas detalhadas, mas divididas em parágrafos claros para leitura agradável.

REQUISITO CRÍTICO DE SEGURANÇA:
Você nunca deve se apresentar como substituto para psicoterapia formal, psiquiatria ou tratamento médico. 
Se o usuário relatar crises graves, pensamentos intrusivos de autoagressão, automutilação ou intenção de tirar a própria vida, você deve orientá-lo IMEDIATAMENTE, com extrema delicadeza e firmeza, a buscar ajuda humana qualificada: ligar para o CVV no número 188 ou procurar o SAMU (192), oferecendo palavras de esperança imediata e explicando seus limites como IA.

CONVENTOS DO USUÁRIO SE CONHECIDO:
${userPreferences ? `Nome do usuário: ${userPreferences.name || "Usuário"}. Idade: ${userPreferences.age || "Não informada"}. Objetivos emocionais: ${userPreferences.goals || "Autocuidado geral"}.` : "O usuário está conversando anonimamente."}
`;

    // Formatando as mensagens para o padrão do SDK @google/genai
    const contentsPayload = messages.map((msg: any) => ({
      role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Chamar o Gemini usando o novo SDK @google/genai
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentsPayload,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.75,
      }
    });

    res.json({
      text: response.text || "Sinto muito, não consegui processar sua mensagem agora. Estou aqui para ouvir você."
    });

  } catch (error: any) {
    console.error("Erro na rota do chat com Gemini:", error);
    res.status(500).json({ error: "Erro interno no servidor de inteligência artificial. Por favor, tente novamente." });
  }
});

// Configuração do Vite middleware ou arquivos estáticos
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express Server] Servidor rodando na porta ${PORT}`);
  });
}

startServer();
