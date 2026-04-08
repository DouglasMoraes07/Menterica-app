# 🔒 Guia de Segurança e Manutenção para o MenteRica em VPS

Este guia detalha as melhores práticas de segurança e manutenção para garantir que seu site MenteRica, hospedado em seu próprio VPS, permaneça seguro, atualizado e funcionando sem problemas. Ter controle total significa também ter total responsabilidade pela segurança e manutenção.

## 1. Segurança Inicial do Servidor (VPS)

### 1.1. Acesso SSH com Chaves (Recomendado)

Em vez de usar senhas para acessar seu servidor via SSH, utilize chaves SSH. Isso é significativamente mais seguro e evita ataques de força bruta.

*   **Gerar Chave SSH**: No seu computador local, execute `ssh-keygen -t rsa -b 4096`. Siga as instruções para criar a chave.
*   **Copiar Chave Pública para o VPS**: Use `ssh-copy-id usuario@seu_ip_do_vps` para copiar sua chave pública para o servidor. Se não funcionar, copie manualmente para `~/.ssh/authorized_keys` no VPS.
*   **Desabilitar Autenticação por Senha**: Edite o arquivo `/etc/ssh/sshd_config` no seu VPS e defina `PasswordAuthentication no`. Reinicie o serviço SSH com `sudo systemctl restart sshd`.

### 1.2. Configurar Firewall (UFW)

Um firewall é essencial para controlar o tráfego de rede, permitindo apenas as conexões necessárias.

*   **Instalar UFW**: `sudo apt install ufw`
*   **Permitir SSH**: `sudo ufw allow ssh` (ou a porta SSH personalizada, se alterou)
*   **Permitir HTTP/HTTPS**: `sudo ufw allow http` e `sudo ufw allow https`
*   **Habilitar UFW**: `sudo ufw enable`
*   **Verificar Status**: `sudo ufw status`

### 1.3. Atualizações Regulares do Sistema

Mantenha seu sistema operacional atualizado para corrigir vulnerabilidades de segurança.

*   **Atualizar Pacotes**: `sudo apt update && sudo apt upgrade -y`
*   **Reiniciar (se necessário)**: Após grandes atualizações do kernel, um reboot pode ser necessário: `sudo reboot`

## 2. Segurança da Aplicação

### 2.1. Variáveis de Ambiente (`.env`)

Nunca exponha informações sensíveis (chaves de API, senhas de banco de dados) diretamente no código. Use variáveis de ambiente.

*   O arquivo `.env` deve ser ignorado pelo controle de versão (`.gitignore`).
*   No servidor, crie o arquivo `.env` no diretório do projeto e preencha com as credenciais reais.
*   Certifique-se de que o `.env` tenha permissões restritas (ex: `chmod 600 .env`).

### 2.2. Senhas Fortes e Gerenciamento de Segredos

*   Use senhas complexas e únicas para o banco de dados, usuários do sistema e qualquer serviço externo.
*   Considere um gerenciador de senhas para suas credenciais.
*   Para segredos mais críticos, como chaves de API, explore soluções como HashiCorp Vault ou AWS Secrets Manager (se estiver usando AWS).

### 2.3. Dependências da Aplicação

Mantenha as bibliotecas e frameworks do seu projeto atualizados para evitar vulnerabilidades conhecidas.

*   **Auditoria de Segurança**: Use `pnpm audit` (ou `npm audit`) regularmente para verificar vulnerabilidades nas dependências.
*   **Atualizar Dependências**: `pnpm update` para atualizar para versões compatíveis ou `pnpm outdated` para ver o que pode ser atualizado.

## 3. Backup e Recuperação

Implemente uma estratégia de backup robusta para o banco de dados e os arquivos da aplicação.

### 3.1. Backup do Banco de Dados (MySQL)

*   **Backup Manual**: `mysqldump -u seu_usuario -p seu_banco_de_dados > backup.sql`
*   **Backup Automatizado**: Crie um script shell para executar o `mysqldump` e agende-o com `cron` para rodar diariamente ou semanalmente. Envie os backups para um armazenamento externo (S3, Google Drive, etc.).

### 3.2. Backup dos Arquivos da Aplicação

*   Seu repositório Git já serve como backup do código-fonte. Certifique-se de fazer `git push` regularmente.
*   Para arquivos gerados (uploads de usuários, logs), configure um backup para um serviço de armazenamento em nuvem (S3, R2).

## 4. Monitoramento

Monitore a saúde e o desempenho do seu servidor e aplicação.

*   **Logs da Aplicação**: O PM2 já configura logs (`/var/log/menterica/out.log`, `/var/log/menterica/error.log`). Monitore-os para erros.
*   **Monitoramento de Recursos do VPS**: Use ferramentas como `htop`, `top`, `free -h` para verificar CPU, memória e disco. Provedores de VPS geralmente oferecem painéis de monitoramento.
*   **Alertas**: Configure alertas para quando o uso de CPU/memória estiver alto, ou quando a aplicação cair.

## 5. Manutenção Contínua

### 5.1. Atualizações de Software

*   Periodicamente, repita o processo de `sudo apt update && sudo apt upgrade -y` e atualize as dependências do projeto (`pnpm update`).

### 5.2. Gerenciamento de Logs

*   Os logs podem consumir muito espaço em disco. Configure a rotação de logs (ex: com `logrotate`) para arquivar e remover logs antigos automaticamente.

## 6. Boas Práticas de Desenvolvimento

*   **Validação de Entrada**: Sempre valide e sanitize todas as entradas do usuário para prevenir ataques como XSS e SQL Injection.
*   **Tratamento de Erros**: Implemente um tratamento de erros robusto para evitar que informações sensíveis vazem em mensagens de erro.
*   **HTTPS Obrigatório**: O Certbot já configura HTTPS, mas certifique-se de que sua aplicação redirecione todo o tráfego HTTP para HTTPS.

Ao seguir estas diretrizes, você terá um ambiente mais seguro e estável para o seu projeto MenteRica, com total controle sobre cada aspecto da sua infraestrutura. Lembre-se que a segurança é um processo contínuo, não um evento único.
