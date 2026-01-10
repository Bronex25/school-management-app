import { Day, PrismaClient, UserSex } from '@/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  /* ===================== ADMIN ===================== */
  await Promise.all(
    ['admin1', 'admin2'].map((id) =>
      prisma.admin.upsert({
        where: { id },
        update: {},
        create: { id, username: id },
      }),
    ),
  )

  /* ===================== GRADE ===================== */
  await Promise.all(
    Array.from({ length: 6 }, (_, i) =>
      prisma.grade.upsert({
        where: { level: i + 1 },
        update: {},
        create: { level: i + 1 },
      }),
    ),
  )

  /* ===================== CLASS ===================== */
  await Promise.all(
    Array.from({ length: 6 }, (_, i) =>
      prisma.class.upsert({
        where: { name: `${i + 1}A` },
        update: {},
        create: {
          name: `${i + 1}A`,
          gradeId: i + 1,
          capacity: 15 + Math.floor(Math.random() * 6),
        },
      }),
    ),
  )

  /* ===================== SUBJECT ===================== */
  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Art',
  ]

  await Promise.all(
    subjects.map((name) =>
      prisma.subject.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  )

  /* ===================== TEACHER ===================== */
  await Promise.all(
    Array.from({ length: 15 }, (_, i) =>
      prisma.teacher.upsert({
        where: { id: `teacher${i + 1}` },
        update: {},
        create: {
          id: `teacher${i + 1}`,
          username: `teacher${i + 1}`,
          name: `TName${i + 1}`,
          surname: `TSurname${i + 1}`,
          email: `teacher${i + 1}@example.com`,
          phone: `123-456-789${i}`,
          address: `Address${i}`,
          bloodType: 'A+',
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          birthday: new Date(
            new Date().setFullYear(new Date().getFullYear() - 30),
          ),
          subjects: { connect: [{ id: (i % 10) + 1 }] },
          classes: { connect: [{ id: (i % 6) + 1 }] },
        },
      }),
    ),
  )

  /* ===================== PARENT ===================== */
  await Promise.all(
    Array.from({ length: 25 }, (_, i) =>
      prisma.parent.upsert({
        where: { id: `parent${i + 1}` },
        update: {},
        create: {
          id: `parent${i + 1}`,
          username: `parent${i + 1}`,
          name: `PName${i + 1}`,
          surname: `PSurname${i + 1}`,
          email: `parent${i + 1}@example.com`,
          phone: `123-456-789${i}`,
          address: `Address${i}`,
        },
      }),
    ),
  )

  /* ===================== STUDENT ===================== */
  await Promise.all(
    Array.from({ length: 50 }, (_, i) =>
      prisma.student.upsert({
        where: { id: `student${i + 1}` },
        update: {},
        create: {
          id: `student${i + 1}`,
          username: `student${i + 1}`,
          name: `SName${i + 1}`,
          surname: `SSurname${i + 1}`,
          email: `student${i + 1}@example.com`,
          phone: `987-654-321${i}`,
          address: `Address${i}`,
          bloodType: 'O-',
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          parentId: `parent${(i % 25) + 1}`,
          gradeId: (i % 6) + 1,
          classId: (i % 6) + 1,
          birthday: new Date(
            new Date().setFullYear(new Date().getFullYear() - 10),
          ),
        },
      }),
    ),
  )

  /* ===================== LESSON ===================== */
  await Promise.all(
    Array.from({ length: 30 }, (_, i) =>
      prisma.lesson.upsert({
        where: { id: i + 1 },
        update: {},
        create: {
          name: `Lesson${i + 1}`,
          day: Object.values(Day)[i % Object.values(Day).length],
          startTime: new Date(Date.now() + 60 * 60 * 1000),
          endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
          subjectId: (i % 10) + 1,
          classId: (i % 6) + 1,
          teacherId: `teacher${(i % 15) + 1}`,
        },
      }),
    ),
  )

  /* ===================== EVENT ===================== */
  await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.event.create({
        data: {
          title: `Event ${i + 1}`,
          description: `Description ${i + 1}`,
          startTime: new Date(Date.now() + 60 * 60 * 1000),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
          classId: (i % 5) + 1,
        },
      }),
    ),
  )

  /* ===================== ANNOUNCEMENT ===================== */
  await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.announcement.create({
        data: {
          title: `Announcement ${i + 1}`,
          description: `Announcement description ${i + 1}`,
          date: new Date(),
          classId: (i % 5) + 1,
        },
      }),
    ),
  )

  console.log('✅ Database seeded successfully')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
