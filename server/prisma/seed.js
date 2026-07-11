import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  // 👇 CHANGE YOUR CREDENTIALS HERE 👇
  const adminPassword = await bcrypt.hash('admin123', 10); // Change 'admin123' to your password
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@college.edu' }, // Change this email
    update: {},
    create: {
      name: 'Admin User', // Change this name
      email: 'admin@college.edu', // Change this email (same as above)
      passwordHash: adminPassword,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create bus routes (Chennai area)
  const route1 = await prisma.busRoute.create({
    data: {
      routeName: 'Route 1 - Tambaram to College',
      startPoint: 'Tambaram',
      endPoint: 'College Campus',
      totalStops: 5,
    },
  });

  const route2 = await prisma.busRoute.create({
    data: {
      routeName: 'Route 2 - Velachery to College',
      startPoint: 'Velachery',
      endPoint: 'College Campus',
      totalStops: 4,
    },
  });

  const route3 = await prisma.busRoute.create({
    data: {
      routeName: 'Route 3 - Adyar to College',
      startPoint: 'Adyar',
      endPoint: 'College Campus',
      totalStops: 3,
    },
  });

  console.log('✅ Routes created');

  // Create boarding points for Route 1 (Tambaram to College)
  const bp1 = await prisma.boardingPoint.create({
    data: {
      name: 'Tambaram Railway Station',
      latitude: 12.9226,
      longitude: 80.1275,
      routeId: route1.id,
    },
  });

  const bp2 = await prisma.boardingPoint.create({
    data: {
      name: 'Chromepet Bus Stop',
      latitude: 12.9516,
      longitude: 80.1462,
      routeId: route1.id,
    },
  });

  const bp3 = await prisma.boardingPoint.create({
    data: {
      name: 'Pallavaram Junction',
      latitude: 12.9675,
      longitude: 80.1491,
      routeId: route1.id,
    },
  });

  const bp4 = await prisma.boardingPoint.create({
    data: {
      name: 'Nanganallur Bus Stand',
      latitude: 12.9850,
      longitude: 80.1850,
      routeId: route1.id,
    },
  });

  const bp5 = await prisma.boardingPoint.create({
    data: {
      name: 'College Main Gate',
      latitude: 13.0067,
      longitude: 80.2206,
      routeId: route1.id,
    },
  });

  // Create boarding points for Route 2 (Velachery to College)
  const bp6 = await prisma.boardingPoint.create({
    data: {
      name: 'Velachery Bus Depot',
      latitude: 12.9756,
      longitude: 80.2169,
      routeId: route2.id,
    },
  });

  const bp7 = await prisma.boardingPoint.create({
    data: {
      name: 'Taramani Link Road',
      latitude: 12.9916,
      longitude: 80.2336,
      routeId: route2.id,
    },
  });

  const bp8 = await prisma.boardingPoint.create({
    data: {
      name: 'Perungudi Signal',
      latitude: 12.9610,
      longitude: 80.2440,
      routeId: route2.id,
    },
  });

  const bp9 = await prisma.boardingPoint.create({
    data: {
      name: 'College Main Gate',
      latitude: 13.0067,
      longitude: 80.2206,
      routeId: route2.id,
    },
  });

  // Create boarding points for Route 3 (Adyar to College)
  const bp10 = await prisma.boardingPoint.create({
    data: {
      name: 'Adyar Bus Terminus',
      latitude: 13.0067,
      longitude: 80.2571,
      routeId: route3.id,
    },
  });

  const bp11 = await prisma.boardingPoint.create({
    data: {
      name: 'Thiruvanmiyur Signal',
      latitude: 12.9833,
      longitude: 80.2611,
      routeId: route3.id,
    },
  });

  const bp12 = await prisma.boardingPoint.create({
    data: {
      name: 'College Main Gate',
      latitude: 13.0067,
      longitude: 80.2206,
      routeId: route3.id,
    },
  });

  console.log('✅ Boarding points created');

  // Create drivers
  const driver1 = await prisma.driver.create({
    data: {
      name: 'Rajesh Kumar',
      phoneNumber: '+91 98765 43210',
      idCardNumber: 'DRV001',
      photoUrl: '/uploads/drivers/default-driver.jpg',
    },
  });

  const driver2 = await prisma.driver.create({
    data: {
      name: 'Suresh Babu',
      phoneNumber: '+91 98765 43211',
      idCardNumber: 'DRV002',
      photoUrl: '/uploads/drivers/default-driver.jpg',
    },
  });

  const driver3 = await prisma.driver.create({
    data: {
      name: 'Murugan S',
      phoneNumber: '+91 98765 43212',
      idCardNumber: 'DRV003',
      photoUrl: '/uploads/drivers/default-driver.jpg',
    },
  });

  const driver4 = await prisma.driver.create({
    data: {
      name: 'Karthik Raj',
      phoneNumber: '+91 98765 43213',
      idCardNumber: 'DRV004',
      photoUrl: '/uploads/drivers/default-driver.jpg',
    },
  });

  console.log('✅ Drivers created');

  // Create buses
  const bus1 = await prisma.bus.create({
    data: {
      busNumber: 'TN-01-AB-1234',
      capacity: 50,
      driverId: driver1.id,
      routeId: route1.id,
    },
  });

  const bus2 = await prisma.bus.create({
    data: {
      busNumber: 'TN-01-AB-5678',
      capacity: 45,
      driverId: driver2.id,
      routeId: route1.id,
    },
  });

  const bus3 = await prisma.bus.create({
    data: {
      busNumber: 'TN-01-CD-9012',
      capacity: 50,
      driverId: driver3.id,
      routeId: route2.id,
    },
  });

  const bus4 = await prisma.bus.create({
    data: {
      busNumber: 'TN-01-EF-3456',
      capacity: 40,
      driverId: driver4.id,
      routeId: route3.id,
    },
  });

  console.log('✅ Buses created');

  // Create schedules for Bus 1 (Route 1)
  await prisma.busSchedule.createMany({
    data: [
      { busId: bus1.id, boardingPointId: bp1.id, arrivalTime: '07:00', departureTime: '07:05' },
      { busId: bus1.id, boardingPointId: bp2.id, arrivalTime: '07:15', departureTime: '07:18' },
      { busId: bus1.id, boardingPointId: bp3.id, arrivalTime: '07:25', departureTime: '07:28' },
      { busId: bus1.id, boardingPointId: bp4.id, arrivalTime: '07:35', departureTime: '07:38' },
      { busId: bus1.id, boardingPointId: bp5.id, arrivalTime: '07:50', departureTime: '07:50' },
    ],
  });

  // Create schedules for Bus 2 (Route 1 - different timing)
  await prisma.busSchedule.createMany({
    data: [
      { busId: bus2.id, boardingPointId: bp1.id, arrivalTime: '07:30', departureTime: '07:35' },
      { busId: bus2.id, boardingPointId: bp2.id, arrivalTime: '07:45', departureTime: '07:48' },
      { busId: bus2.id, boardingPointId: bp3.id, arrivalTime: '07:55', departureTime: '07:58' },
      { busId: bus2.id, boardingPointId: bp4.id, arrivalTime: '08:05', departureTime: '08:08' },
      { busId: bus2.id, boardingPointId: bp5.id, arrivalTime: '08:20', departureTime: '08:20' },
    ],
  });

  // Create schedules for Bus 3 (Route 2)
  await prisma.busSchedule.createMany({
    data: [
      { busId: bus3.id, boardingPointId: bp6.id, arrivalTime: '07:10', departureTime: '07:15' },
      { busId: bus3.id, boardingPointId: bp7.id, arrivalTime: '07:25', departureTime: '07:28' },
      { busId: bus3.id, boardingPointId: bp8.id, arrivalTime: '07:35', departureTime: '07:38' },
      { busId: bus3.id, boardingPointId: bp9.id, arrivalTime: '07:50', departureTime: '07:50' },
    ],
  });

  // Create schedules for Bus 4 (Route 3)
  await prisma.busSchedule.createMany({
    data: [
      { busId: bus4.id, boardingPointId: bp10.id, arrivalTime: '07:20', departureTime: '07:25' },
      { busId: bus4.id, boardingPointId: bp11.id, arrivalTime: '07:35', departureTime: '07:38' },
      { busId: bus4.id, boardingPointId: bp12.id, arrivalTime: '07:50', departureTime: '07:50' },
    ],
  });

  console.log('✅ Schedules created');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
