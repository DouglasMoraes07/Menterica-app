# Guia de Hospedagem Externa - MenteRica

Este guia contém as configurações necessárias para rodar o MenteRica em um VPS próprio.

## 1. Configuração do Nginx (Reverse Proxy)

Crie um arquivo em `/etc/nginx/sites-available/menterica`:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 2. Configuração do PM2 (`ecosystem.config.json`)

```json
{
  "apps": [
    {
      "name": "menterica",
      "script": "dist/index.js",
      "instances": 1,
      "exec_mode": "fork",
      "env": {
        "NODE_ENV": "production",
        "PORT": "3000"
      },
      "error_file": "logs/error.log",
      "out_file": "logs/out.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss"
    }
  ]
}
```

## 3. Script de Deploy (`deploy.sh`)

```bash
#!/bin/bash
# 1. Atualizar código
git pull origin main

# 2. Instalar dependências
pnpm install

# 3. Build
pnpm build

# 4. Reiniciar servidor
pm2 restart menterica || pm2 start ecosystem.config.json
echo "Deploy completo!"
```

## 4. Comandos de Setup Inicial no VPS

```bash
# Instalar Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm e PM2
npm install -g pnpm pm2

# Instalar MySQL
sudo apt install mysql-server -y

# Criar Banco de Dados
sudo mysql -e "CREATE DATABASE menterica CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```
