const API_KEY = "add your gemini api";
const summarizeBtn = document.getElementById("summarizeBtn");
const inputText = document.getElementById("inputText");
const output = document.getElementById("output");

async function handleSummarize() {
    const text = inputText.value.trim();

    if (!text) {
        output.textContent = "Please paste some text to summarize.";
        return;
    }

    summarizeBtn.disabled = true;
    summarizeBtn.textContent = "Summarizing...";
    output.textContent = "Generating your summary...";

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Summarize the following text in simple, clear language.

Use concise sentences and include only the main points.
Use plain text without Markdown symbols or unnecessary blank lines.

Text:
${text}`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "API request failed.");
        }

        let summary = data.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("")
            .trim();

        summary = summary
            ? summary
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .replace(/\*(.*?)\*/g, "$1")
                .replace(/^#{1,6}\s*/gm, "")
                .replace(/`([^`]+)`/g, "$1")
                .replace(/\n{3,}/g, "\n\n")
                .trim()
            : "No summary received.";

        output.textContent = summary;
    } catch (error) {
        output.textContent = error.message || "Something went wrong.";
        console.error(error);
    } finally {
        summarizeBtn.disabled = false;
        summarizeBtn.textContent = "Summarize";
    }
}

summarizeBtn.addEventListener("click", handleSummarize);