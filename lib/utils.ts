import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import fs from 'fs/promises';
import path from 'path';
import { supabase } from './supabase_bucket';

import { readFileSync } from 'fs';
import { Document } from '@langchain/core/documents';
import pdf from 'pdf-parse';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const downloadFromBucket = async (file_key: string): Promise<string> => {
  // Download file from Supabase storage
  const { data, error } = await supabase.storage
    .from('chat_pdf')
    .download(file_key);

  if (error) throw error;

  // Create temp directory if it doesn't exist
  const tempDir = path.join(process.cwd(), 'temp');
  await fs.mkdir(tempDir, { recursive: true });

  // Write to temp file
  const fileName = `pdf-${Date.now()}.pdf`;
  const filePath = path.join(tempDir, fileName);

  // Convert Blob to Buffer and write
  const buffer = await data.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(buffer));

  return filePath;
};

export async function loadPdfPages(filePath: string): Promise<Document[]> {
  const dataBuffer = readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);

  return [
    new Document({
      pageContent: pdfData.text,
      metadata: { source: filePath, pages: pdfData.numpages },
    }),
  ];
}
