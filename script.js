// Инициализация Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    Telegram.WebApp.ready();
} else {
    console.error("Telegram Web App API не найден!");
}

// Массив тестовых профилей
const profiles = [
    { name: "Иван", game: "CS:GO", hours: 10 },
    { name: "Мария", game: "LOL", hours: 15 },
    { name: "Петр", game: "Minecraft", hours: 20 }
];

let currentProfileIndex = 0;

// Проверка наличия профиля
function checkUserProfile() {
    // Отправляем запрос боту для проверки наличия профиля
    if (Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify({ action: 'check_profile' }));
    } else {
        console.error("Telegram Web App API недоступен.");
    }
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
    if (Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify({
            action: 'save_profile',
            profile: {
                name: name,
                game: game,
                hours: hours
            }
        }));
    } else {
        console.error("Telegram Web App API недоступен.");
    }
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
    if (Telegram.WebApp) {
        Telegram.WebApp.sendData(JSON.stringify({
            action: action,
            profile: profile
        }));
    } else {
        console.error("Telegram Web App API недоступен.");
    }
}

// Начало поиска
document.getElementById('startSearch').addEventListener('click', () => {
    showProfile();
    document.getElementById('startSearch').classList.add('hidden');
});

// Обработка ответа от бота
if (Telegram.WebApp) {
    Telegram.WebApp.onEvent('mainButtonClicked', function () {
        const data = JSON.parse(Telegram.WebApp.MainButton.data);

        if (data && data.message) {
            if (data.message === "create_profile") {
                // Показываем форму создания профиля
                showCreateProfileForm();
            } else if (data.message === "start_search") {
                // Начинаем поиск
                document.getElementById('startSearch').classList.remove('hidden');
            }
        }
    });
} else {
    console.error("Telegram Web App API недоступен.");
}

// Проверяем профиль при загрузке приложения
checkUserProfile();