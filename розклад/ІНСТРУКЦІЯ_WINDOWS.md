# Інструкція для запуску на Windows

## Швидкий старт

### Варіант 1: Запуск через PowerShell (рекомендовано)

1. Відкрийте PowerShell в папці проекту (правою кнопкою миші → "Відкрити в Terminal")
2. Запустіть скрипт:
```powershell
.\start.ps1
```

### Варіант 2: Подвійний клік

Просто двічі клацніть по файлу `start.ps1` - він запуститься автоматично.

---

## Якщо виникає помилка "execution policy"

Якщо ви бачите помилку:
```
cannot be loaded because running scripts is disabled on this system
```

### Рішення 1: Дозволити для поточної сесії (безпечно)

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\start.ps1
```

### Рішення 2: Дозволити для поточного користувача (постійно)

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Після цього команда `.\start.ps1` буде працювати завжди.

### Рішення 3: Запуск через bypass (разово)

```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

---

## Доступні скрипти

| Скрипт | Опис |
|--------|------|
| `start.ps1` | 🚀 Повний запуск з перевірками |
| `stop.ps1` | ⛔ Зупинка всіх сервісів |
| `restart.ps1` | 🔄 Перезапуск всіх сервісів |

---

## Альтернатива: Використання Docker Compose напряму

Якщо не хочете використовувати скрипти, можете керувати вручну:

```powershell
# Запуск
docker-compose up -d

# Зупинка
docker-compose down

# Перезапуск
docker-compose restart

# Логи
docker-compose logs -f
```

---

## Що робити якщо Docker Desktop не запущений?

1. Натисніть `Win + S`
2. Знайдіть "Docker Desktop"
3. Запустіть програму
4. Дочекайтесь поки Docker стане активним (зелена іконка в треї)
5. Запустіть `.\start.ps1`

---

## Посилання на сервіси після запуску

- **Frontend (веб-інтерфейс):** http://localhost:5173
- **Backend API (документація):** http://localhost:8000/docs
- **База даних PostgreSQL:** localhost:5432
  - Database: `rozklad`
  - User: `rozklad_user`
  - Password: `rozklad_pass`

---

## Корисні команди для діагностики

```powershell
# Перевірити чи Docker працює
docker ps

# Подивитись статус контейнерів проекту
docker-compose ps

# Подивитись логи з помилками
docker-compose logs --tail=50

# Перевірити використання ресурсів
docker stats

# Очистити все та почати заново
docker-compose down -v
.\start.ps1
```

---

## Вимоги

✅ Windows 10/11  
✅ Docker Desktop for Windows  
✅ PowerShell 5.1+ (вже встановлений в Windows)

---

## Підтримка

Якщо виникають проблеми:

1. Переконайтесь що Docker Desktop запущений
2. Переконайтесь що порти 5173, 8000, 5432 вільні
3. Спробуйте повністю перезапустити:
   ```powershell
   docker-compose down -v
   .\start.ps1
   ```
4. Перегляньте логи: `docker-compose logs -f`


