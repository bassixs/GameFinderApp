// Инициализация Telegram Web App
Telegram.WebApp.ready();

// Массив тестовых профилей
const profiles = [
    { name: "Иван", game: "CS:GO", hours: 10 },
    { name: "Мария", game: "LOL", hours: 15 },
    { name: "Петр", game: "Minecraft", hours: 20 }
];

let currentProfileIndex = 0;

// Функция показа профиля
function showProfile() {
    if (currentProfileIndex >= profiles.length) {
        document.getElementById('profileCard').classList.add('hidden');
        alert("Все профили просмотрены!");
        return;
    }

    const profile = profiles[currentProfileIndex];
    document.getElementById('name').textContent = profile.name;
    document.getElementById('game').textContent = profile.game;
    document.getElementById('hours').textContent = profile.hours + ' часов';
    document.getElementById('profileCard').classList.remove('hidden');
}

// Обработка нажатия кнопки "Лайк"
document.getElementById('likeButton').addEventListener('click', () => {
    sendData('like');
    nextProfile();
});

// Обработка нажатия кнопки "Дизлайк"
document.getElementById('dislikeButton').addEventListener('click', () => {
    sendData('dislike');
    nextProfile();
});

// Переход к следующему профилю
function nextProfile() {
    currentProfileIndex++;
    showProfile();
}

// Отправка данных в бот
function sendData(action) {
    const profile = profiles[currentProfileIndex];
    Telegram.WebApp.sendData(JSON.stringify({
        action: action,
        profile: profile
    }));
}

// Начало поиска
document.getElementById('startSearch').addEventListener('click', () => {
    showProfile();
    document.getElementById('startSearch').classList.add('hidden');
});