@echo off
cd /d "C:\Users\Z\Workspace\Project001-pet-blind-box"
echo 光球版预览启动中...
echo 电脑上打开: http://localhost:4183
echo 手机打开(需同一WiFi): http://192.168.31.75:4183
echo.
npx serve dist -p 4183
pause
