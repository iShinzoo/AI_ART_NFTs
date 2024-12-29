import { useState } from "react";
import axios from "axios";

function App() {
  const prompt = "A futuristic city skyline"; // Hardcoded prompt

  const [imageBlob, setImageBlob] = useState(null);

  const generateArt = async () => {
    const REPLICATE_API_KEY = ""; // Replace with your actual API key

    try {
      const requestPayload = {
        version: "db21e3e65035724c8e77273365f5c4707e22ccf4bdf3b063db20c2b860eae823", // Replace with the correct version ID
        input: {
          prompt: prompt, // Ensure the prompt is correctly formatted
          width: 512,
          height: 512,
        },
      };

      console.log("Request Payload:", requestPayload); // Log the request payload for debugging

      const response = await axios.post("http://localhost:5000/generate-image", requestPayload);

      // Poll for the generated image
      const prediction = response.data;
      let generatedImageUrl = null;

      while (prediction.status !== "succeeded" && prediction.status !== "failed") {
        const result = await axios.get(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: {
            Authorization: `Token ${REPLICATE_API_KEY}`,
          },
        });
        generatedImageUrl = result.data.output;
      }

      if (generatedImageUrl) {
        setImageBlob(generatedImageUrl[0]); // Set the first generated image URL
      }
    } catch (err) {
      console.error("Error generating image with Replicate:", err.response ? err.response.data : err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-extrabold">AI Art Generator</h1>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={generateArt}
          className="bg-black text-white rounded-md p-2"
        >
          Generate
        </button>
      </div>
      {imageBlob && <img src={imageBlob} alt="AI generated art" className="mt-4" />}
    </div>
  );
}

export default App;
