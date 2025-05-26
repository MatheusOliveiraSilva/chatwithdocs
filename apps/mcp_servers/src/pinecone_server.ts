import { Pinecone } from '@pinecone-database/pinecone';
import type { IndexList, SearchRecordsResponse } from '@pinecone-database/pinecone';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
if (!PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY is not set");
}

const pc = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

// Create server instance
const server = new McpServer({
  name: "pinecone",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function listIndexes(): Promise<IndexList> {
  return await pc.listIndexes();
}

type Document = {
  id: string;
  content: string;
}

interface RelevantDocumentsList {
  documents: Document[];
}

interface SimilaritySearchInput {
  index_name: string;
  host: string;
  query: string;
  namespace: string;
}

async function similaritySearch(input: SimilaritySearchInput): Promise<SearchRecordsResponse> {
  const namespace = pc.index(input.index_name, input.host).namespace(input.namespace);

  return await namespace.searchRecords({
    query: {
      inputs: { text: input.query }, topK: 4 },
      rerank: {
        model: 'bge-reranker-v2-m3',
        topN: 2,
        rankFields: ['chunk_text'],
      },
    fields: ['category', 'chunk_text'],
  });
}

server.tool(
  "listIndexes",
  "List all indexes in a Pinecone database.",
  {},
  async () => {
    let indexes: IndexList = await listIndexes();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(indexes),
        },
      ],
    };
  }
)

server.tool(
  "similaritySearch",
  "Pass the index information and query to search for relevant documents.",
  {
    input: z.object({
      index_name: z.string(),
      host: z.string(),
      query: z.string(),
      namespace: z.string(),
    }),
  },
  async ({ input }) => {
    const { index_name, host, query, namespace } = input;
    let response: SearchRecordsResponse = await similaritySearch({ index_name, host, query, namespace });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response),
        },
      ],
    };
  }
)

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});