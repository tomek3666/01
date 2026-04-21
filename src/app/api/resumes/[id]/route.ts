import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const resume = await prisma.resume.findUnique({
    where: { id },
    include: { user: { select: { id: true, username: true, name: true } } },
  });

  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(resume);
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

  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (!isAdmin && resume.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const allowedFields: any = {};
  if (isAdmin && body.status) allowedFields.status = body.status;
  if (body.titleTj) allowedFields.titleTj = body.titleTj;
  if (body.titleRu) allowedFields.titleRu = body.titleRu;
  if (body.descTj) allowedFields.descTj = body.descTj;
  if (body.descRu) allowedFields.descRu = body.descRu;
  if (body.experience !== undefined) allowedFields.experience = body.experience;
  if (body.phone) allowedFields.phone = body.phone;

  const updated = await prisma.resume.update({
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

  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const isAdmin = (session.user as any).role === 'ADMIN';
  if (!isAdmin && resume.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.resume.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
