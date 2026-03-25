require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('./models/Role');
const User = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // ─── Xoá dữ liệu cũ ──────────────────────────────────────────────────────
    await User.deleteMany({});
    await Role.deleteMany({});
    console.log('🗑️  Đã xoá dữ liệu cũ');

    // ─── Tạo Roles ────────────────────────────────────────────────────────────
    const roles = await Role.insertMany([
      { name: 'Admin', description: 'Quản trị viên hệ thống' },
      { name: 'Manager', description: 'Quản lý' },
      { name: 'User', description: 'Người dùng thông thường' },
      { name: 'Moderator', description: 'Kiểm duyệt viên' },
    ]);

    const [adminRole, managerRole, userRole, modRole] = roles;
    console.log('✅ Đã tạo 4 Roles:', roles.map(r => r.name).join(', '));

    // ─── Tạo Users ────────────────────────────────────────────────────────────
    await User.insertMany([
      {
        username: 'admin01',
        password: 'Admin@123',
        email: 'admin01@example.com',
        fullName: 'Nguyễn Quản Trị',
        status: true,
        role: adminRole._id,
        loginCount: 120,
      },
      {
        username: 'admin02',
        password: 'Admin@456',
        email: 'admin02@example.com',
        fullName: 'Trần Văn Admin',
        status: true,
        role: adminRole._id,
        loginCount: 85,
      },
      {
        username: 'manager01',
        password: 'Manager@123',
        email: 'manager01@example.com',
        fullName: 'Lê Thị Quản Lý',
        status: true,
        role: managerRole._id,
        loginCount: 60,
      },
      {
        username: 'manager02',
        password: 'Manager@456',
        email: 'manager02@example.com',
        fullName: 'Phạm Quản Lý',
        status: false,
        role: managerRole._id,
        loginCount: 12,
      },
      {
        username: 'nguyenvana',
        password: 'User@123',
        email: 'nguyenvana@example.com',
        fullName: 'Nguyễn Văn A',
        status: true,
        role: userRole._id,
        loginCount: 45,
      },
      {
        username: 'tranthib',
        password: 'User@456',
        email: 'tranthib@example.com',
        fullName: 'Trần Thị B',
        status: false,
        role: userRole._id,
        loginCount: 7,
      },
      {
        username: 'hoangvanc',
        password: 'User@789',
        email: 'hoangvanc@example.com',
        fullName: 'Hoàng Văn C',
        status: true,
        role: userRole._id,
        loginCount: 33,
      },
      {
        username: 'phamthid',
        password: 'User@000',
        email: 'phamthid@example.com',
        fullName: 'Phạm Thị D',
        status: false,
        role: userRole._id,
        loginCount: 0,
      },
      {
        username: 'moderator01',
        password: 'Mod@123',
        email: 'moderator01@example.com',
        fullName: 'Vũ Kiểm Duyệt',
        status: true,
        role: modRole._id,
        loginCount: 28,
      },
      {
        username: 'usertest',
        password: 'Test@123',
        email: 'usertest@example.com',
        fullName: 'Tài Khoản Test',
        status: false,
        role: userRole._id,
        loginCount: 0,
      },
    ]);

    console.log('✅ Đã tạo 10 Users');

    // ─── In kết quả ──────────────────────────────────────────────────────────
    console.log('\n══════════════════════════════════════════════');
    console.log('📋  DANH SÁCH DỮ LIỆU ĐÃ SEED');
    console.log('══════════════════════════════════════════════');

    const allRoles = await Role.find();
    console.log('\n🔷 ROLES:');
    allRoles.forEach(r => {
      console.log(`   ID: ${r._id}  |  Name: ${r.name}  |  Desc: ${r.description}`);
    });

    const allUsers = await User.find().populate('role', 'name');
    console.log('\n🔷 USERS:');
    allUsers.forEach(u => {
      console.log(
        `   ID: ${u._id}\n` +
        `   username: ${u.username} | email: ${u.email}\n` +
        `   fullName: ${u.fullName} | status: ${u.status} | loginCount: ${u.loginCount}\n` +
        `   role: ${u.role?.name}\n`
      );
    });

    console.log('══════════════════════════════════════════════');
    console.log('🎉 Seed data hoàn thành!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi seed data:', error.message);
    process.exit(1);
  }
};

seedData();
