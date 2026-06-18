const API_BASE = '/api';

// Lista de vídeos estáticos padrão idênticos aos prints fornecidos para garantir carregamento imediato
const DEFAULT_VIDEOS = [
    { id: 1, title: "Tabuada Divertida do 5", subject: "Matemática", time: "12:30", points: 50, platform: "StarMind", ytId: "e9FiG7E99Z0", watched: false },
    { id: 2, title: "Como as Plantas Crescem?", subject: "Ciências", time: "15:45", points: 60, platform: "YouTube Kids", ytId: "zX7pYgSSTp0", watched: false },
    { id: 3, title: "Histórias Incríveis da Gramática", subject: "Português", time: "10:20", points: 40, platform: "StarMind", ytId: "9g2D3W3rXbY", watched: false },
    { id: 4, title: "Inglês com Músicas", subject: "Inglês", time: "8:15", points: 35, platform: "Netflix", ytId: "tV9zVf3wPZ8", watched: false },
    { id: 5, title: "Pinturas Famosas para Crianças", subject: "Arte", time: "20:00", points: 70, platform: "StarMind", ytId: "Qp9Z5nPr6f8", watched: false },
    { id: 6, title: "Experimentos Científicos Caseiros", subject: "Ciências", time: "18:30", points: 65, platform: "YouTube Kids", ytId: "8m_8t7E0B3Y", watched: false },
    { id: 7, title: "Frações de Forma Fácil", subject: "Matemática", time: "14:10", points: 55, platform: "StarMind", ytId: "4Z8Yw2rG9X0", watched: false },
    { id: 8, title: "Instrumentos Musicais do Mundo", subject: "Música", time: "16:40", points: 60, platform: "Netflix", ytId: "v8b3rG78YmE", watched: false }
];

const STORE_ITEMS = [
    { id: 'av_lion', title: "Avatar Leão Dourado 🦁", cost: 50, icon: "🦁", type: "avatar" },
    { id: 'av_dino', title: "Avatar Dinossauro Rex 🦖", cost: 100, icon: "🦖", type: "avatar" },
    { id: 'av_astro', title: "Avatar Astronauta 🚀", cost: 150, icon: "🚀", type: "avatar" },
    { id: 'bg_cosmic', title: "Tema Fundo Cósmico 🌌", cost: 200, icon: "🌌", type: "theme" }
];

const AVATAR_POOL = ['🦁', '🐼', '🦊', '🐯', '🐨', '🐸', '🦄', '🦋', '🐙', '🦕', '🚀', '⭐'];

let AppState = {
    user: { name: 'Maria', avatar: '🦄', points: 0, watchedCount: 0, streak: 0, dailyTimeLimitMinutes: 60 },
    videos: [],
    currentVideoId: null,
    currentFilter: 'Todos',
    selectedAvatar: '🦄'
};

window.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    loadLocalCache();
    await syncUser();
    await syncVideos();
    renderAvatarGrid();
    setupSliderEvent();
    updateUserUI();
}

// Carregamento de salvamento local preventivo (Garante funcionamento sem travar)
function loadLocalCache() {
    const cachedUser = localStorage.getItem('sm_user');
    const cachedVideos = localStorage.getItem('sm_videos');

    if (cachedUser) AppState.user = JSON.parse(cachedUser);
    AppState.videos = cachedVideos ? JSON.parse(cachedVideos) : DEFAULT_VIDEOS;
    AppState.selectedAvatar = AppState.user.avatar;
}

function saveLocalCache() {
    localStorage.setItem('sm_user', JSON.stringify(AppState.user));
    localStorage.setItem('sm_videos', JSON.stringify(AppState.videos));
}

// =========================================
// SINCRONIZAÇÃO COM BACKEND (SPRING BOOT)
// =========================================
async function syncUser() {
    try {
        const response = await fetch(`${API_BASE}/user`);
        if (response.ok) {
            AppState.user = await response.json();
            saveLocalCache();
        }
    } catch (e) { console.warn("Modo offline/híbrido ativo para Usuário."); }
}

