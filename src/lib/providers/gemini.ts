import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { getGeminiApiKey } from '../../config';
import logger from '../../utils/logger';

export const loadGeminiChatModels = async () => {
  const geminiApiKey = getGeminiApiKey();

  if (!geminiApiKey) {
    logger.warn('No Gemini API key found');
    return {};
  }

  try {
    const chatModels = {
      'gemini-pro': {
        model: new ChatGoogleGenerativeAI({
          temperature: 0.7,
          apiKey: geminiApiKey,
          modelName: 'gemini-1.0-pro',
        }),
        displayName: 'Gemini Pro'
      },
      'gemini-pro-1.5': {
        model: new ChatGoogleGenerativeAI({
          temperature: 0.7,
          apiKey: geminiApiKey,
          modelName: 'gemini-1.5-pro',
        }),
        displayName: 'Gemini 1.5 Pro'
      },
      'gemini-pro-1.5-flash': {
        model: new ChatGoogleGenerativeAI({
          temperature: 0.7,
          apiKey: geminiApiKey,
          modelName: 'gemini-1.5-flash',
        }),
        displayName: 'Gemini 1.5 Flash'
      }
    };

    return chatModels;
  } catch (err) {
    logger.error(`Error loading Gemini chat models: ${err}`);
    return {};
  }
};

export const loadGeminiEmbeddingsModels = async () => {
  const geminiApiKey = getGeminiApiKey();

  if (!geminiApiKey) return {};

  try {
    const embeddingsModels = {
      'text-embedding-004': {
        model: new GoogleGenerativeAIEmbeddings({
          apiKey: geminiApiKey,
          modelName: 'text-embedding-004',
        }),
        displayName: 'Gemini Text Embedding 004'
      },
      'embedding-001': {
        model: new GoogleGenerativeAIEmbeddings({
          apiKey: geminiApiKey,
          modelName: 'embedding-001',
        }),
        displayName: 'Gemini Text Embedding 001'
      }
    };

    return embeddingsModels;
  } catch (err) {
    logger.error(`Error loading Gemini embeddings model: ${err}`);
    return {};
  }
};
