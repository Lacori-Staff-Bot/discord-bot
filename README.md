# Back-end Lacori/Staff bot

# Установка

## Требуемые компоненты

### Ubuntu Sever 22.04+
```
sudo apt-get update
sudo apt-get upgrade
```
Установить последние обновления системы

### MariaDB

`sudo apt install mariadb-server` - Установка СУБД
`sudo mysql_secure_installation` - Начальная настройка СУБД

### Docker Engine + docker_compose_plugin

```
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
Установка Docker Engine + docker_compose_plugin

## Настройка

### MariaDB

1. Отредактировать файлы конфигурации и перезагрузить mariadb для их принятия

/etc/mysql/mariadb.cnf

`#port: 3306` - Раскоментировать строчку удалив #

/etc/mysql/mariadb.conf.d/50-server.cnf

`bind-address = 127.0.0.1` - Заменить адрес на 172.17.0.1

`sudo systemctl restart mariadb.service` - Презапуск mariadb

2. Создать базу данных и пользователя

`sudo mariadb` - Вход в СУБД
```sql
    CREATE DATABASE `discord-bot`; --Создать базу данных
    CREATE USER 'username'@'172.17.%.%' IDENTIFIED BY 'password'; --Создать пользователя
    GRANT ALL PRIVILEGES ON `discord-bot`.* TO 'username'@'172.17.%.%'; --Выдать пользователю доступ к базе данных
    quit; --Выход из СУБД
```

### Docker

1. Скопировать github репоциторий на сервер

2. Создать в корне .env файл с кнофигурацией

```shell
API_PORT=3001
FRONT_END_URL=YOUR_FRONT_END_URL #http://example.com
CLIENT_ID=YORT_BOT_CLIENT_ID
CLIENT_SECRET=YOUR_BOT_CLIENT_SECRET
BOT_TOKEN=YOUR_BOT_TOKEN
MYSQL_HOST=host.docker.internal
MYSQL_PORT=3306
MYSQL_USER=YOUR_DATABASE_USER
MYSQL_PASSWORD=YOUR_DATABASE_PASSWORD
MYSQL_DATABASE=discord-bot
```
Шаблон настроек

3. Запустить контейнер

`sudo docker compose pull` - Применение файла конфигурации

`sudo docker compose up -d` - Запуск контейнера