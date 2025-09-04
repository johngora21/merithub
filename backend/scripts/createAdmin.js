/* Seed an admin user */
const { sequelize } = require('../config/database');
const User = require('../src/models/User');

async function main() {
  try {
    await sequelize.authenticate();

    const email = 'johnjohngora@gmail.com';
    const password = '99009900';

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        email,
        password_hash: password,
        first_name: 'John',
        last_name: 'Gora',
        is_verified: true,
        is_active: true,
        is_admin: true,
        subscription_type: 'enterprise'
      });
      console.log('Admin user created:', user.email);
    } else {
      // Update password and admin flags
      user.password_hash = password;
      user.is_admin = true;
      user.is_active = true;
      user.is_verified = true;
      user.subscription_type = 'enterprise';
      await user.save();
      console.log('Admin user updated:', user.email);
    }
  } catch (err) {
    console.error('Failed to create/update admin user:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();


