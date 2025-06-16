# Task Master

### por [@eyaltoledano](https://x.com/eyaltoledano)

Um sistema de gerenciamento de tarefas para desenvolvimento orientado por IA com Claude, projetado para funcionar perfeitamente com o Cursor AI.

## Requisitos

- Node.js 14.0.0 ou superior
- Chave de API da Anthropic (API Claude)
- Anthropic SDK versão 0.39.0 ou superior
- OpenAI SDK (para integração com a API Perplexity, opcional)

## Configuração

O Taskmaster utiliza dois métodos principais de configuração:

1.  **Arquivo `.taskmasterconfig` (Raiz do Projeto)**

    - Armazena a maioria das configurações: seleções de modelos de IA (principal, pesquisa, fallback), parâmetros (tokens máximos, temperatura), nível de log, prioridade/subtarefas padrão, nome do projeto.
    - **Criado e gerenciado usando o comando CLI `task-master models --setup` ou a ferramenta MCP `models`.**
    - Não edite manualmente, a menos que saiba o que está fazendo.

2.  **Variáveis de Ambiente (arquivo `.env` ou bloco `env` do MCP)**
    - Usado **apenas** para **Chaves de API** sensíveis (por exemplo, `ANTHROPIC_API_KEY`, `PERPLEXITY_API_KEY`, etc.) e endpoints específicos (como `OLLAMA_BASE_URL`).
    - **Para CLI:** Coloque as chaves em um arquivo `.env` na raiz do seu projeto.
    - **Para MCP/Cursor:** Coloque as chaves na seção `env` do seu arquivo `.cursor/mcp.json` (ou outra configuração MCP de acordo com a IDE ou cliente AI que você usa) sob a definição do servidor `taskmaster-ai`.

**Importante:** Configurações como escolhas de modelo, tokens máximos, temperatura e nível de log **não são mais configuradas via variáveis de ambiente.** Use o comando ou ferramenta `task-master models`.

Consulte o [Guia de Configuração](docs/configuration.md) para detalhes completos.

## Instalação

```bash
# Instalar globalmente
npm install -g task-master-ai

# OU instalar localmente dentro do seu projeto
npm install task-master-ai
```

### Inicializar um novo projeto

```bash
# Se instalado globalmente
task-master init

# Se instalado localmente
npx task-master init
```

Isso solicitará detalhes do projeto e configurará um novo projeto com os arquivos e estrutura necessários.

### Notas Importantes

1. **Configuração de Módulos ES:**

   - Este projeto usa Módulos ES (ESM) em vez de CommonJS.
   - Isso é definido via `"type": "module"` no seu package.json.
   - Use a sintaxe `import/export` em vez de `require()`.
   - Os arquivos devem usar extensões `.js` ou `.mjs`.
   - Para usar um módulo CommonJS, ou:
     - Renomeie-o com a extensão `.cjs`
     - Use `await import()` para importações dinâmicas
   - Se você precisar de CommonJS em todo o seu projeto, remova `"type": "module"` do package.json, mas os scripts do Task Master esperam ESM.

2. A versão do Anthropic SDK deve ser 0.39.0 ou superior.

## Início Rápido com Comandos Globais

Após instalar o pacote globalmente, você pode usar esses comandos CLI de qualquer diretório:

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

### Se `task-master init` não responder:

Tente executá-lo diretamente com Node:

```bash
node node_modules/claude-task-master/scripts/init.js
```

Ou clone o repositório e execute:

```bash
git clone https://github.com/eyaltoledano/claude-task-master.git
cd claude-task-master
node scripts/init.js
```

## Estrutura da Tarefa

As tarefas em tasks.json têm a seguinte estrutura:

- `id`: Identificador único para a tarefa (Exemplo: `1`)
- `title`: Título breve e descritivo da tarefa (Exemplo: `"Inicializar Repositório"`)
- `description`: Descrição concisa do que a tarefa envolve (Exemplo: `"Criar um novo repositório, configurar a estrutura inicial."`)
- `status`: Estado atual da tarefa (Exemplo: `"pending"`, `"done"`, `"deferred"`)
- `dependencies`: IDs de tarefas que devem ser concluídas antes desta tarefa (Exemplo: `[1, 2]`)
  - As dependências são exibidas com indicadores de status (✅ para concluídas, ⏱️ para pendentes)
  - Isso ajuda a identificar rapidamente quais tarefas pré-requisitos estão bloqueando o trabalho
