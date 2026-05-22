// js/data.js

const State = {
    user: {
        name: 'Maria',
        avatar: '🦄',
        points: 0,
        watchedCount: 0
    },
    currentVideoPlaying: null,

    // Lista de avatares disponíveis baseada na sua imagem
    avatars: ['🦁', '🐼', '🦊', '🐯', '🐨', '🐸', '🦄', '🦋', '🐙', '🦕', '🚀', '⭐'],

    // Catálogo de Vídeos
    videos: [
        { id: 1, title: 'Tabuada Divertida do 5', subject: 'Matemática', points: 50, time: '12:30', platform: 'StarMind', ytId: 'n4K_I6K8bAM', watched: false },
        { id: 2, title: 'Como as Plantas Crescem?', subject: 'Ciências', points: 60, time: '15:45', platform: 'YouTube Kids', ytId: '8I9S_wH_Xb8', watched: false },
        { id: 3, title: 'Histórias da Gramática', subject: 'Português', points: 40, time: '10:20', platform: 'StarMind', ytId: 'Q-XN85G55Y4', watched: false },
        { id: 4, title: 'Inglês com Músicas', subject: 'Inglês', points: 35, time: '08:15', platform: 'Netflix', ytId: 'Y9jF1w-4V5c', watched: false },
        { id: 5, title: 'Pinturas Famosas', subject: 'Arte', points: 70, time: '20:00', platform: 'StarMind', ytId: 'n4K_I6K8bAM', watched: false },
        { id: 6, title: 'Instrumentos do Mundo', subject: 'Música', points: 60, time: '16:40', platform: 'Netflix', ytId: '8I9S_wH_Xb8', watched: false }
    ],

    // Sistema de Conquistas
    achievements: [
        { id: 'a1', title: 'Primeira Estrela', desc: 'Assistiu ao primeiro vídeo', required: 1, icon: '⭐' },
        { id: 'a2', title: 'Cientista Junior', desc: 'Completou vídeos de ciências', required: 3, icon: '🔬' },
        { id: 'a3', title: 'Mestre da Matemática', desc: 'Assistiu vídeos de matemática', required: 5, icon: '🏆' },
        { id: 'a4', title: 'Poliglota', desc: 'Completou vídeos em inglês', required: 3, icon: '🌍' },
        { id: 'a5', title: 'Maratona do Saber', desc: 'Assistiu 10 vídeos', required: 10, icon: '⚡' }
    ]
};