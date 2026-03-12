module.exports = {
  apps: [
    {
      name: 'edu_mb_slides',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 8900
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8900
      }
    }
  ]
};
