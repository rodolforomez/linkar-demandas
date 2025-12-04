// ========================================
// SISTEMA DE SOLICITAÇÃO DE DEMANDAS - LINKAR
// Integração com Trello API
// ========================================

// Elementos do DOM
const form = document.getElementById('demandForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const feedbackMessage = document.getElementById('feedbackMessage');
const detalhesTextarea = document.getElementById('detalhes');
const charCount = document.getElementById('charCount');
const prazoInput = document.getElementById('prazo');

// ========================================
// CONFIGURAÇÕES E VALIDAÇÕES
// ========================================

// Definir data mínima para o campo de prazo (hoje)
const hoje = new Date().toISOString().split('T')[0];
prazoInput.setAttribute('min', hoje);

// Contador de caracteres para o textarea
detalhesTextarea.addEventListener('input', () => {
    const count = detalhesTextarea.value.length;
    charCount.textContent = `${count} caracteres`;
});

// ========================================
// FUNÇÕES DE FEEDBACK VISUAL
// ========================================

/**
 * Mostra o estado de loading no botão
 */
function mostrarLoading() {
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
}

/**
 * Esconde o estado de loading no botão
 */
function esconderLoading() {
    submitBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
}

/**
 * Mostra mensagem de feedback para o usuário
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da mensagem ('success' ou 'error')
 */
function mostrarFeedback(message, type) {
    feedbackMessage.textContent = message;
    feedbackMessage.className = `feedback-message ${type}`;
    feedbackMessage.classList.remove('hidden');

    // Scroll suave até a mensagem
    feedbackMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-esconder mensagem de sucesso após 5 segundos
    if (type === 'success') {
        setTimeout(() => {
            feedbackMessage.classList.add('hidden');
        }, 5000);
    }
}

/**
 * Esconde a mensagem de feedback
 */
function esconderFeedback() {
    feedbackMessage.classList.add('hidden');
}

// ========================================
// VALIDAÇÕES DO FORMULÁRIO
// ========================================

/**
 * Valida se a data selecionada não é anterior a hoje
 * @param {string} dataSelecionada - Data no formato YYYY-MM-DD
 * @returns {boolean} - True se válida, False se inválida
 */
function validarData(dataSelecionada) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data

    const dataEscolhida = new Date(dataSelecionada + 'T00:00:00');

    return dataEscolhida >= hoje;
}

/**
 * Valida todos os campos do formulário
 * @param {FormData} formData - Dados do formulário
 * @returns {Object} - { valido: boolean, erro: string }
 */
function validarFormulario(formData) {
    const solicitante = formData.get('solicitante');
    const tipoSolicitacao = formData.get('tipoSolicitacao');
    const detalhes = formData.get('detalhes');
    const prazo = formData.get('prazo');

    // Verificar campos obrigatórios
    if (!solicitante || !tipoSolicitacao || !detalhes || !prazo) {
        return {
            valido: false,
            erro: 'Por favor, preencha todos os campos obrigatórios.'
        };
    }

    // Validar detalhes mínimos
    if (detalhes.length < 20) {
        return {
            valido: false,
            erro: 'Por favor, forneça mais detalhes sobre sua solicitação (mínimo 20 caracteres).'
        };
    }

    // Validar data
    if (!validarData(prazo)) {
        return {
            valido: false,
            erro: 'A data de entrega deve ser hoje ou uma data futura.'
        };
    }

    return { valido: true, erro: null };
}

// ========================================
// INTEGRAÇÃO COM TRELLO API
// ========================================

/**
 * Formata a descrição do card em Markdown
 * @param {Object} dados - Dados do formulário
 * @returns {string} - Descrição formatada
 */
function formatarDescricao(dados) {
    return `## 📋 Detalhes da Solicitação

${dados.detalhes}

---

### 👤 Informações do Solicitante
- **Solicitante:** ${dados.solicitante}
- **Tipo:** ${dados.tipoSolicitacao}
- **Prazo:** ${formatarDataBrasileira(dados.prazo)}

---
*Solicitação criada automaticamente através do formulário web.*`;
}

