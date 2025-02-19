// Инициализация Telegram Web App
Telegram.WebApp.ready();

// Массив тестовых профилей
const profiles = [
    { name: "Иван", game: "CS:GO", hours: 10 },
    { name: "Мария", game: "LOL", hours: 15 },
    { name: "Петр", game: "Minecraft", hours: 20 }
];

let currentProfileIndex = 0;

// Проверяем наличие профиля у пользователя
function checkUserProfile() {
    // Отправляем запрос боту для проверки наличия профиля
    Telegram.WebApp.sendData(JSON.stringify({ action: 'check_profile' }));
}

// Функция показа формы создания профиля
function showCreateProfileForm() {
    document.getElementById('createProfile').classList.remove('hidden');
    document.getElementById('startSearch').classList.add('hidden');
}

// Функция сохранения профиля
document.getElementById('saveProfile').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const game = document.getElementById('game').value;
    const hours = document.getElementById('hours').value;

    if (name && game && hours) {
        saveProfileToBot(name, game, hours);
        document.getElementById('createProfile').classList.add('hidden');
        document.getElementById('startSearch').classList.remove('hidden');
    } else {
        alert("Пожалуйста, заполните все поля.");
    }
});

// Функция отправки профиля в бот
function saveProfileToBot(name, game, hours) {
    Telegram.WebApp.sendData(JSON.stringify({
        action: 'save_profile',
        profile: {
            name: name,
            game: game,
            hours: hours
        }
    }));
}

// Функция показа профиля
function showProfile() {
    if (currentProfileIndex >= profiles.length) {
        document.getElementById('profileCard').classList.add('hidden');
        alert("Все профили просмотрены!");
        return;
    }

    const profile = profiles[currentProfileIndex];
    document.getElementById('nameDisplay').textContent = profile.name;
    document.getElementById('gameDisplay').textContent = profile.game;
    document.getElementById('hoursDisplay').textContent = profile.hours + ' часов';
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

// Проверяем профиль при загрузке приложения
checkUserProfile();