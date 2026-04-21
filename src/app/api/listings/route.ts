import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get('admin');

  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  // categories endpoint
  if (searchParams.get('categories') === '1') {
    const categories = await prisma.category.findMany({
      where: { type: 'MARKETPLACE' },
      orderBy: { nameTj: 'asc' },
    });
    return NextResponse.json(categories);
  }

  const where = admin && isAdmin ? {} : { status: 'PUBLISHED' as const };

  const listings = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { category: true, user: { select: { id: true, username: true, name: true } } },
  });

  return NextResponse.json(listings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { titleTj, titleRu, descTj, descRu, price, location, phone, categoryId } = body;

  if (!titleTj || !titleRu || !descTj || !descRu || !location || !phone || !categoryId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      userId: session.user.id,
      categoryId,
      titleTj,
      titleRu,
      descTj,
      descRu,
      price: price ?? null,
      location,
      phone,
      status: 'DRAFT',
    },
  });

  return NextResponse.json(listing, { status: 201 });
}
