// =========================================
// BANCO DE DADOS TEMPORÁRIO E IMAGENS FIXAS
// =========================================

// Mapeamento explícito das matérias para os arquivos físicos de imagem enviados
const SUBJECT_IMAGES = {
    "Matemática": "imagem tabuada.jpg",
    "Ciências": "Ciencias.jpg",
    "Inglês": "ingles.jpg",
    "Arte": "arts.jpg",
    "Português": "science.jpg" // Fallback dinâmico para outras disciplinas
};

const DEFAULT_VIDEOS = [
    { id: 1, title: "Tabuada Divertida do 5", subject: "Matemática", points: 50, ytId: "e9FiG7E99Z0", watched: false },
    { id: 2, title: "Como as Plantas Crescem?", subject: "Ciências", points: 60, ytId: "zX7pYgSSTp0", watched: false },
    { id: 3, title: "Inglês com Músicas Infantis", subject: "Inglês", points: 40, ytId: "tV9zVf3wPZ8", watched: false },
    { id: 4, title: "Pinturas Famosas e Cores", subject: "Arte", points: 70, ytId: "Qp9Z5nPr6f8", watched: false }
];

const STORE_ITEMS = [
    { id: 'av_lion', title: "Avatar Leão", cost: 50, icon: "🦁" },
    { id: 'av_dino', title: "Avatar Dino", cost: 100, icon: "🦖" },
    { id: 'av_astro', title: "Avatar Foguete", cost: 150, icon: "🚀" }
];

const FREE_AVATARS = ['🦄', '🐶', '🐱', '🦊'];

let AppState = {
    isLoggedIn: false,
    parentAccount: {
        name: '',
        email: '',
        pin: ''
    },
    user: {
        name: '',
        avatar: '🦄',
        points: 0,
        watchedCount: 0,
        streak: 0,
        unlockedAvatars: [...FREE_AVATARS]
    },
    videos: [],
    currentVideoId: null,
    currentFilter: 'Todos'
};

// Ao carregar a página, força a tela de Login/Cadastro Inicial
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('main-nav').classList.add('view-hidden');
    switchView('auth-view');
});

// =========================================
// FLUXO DE CADASTRO COESIVO (PAIS -> CRIANÇA)
// =========================================
function goToChildStep() {
    const parentName = document.getElementById('parent-name').value.trim();
    const parentEmail = document.getElementById('parent-email').value.trim();
    const parentPin = document.getElementById('parent-pin').value.trim();

    if (!parentName || !parentEmail || !parentPin) {
        alert("Atenção Pais: Preencham todos os campos e criem o PIN para continuar.");
        return;
    }
    if (parentPin.length < 4 || isNaN(parentPin)) {
        alert("O PIN de segurança deve conter exatamente 4 números.");
        return;
    }

    // Grava dados temporários do Responsável
    AppState.parentAccount.name = parentName;
    AppState.parentAccount.email = parentEmail;
    AppState.parentAccount.pin = parentPin;

    // Alterna visualmente os passos de cadastro
    document.getElementById('step-parent').classList.add('view-hidden');
    document.getElementById('step-child').classList.remove('view-hidden');
}

function backToParentStep() {
    document.getElementById('step-child').classList.add('view-hidden');
    document.getElementById('step-parent').classList.remove('view-hidden');
}

function selectSignupAvatar(avatar, element) {
    document.querySelectorAll('.avatar-signup-opt').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    AppState.user.avatar = avatar;
}

function handleFinalRegistration() {
    const childName = document.getElementById('auth-child-name').value.trim();
    if (!childName) {
        alert("Por favor, digite o nome da criança para finalizar.");
        return;
    }

    AppState.isLoggedIn = true;
    AppState.user.name = childName;
    AppState.videos = JSON.parse(JSON.stringify(DEFAULT_VIDEOS)); // Clona massa inicial

    // Configura e libera aplicação infantil
    document.getElementById('main-nav').classList.remove('view-hidden');
    document.getElementById('parental-user-title').innerText = AppState.parentAccount.name;

    updateUserUI();
    renderVideos('Todos');
    switchView('student-view');
    triggerConfetti();
}