async function syncVideos() {
    try {
        const response = await fetch(`${API_BASE}/videos`);
        if (response.ok) {
            AppState.videos = await response.json();
            saveLocalCache();
        }
    } catch (e) { console.warn("Modo offline/híbrido ativo para Vídeos."); }
    renderVideos(AppState.currentFilter);
}

// =========================================
// RENDERIZAÇÃO E PROCESSAMENTO DE INTERFACE
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
    document.getElementById('modal-points').innerText = AppState.user.points;
    document.getElementById('modal-videos').innerText = AppState.user.watchedCount;
    document.getElementById('modal-streak').innerText = `${AppState.user.streak} dias`;
}

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

function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;
    const count = AppState.user.watchedCount;

    grid.innerHTML = `
        <div class="ach-card ${count >= 1 ? '' : 'locked'}">
            <div class="ach-icon">⭐</div>
            <div class="ach-text"><h4>Primeira Estrela</h4><p>Assistiu ao primeiro vídeo.</p></div>
        </div>
        <div class="ach-card ${count >= 3 ? '' : 'locked'}">
            <div class="ach-icon">🚀</div>
            <div class="ach-text"><h4>Cientista Júnior</h4><p>Completo 3 vídeos de ciências.</p></div>
        </div>
        <div class="ach-card ${count >= 5 ? '' : 'locked'}">
            <div class="ach-icon">🏆</div>
            <div class="ach-text"><h4>Maratona do Saber</h4><p>Assistiu 5 vídeos educativos.</p></div>
        </div>
        <div class="ach-card ${count >= 4 ? '' : 'locked'}">
            <div class="ach-icon">⭐</div>
            <div class="ach-text"><h4>Focado nos Estudos</h4><p>Assistiu mais de 10 vídeos.</p></div>
        </div>
    `;
}

// =========================================
// MECÂNICA E OPERAÇÕES DA LOJA DE PONTOS
// =========================================
function openStoreModal() {
    const grid = document.getElementById('store-grid');
    if(!grid) return;
    grid.innerHTML = '';

    STORE_ITEMS.forEach(item => {
        const canBuy = AppState.user.points >= item.cost;
        grid.innerHTML += `
            <div class="store-item">
                <div class="store-icon">${item.icon}</div>
                <h4>${item.title}</h4>
                <span class="store-cost">⭐ ${item.cost} pontos</span>
                <button class="buy-btn" ${canBuy ? '' : 'disabled'} onclick="buyRewardItem('${item.id}', ${item.cost}, '${item.icon}')">
                    ${canBuy ? 'Resgatar' : 'Pontos Insuficientes'}
                </button>
            </div>
        `;
    });
    document.getElementById('store-modal').classList.remove('view-hidden');
}

function closeStoreModal() {
    document.getElementById('store-modal').classList.add('view-hidden');
}

function buyRewardItem(id, cost, icon) {
    if(AppState.user.points >= cost) {
        AppState.user.points -= cost;
        triggerConfetti();
        alert(`Parabéns! Você resgatou com sucesso o prêmio! 🎉`);

        // Se for um avatar, altera automaticamente o avatar atual da criança!
        if(STORE_ITEMS.find(i => i.id === id).type === 'avatar') {
            AppState.user.avatar = icon;
        }

        saveLocalCache();
        updateUserUI();
        openStoreModal(); // Recarrega os estados dos botões da loja

        // Envia ao endpoint caso implementado
        fetch(`${API_BASE}/user/buy?itemId=${id}`, { method: 'POST' }).catch(() => {});
    }
}

