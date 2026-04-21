import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get('admin');

  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const where = admin && isAdmin ? {} : { status: 'PUBLISHED' as const };

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, username: true, name: true } } },
  });

  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { titleTj, titleRu, descTj, descRu, salary, location, phone } = body;

  if (!titleTj || !titleRu || !descTj || !descRu || !location || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      userId: session.user.id,
      titleTj,
      titleRu,
      descTj,
      descRu,
      salary: salary || null,
      location,
      phone,
      status: 'DRAFT',
    },
  });

  return NextResponse.json(job, { status: 201 });
}
