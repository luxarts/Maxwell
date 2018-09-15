@echo off
cls

:main
echo Where host server?
echo 1) Local (localhost)
echo 2) LAN (192.168.0.13)

choice /c 12 /n
cls

if %errorlevel% == 1 goto local
if %errorlevel% == 2 goto lan
goto main:

:local
cd www/
python -m http.server 80 --bind 127.0.0.1
goto end

:lan
cd www/
python -m http.server 80 --bind 192.168.0.13
goto end

:end