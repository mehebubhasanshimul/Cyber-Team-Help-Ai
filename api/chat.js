export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send();

    const { prompt } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    try {
        // লেটেস্ট Gemini 2.0 Flash মডেল ব্যবহার করা হচ্ছে
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ reply: "SYSTEM_ERROR: API রেসপন্স দিতে ব্যর্থ হয়েছে। কি (Key) চেক করুন।" });
        }
    } catch (error) {
        res.status(500).json({ reply: "FATAL_ERROR: " + error.message });
    }
}
