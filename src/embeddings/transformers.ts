import { pipeline, env } from "@huggingface/transformers";

// Disable remote model downloading when running in restricted environments
// Models will be cached locally after first download
env.allowLocalModels = true;
env.allowRemoteModels = true;

export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
  dimension: number;
}

/**
 * Transformers.js embedding provider using bge-small-en-v1.5 (384 dimensions).
 * This runs entirely in-process with no external API calls.
 */
export class TransformersEmbeddings implements EmbeddingProvider {
  public readonly dimension = 384;
  private pipeline: any = null;
  private readonly model = "Xenova/bge-small-en-v1.5";
  private debug: boolean;

  constructor(debug = false) {
    this.debug = debug;
  }

  private async ensurePipeline() {
    if (!this.pipeline) {
      if (this.debug) {
        console.error(`[TransformersEmbeddings] Loading model ${this.model}...`);
      }
      this.pipeline = await pipeline("feature-extraction", this.model);
      if (this.debug) {
        console.error(`[TransformersEmbeddings] Model loaded successfully`);
      }
    }
    return this.pipeline;
  }

  async embed(text: string): Promise<number[]> {
    const pipe = await this.ensurePipeline();
    
    // Generate embeddings
    const output = await pipe(text, { pooling: "mean", normalize: true });
    
    // Convert to regular array
    const embedding = Array.from(output.data) as number[];
    
    if (this.debug) {
      console.error(
        `[TransformersEmbeddings] Generated embedding of dimension ${embedding.length} for text of length ${text.length}`
      );
    }

    return embedding;
  }
}
