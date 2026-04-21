import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { user: { select: { id: true, username: true, name: true } } },
  });

  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const isAdmin = (session.user as any).role === 'ADMIN';

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (!isAdmin && job.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const allowedFields: any = {};
  if (isAdmin && body.status) allowedFields.status = body.status;
  if (body.titleTj) allowedFields.titleTj = body.titleTj;
  if (body.titleRu) allowedFields.titleRu = body.titleRu;
  if (body.descTj) allowedFields.descTj = body.descTj;
  if (body.descRu) allowedFields.descRu = body.descRu;
  if (body.salary !== undefined) allowedFields.salary = body.salary;
  if (body.location) allowedFields.location = body.location;
  if (body.phone) allowedFields.phone = body.phone;

  const updated = await prisma.job.update({
    where: { id },
    data: allowedFields,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const isAdmin = (session.user as any).role === 'ADMIN';
  if (!isAdmin && job.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