function logout() {
    window.location.reload(); // Limpa a memória temporária da aba ativa
}

// =========================================
// DESIGN DOS CARDS COM VÍNCULO DE MATÉRIA
// =========================================
function renderVideos(filterSubject) {
    AppState.currentFilter = filterSubject;
    const grid = document.getElementById('video-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = filterSubject === 'Todos'
        ? AppState.videos
        : AppState.videos.filter(v => v.subject === filterSubject);

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#64748b; padding:20px;">Nenhum vídeo disponível nesta matéria.</p>`;
        return;
    }

    filtered.forEach(vid => {
        let bgImage = '';
        switch(vid.subject) {
            case 'Matemática': bgImage = 'img/tabuada.jpg'; break;
            case 'Ciências': bgImage = 'img/Ciencias.jpg'; break;
            case 'Português': bgImage = 'img/photo.jpg'; break;
            case 'Inglês': bgImage = 'img/ingles.jpg'; break;
            case 'Arte': bgImage = 'img/arts.jpg'; break;
            case 'Música': bgImage = 'img/science.jpg'; break; // Mapeamento alternativo padrão
            default: bgImage = `https://img.youtube.com/vi/${vid.ytId}/hqdefault.jpg`; break;
        }

        // Correção de exibição de imagens quebradas injetando imagens padrão de internet caso as locais falhem
        if(!bgImage || vid.id > 8) bgImage = `https://img.youtube.com/vi/${vid.ytId}/0.jpg`;

        const watchedTag = vid.watched ? `<div class="status-badge">✔ Assistido</div>` : '';
        let platClass = vid.platform === 'YouTube Kids' ? 'tag-yt' : (vid.platform === 'Netflix' ? 'tag-netflix' : 'tag-starmind');

        grid.innerHTML += `
            <div class="video-card" onclick="playVideo(${vid.id}, '${vid.title}', '${vid.ytId}', ${vid.points})">
                <div class="thumbnail" style="background-image: url('${bgImage}')">
                    ${watchedTag}
                    <span class="platform-tag ${platClass}">${vid.platform}</span>
                    <button class="play-btn">▶</button>
                </div>
                <div class="video-info">
                    <h4>${vid.title}</h4>
                    <div class="video-meta">
                        <span class="subject-pill">${vid.subject}</span>
                        <span class="meta-time">⏱ ${vid.time}</span>
                        <span class="meta-points">⭐ +${vid.points}</span>
                    </div>
                </div>
            </div>
        `;
    });
    renderAchievements();
}


// =========================================
// ATUALIZAÇÃO DE UI E CONQUISTAS EM PROGRESSO
// =========================================
function updateUserUI() {
    document.getElementById('nav-points').innerText = AppState.user.points;
    document.getElementById('nav-avatar').innerText = AppState.user.avatar;
    document.getElementById('nav-name').innerText = AppState.user.name;

    document.getElementById('banner-name').innerText = AppState.user.name;
    document.getElementById('banner-videos').innerText = AppState.user.watchedCount;
    document.getElementById('banner-points').innerText = AppState.user.points;
    document.getElementById('banner-streak').innerText = `${AppState.user.streak} dias 🔥`;

    document.getElementById('edit-name').value = AppState.user.name;
    renderAchievements();
}

