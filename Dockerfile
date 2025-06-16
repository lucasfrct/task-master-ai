# Use uma imagem base Node.js
FROM node:20-alpine

# Instalar dependências necessárias
RUN apk add --no-cache \
    curl \
    git \
    python3 \
    make \
    g++

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo .env para o diretório de trabalho
COPY .env ./

# Copie os arquivos de dependência e instale-os
COPY package*.json ./
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Garanta que os scripts sejam executáveis
RUN chmod +x bin/task-master.js mcp-server/server.js

# Exponha a porta padrão do servidor MCP (8000)
EXPOSE 8001

# Configurar variáveis de ambiente
ENV NODE_ENV=development
ENV LOG_LEVEL=debug
ENV MCP_PORT=8000
ENV HTTP_PORT=8001

# Comando para iniciar o servidor MCP
ENTRYPOINT ["node", "mcp-server/server.js", " --port=8005"] 