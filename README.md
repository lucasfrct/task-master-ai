# Task Master Ai


Um sistema de gerenciamento de tarefas para desenvolvimento orientado por IA.

## Documentação

Para informações mais detalhadas, consulte a documentação no diretório `docs`:

- [Guia de Configuração](docs/configuration.md) - Configure variáveis de ambiente e personalize o Task Master
- [Tutorial](docs/tutorial.md) - Guia passo a passo para começar com o Task Master
- [Referência de Comandos](docs/command-reference.md) - Lista completa de todos os comandos disponíveis
- [Estrutura de Tarefas](docs/task-structure.md) - Entendendo o formato e recursos das tarefas
- [Exemplos de Interações](docs/examples.md) - Exemplos comuns de interações com o Cursor AI
- [Guia de Migração](docs/migration-guide.md) - Guia para migrar para a nova estrutura do projeto

##### Instalação Rápida para Cursor 1.0+ (Um Clique)

> **Nota:** Após clicar no botão de instalação, você ainda precisará adicionar suas chaves de API à configuração. O botão instala o servidor MCP com chaves temporárias que você precisará substituir por suas chaves de API reais.

## Requisitos

O Taskmaster utiliza IA em vários comandos, e esses requerem uma chave de API separada. Você pode usar uma variedade de modelos de diferentes provedores de IA, desde que adicione suas chaves de API. Por exemplo, se você quiser usar o Claude 3.7, precisará de uma chave de API da Anthropic.

Você pode definir 3 tipos de modelos para serem usados: o modelo principal, o modelo de pesquisa e o modelo de fallback (caso o principal ou o de pesquisa falhem). Qualquer modelo que você use, a chave de API do seu provedor deve estar presente em mcp.json ou .env.

Pelo menos uma (1) das seguintes é necessária:

- Chave de API da Anthropic (API Claude)
- Chave de API da OpenAI
- Chave de API do Google Gemini
- Chave de API da Perplexity (para modelo de pesquisa)
- Chave de API da xAI (para modelo de pesquisa ou principal)
- Chave de API do OpenRouter (para modelo de pesquisa ou principal)

Usar o modelo de pesquisa é opcional, mas altamente recomendado. Você precisará de pelo menos UMA chave de API. Adicionar todas as chaves de API permite que você mude perfeitamente entre provedores de modelos quando desejar.

## Início Rápido

### Opção 1: MCP (Recomendado)

MCP (Model Control Protocol) permite que você execute o Task Master diretamente do seu editor.

#### 1. Adicione sua configuração MCP no seguinte caminho, dependendo do seu editor

| Editor       | Escopo  | Caminho Linux/macOS                    | Caminho Windows                                    | Chave        |
| ------------ | ------- | ------------------------------------- | ------------------------------------------------- | ------------ |
| **Cursor**   | Global  | `~/.cursor/mcp.json`                  | `%USERPROFILE%\.cursor\mcp.json`                  | `mcpServers` |
|              | Projeto | `<pasta_projeto>/.cursor/mcp.json`    | `<pasta_projeto>\.cursor\mcp.json`                | `mcpServers` |
| **Windsurf** | Global  | `~/.codeium/windsurf/mcp_config.json` | `%USERPROFILE%\.codeium\windsurf\mcp_config.json` | `mcpServers` |
| **VS Code**  | Projeto | `<pasta_projeto>/.vscode/mcp.json`    | `<pasta_projeto>\.vscode\mcp.json`                | `servers`    |

##### Configuração Manual

###### Cursor & Windsurf (`mcpServers`)

```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "SUA_CHAVE_API_ANTHROPIC_AQUI",
        "PERPLEXITY_API_KEY": "SUA_CHAVE_API_PERPLEXITY_AQUI",
        "OPENAI_API_KEY": "SUA_CHAVE_OPENAI_AQUI",
        "GOOGLE_API_KEY": "SUA_CHAVE_GOOGLE_AQUI",
        "MISTRAL_API_KEY": "SUA_CHAVE_MISTRAL_AQUI",
        "OPENROUTER_API_KEY": "SUA_CHAVE_OPENROUTER_AQUI",
        "XAI_API_KEY": "SUA_CHAVE_XAI_AQUI",
        "AZURE_OPENAI_API_KEY": "SUA_CHAVE_AZURE_AQUI",
        "OLLAMA_API_KEY": "SUA_CHAVE_OLLAMA_AQUI"
      }
    }
  }
}
```

