import express from 'express';
import handleImageSearch from '../agents/imageSearchAgent';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { getAvailableChatModelProviders } from '../lib/providers';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import logger from '../utils/logger';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let { query, chat_history = [], chat_model_provider, chat_model } = req.body;

    // Ensure chat_history is an array
    chat_history = Array.isArray(chat_history) ? chat_history : [];

    // Map chat_history to messages
    chat_history = chat_history.map((msg: any) => {
      if (msg.role === 'user') {
        return new HumanMessage(msg.content);
      } else if (msg.role === 'assistant') {
        return new AIMessage(msg.content);
      }
      return null; // Handle unexpected roles
    }).filter(Boolean); // Remove null values

    const chatModels = await getAvailableChatModelProviders();
    const provider = chat_model_provider ?? Object.keys(chatModels)[0];
    const chatModel = chat_model ?? Object.keys(chatModels[provider])[0];

    let llm: BaseChatModel | undefined;

    if (chatModels[provider] && chatModels[provider][chatModel]) {
      llm = chatModels[provider][chatModel].model as BaseChatModel | undefined;
    }

    if (!llm) {
      return res.status(500).json({ message: 'Invalid LLM model selected' });
    }

    const images = await handleImageSearch({ query, chat_history }, llm);

    res.status(200).json({ images });
  } catch (err) {
    logger.error(`Error in image search: ${err.message}`);
    res.status(500).json({ message: 'An error has occurred.' });
  }
});

export default router;
