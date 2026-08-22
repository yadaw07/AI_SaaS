import fs from 'fs/promises';
import { Pinecone } from '@pinecone-database/pinecone';

import { downloadFromBucket, loadPdfPages } from './utils';

export const getPineconeClient = async () => {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  return pc;
};

export const loadPdfToPinecone = async (file_key: string) => {
  // obtain the pdf -> download and read from pdf
  const file_name = await downloadFromBucket(file_key);
  if (!file_name) throw new Error('file name is missing');

  // 2. Load PDF
  const pages = await loadPdfPages(file_name);
  return pages;

  // 5. Cleanup temp file
  //   await fs.unlink(file_path);

  //   console.log(`Loaded PDF ${file_key} into Pinecone namespace ${namespace}`);
};