> 🔑 Substitua `SUA_…_CHAVE_AQUI` por suas chaves de API reais. Você pode remover as chaves que não usa.

###### VS Code (`servers` + `type`)

```json
{
  "servers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "SUA_CHAVE_API_ANTHROPIC_AQUI",
        "PERPLEXITY_API_KEY": "SUA_CHAVE_API_PERPLEXITY_AQUI",
        "OPENAI_API_KEY": "SUA_CHAVE_OPENAI_AQUI",
        "GOOGLE_API_KEY": "SUA_CHAVE_GOOGLE_AQUI",
        "MISTRAL_API_KEY": "SUA_CHAVE_MISTRAL_AQUI",
        "OPENROUTER_API_KEY": "SUA_CHAVE_OPENROUTER_AQUI",
        "XAI_API_KEY": "SUA_CHAVE_XAI_AQUI",
        "AZURE_OPENAI_API_KEY": "SUA_CHAVE_AZURE_AQUI"
      },
      "type": "stdio"
    }
  }
}
```

> 🔑 Substitua `SUA_…_CHAVE_AQUI` por suas chaves de API reais. Você pode remover as chaves que não usa.

#### 2. (Apenas Cursor) Ative o Taskmaster MCP

Abra as Configurações do Cursor (Ctrl+Shift+J) ➡ Clique na aba MCP à esquerda ➡ Ative o task-master-ai com o toggle

#### 3. (Opcional) Configure os modelos que você deseja usar

No painel de chat de IA do seu editor, diga:

```txt
Altere os modelos principal, de pesquisa e de fallback para <nome_do_modelo>, <nome_do_modelo> e <nome_do_modelo> respectivamente.
```

[Tabela de modelos disponíveis](docs/models.md)

#### 4. Inicialize o Task Master

No painel de chat de IA do seu editor, diga:

```txt
Inicialize o taskmaster-ai no meu projeto
```

#### 5. Certifique-se de ter um PRD (Recomendado)

Para **novos projetos**: Crie seu PRD em `.taskmaster/docs/prd.txt`  
Para **projetos existentes**: Você pode usar `scripts/prd.txt` ou migrar com `task-master migrate`

Um modelo de exemplo de PRD está disponível após a inicialização em `.taskmaster/templates/example_prd.txt`.

> [!NOTE]
> Embora um PRD seja recomendado para projetos complexos, você sempre pode criar tarefas individuais perguntando "Você pode me ajudar a implementar [descrição do que você quer fazer]?" no chat.

**Sempre comece com um PRD detalhado.**

Quanto mais detalhado for seu PRD, melhores serão as tarefas geradas.

#### 6. Comandos Comuns

Use seu assistente de IA para:

- Analisar requisitos: `Você pode analisar meu PRD em scripts/prd.txt?`
- Planejar próximo passo: `Qual é a próxima tarefa que devo trabalhar?`
- Implementar uma tarefa: `Você pode me ajudar a implementar a tarefa 3?`
- Expandir uma tarefa: `Você pode me ajudar a expandir a tarefa 4?`

[Mais exemplos de como usar o Task Master no chat](docs/examples.md)

### Opção 2: Usando Linha de Comando

#### Instalação

```bash
# Instalar globalmente
npm install -g task-master-ai

# OU instalar localmente dentro do seu projeto
npm install task-master-ai
```

#### Inicializar um novo projeto

```bash
# Se instalado globalmente
task-master init

# Se instalado localmente
npx task-master init
```

Isso solicitará detalhes do projeto e configurará um novo projeto com os arquivos e estrutura necessários.

#### Comandos Comuns

```bash
# Inicializar um novo projeto
task-master init

# Analisar um PRD e gerar tarefas
task-master parse-prd seu-prd.txt

# Listar todas as tarefas
task-master list

# Mostrar a próxima tarefa para trabalhar
task-master next

# Gerar arquivos de tarefas
task-master generate
```

## Solução de Problemas

### Se `task-master init` não responder

Tente executá-lo diretamente com Node:

```bash
node node_modules/claude-task-master/scripts/init.js
```