- `priority`: Nível de importância da tarefa (Exemplo: `"high"`, `"medium"`, `"low"`)
- `details`: Instruções de implementação detalhadas (Exemplo: `"Usar ID/segredo do cliente GitHub, manipular callback, definir token de sessão."`)
- `testStrategy`: Abordagem de verificação (Exemplo: `"Implantar e chamar endpoint para confirmar resposta 'Hello World'."`)
- `subtasks`: Lista de tarefas menores e mais específicas que compõem a tarefa principal (Exemplo: `[{"id": 1, "title": "Configurar OAuth", ...}]`)

## Integrando com Cursor AI

Claude Task Master é projetado para funcionar perfeitamente com [Cursor AI](https://www.cursor.so/), fornecendo um fluxo de trabalho estruturado para desenvolvimento orientado por IA.

### Configuração com Cursor

1. Após inicializar seu projeto, abra-o no Cursor
2. O arquivo `.cursor/rules/dev_workflow.mdc` é automaticamente carregado pelo Cursor, fornecendo ao AI conhecimento sobre o sistema de gerenciamento de tarefas
3. Coloque seu documento PRD no diretório `scripts/` (ex: `scripts/prd.txt`)
4. Abra o chat AI do Cursor e mude para o modo Agente

### Configurando o MCP no Cursor

Para habilitar recursos aprimorados de gerenciamento de tarefas diretamente no Cursor usando o Protocolo de Controle de Modelo (MCP):

1. Vá para as configurações do Cursor
2. Navegue até a seção MCP
3. Clique em "Adicionar Novo Servidor MCP"
4. Configure com os seguintes detalhes:
   - Nome: "Task Master"
   - Tipo: "Comando"
   - Comando: "npx -y task-master-ai"
5. Salve as configurações

Uma vez configurado, você pode interagir com os comandos de gerenciamento de tarefas do Task Master diretamente através da interface do Cursor, proporcionando uma experiência mais integrada.

### Geração Inicial de Tarefas

No chat AI do Cursor, instrua o agente a gerar tarefas a partir do seu PRD:

```
Por favor, use o comando task-master parse-prd para gerar tarefas a partir do meu PRD. O PRD está localizado em scripts/prd.txt.
```

O agente executará:

```bash
task-master parse-prd scripts/prd.txt
```

Isso irá:

- Analisar seu documento PRD
- Gerar um arquivo `tasks.json` estruturado com tarefas, dependências, prioridades e estratégias de teste
- O agente entenderá esse processo devido às regras do Cursor

### Gerar Arquivos de Tarefas Individuais

Em seguida, peça ao agente para gerar arquivos de tarefas individuais:

```
Por favor, gere arquivos de tarefas individuais a partir de tasks.json
```

O agente executará:

```bash
task-master generate
```

Isso cria arquivos de tarefas individuais no diretório `tasks/` (ex: `task_001.txt`, `task_002.txt`), facilitando a referência a tarefas específicas.

## Fluxo de Trabalho de Desenvolvimento Orientado por IA

O agente do Cursor é pré-configurado (através do arquivo de regras) para seguir este fluxo de trabalho:

### 1. Descoberta e Seleção de Tarefas

Peça ao agente para listar as tarefas disponíveis:

```
Quais tarefas estão disponíveis para trabalhar em seguida?
```

O agente irá:

- Executar `task-master list` para ver todas as tarefas
- Executar `task-master next` para determinar a próxima tarefa a ser trabalhada
- Analisar dependências para determinar quais tarefas estão prontas para serem trabalhadas
- Priorizar tarefas com base no nível de prioridade e ordem de ID
- Sugerir a(s) próxima(s) tarefa(s) a serem implementadas

### 2. Implementação de Tarefas

Ao implementar uma tarefa, o agente irá:

- Consultar a seção de detalhes da tarefa para especificações de implementação
- Considerar dependências em tarefas anteriores
- Seguir os padrões de codificação do projeto
- Criar testes apropriados com base na `testStrategy` da tarefa

Você pode perguntar:

```
Vamos implementar a tarefa 3. O que ela envolve?
```

### 3. Verificação da Tarefa

Antes de marcar uma tarefa como concluída, verifique-a de acordo com:

- A `testStrategy` especificada na tarefa
- Quaisquer testes automatizados na base de código
- Verificação manual, se necessário

### 4. Conclusão da Tarefa

Quando uma tarefa for concluída, diga ao agente:

```
A Tarefa 3 agora está completa. Por favor, atualize seu status.
```

O agente executará:

```bash
task-master set-status --id=3 --status=done
```

### 5. Lidando com Desvios de Implementação

Se durante a implementação, você descobrir que:

- A abordagem atual difere significativamente do que foi planejado
- Tarefas futuras precisam ser modificadas devido às escolhas de implementação atuais
- Novas dependências ou requisitos surgiram

Tell the agent:

```
We've changed our approach. We're now using Express instead of Fastify. Please update all future tasks to reflect this change.
```

The agent will execute:

```bash
task-master update --from=4 --prompt="Now we are using Express instead of Fastify."
```

This will rewrite or re-scope subsequent tasks in tasks.json while preserving completed work.

### 6. Breaking Down Complex Tasks

For complex tasks that need more granularity:

```
Task 5 seems complex. Can you break it down into subtasks?
```

The agent will execute:

```bash
task-master expand --id=5 --num=3
```

You can provide additional context:

```
Please break down task 5 with a focus on security considerations.
```

The agent will execute:

```bash
task-master expand --id=5 --prompt="Focus on security aspects"
```

You can also expand all pending tasks:

```
Please break down all pending tasks into subtasks.
```

The agent will execute:

```bash
task-master expand --all
```

For research-backed subtask generation using Perplexity AI:

```
Please break down task 5 using research-backed generation.
```

The agent will execute:

```bash
task-master expand --id=5 --research
```

## Command Reference

Here's a comprehensive reference of all available commands:

### Parse PRD

```bash
# Parse a PRD file and generate tasks
task-master parse-prd <prd-file.txt>

# Limit the number of tasks generated
task-master parse-prd <prd-file.txt> --num-tasks=10
```

### List Tasks

```bash
# List all tasks
task-master list

# List tasks with a specific status
task-master list --status=<status>

# List tasks with subtasks
task-master list --with-subtasks

# List tasks with a specific status and include subtasks
task-master list --status=<status> --with-subtasks
```

### Show Next Task

```bash
# Show the next task to work on based on dependencies and status
task-master next
```

### Show Specific Task

```bash
# Show details of a specific task
task-master show <id>
# or
task-master show --id=<id>

# View a specific subtask (e.g., subtask 2 of task 1)
task-master show 1.2
```

### Update Tasks

```bash
# Update tasks from a specific ID and provide context
task-master update --from=<id> --prompt="<prompt>"
```

### Generate Task Files

```bash
# Generate individual task files from tasks.json
task-master generate
```

### Set Task Status

```bash
# Set status of a single task
task-master set-status --id=<id> --status=<status>

# Set status for multiple tasks
task-master set-status --id=1,2,3 --status=<status>

# Set status for subtasks
task-master set-status --id=1.1,1.2 --status=<status>
```

When marking a task as "done", all of its subtasks will automatically be marked as "done" as well.

### Expand Tasks

```bash
# Expand a specific task with subtasks
task-master expand --id=<id> --num=<number>

# Expand with additional context
task-master expand --id=<id> --prompt="<context>"

# Expand all pending tasks
task-master expand --all

# Force regeneration of subtasks for tasks that already have them
task-master expand --all --force

# Research-backed subtask generation for a specific task
task-master expand --id=<id> --research

# Research-backed generation for all tasks
task-master expand --all --research
```

### Clear Subtasks

```bash
# Clear subtasks from a specific task
task-master clear-subtasks --id=<id>

# Clear subtasks from multiple tasks
task-master clear-subtasks --id=1,2,3

# Clear subtasks from all tasks
task-master clear-subtasks --all
```

### Analyze Task Complexity

```bash
# Analyze complexity of all tasks
task-master analyze-complexity

# Save report to a custom location
task-master analyze-complexity --output=my-report.json

# Use a specific LLM model
task-master analyze-complexity --model=claude-3-opus-20240229

# Set a custom complexity threshold (1-10)
task-master analyze-complexity --threshold=6

# Use an alternative tasks file
task-master analyze-complexity --file=custom-tasks.json

# Use Perplexity AI for research-backed complexity analysis
task-master analyze-complexity --research
```

### View Complexity Report

```bash
# Display the task complexity analysis report
task-master complexity-report

# View a report at a custom location
task-master complexity-report --file=my-report.json
```

### Managing Task Dependencies

```bash
# Add a dependency to a task
task-master add-dependency --id=<id> --depends-on=<id>

# Remove a dependency from a task
task-master remove-dependency --id=<id> --depends-on=<id>

# Validate dependencies without fixing them
task-master validate-dependencies

# Find and fix invalid dependencies automatically
task-master fix-dependencies
```

### Add a New Task

```bash
# Add a new task using AI
task-master add-task --prompt="Description of the new task"

# Add a task with dependencies
task-master add-task --prompt="Description" --dependencies=1,2,3

# Add a task with priority
task-master add-task --prompt="Description" --priority=high
```

## Feature Details

### Analyzing Task Complexity

The `analyze-complexity` command:

- Analyzes each task using AI to assess its complexity on a scale of 1-10
- Recommends optimal number of subtasks based on configured DEFAULT_SUBTASKS
- Generates tailored prompts for expanding each task
- Creates a comprehensive JSON report with ready-to-use commands
- Saves the report to scripts/task-complexity-report.json by default

The generated report contains:

- Complexity analysis for each task (scored 1-10)
- Recommended number of subtasks based on complexity
- AI-generated expansion prompts customized for each task
- Ready-to-run expansion commands directly within each task analysis

### Viewing Complexity Report

The `complexity-report` command:

- Displays a formatted, easy-to-read version of the complexity analysis report
- Shows tasks organized by complexity score (highest to lowest)
- Provides complexity distribution statistics (low, medium, high)
- Highlights tasks recommended for expansion based on threshold score
- Includes ready-to-use expansion commands for each complex task
- If no report exists, offers to generate one on the spot

### Smart Task Expansion

The `expand` command automatically checks for and uses the complexity report:

When a complexity report exists:

- Tasks are automatically expanded using the recommended subtask count and prompts
- When expanding all tasks, they're processed in order of complexity (highest first)
- Research-backed generation is preserved from the complexity analysis
- You can still override recommendations with explicit command-line options

Example workflow:

```bash
# Generate the complexity analysis report with research capabilities
task-master analyze-complexity --research

# Review the report in a readable format
task-master complexity-report

# Expand tasks using the optimized recommendations
task-master expand --id=8
# or expand all tasks
task-master expand --all
```

### Finding the Next Task

The `next` command:

- Identifies tasks that are pending/in-progress and have all dependencies satisfied
- Prioritizes tasks by priority level, dependency count, and task ID
- Displays comprehensive information about the selected task:
  - Basic task details (ID, title, priority, dependencies)
  - Implementation details
  - Subtasks (if they exist)
- Provides contextual suggested actions:
  - Command to mark the task as in-progress
  - Command to mark the task as done
  - Commands for working with subtasks

### Viewing Specific Task Details

The `show` command:

- Displays comprehensive details about a specific task or subtask
- Shows task status, priority, dependencies, and detailed implementation notes
- For parent tasks, displays all subtasks and their status
- For subtasks, shows parent task relationship
- Provides contextual action suggestions based on the task's state
- Works with both regular tasks and subtasks (using the format taskId.subtaskId)

## Best Practices for AI-Driven Development

1. **Start with a detailed PRD**: The more detailed your PRD, the better the generated tasks will be.

2. **Review generated tasks**: After parsing the PRD, review the tasks to ensure they make sense and have appropriate dependencies.

3. **Analyze task complexity**: Use the complexity analysis feature to identify which tasks should be broken down further.

4. **Follow the dependency chain**: Always respect task dependencies - the Cursor agent will help with this.

5. **Update as you go**: If your implementation diverges from the plan, use the update command to keep future tasks aligned with your current approach.

6. **Break down complex tasks**: Use the expand command to break down complex tasks into manageable subtasks.

7. **Regenerate task files**: After any updates to tasks.json, regenerate the task files to keep them in sync.

8. **Communicate context to the agent**: When asking the Cursor agent to help with a task, provide context about what you're trying to achieve.

9. **Validate dependencies**: Periodically run the validate-dependencies command to check for invalid or circular dependencies.

## Example Cursor AI Interactions

### Starting a new project

```
I've just initialized a new project with Claude Task Master. I have a PRD at scripts/prd.txt.
Can you help me parse it and set up the initial tasks?
```

### Working on tasks

```
What's the next task I should work on? Please consider dependencies and priorities.
```

### Implementing a specific task

```
I'd like to implement task 4. Can you help me understand what needs to be done and how to approach it?
```

### Managing subtasks

```
I need to regenerate the subtasks for task 3 with a different approach. Can you help me clear and regenerate them?
```

### Handling changes

```
We've decided to use MongoDB instead of PostgreSQL. Can you update all future tasks to reflect this change?
```

### Completing work

```
I've finished implementing the authentication system described in task 2. All tests are passing.
Please mark it as complete and tell me what I should work on next.
```

### Analyzing complexity

```
Can you analyze the complexity of our tasks to help me understand which ones need to be broken down further?
```

### Viewing complexity report

```
Can you show me the complexity report in a more readable format?
```
