# Missões da Família

App web para os pais organizarem tarefas dos filhos com recompensas por cumprimento combinado.

## Funcionalidades

- **Perfis sem senha**: tela inicial para escolher entre cada filho ou a Área dos Pais (protegida por PIN de 4 dígitos).
- **Tarefas com valor em estrelas**: cada tarefa tem um valor em ⭐ estrelas, dias da semana e horário (opcional), duração pré-definida para o timer, e pode exigir aprovação dos pais ao ser concluída.
- **Timer regressivo por tarefa**: a criança clica em ▶️ para iniciar a tarefa, pode ajustar o tempo antes de começar, pausar/continuar durante a execução, e o timer apita com alarme sonoro quando o tempo acaba.
- **Recompensas configuráveis**: os pais cadastram prêmios (tempo de tela/jogo, dinheiro ou outro), cada um com custo em estrelas.
- **Banco de tempo de tela**: contador de minutos acumulados que tanto os pais quanto a criança podem adicionar; a criança pode "usar" o tempo com um contador regressivo ao vivo que desconta do saldo.
- **Aprovações**: painel central para os pais aprovarem ou rejeitarem tarefas concluídas e resgates de recompensa pendentes.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Zustand (com persistência em `localStorage`)

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Na primeira vez, entre na Área dos Pais com o PIN padrão `0000` (pode ser alterado em Configurações) para cadastrar filhos, tarefas e recompensas.

## Build de produção

```bash
npm run build
```
