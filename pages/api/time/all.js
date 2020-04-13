import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (_, res) => {
  try {
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        user: {
          email: 'test@test.com',
        },
      },
      orderBy: { end: 'desc' },
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(timeEntries));
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
  }
};
