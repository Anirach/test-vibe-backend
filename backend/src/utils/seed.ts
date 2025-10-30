import prisma from './prisma';

const DEFAULT_USER_ID = 'default-user';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create default user if not exists
    const existingUser = await prisma.user.findUnique({
      where: { id: DEFAULT_USER_ID },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: DEFAULT_USER_ID,
          email: 'user@example.com',
          password: 'hashed_password', // Not used in this app
          name: 'Default User',
        },
      });
      console.log('✅ Default user created');
    } else {
      console.log('ℹ️  Default user already exists');
    }

    // Create sample transactions
    const transactionCount = await prisma.transaction.count({
      where: { userId: DEFAULT_USER_ID },
    });

    if (transactionCount === 0) {
      const sampleTransactions = [
        {
          userId: DEFAULT_USER_ID,
          type: 'income',
          amount: 5000,
          category: 'Salary',
          description: 'Monthly salary',
          date: new Date('2024-10-01'),
        },
        {
          userId: DEFAULT_USER_ID,
          type: 'expense',
          amount: 150,
          category: 'Food',
          description: 'Groceries',
          date: new Date('2024-10-05'),
        },
        {
          userId: DEFAULT_USER_ID,
          type: 'expense',
          amount: 50,
          category: 'Entertainment',
          description: 'Movie tickets',
          date: new Date('2024-10-10'),
        },
        {
          userId: DEFAULT_USER_ID,
          type: 'expense',
          amount: 1200,
          category: 'Bills',
          description: 'Rent payment',
          date: new Date('2024-10-01'),
        },
        {
          userId: DEFAULT_USER_ID,
          type: 'income',
          amount: 500,
          category: 'Freelance',
          description: 'Web design project',
          date: new Date('2024-10-15'),
        },
        {
          userId: DEFAULT_USER_ID,
          type: 'expense',
          amount: 80,
          category: 'Travel',
          description: 'Gas',
          date: new Date('2024-10-12'),
        },
        {
          userId: DEFAULT_USER_ID,
          type: 'expense',
          amount: 200,
          category: 'Shopping',
          description: 'Clothes',
          date: new Date('2024-10-20'),
        },
        {
          userId: DEFAULT_USER_ID,
          type: 'expense',
          amount: 100,
          category: 'Healthcare',
          description: 'Doctor visit',
          date: new Date('2024-10-18'),
        },
      ];

      await prisma.transaction.createMany({
        data: sampleTransactions,
      });

      console.log(`✅ Created ${sampleTransactions.length} sample transactions`);
    } else {
      console.log(`ℹ️  Database already has ${transactionCount} transactions`);
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
