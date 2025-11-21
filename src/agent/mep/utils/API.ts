import Together from "together-ai";

type Messages = (
  | Together.Chat.Completions.CompletionCreateParams.ChatCompletionSystemMessageParam
  | Together.Chat.Completions.CompletionCreateParams.ChatCompletionUserMessageParam
  | Together.Chat.Completions.CompletionCreateParams.ChatCompletionAssistantMessageParam
  | Together.Chat.Completions.CompletionCreateParams.ChatCompletionToolMessageParam
  | Together.Chat.Completions.CompletionCreateParams.ChatCompletionFunctionMessageParam
)[];

export default async function api(messages: Messages) {
  const together = new Together({
    apiKey: "acedc05c0c0d15f97d330657e48b7cfc991cd96d0f75a7de4a69af7e4f132a41", // sécurise la clé
  });
  // system explique la sturture du prompt
  // un fils de discution
  // html
  // paser par des agent
  const response = await together.chat.completions.create({
    messages,
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  });

  if (response.choices[0].message) {
    return response.choices[0].message.content;
  } else {
    throw new Error("No response from API");
  }
}
