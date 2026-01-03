// ChatService.js
const { Configuration, OpenAI } = require("openai");

class ChatService {
  constructor() {
    this.instructions = "Extract total fuel consumption from the given userInput, return only number.  example:  1000";

    this.client = new OpenAI({
      apiKey: "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", // This is the default and can be omitted
      dangerouslyAllowBrowser: true
    });

  }

  async getResponse(userInput) {

    const params = OpenAI.Chat.ChatCompletionCreateParams =
    {
      model: "gpt-4o-mini",
      temperature: 0.888,
      max_tokens: 2048,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 1,
      messages: [
        { role: "system", content: this.instructions },
        { role: "user", content: userInput },
      ],
    }

    const chatCompletion = await this.client.chat.completions.create(params);

    return chatCompletion.choices[0].message.content.trim();
  }
}

export default ChatService;
