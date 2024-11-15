const maxWords = 800;

document.getElementById("detection-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const textInput = document.getElementById("text-input").value.trim();
    const resultSection = document.getElementById("result-message");

    resultSection.innerHTML = "";

    if (!textInput) {
        resultSection.textContent = "Please enter some text to analyze.";
        return;
    }

    if (countWords(textInput) > maxWords) {
        resultSection.textContent = "Text exceeds 800 words. Please reduce the text length.";
        return;
    }

    try {
        const response = await analyzeContent(textInput);
        if (response.score !== undefined) {

            const mainScore = (response.score * 100).toFixed(2);
            let colorClass = '';


            if (mainScore < 10) {
                colorClass = 'green-score';
            } else if (mainScore <= 50) {
                colorClass = 'orange-score';
            } else {
                colorClass = 'red-score';
            }



            resultSection.innerHTML = `<strong class="${colorClass}">AI Detection Score: ${mainScore}%</strong><br>(${mainScore}% likely to be AI-generated content)`;
        } else {
            resultSection.textContent = "An error occurred. Please try again.";
        }
    } catch (error) {
        resultSection.textContent = "An error occurred. Please try again.";
        console.error(error);
    }
});


async function analyzeContent(content) {
    const response = await fetch("https://api.sapling.ai/api/v1/aidetect", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key: "FDSTAOOFIM4USBB141Z3IGNAQHI88KF2", 
            text: content,
            sent_scores: false, 
            score_string: false,
            version: "20240606"
        })
    });
    return response.json();
}

function countWords(text) {
    return text.trim().split(/\s+/).length;
}

document.getElementById("text-input").addEventListener("input", () => {
    const textInput = document.getElementById("text-input");
    const wordCounter = document.getElementById("word-counter");
    const wordCount = countWords(textInput.value);

    wordCounter.textContent = `Words: ${wordCount} / ${maxWords}`;
});