function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    const count = AppState.user.watchedCount;

    const achievements = [
        { title: "Iniciante Estelar", target: 1, desc: "Conclua a primeira aula no site.", icon: "⭐" },
        { title: "Pequeno Cientista", target: 3, desc: "Assista 3 vídeos recomendados.", icon: "🔬" },
        { title: "Mestre do Conhecimento", target: 5, desc: "Assista 5 aulas com sucesso.", icon: "🏆" }
    ];

    grid.innerHTML = '';
    achievements.forEach(ach => {
        const progress = Math.min(count, ach.target);
        const percent = (progress / ach.target) * 100;
        const isLocked = progress < ach.target;

        grid.innerHTML += `
            <div class="ach-card" style="opacity: ${isLocked ? '0.75' : '1'}">
                <div class="ach-icon" style="background: ${isLocked ? '#e2e8f0' : '#fef08a'}">${ach.icon}</div>
                <div class="ach-text">
                    <h4>${ach.title}</h4>
                    <p style="font-size: 12px; color: #64748b;">${ach.desc}</p>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${percent}%;"></div>
                    </div>
                    <span class="progress-text">${progress} / ${ach.target}</span>
                </div>
            </div>
        `;
    });
}

// =========================================
// PLAYER REFORÇADO E RETORNO
// =========================================
function playVideo(id, title, ytId, points, isWatched) {
    AppState.currentVideoId = id;
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-points').innerText = points;
    document.getElementById('yt-player').src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;

    const finishBtn = document.getElementById('finish-btn');
    if (isWatched) {
        finishBtn.innerText = "✔ Aula já Computada";
        finishBtn.disabled = true;
    } else {
        finishBtn.innerText = "✅ Marcar como Assistido";
        finishBtn.disabled = false;
    }

    switchView('player-view');
}

function finishCurrentVideo() {
    const video = AppState.videos.find(v => v.id === AppState.currentVideoId);
    if(video && !video.watched) {
        video.watched = true;
        AppState.user.points += video.points;
        AppState.user.watchedCount += 1;
        if(AppState.user.streak === 0) AppState.user.streak = 1;

        updateUserUI();
        renderVideos(AppState.currentFilter);
        triggerConfetti();
        goHome();
    }
}

// =========================================
// CONTROLE PARENTAL (GATE POR PIN PROTEGIDO)
// =========================================
function openParentalGate() {
    document.getElementById('gate-pin-input').value = '';
    document.getElementById('pin-modal').classList.remove('view-hidden');
}

function verifyParentalGate() {
    const inputtedPin = document.getElementById('gate-pin-input').value;
    if (inputtedPin === AppState.parentAccount.pin) {
        closeParentalGate();
        renderParentalVideoList();
        switchView('parental-view');
    } else {
        alert("PIN incorreto! Acesso à área dos pais foi negado.");
    }
}

function closeParentalGate() {
    document.getElementById('pin-modal').classList.add('view-hidden');
}

function renderParentalVideoList() {
    const list = document.getElementById('parental-video-list');
    list.innerHTML = '';
    AppState.videos.forEach(vid => {
        list.innerHTML += `
            <div class="manage-item">
                <div>
                    <strong style="font-size:14px; display:block;">${vid.title}</strong>
                    <span style="font-size:12px; color:var(--text-muted);">${vid.subject}</span>
                </div>
                <button class="btn-delete" onclick="deleteVideo(${vid.id})">🗑️ Retirar</button>
            </div>
        `;
    });
}

function deleteVideo(id) {
    if(confirm("Deseja mesmo retirar este vídeo permanentemente do catálogo da criança?")) {
        AppState.videos = AppState.videos.filter(v => v.id !== id);
        renderParentalVideoList();
        renderVideos(AppState.currentFilter);
    }
}

