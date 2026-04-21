import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { type: 'MARKETPLACE' },
    orderBy: { nameTj: 'asc' },
  });
  return NextResponse.json(categories);
}
