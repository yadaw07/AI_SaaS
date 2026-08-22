import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs/server';

import db from '@/lib/db';
import { chats } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { file_key, file_name, file_url } = await req.json();

    // Save to DB
    const newChat = await db
      .insert(chats)
      .values({
        pdfName: file_name,
        pdfUrl: file_url,
        fileKey: file_key,
        userId,
      })
      .returning();

    return NextResponse.json(newChat[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
