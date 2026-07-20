const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  const env = {};

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }

  const envVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MEASUREMENT_ID'
  ];

  envVars.forEach(key => {
    if (process.env[key]) {
      env[key] = process.env[key];
    }
  });

  return env;
}

function replaceInFile(filePath, env) {
  let content = fs.readFileSync(filePath, 'utf8');

  Object.keys(env).forEach(key => {
    const regex = new RegExp(`'${key}'`, 'g');
    content = content.replace(regex, `'${env[key]}'`);
  });

  fs.writeFileSync(filePath, content);
  console.log(`✓ Updated ${filePath}`);
}

const env = loadEnv();
const envFiles = [
  'src/environments/environment.ts',
  'src/environments/environment.prod.ts'
];

envFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    replaceInFile(filePath, env);
  }
});
