import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
import json
import sqlite3
from dotenv import load_dotenv
import os

# Загрузка переменных окружения
load_dotenv()

# Получение токена бота из переменной окружения
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

# Инициализация бота
bot = telebot.TeleBot(BOT_TOKEN)

# Подключение к базе данных
conn = sqlite3.connect('gamefinder.db', check_same_thread=False)
cursor = conn.cursor()

# Создание таблицы для хранения профилей
cursor.execute('''
CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    name TEXT,
    game TEXT,
    hours INTEGER
)
''')
conn.commit()

# Функция для получения профиля пользователя
def get_profile(user_id):
    try:
        cursor.execute('SELECT * FROM profiles WHERE user_id = ?', (user_id,))
        profile = cursor.fetchone()
        
        if profile:
            return {
                'id': profile[0],
                'user_id': profile[1],
                'name': profile[2],
                'game': profile[3],
                'hours': profile[4]
            }
        else:
            return None
    except Exception as e:
        print(f"Ошибка при получении профиля: {e}")
        return None

# Функция для сохранения профиля пользователя
def save_profile(user_id, name, game, hours):
    try:
        cursor.execute('SELECT * FROM profiles WHERE user_id = ?', (user_id,))
        existing_profile = cursor.fetchone()
        
        if existing_profile:
            cursor.execute('''
            UPDATE profiles
            SET name = ?, game = ?, hours = ?
            WHERE user_id = ?
            ''', (name, game, hours, user_id))
        else:
            cursor.execute('''
            INSERT INTO profiles (user_id, name, game, hours)
            VALUES (?, ?, ?, ?)
            ''', (user_id, name, game, hours))
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Ошибка при сохранении профиля: {e}")
        return False

# Обработчик команды /start
@bot.message_handler(commands=['start'])
def start(message):
    markup = InlineKeyboardMarkup()
    web_app_button = InlineKeyboardButton(
        text="Начать поиск тиммейтов",
        web_app=WebAppInfo(url='https://bassixs.github.io/GameFinderApp/')
    )
    markup.add(web_app_button)
    
    bot.send_message(
        message.chat.id,
        "Добро пожаловать! Нажмите кнопку ниже, чтобы начать поиск.",
        reply_markup=markup
    )

# Обработчик данных от mini-app
@bot.message_handler(content_types=['web_app_data'])
def handle_webapp(message):
    data = json.loads(message.web_app_data.data)
    user_id = message.from_user.id
    
    if data['action'] == 'check_profile':
        # Проверяем наличие профиля
        profile = get_profile(user_id)
        
        if profile:
            # Если профиль существует, отправляем команду "start_search"
            bot.send_message(message.chat.id, "Ваш профиль найден. Вы можете начать поиск.")
            Telegram.WebApp.MainButton.setText("Начать поиск")
            Telegram.WebApp.MainButton.setParams({ 'data': json.dumps({ 'message': 'start_search' }) })
        else:
            # Если профиля нет, отправляем команду "create_profile"
            bot.send_message(message.chat.id, "У вас еще нет профиля. Пожалуйста, создайте его.")
            Telegram.WebApp.MainButton.setText("Создать профиль")
            Telegram.WebApp.MainButton.setParams({ 'data': json.dumps({ 'message': 'create_profile' }) })
    
    elif data['action'] == 'save_profile':
        # Сохраняем профиль
        profile = data['profile']
        
        if save_profile(user_id, profile['name'], profile['game'], profile['hours']):
            bot.send_message(message.chat.id, "Ваш профиль успешно сохранен!")
        else:
            bot.send_message(message.chat.id, "Произошла ошибка при сохранении профиля.")
    
    elif data['action'] == 'like':
        # Обработка лайка
        bot.send_message(
            message.chat.id,
            f"Вы поставили лайк профилю {data['profile']['name']}!"
        )
    
    elif data['action'] == 'dislike':
        # Обработка дизлайка
        bot.send_message(
            message.chat.id,
            f"Вы пропустили профиль {data['profile']['name']}."
        )

# Запуск бота
if __name__ == '__main__':
    bot.polling()