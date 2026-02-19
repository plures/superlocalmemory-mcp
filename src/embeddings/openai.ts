import type { EmbeddingProvider } from "./transformers.js";

/**
 * OpenAI embedding provider (optional, requires openai package and API key).
 * Uses text-embedding-3-small with 1536 dimensions.
 * Uses dynamic ES module import for better compatibility with ES module projects.
 */
export class OpenAIEmbeddings implements EmbeddingProvider {
  public readonly dimension = 1536;
  private apiKey: string;
  private model: string;
  private debug: boolean;
  private clientPromise: Promise<any> | null = null;

  constructor(apiKey: string, model = "text-embedding-3-small", debug = false) {
    this.apiKey = apiKey;
    this.model = model;
    this.debug = debug;

    if (this.debug) {
      console.error(
        `[OpenAIEmbeddings] Configured for lazy initialization with model ${this.model}`
      );
    }
  }

  private async getClient(): Promise<any> {
    if (!this.clientPromise) {
      this.clientPromise = (async () => {
        try {
          // Dynamic import to make openai optional in an ES module context
          const openaiModule = await import("openai");
          const OpenAI = (openaiModule as any).default || openaiModule;
          const client = new (OpenAI as any)({ apiKey: this.apiKey });

          if (this.debug) {
            console.error(
              `[OpenAIEmbeddings] Initialized OpenAI client with model ${this.model}`
            );
          }

          return client;
        } catch (err) {
          throw new Error(
            "OpenAI package not available. Install with: npm install openai"
          );
        }
      })();
    }

    return this.clientPromise;
  }

  async embed(text: string): Promise<number[]> {
    try {
      const client = await this.getClient();
      const response = await client.embeddings.create({
        model: this.model,
        input: text,
      });

      const embedding = response.data[0].embedding;

      // Validate dimension
      if (embedding.length !== this.dimension) {
        throw new Error(
          `Expected ${this.dimension}-dim embedding but got ${embedding.length}-dim from OpenAI`
        );
      }

      if (this.debug) {
        console.error(
          `[OpenAIEmbeddings] Generated embedding of dimension ${embedding.length} for text of length ${text.length}`
        );
      }

      return embedding;
    } catch (err) {
      throw new Error(`OpenAI embedding failed: ${(err as Error).message}`);
    }
  }
}
