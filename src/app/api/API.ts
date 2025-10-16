import Together from "together-ai";

export default  async function api(prompt: string) {
    const together = new Together({
      apiKey:
        "acedc05c0c0d15f97d330657e48b7cfc991cd96d0f75a7de4a69af7e4f132a41", // sécurise la clé
    });

    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    });

    if (response.choices[0].message) {
      return response.choices[0].message.content;
    } else {
      throw new Error("No response from API");
    }
  }