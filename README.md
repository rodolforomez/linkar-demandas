# Linkar - Sistema de Solicitação de Demandas

Sistema web para submissão de solicitações de serviços que cria automaticamente cards no Trello através da API REST.

![Status](https://img.shields.io/badge/status-ativo-success)
![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-blue)

## 📋 Descrição

Aplicação web single-page (SPA) que permite aos colaboradores enviarem solicitações de serviços (artes, vídeos, landing pages, etc.) de forma organizada. Cada solicitação cria automaticamente um card na lista do Trello da equipe.

## ✨ Funcionalidades

- ✅ Formulário intuitivo e responsivo
- ✅ Integração direta com a API do Trello
- ✅ Validações em tempo real
- ✅ Feedback visual para o usuário
- ✅ Design moderno com identidade visual Linkar
- ✅ Prevenção de múltiplos envios
- ✅ Formatação automática em Markdown

## 🎨 Interface

- Layout centralizado com card flutuante
- Paleta de cores: gradiente ciano/azul
- Responsivo (mobile, tablet, desktop)
- Animações suaves e micro-interações

## 🚀 Como Usar

### Pré-requisitos

1. Conta no Trello
2. API Key e Token do Trello
3. ID da lista onde os cards serão criados

### Configuração

#### Passo 1: Obter credenciais do Trello

1. **API Key**:
   - Acesse [https://trello.com/power-ups/admin](https://trello.com/power-ups/admin)
   - Faça login na sua conta
   - Clique em "New" para criar um novo Power-Up (ou use um existente)
   - Copie a **API Key** exibida

2. **Token**:
   - Na mesma página, você verá um link para gerar um Token
   - Clique no link e autorize o acesso
   - Copie o **Token** gerado

3. **List ID**:
   - Abra seu quadro do Trello no navegador
   - Adicione `.json` ao final da URL (exemplo: `https://trello.com/b/ABC123.json`)
   - Pressione Enter
   - Procure pela lista desejada (ex: "Caixa de Entrada") no JSON
   - Copie o valor do campo `"id"` dessa lista

#### Passo 2: Configurar o arquivo config.js

1. Copie o arquivo de exemplo:
   ```bash
   cp config.example.js config.js
   ```

2. Abra `config.js` em um editor de texto

3. Substitua os valores de exemplo pelas suas credenciais:
   ```javascript
   const TRELLO_CONFIG = {
       apiKey: 'sua_api_key_aqui',
       token: 'seu_token_aqui',
       listId: 'id_da_lista_aqui'
   };
   ```

4. Salve o arquivo

> ⚠️ **IMPORTANTE**: O arquivo `config.js` contém informações sensíveis e NÃO deve ser commitado no Git. Ele já está incluído no `.gitignore`.

### Executar a aplicação

1. **Opção 1 - Live Server (Recomendado)**:
   - Se usar VS Code, instale a extensão "Live Server"
   - Clique com botão direito em `index.html`
   - Selecione "Open with Live Server"

2. **Opção 2 - Python**:
   ```bash
   python3 -m http.server 8000
   ```
   - Acesse: `http://localhost:8000`

3. **Opção 3 - Node.js**:
   ```bash
   npx serve .
   ```

4. **Opção 4 - Abrir diretamente**:
   - Simplesmente dê duplo clique em `index.html`
   - (Alguns recursos podem não funcionar sem servidor local)

## 📝 Como Usar o Formulário

1. Abra a aplicação no navegador
2. Preencha todos os campos obrigatórios:
   - **Solicitante**: Selecione quem está fazendo a solicitação
   - **Tipo da Solicitação**: Escolha o tipo de serviço
   - **Detalhes**: Descreva em detalhes o que você precisa (mínimo 20 caracteres)
   - **Prazo**: Selecione a data de entrega desejada
   - **Anexos** (opcional): Adicione arquivos de referência
3. Clique em "ENVIAR SOLICITAÇÃO"
4. Aguarde a confirmação de sucesso
5. Verifique o card criado no Trello!

## 🔒 Segurança

> ⚠️ **Aviso de Segurança**: Como esta é uma aplicação frontend-only, as credenciais da API estarão expostas no código JavaScript do cliente. 

**Para uso em produção**, recomenda-se:
- Implementar um backend (Node.js, Python, etc.) que proteja as credenciais
- O frontend envia dados para o backend
- O backend se comunica com a API do Trello

**Para uso interno** (equipe pequena, rede local), a solução atual é adequada.

## 📁 Estrutura do Projeto

```
linkar-demandas/
├── index.html          # Estrutura HTML do formulário
├── style.css           # Estilos e design visual
├── script.js           # Lógica e integração com Trello
├── config.js           # Credenciais (não commitado)
├── config.example.js   # Template de configuração
├── assets/             # Imagens e recursos
├── .gitignore          # Arquivos ignorados pelo Git
└── README.md           # Este arquivo
```

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização responsiva (Flexbox/Grid)
- **JavaScript Vanilla** - Lógica e integração
- **Trello REST API** - Criação de cards

## 🎯 Validações Implementadas

- ✅ Todos os campos obrigatórios devem ser preenchidos
- ✅ Detalhes devem ter no mínimo 20 caracteres
- ✅ Data de entrega não pode ser anterior a hoje
- ✅ Prevenção de múltiplos cliques no botão
- ✅ Validação de credenciais do Trello

## 📱 Responsividade

A interface se adapta perfeitamente a:
- 📱 Smartphones (até 480px)
- 📱 Tablets (481px - 768px)
- 💻 Desktops (769px+)

## 🐛 Solução de Problemas

### Erro: "Configuração do Trello não encontrada"
- Verifique se o arquivo `config.js` existe
- Confirme se as credenciais estão preenchidas corretamente

### Erro: "401 Unauthorized"
- API Key ou Token inválidos
- Gere novas credenciais no Trello

### Erro: "404 Not Found"
- List ID incorreto
- Verifique o ID da lista no JSON do quadro

### Card não aparece no Trello
- Verifique se está olhando a lista correta
- Atualize a página do Trello (F5)
- Verifique o console do navegador para erros

## 🤝 Contribuindo

Para contribuir com melhorias:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de uso interno da Linkar.

## ✉️ Suporte

Em caso de dúvidas ou problemas, entre em contato com a equipe de TI.

---

**Desenvolvido com 💙 pela equipe Linkar**