/**
 * Formata data de YYYY-MM-DD para DD/MM/YYYY
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {string} - Data formatada
 */
function formatarDataBrasileira(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

/**
 * Cria um card no Trello via API
 * @param {Object} dados - Dados do formulário
 * @returns {Promise} - Promessa da requisição
 */
async function criarCardNoTrello(dados) {
    // Verificar se as configurações foram definidas
    if (!TRELLO_CONFIG.apiKey || TRELLO_CONFIG.apiKey === 'cole_sua_api_key_aqui') {
        throw new Error('Configuração do Trello não encontrada. Por favor, configure o arquivo config.js.');
    }

    // Montar o nome do card: [TIPO] - [SOLICITANTE]
    const nomeCard = `[${dados.tipoSolicitacao}] - ${dados.solicitante}`;

    // Formatar descrição em Markdown
    const descricao = formatarDescricao(dados);

    // Converter data para formato ISO (com horário final do dia)
    const dataVencimento = new Date(dados.prazo + 'T23:59:59').toISOString();

    // URL da API do Trello
    const url = 'https://api.trello.com/1/cards';

    // Parâmetros da requisição
    const params = new URLSearchParams({
        key: TRELLO_CONFIG.apiKey,
        token: TRELLO_CONFIG.token,
        idList: TRELLO_CONFIG.listId,
        name: nomeCard,
        desc: descricao,
        due: dataVencimento,
        pos: 'top' // Adicionar no topo da lista
    });

    // Fazer requisição POST
    const response = await fetch(`${url}?${params}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    });

    // Verificar resposta
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro na API do Trello: ${response.status}`);
    }

    return await response.json();
}

// ========================================
// HANDLER DO FORMULÁRIO
// ========================================

/**
 * Processa o envio do formulário
 * @param {Event} e - Evento de submit
 */
async function handleSubmit(e) {
    e.preventDefault();

    // Esconder feedback anterior
    esconderFeedback();

    // Coletar dados do formulário
    const formData = new FormData(form);
    const dados = {
        solicitante: formData.get('solicitante'),
        tipoSolicitacao: formData.get('tipoSolicitacao'),
        detalhes: formData.get('detalhes'),
        prazo: formData.get('prazo')
    };

    // Validar formulário
    const validacao = validarFormulario(formData);
    if (!validacao.valido) {
        mostrarFeedback(validacao.erro, 'error');
        return;
    }

    // Mostrar loading
    mostrarLoading();

    try {
        // Enviar para o Trello
        const card = await criarCardNoTrello(dados);

        // Sucesso!
        mostrarFeedback(
            '✅ Sucesso! Sua demanda foi enviada para o Trello e nossa equipe já foi notificada.',
            'success'
        );

        // Limpar formulário
        form.reset();
        charCount.textContent = '0 caracteres';

        // Log para debug (opcional)
        console.log('Card criado com sucesso:', card);

    } catch (error) {
        // Erro
        console.error('Erro ao criar card:', error);
        mostrarFeedback(
            `❌ Erro ao enviar solicitação: ${error.message}. Por favor, tente novamente ou entre em contato com o suporte.`,
            'error'
        );
    } finally {
        // Esconder loading
        esconderLoading();
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

// Adicionar listener ao formulário
form.addEventListener('submit', handleSubmit);

// Validar data em tempo real
prazoInput.addEventListener('change', function () {
    if (!validarData(this.value)) {
        this.setCustomValidity('Selecione uma data futura');
        mostrarFeedback('A data de entrega deve ser hoje ou uma data futura.', 'error');
    } else {
        this.setCustomValidity('');
        esconderFeedback();
    }
});

// Limpar mensagem de validação ao interagir novamente
prazoInput.addEventListener('input', function () {
    this.setCustomValidity('');
});

// Log de inicialização
console.log('Sistema de Solicitação de Demandas Linkar - Inicializado ✓');
