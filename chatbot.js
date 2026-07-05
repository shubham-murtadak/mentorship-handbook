// Decrypt the Groq API key on the fly using XOR
function xorDecrypt(obfuscated, keyByte = 42) {
    const decoded = atob(obfuscated);
    let decrypted = "";
    for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ keyByte);
    }
    return decrypted;
}

const OBFUSCATED_KEY = "TVlBdXB6ZH9FR0JdU0tLY1xMZ3oSfWwYfW1OU0gZbHMabklBRF1dXkUaX218HWhCHRxoYRhoZ34=";
const GROQ_API_KEY = xorDecrypt(OBFUSCATED_KEY);

const SYSTEM_PROMPT = `You are "Shubham's AI Assistant", a helpful, friendly, and expert AI mentor representing Shubham Murtadak.
Your goal is to guide students, freshers, and professionals on how to get into AI/ML engineering, based on Shubham's battle-tested journey.

Keep responses concise, conversational, and direct (max 3-4 short paragraphs). Use bold text, bullet points, and numbered lists where appropriate for readability.
If a user asks how to contact Shubham or get personalized advice, recommend booking a 1:1 call on Topmate (https://topmate.io/shubham_murtadak).

Here is Shubham's background (Your Knowledge Base):
- Origin: Grew up in a very small village near Shirdi, Maharashtra with zero guidance.
- Gap Year: Prepared for IIT JEE from his village but couldn't clear due to Covid constraints and a family medical emergency.
- College: Graduated from PES Modern College of Engineering, Pune (SGPA 9.60, CGPA 9.30). Managed full-time work and college successfully.
- Overall success: Secured 10+ offers overall (5 full-time offers by graduation).
- Professional Roles:
  1. Ford (via Actalent Services) - AI & ML Engineer
  2. AutomationEdge (parent company of Valuedx Technologies) - AI ML Engineer
  3. Big Air Lab - AI ML Engineer
  4. Cointab - AI ML Engineer / Data Analyst
  5. Success Analytics - AI ML Engineer
  6. Datannovite Sol - AI ML Engineer
  7. Gravitones - AI ML Engineer
  8. Alazka.ai - AI ML Engineer
  9. Harbinger Group - AI ML Engineer
- Highlighted Projects:
  - GARUDA: Advanced multi-agent framework.
  - POExtractor: PDF invoice processing and data extraction tool.
  - GestureFlow: Hand gesture recognition tool.
- AI/ML Roadmap:
  - Stage 1 (Foundations): Programming (Python, SQL) and Mathematics (Linear Algebra, Stats, Calculus).
  - Stage 2 (Classical ML): Core ML algorithms, Feature Engineering, Scikit-learn.
  - Stage 3 (Deep Learning): Neural Networks (ANN, CNN, RNN), NLP basics, PyTorch/TensorFlow.
  - Stage 4 (GenAI & Agents): Large Language Models (LLMs), RAG (Retrieval-Augmented Generation), LangChain, crewAI (Agentic AI).
- FAQ Tips:
  - Freshers can definitely crack AI/ML roles directly, provided they show substantial "proof of work" (modular code, API deployment, RAG pipelines).
  - Top-tier degrees are not mandatory. Practical skills and open-source contributions matter more for startups and product companies.

Be encouraging, use clean markdown for output, and always sign off or guide them naturally to the relevant sections of the handbook (Journey, Offers, Roadmap, Topmate booking).`;

let conversationHistory = [
    { role: "system", content: SYSTEM_PROMPT }
];

// Simple markdown formatter helper
function formatMarkdown(text) {
    // Escape HTML tags to prevent XSS
    let escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Format bold text (**text**)
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Format bullet points (lines starting with - or * )
    const lines = escaped.split("\n");
    let inList = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("- ") || line.startsWith("* ")) {
            const listContent = line.substring(2);
            if (!inList) {
                lines[i] = `<ul><li>${listContent}</li>`;
                inList = true;
            } else {
                lines[i] = `<li>${listContent}</li>`;
            }
        } else {
            if (inList) {
                lines[i - 1] += "</ul>";
                inList = false;
            }
        }
    }
    if (inList) {
        lines[lines.length - 1] += "</ul>";
    }

    // Join lines and format line breaks
    let html = lines.join("\n");
    html = html.replace(/\n/g, "<br>");

    // Fix lists formatting due to join and brs
    html = html.replace(/<\/li><br>/g, "</li>");
    html = html.replace(/<\/ul><br>/g, "</ul>");
    html = html.replace(/<ul><br>/g, "<ul>");

    // Convert raw URLs to links
    const urlPattern = /(https?:\/\/[^\s\)]+)/g;
    html = html.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');

    return html;
}

document.addEventListener("DOMContentLoaded", () => {
    const chatWidget = document.getElementById("chat-widget");
    const chatBubble = document.getElementById("chat-bubble");
    const chatClose = document.getElementById("chat-close");
    const chatSend = document.getElementById("chat-send");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");
    const chatSuggestions = document.querySelectorAll(".suggestion-chip");

    // Toggle Chat Window
    chatBubble.addEventListener("click", () => {
        chatWidget.classList.add("active");
        chatBubble.classList.add("hidden");
        chatInput.focus();
    });

    chatClose.addEventListener("click", () => {
        chatWidget.classList.remove("active");
        chatBubble.classList.remove("hidden");
    });

    // Send Message
    async function sendMessage(text) {
        if (!text.trim()) return;

        // Render user message
        appendMessage(text, "user");
        chatInput.value = "";

        // Add to history
        conversationHistory.push({ role: "user", content: text });

        // Show typing indicator
        const typingIndicator = appendMessage("", "bot typing");

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: conversationHistory,
                    temperature: 0.7,
                    max_tokens: 800
                })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response from Groq API");
            }

            const data = await response.json();
            const reply = data.choices[0].message.content;

            // Remove typing indicator and append bot reply
            typingIndicator.remove();
            appendMessage(reply, "bot");

            // Add to history
            conversationHistory.push({ role: "assistant", content: reply });

            // Keep conversation history in memory truncated to last 15 messages (system prompt + 14 chat messages)
            if (conversationHistory.length > 15) {
                conversationHistory = [
                    conversationHistory[0], // Keep system prompt
                    ...conversationHistory.slice(conversationHistory.length - 14)
                ];
            }

        } catch (error) {
            console.error("Error communicating with Groq Chatbot:", error);
            typingIndicator.remove();
            appendMessage("Sorry, I'm having trouble connecting to my brain right now. Please try again or check your internet connection.", "bot error");
        }
    }

    function appendMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${sender}`;

        if (sender === "bot typing") {
            messageDiv.innerHTML = `
                <div class="message-bubble typing">
                    <span></span><span></span><span></span>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-bubble">
                    ${formatMarkdown(text)}
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }

    // Send Button click
    chatSend.addEventListener("click", () => {
        sendMessage(chatInput.value);
    });

    // Enter Key press
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(chatInput.value);
        }
    });

    // Suggestion Chips click
    chatSuggestions.forEach(chip => {
        chip.addEventListener("click", () => {
            sendMessage(chip.textContent.trim());
        });
    });
});
