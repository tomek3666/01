import { PrismaClient, Role, CategoryType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminUsername = process.env.ADMIN_USERNAME || 'sulton';
  const adminPassword = process.env.ADMIN_PASSWORD || '2005';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      name: 'Admin',
      role: Role.ADMIN,
      hashedPassword,
    },
  });

  // Create marketplace categories
  const marketplaceCategories = [
    { nameTj: 'Elektronika', nameRu: 'Электроника' },
    { nameTj: 'Kiyim', nameRu: 'Одежда' },
    { nameTj: 'Oziq-ovqat', nameRu: 'Продукты питания' },
    { nameTj: 'Uy jihozlari', nameRu: 'Товары для дома' },
    { nameTj: 'Qishloq xo\'jaligi', nameRu: 'Сельское хозяйство' },
    { nameTj: 'Boshqa', nameRu: 'Другое' },
  ];

  for (const cat of marketplaceCategories) {
    await prisma.category.upsert({
      where: { id: `marketplace-${cat.nameTj.toLowerCase().replace(/\s/g, '-')}` },
      update: {},
      create: {
        id: `marketplace-${cat.nameTj.toLowerCase().replace(/\s/g, '-')}`,
        nameTj: cat.nameTj,
        nameRu: cat.nameRu,
        type: CategoryType.MARKETPLACE,
      },
    });
  }

  // Create job categories
  const jobCategories = [
    { nameTj: 'Qurilish', nameRu: 'Строительство' },
    { nameTj: 'Savdo', nameRu: 'Торговля' },
    { nameTj: 'Xizmatlar', nameRu: 'Услуги' },
    { nameTj: 'IT', nameRu: 'IT' },
    { nameTj: 'Boshqa', nameRu: 'Другое' },
  ];

  for (const cat of jobCategories) {
    await prisma.category.upsert({
      where: { id: `job-${cat.nameTj.toLowerCase().replace(/\s/g, '-')}` },
      update: {},
      create: {
        id: `job-${cat.nameTj.toLowerCase().replace(/\s/g, '-')}`,
        nameTj: cat.nameTj,
        nameRu: cat.nameRu,
        type: CategoryType.JOB,
      },
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
