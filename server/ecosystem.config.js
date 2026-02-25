module.exports = {
  apps: [
    {
      name: 'clockyou',
      script: './app.js',
      cwd: '/opt/clock-you/server',
      instances: 1, // Socket.io requiere configuración especial para cluster
      exec_mode: 'fork', // Fork mode por Socket.io sin configuración de cluster
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '500M', // Apropiado para la carga actual (~97MB)
      error_file: '/var/log/pm2/clockyou-error.log',
      out_file: '/var/log/pm2/clockyou-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      time: true,
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      // Configuraciones adicionales recomendadas
      kill_timeout: 5000,
      listen_timeout: 10000,
      wait_ready: false,
      // Variables de entorno para producción
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
