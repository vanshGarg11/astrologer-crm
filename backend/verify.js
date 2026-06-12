const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

async function verify() {
  console.log('\n🔍 Astrologer CRM - Setup Verification\n');
  
  const checks = [];

  // Check environment variables
  console.log('📋 Environment Variables:');
  const requiredVars = ['MONGO_URI'];
  const optionalVars = ['PORT', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'CORS_ORIGIN', 'RATE_LIMIT_MAX', 'AUTH_RATE_LIMIT_MAX'];
  
  let envOk = true;
  for (const v of requiredVars) {
    const val = process.env[v];
    if (!val) {
      console.log(`  ❌ ${v}: MISSING (required)`);
      envOk = false;
    } else if (val.includes('<') || val.includes('>')) {
      console.log(`  ⚠️  ${v}: Contains placeholder (e.g. <username>)`);
      envOk = false;
    } else {
      console.log(`  ✅ ${v}: Set`);
    }
  }

  for (const v of optionalVars) {
    const val = process.env[v];
    console.log(`  ${val ? '✅' : '⏭️ '} ${v}: ${val ? 'Set' : 'Using default'}`);
  }

  checks.push({ name: 'Environment', ok: envOk });

  // Check MongoDB connection
  console.log('\n🗄️  MongoDB Connection:');
  try {
    const uri = process.env.MONGO_URI;
    if (uri && !uri.includes('<')) {
      await mongoose.connect(uri, { connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 });
      console.log(`  ✅ Connected to MongoDB`);
      console.log(`  ✅ Host: ${mongoose.connection.host}`);
      console.log(`  ✅ Database: ${mongoose.connection.name}`);
      await mongoose.disconnect();
      checks.push({ name: 'MongoDB', ok: true });
    } else {
      console.log('  ⏭️  Skipped (MONGO_URI not configured)');
      checks.push({ name: 'MongoDB', ok: false });
    }
  } catch (error) {
    console.log(`  ❌ Connection failed: ${error.message}`);
    checks.push({ name: 'MongoDB', ok: false });
  }

  // Check Node version
  console.log('\n⚙️  Node.js:');
  const nodeVersion = process.version;
  console.log(`  ${nodeVersion}`);
  const isValidVersion = parseInt(nodeVersion.split('.')[0].slice(1)) >= 16;
  console.log(`  ${isValidVersion ? '✅' : '⚠️ '} Node 16+ ${isValidVersion ? 'OK' : 'recommended'}`);
  checks.push({ name: 'Node.js', ok: isValidVersion });

  // Check installed dependencies
  console.log('\n📦 Dependencies:');
  const deps = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs', 'cors'];
  let depsOk = true;
  for (const dep of deps) {
    try {
      require(dep);
      console.log(`  ✅ ${dep}`);
    } catch (e) {
      console.log(`  ❌ ${dep} (missing - run: npm install)`);
      depsOk = false;
    }
  }
  checks.push({ name: 'Dependencies', ok: depsOk });

  // Summary
  console.log('\n📊 Summary:');
  const passed = checks.filter((c) => c.ok).length;
  console.log(`  ${passed}/${checks.length} checks passed\n`);

  if (passed === checks.length) {
    console.log('✅ All checks passed! Run: npm run dev\n');
  } else {
    console.log('⚠️  Please fix the issues above before running the server.\n');
    console.log('Common fixes:');
    console.log('  • MongoDB: Update MONGO_URI in .env with your connection string');
    console.log('  • Dependencies: Run: npm install');
    console.log('  • Node: Update to Node 16 or later\n');
  }
}

verify().catch(console.error);
