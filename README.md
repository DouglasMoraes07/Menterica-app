# MenteRica - Código Completo para Hospedagem Externa

Este pacote contém todos os arquivos necessários para hospedar o projeto **MenteRica** em um servidor próprio (VPS), sem dependência do Manus.

## 🚀 Estrutura do Projeto

- **`.env.example`**: Modelo das variáveis de ambiente necessárias.
- **`server/`**: Código do servidor Express + tRPC.
- **`client/`**: Código do frontend React + Tailwind.
- **`shared/`**: Código compartilhado entre cliente e servidor.
- **`migrations/`**: Script SQL para atualizar seu banco de dados MySQL.
- **`deployment_guide.md`**: Guia passo a passo para configurar Nginx e PM2.

## ✅ Checklist de Configuração

1. **Servidor (VPS)**: Recomenda-se Ubuntu 22.04+ com Node.js 22+ e pnpm.
2. **Banco de Dados**: MySQL 8.0+. Execute o script em `migrations/add_password_hash.sql`.
3. **Variáveis de Ambiente**: Copie `.env.example` para `.env` e preencha com suas chaves:
   - OpenAI API Key
   - AWS S3 (ou Cloudflare R2) para armazenamento de arquivos
   - Stripe/Hotmart para pagamentos
4. **Instalação**:
   ```bash
   pnpm install
   pnpm build
   ```
5. **Execução**: Use o PM2 conforme descrito no `deployment_guide.md`.

## 🛠 Tecnologias Utilizadas

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Express 4 + tRPC 11
- **ORM**: Drizzle ORM + MySQL
- **IA**: OpenAI GPT-4o
- **Autenticação**: JWT Próprio + bcryptjs
- **Storage**: AWS S3 SDK
