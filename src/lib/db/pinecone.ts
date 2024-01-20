import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw new Error("Please define the PINECONE_API_KEY inside .env");
}

const pinecone = new Pinecone({ apiKey });

export const notesIndex = pinecone.Index("nextjs-ai-mentor");