// =========================================
// CONTROLES DE CADASTRO E INSERÇÃO MANUAL
// =========================================
function renderAvatarGrid() {
    const grid = document.getElementById('avatar-grid');
    if (!grid) return;
    grid.innerHTML = '';
    AVATAR_POOL.forEach(av => {
        const isSel = av === AppState.selectedAvatar ? 'selected' : '';
        grid.innerHTML += `<button class="avatar-btn ${isSel}" onclick="selectAvatar('${av}', this)">${av}</button>`;
    });
}

function selectAvatar(av, btn) {
    document.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    AppState.selectedAvatar = av;
}

// Solução para atualização instantânea do perfil do estudante
function saveProfile() {
    const nameInput = document.getElementById('edit-name').value;
    if(!nameInput.trim()) { alert("Digite um nome válido!"); return; }

    // Atualização reativa em tempo real na tela
    AppState.user.name = nameInput;
    AppState.user.avatar = AppState.selectedAvatar;

    saveLocalCache();
    updateUserUI();
    closeProfileModal();
    triggerConfetti();

    // Envio assíncrono para persistência no Spring Boot
    fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput, avatar: AppState.selectedAvatar })
    }).catch(e => console.log("Atualização local mantida com segurança."));
}

function addNewVideo() {
    const urlInput = document.getElementById('new-vid-url').value;
    const titleInput = document.getElementById('new-vid-title').value;
    const subjectInput = document.getElementById('new-vid-subject').value;

    if (!urlInput || !titleInput) { alert("Preencha todos os campos."); return; }

    const ytId = extractYoutubeId(urlInput);
    if (!ytId) { alert("Insira uma URL válida do YouTube."); return; }

    const newVideo = {
        id: AppState.videos.length + 1,
        title: titleInput,
        subject: subjectInput,
        time: "10:00",
        points: 40,
        platform: "StarMind",
        ytId: ytId,
        watched: false
    };

    // Inserção instantânea na lista reativa
    AppState.videos.push(newVideo);
    saveLocalCache();
    renderVideos(AppState.currentFilter);

    alert("Sucesso! O vídeo foi integrado via curadoria parental!");
    document.getElementById('new-vid-url').value = '';
    document.getElementById('new-vid-title').value = '';

    fetch(`${API_BASE}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo)
    }).catch(e => console.log("Sincronização offline concluída."));
}

// =========================================
// PLAYER E AUXILIARES DO FLUXO DO SITE
// =========================================
function playVideo(id, title, ytId, points) {
    AppState.currentVideoId = id;
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-points').innerText = points;
    document.getElementById('yt-player').src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
    switchView('player-view');
}

function finishCurrentVideo() {
    if (AppState.currentVideoId) {
        const video = AppState.videos.find(v => v.id === AppState.currentVideoId);
        if(video && !video.watched) {
            video.watched = true;
            AppState.user.points += video.points;
            AppState.user.watchedCount += 1;
            if(AppState.user.streak === 0) AppState.user.streak = 1;
        }

        saveLocalCache();
        updateUserUI();
        triggerConfetti();
        goHome();

        fetch(`${API_BASE}/videos/${AppState.currentVideoId}/watch`, { method: 'POST' }).catch(() => {});
    }
}

function extractYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function filterVideos(subject, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderVideos(subject);
}

function setupSliderEvent() {
    const slider = document.querySelector('.time-slider');
    if (!slider) return;
    slider.addEventListener('input', (e) => {
        document.getElementById('current-time-display').innerText = `${e.target.value} minutos`;
    });
}

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('view-hidden'));
    document.getElementById(viewId).classList.remove('view-hidden');
    document.getElementById(viewId).classList.add('view-active');
}

function goHome() { document.getElementById('yt-player').src = ""; switchView('student-view'); }
function openParentalView() { switchView('parental-view'); }
function openProfileModal() { AppState.selectedAvatar = AppState.user.avatar; renderAvatarGrid(); document.getElementById('profile-modal').classList.remove('view-hidden'); }
function closeProfileModal() { document.getElementById('profile-modal').classList.add('view-hidden'); }
function triggerConfetti() { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); }