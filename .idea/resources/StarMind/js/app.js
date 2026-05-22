// js/app.js

// === INICIALIZAÇÃO ===
window.onload = () => {
    updateUI();
    renderVideos('Todos');
    renderAchievements();
    renderAvatarGrid();
};

// === NAVEGAÇÃO ENTRE TELAS ===
function hideAllViews() {
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('view-active');
        v.classList.add('view-hidden');
    });
}

function goHome() {
    hideAllViews();
    document.getElementById('student-view').classList.remove('view-hidden');
    document.getElementById('student-view').classList.add('view-active');
    document.getElementById('yt-player').src = ""; // Pausa o vídeo
    renderVideos(document.querySelector('.filter-btn.active').innerText.split(' ')[1] || 'Todos');
}

function openParentalView() {
    hideAllViews();
    document.getElementById('parental-view').classList.remove('view-hidden');
    document.getElementById('parental-view').classList.add('view-active');
}

// === RENDERIZAÇÃO DA INTERFACE ===
function updateUI() {
    // Atualiza Textos
    document.getElementById('nav-name').innerText = State.user.name;
    document.getElementById('banner-name').innerText = State.user.name;
    document.getElementById('nav-avatar').innerText = State.user.avatar;

    // Atualiza Pontos
    document.getElementById('nav-points').innerText = State.user.points;
    document.getElementById('banner-points').innerText = State.user.points;
    document.getElementById('banner-videos').innerText = State.user.watchedCount;

    // Atualiza Modal
    document.getElementById('modal-points').innerText = State.user.points;
    document.getElementById('modal-videos').innerText = State.user.watchedCount;
}

// === SISTEMA DE VÍDEOS E FILTROS ===
// === SISTEMA DE VÍDEOS E FILTROS ===
function renderVideos(filterSubject) {
    const grid = document.getElementById('video-grid');
    grid.innerHTML = '';

    const filteredVideos = filterSubject === 'Todos'
        ? State.videos
        : State.videos.filter(v => v.subject === filterSubject);

    filteredVideos.forEach(vid => {
        // Mapeamento das imagens por matéria conforme as fotos enviadas
        let bgImage = '';
        switch(vid.subject) {
            case 'Matemática': bgImage = 'img/Matemática.jpg'; break;
            case 'Ciências': bgImage = 'img/Ciencias.jpg'; break;
            case 'Português': bgImage = 'img/photo.jpg'; break;
            case 'Inglês': bgImage = 'img/ingles.jpg'; break;
            case 'Arte': bgImage = 'img/arts.jpg'; break;
            default: bgImage = `https://img.youtube.com/vi/${vid.ytId}/hqdefault.jpg`; break;
        }

        // Tag de Assistido idêntica ao Figma
        const watchedTag = vid.watched ? `<div class="status-badge">☑ Assistido</div>` : '';

        // Cores das plataformas (StarMind, YouTube Kids, Netflix)
        let platClass = 'tag-starmind';
        if(vid.platform === 'YouTube Kids') platClass = 'tag-yt';
        if(vid.platform === 'Netflix') platClass = 'tag-netflix';

        grid.innerHTML += `
            <div class="video-card" onclick="playVideo(${vid.id})">
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
}

function filterVideos(subject, btnElement) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    renderVideos(subject);
}

// === PLAYER DE VÍDEO ===
function playVideo(id) {
    const vid = State.videos.find(v => v.id === id);
    State.currentVideoPlaying = vid;

    hideAllViews();
    document.getElementById('player-view').classList.remove('view-hidden');
    document.getElementById('player-view').classList.add('view-active');

    document.getElementById('player-title').innerText = vid.title;
    document.getElementById('player-points').innerText = vid.points;
    document.getElementById('yt-player').src = `https://www.youtube.com/embed/${vid.ytId}?autoplay=1`;

    const btn = document.getElementById('finish-btn');
    if(vid.watched) {
        btn.innerText = "Já Assistido";
        btn.disabled = true;
        btn.style.background = "#94a3b8";
    } else {
        btn.innerText = "✅ Marcar como Assistido";
        btn.disabled = false;
        btn.style.background = "var(--success)";
    }
}

function finishCurrentVideo() {
    const vid = State.currentVideoPlaying;
    if(!vid || vid.watched) return;

    // Confetes!
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    vid.watched = true;
    State.user.points += vid.points;
    State.user.watchedCount += 1;

    updateUI();
    renderAchievements(); // Checa se ganhou conquista

    const btn = document.getElementById('finish-btn');
    btn.innerText = "⭐ Pontos Coletados!";
    btn.disabled = true;
    btn.style.background = "#94a3b8";
}

// === CONQUISTAS ===
function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';

    State.achievements.forEach(ach => {
        // Lógica simples: se viu X vídeos, desbloqueia.
        const isUnlocked = State.user.watchedCount >= ach.required;
        const lockedClass = isUnlocked ? '' : 'locked';

        grid.innerHTML += `
            <div class="ach-card ${lockedClass}">
                <div class="ach-icon">${ach.icon}</div>
                <div class="ach-text">
                    <h4>${ach.title}</h4>
                    <p>${ach.desc}</p>
                </div>
            </div>
        `;
    });
}

// === MODAL DE PERFIL ===
let tempAvatar = State.user.avatar;

function openProfileModal() {
    document.getElementById('profile-modal').classList.remove('view-hidden');
    document.getElementById('edit-name').value = State.user.name;
    tempAvatar = State.user.avatar;
    renderAvatarGrid();
}

function closeProfileModal() {
    document.getElementById('profile-modal').classList.add('view-hidden');
}

function renderAvatarGrid() {
    const grid = document.getElementById('avatar-grid');
    grid.innerHTML = '';
    State.avatars.forEach(av => {
        const selected = av === tempAvatar ? 'selected' : '';
        grid.innerHTML += `<button class="avatar-btn ${selected}" onclick="selectAvatar('${av}')">${av}</button>`;
    });
}

function selectAvatar(emoji) {
    tempAvatar = emoji;
    renderAvatarGrid(); // Atualiza a seleção visual
}

function saveProfile() {
    State.user.name = document.getElementById('edit-name').value;
    State.user.avatar = tempAvatar;
    updateUI();
    closeProfileModal();
}

// === ADICIONAR VÍDEO (PAIS) ===
function addNewVideo() {
    const url = document.getElementById('new-vid-url').value;
    const title = document.getElementById('new-vid-title').value;
    const subject = document.getElementById('new-vid-subject').value;

    let ytId = "";
    try { ytId = url.split('v=')[1].substring(0, 11); }
    catch (e) { alert("Use um link válido do YouTube (com v=...)"); return; }

    if(title && ytId) {
        State.videos.push({
            id: Date.now(), title: title, subject: subject,
            points: 50, time: '10:00', platform: 'YouTube Kids', ytId: ytId, watched: false
        });
        alert("Vídeo adicionado!");
        document.getElementById('new-vid-url').value = '';
        document.getElementById('new-vid-title').value = '';
    }
}
function updateTimeSliderDisplay(value) {
    const displayElement = document.getElementById('current-time-display');
    if (!displayElement) return;

    const totalMinutes = parseInt(value);

    if (totalMinutes >= 60) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (minutes > 0) {
            displayElement.innerText = `${hours}h e ${minutes} min`;
        } else {
            displayElement.innerText = hours === 1 ? `${hours} hora` : `${hours} horas`;
        }
    } else {
        displayElement.innerText = `${totalMinutes} minutos`;
    }
}