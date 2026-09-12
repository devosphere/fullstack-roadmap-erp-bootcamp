import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from '../src/common/utils/password';
import { PrismaClient } from '../generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run the seed');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main(): Promise<void> {
  const company = await prisma.company.upsert({
    where: { company_code: 'DEMO-ERP' },
    update: {},
    create: {
      company_code: 'DEMO-ERP',
      name: 'Demo ERP Company',
      legal_name: 'Demo ERP Company Inc.',
      email: 'admin@gmail.com',
      country: 'Philippines',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: { description: 'Full access to the ERP application' },
    create: {
      name: 'ADMIN',
      description: 'Full access to the ERP application',
    },
  });

  const passwordHash = await hash('ChangeMe123!');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      company_id: company.id,
      first_name: 'Demo',
      last_name: 'Administrator',
      password_hash: passwordHash,
      status: 'ACTIVE',
    },
    create: {
      company_id: company.id,
      email: 'admin@gmail.com',
      password_hash: passwordHash,
      first_name: 'Demo',
      last_name: 'Administrator',
    },
  });

  await prisma.user_role.upsert({
    where: {
      user_id_role_id: {
        user_id: adminUser.id,
        role_id: adminRole.id,
      },
    },
    update: {},
    create: {
      user_id: adminUser.id,
      role_id: adminRole.id,
    },
  });

  const department = await prisma.department.upsert({
    where: {
      company_id_department_code: {
        company_id: company.id,
        department_code: 'IT',
      },
    },
    update: { name: 'Information Technology' },
    create: {
      company_id: company.id,
      department_code: 'IT',
      name: 'Information Technology',
    },
  });

  const position = await prisma.position.upsert({
    where: {
      company_id_position_code: {
        company_id: company.id,
        position_code: 'SYSADMIN',
      },
    },
    update: { title: 'Systems Administrator' },
    create: {
      company_id: company.id,
      position_code: 'SYSADMIN',
      title: 'Systems Administrator',
    },
  });

  await prisma.employee.upsert({
    where: { user_id: adminUser.id },
    update: {
      department_id: department.id,
      position_id: position.id,
      first_name: 'Demo',
      last_name: 'Administrator',
    },
    create: {
      company_id: company.id,
      employee_number: 'EMP-0001',
      user_id: adminUser.id,
      department_id: department.id,
      position_id: position.id,
      first_name: 'Demo',
      last_name: 'Administrator',
      hire_date: new Date('2026-01-01'),
      employment_type: 'FULL_TIME',
      status: 'REGULAR',
    },
  });

  console.log('Seed completed for Demo ERP Company.');
  console.log('Admin login: admin@gmail.com / ChangeMe123!');
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
