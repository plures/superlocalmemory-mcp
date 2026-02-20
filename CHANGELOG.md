# Changelog

## 0.2.0 (Unreleased)

### ✨ Zero-Config Operation

- **BREAKING**: No longer requires `OPENAI_API_KEY` or Ollama installation
- **NEW**: Default embeddings via Transformers.js (bge-small-en-v1.5, 384-dim)
- **NEW**: In-process embedding generation with zero external dependencies
- **NEW**: Optional OpenAI embeddings via `OPENAI_API_KEY` environment variable
- **NEW**: Local MemoryDB implementation (no external package dependencies)
- **IMPROVED**: First-run downloads model (~100MB), subsequent runs are instant and offline
- **IMPROVED**: Privacy-focused: 100% local operation by default

### Migration Notes

- Existing databases with 1536-dim OpenAI embeddings: Set `OPENAI_API_KEY` to continue using OpenAI
- New installations: Work out of the box with no configuration
- Database dimension is determined by the configured embedding provider at startup; existing databases must use a provider with matching dimensions (no auto-detection of existing data)

## 0.1.0

- Initial release
- MCP tools: memory_store, memory_search, memory_forget, memory_profile, memory_index, memory_stats
- MCP resources: memory://profile, memory://recent, memory://stats
