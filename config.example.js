// ========================================
// CONFIGURAÇÃO DA API DO TRELLO
// ========================================
// IMPORTANTE: Este é um arquivo de exemplo. 
// Copie este arquivo para "config.js" e preencha com suas credenciais reais.

const TRELLO_CONFIG = {
    // Obtenha sua API Key em: https://trello.com/power-ups/admin
    apiKey: 'cole_sua_api_key_aqui',

    // Gere seu Token através do link fornecido após obter a API Key
    token: 'cole_seu_token_aqui',

    // ID da lista onde os cards serão criados
    // Para encontrar: Abra o Trello > Acesse a lista > Adicione ".json" ao final da URL do quadro
    // Procure pelo nome da sua lista e copie o "id"
    listId: 'cole_o_id_da_lista_aqui'
};

// INSTRUÇÕES PARA CONFIGURAÇÃO:
// 1. Renomeie ou copie este arquivo para "config.js"
// 2. Acesse https://trello.com/power-ups/admin
// 3. Obtenha sua API Key
// 4. Gere um Token (o link aparecerá após obter a Key)
// 5. Encontre o ID da sua lista conforme instruções acima
// 6. Preencha as credenciais acima
// 7. Nunca faça commit do arquivo config.js no Git (ele está no .gitignore)
