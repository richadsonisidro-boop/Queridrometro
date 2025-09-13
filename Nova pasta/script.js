// --- Dados da simulação ---
const PARTICIPANTS = ['Eduarda', 'Emilia', 'Karol', 'Kelvin', 'Lucas', 'Neto', 'Paulo', 'Richardson'];
const EMOJIS = ['❤️', '🐍', '💣', '💩', '👑'];
const ADMIN_USER = 'Gerente';

// Objeto para armazenar os votos
let votes = {};
// Objeto para controlar quem já votou
let hasVoted = {};
PARTICIPANTS.forEach(name => hasVoted[name] = false);

let activeUser = null;

// Inicializa o objeto de votos
function initializeVotes() {
    PARTICIPANTS.forEach(participant => {
        votes[participant] = {};
        EMOJIS.forEach(emoji => {
            votes[participant][emoji] = 0;
        });
    });
}
initializeVotes();

// --- Funções de UI (User Interface) ---

// Função para exibir a tela correta
function displayView(viewId) {
    const views = ['login-view', 'voter-view', 'admin-view'];
    views.forEach(view => {
        document.getElementById(view).classList.add('hidden');
    });
    document.getElementById(viewId).classList.remove('hidden');
}

// Preenche o campo de seleção de participantes
function populateParticipants() {
    const select = document.getElementById('participant-select');
    select.innerHTML = '<option value="">-- Escolha um participante --</option>';
    PARTICIPANTS.forEach(participant => {
        const option = document.createElement('option');
        option.value = participant;
        option.textContent = participant;
        select.appendChild(option);
    });
}

// --- Funções de Lógica ---

// Lida com o login do usuário
function login(user) {
    activeUser = user;
    if (activeUser === ADMIN_USER) {
        renderAdminUI();
        displayView('admin-view');
    } else {
        document.getElementById('voter-name').textContent = `Olá, ${activeUser}!`;
        populateParticipants();
        updateVoterStatus();
        displayView('voter-view');
    }
}

// Lida com o logout
function logout() {
    activeUser = null;
    document.getElementById('vote-message').textContent = '';
    displayView('login-view');
}

// Gerencia a seleção de emoji no formulário de votação
let selectedEmoji = null;
function selectEmoji(emoji) {
    selectedEmoji = emoji;
    document.getElementById('selected-emoji-display').textContent = `Emoji selecionado: ${emoji}`;
}

// Lida com a submissão do voto
function submitVote() {
    const participant = document.getElementById('participant-select').value;
    const message = document.getElementById('vote-message');

    if (!participant) {
        message.textContent = 'Selecione um participante para votar.';
        return;
    }
    if (!selectedEmoji) {
        message.textContent = 'Selecione um emoji para votar.';
        return;
    }

    if (hasVoted[activeUser]) {
        message.textContent = 'Você já votou nesta rodada!';
        return;
    }

    votes[participant][selectedEmoji]++;
    hasVoted[activeUser] = true;
    message.textContent = 'Voto registrado com sucesso!';
    updateVoterStatus();
}

// Atualiza a visualização do botão de votação para o votante
function updateVoterStatus() {
    const submitBtn = document.getElementById('submit-vote-btn');
    if (hasVoted[activeUser]) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Você já votou!';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Votar!';
    }
}

// Renderiza a interface do administrador com os resultados
function renderAdminUI() {
    const resultsDisplay = document.getElementById('results-display');
    resultsDisplay.innerHTML = ''; // Limpa os resultados antigos

    PARTICIPANTS.forEach(participant => {
        const participantDiv = document.createElement('div');
        participantDiv.className = 'participant-results';
        
        const nameHeading = document.createElement('h3');
        nameHeading.textContent = participant;
        participantDiv.appendChild(nameHeading);

        const sortedEmojis = Object.entries(votes[participant]).sort(([, a], [, b]) => b - a);

        sortedEmojis.forEach(([emoji, count]) => {
            const emojiRow = document.createElement('div');
            emojiRow.className = 'result-emoji-row';
            emojiRow.innerHTML = `<span>${emoji}</span>: ${count} votos`;
            participantDiv.appendChild(emojiRow);
        });
        resultsDisplay.appendChild(participantDiv);
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    displayView('login-view');
});