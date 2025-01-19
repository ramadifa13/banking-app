const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  
  const hashedPassword = await bcrypt.hash('admin', 10);

  
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword, 
      role: 'admin',
      email: 'admin@example.com',
      customer: {
        create: {
          name: 'Admin User',
          cifNumber: '123456789',
          address: '123 Admin Street',
          dob: new Date('1990-01-01'),
          email: 'admin@example.com',
          phoneNumber: '123-456-7890',
        }
      }
    }
  });

  console.log('Admin user created:', adminUser);
}

main()
  .catch(e => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