function addNewVideo() {
    const urlInput = document.getElementById('new-vid-url').value;
    const titleInput = document.getElementById('new-vid-title').value;
    const subjectInput = document.getElementById('new-vid-subject').value;

    if (!urlInput || !titleInput) { alert("Preencha todos os dados da nova aula."); return; }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlInput.match(regExp);
    const ytId = (match && match[2].length === 11) ? match[2] : null;

    if (!ytId) { alert("Link do YouTube inválido."); return; }

    const newVideo = {
        id: Date.now(),
        title: titleInput,
        subject: subjectInput,
        points: 50,
        ytId: ytId,
        watched: false
    };

    AppState.videos.push(newVideo);
    renderParentalVideoList();
    renderVideos(AppState.currentFilter);

    alert("Aula incluída com sucesso no acervo infantil!");
    document.getElementById('new-vid-url').value = '';
    document.getElementById('new-vid-title').value = '';
}

// =========================================
// LOJA DE RECOMPENSAS E CUSTOMIZAÇÃO
// =========================================
function openStoreModal() {
    const grid = document.getElementById('store-grid');
    grid.innerHTML = '';

    STORE_ITEMS.forEach(item => {
        const isOwned = AppState.user.unlockedAvatars.includes(item.icon);
        const canBuy = AppState.user.points >= item.cost;

        let btnHtml = '';
        if (isOwned) {
            btnHtml = `<button class="buy-btn bought" disabled>✔ Resgatado</button>`;
        } else {
            btnHtml = `<button class="buy-btn" ${canBuy ? '' : 'disabled'} onclick="buyRewardItem('${item.id}', ${item.cost}, '${item.icon}')">
                        ${canBuy ? 'Resgatar' : 'Faltam Estrelas'}
                      </button>`;
        }

        grid.innerHTML += `
            <div class="store-item">
                <div class="store-icon">${item.icon}</div>
                <h4>${item.title}</h4>
                <span class="store-cost">⭐ ${item.cost} estrelas</span>
                ${btnHtml}
            </div>
        `;
    });
    document.getElementById('store-modal').classList.remove('view-hidden');
}

function buyRewardItem(id, cost, icon) {
    if(AppState.user.points >= cost) {
        AppState.user.points -= cost;
        AppState.user.unlockedAvatars.push(icon);
        triggerConfetti();
        updateUserUI();
        openStoreModal();
    }
}

function closeStoreModal() { document.getElementById('store-modal').classList.add('view-hidden'); }

function openProfileModal() {
    renderAvatarGrid();
    document.getElementById('profile-modal').classList.remove('view-hidden');
}
function closeProfileModal() { document.getElementById('profile-modal').classList.add('view-hidden'); }

function renderAvatarGrid() {
    const grid = document.getElementById('avatar-grid');
    grid.innerHTML = '';
    const allAvatars = [...FREE_AVATARS, ...STORE_ITEMS.map(i => i.icon)];

    allAvatars.forEach(av => {
        const isOwned = AppState.user.unlockedAvatars.includes(av);
        const isSel = av === AppState.user.avatar ? 'selected' : '';

        if (isOwned) {
            grid.innerHTML += `<button class="avatar-btn ${isSel}" onclick="selectAvatar('${av}', this)">${av}</button>`;
        } else {
            grid.innerHTML += `<button class="avatar-btn locked" title="Bloqueado - Requer Loja de Estrelas" onclick="alert('Vá até a loja de recompensas para desbloquear com estrelas!')">${av}</button>`;
        }
    });
}

function selectAvatar(av, btn) {
    if(!AppState.user.unlockedAvatars.includes(av)) return;
    document.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    AppState.user.avatar = av;
}

function saveProfile() {
    const nameInput = document.getElementById('edit-name').value;
    if(!nameInput.trim()) return;
    AppState.user.name = nameInput;
    updateUserUI();
    closeProfileModal();
}

// =========================================
// CORE NAVEGAÇÃO E UTILITÁRIOS
// =========================================
function filterVideos(subject, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderVideos(subject);
}

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('view-hidden'));
    document.getElementById(viewId).classList.remove('view-hidden');
    document.getElementById(viewId).classList.add('view-active');
}

function goHome() {
    document.getElementById('yt-player').src = "";
    switchView('student-view');
}

function triggerConfetti() { confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } }); }