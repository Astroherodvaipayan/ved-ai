import { loadGroqChatModels } from './groq';
import { loadOllamaChatModels, loadOllamaEmbeddingsModels } from './ollama';
import { loadOpenAIChatModels, loadOpenAIEmbeddingsModels } from './openai';
import { loadAnthropicChatModels } from './anthropic';
import { loadTransformersEmbeddingsModels } from './transformers';
import { loadGeminiChatModels, loadGeminiEmbeddingsModels } from './gemini'; // Fixed import name

const chatModelProviders = {
  openai: loadOpenAIChatModels,
  groq: loadGroqChatModels,
  ollama: loadOllamaChatModels,
  anthropic: loadAnthropicChatModels,
  gemini: loadGeminiChatModels,
};

const embeddingModelProviders = {
  openai: loadOpenAIEmbeddingsModels,
  local: loadTransformersEmbeddingsModels,
  ollama: loadOllamaEmbeddingsModels,
  gemini: loadGeminiEmbeddingsModels,
};

export const getAvailableChatModelProviders = async () => {
  const models = {};

  for (const provider in chatModelProviders) {
    try {
      console.log(`Loading chat models for provider: ${provider}`);
      const providerModels = await chatModelProviders[provider]();
      console.log(`Loaded models for ${provider}:`, providerModels);
      if (Object.keys(providerModels).length > 0) {
        models[provider] = providerModels;
      }
    } catch (error) {
      console.error(`Error loading models for ${provider}:`, error);
    }
  }

  models['custom_openai'] = {};
  return models;
};

export const getAvailableEmbeddingModelProviders = async () => {
  const models = {};

  for (const provider in embeddingModelProviders) {
    try {
      console.log(`Loading embedding models for provider: ${provider}`);
      const providerModels = await embeddingModelProviders[provider]();
      console.log(`Loaded embeddings for ${provider}:`, providerModels);
      if (Object.keys(providerModels).length > 0) {
        models[provider] = providerModels;
      }
    } catch (error) {
      console.error(`Error loading embeddings for ${provider}:`, error);
    }
  }

  return models;
};