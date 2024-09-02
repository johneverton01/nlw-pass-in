import { prisma } from '../src/lib/prisma'

async function seed() {
  await prisma.event.create({
    data: {
      id: 'c0969428-4b4f-44d6-a58b-0efb96ddfc5e',
      title: 'Unite Summit',
      slug: 'unite-summit',
      details: 'The Prisma Day conference',
      maximumAttendees: 120
    }
  })
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})