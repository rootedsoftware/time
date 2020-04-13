import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (
  { query: { start, end, clientName, description } },
  res
) => {
  console.log(clientName);
  const timeEntry = await prisma.timeEntry.create({
    data: {
      start: new Date(start),
      end: new Date(end),
      description: description || null,
      user: {
        connect: {
          email: 'test@test.com',
        },
      },
      client: clientName
        ? {
            connect: {
              name: clientName,
            },
          }
        : null,
    },
  });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(timeEntry));
};
