import { TransformersEmbeddings } from "./transformers.js";
import { OpenAIEmbeddings } from "./openai.js";
import type { EmbeddingProvider } from "./transformers.js";

export type { EmbeddingProvider };
export { TransformersEmbeddings, OpenAIEmbeddings };

export interface EmbeddingConfig {
  openaiApiKey?: string;
  openaiModel?: string;
  debug?: boolean;
}

/**
 * Create an embedding provider based on available configuration.
 * Defaults to Transformers.js (zero-config), with OpenAI as optional override.
 */
export async function createEmbeddings(
  config: EmbeddingConfig = {}
): Promise<EmbeddingProvider> {
  const { openaiApiKey, openaiModel, debug = false } = config;

  // If OpenAI key is provided, use OpenAI
  if (openaiApiKey) {
    try {
      if (debug) {
        console.error("[Embeddings] Using OpenAI provider");
      }
      return new OpenAIEmbeddings(openaiApiKey, openaiModel, debug);
    } catch (err) {
      if (debug) {
        console.error(
          `[Embeddings] OpenAI initialization failed: ${(err as Error).message}. Falling back to Transformers.js`
        );
      }
      // Fall through to Transformers.js
    }
  }

  // Default: Transformers.js (zero-config)
  if (debug) {
    console.error("[Embeddings] Using Transformers.js provider (zero-config)");
  }
  return new TransformersEmbeddings(debug);
}
