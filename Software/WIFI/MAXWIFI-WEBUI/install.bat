cls
@echo off
echo ##########################################
echo # Installing global gulp-cli        (1/9)# 
echo ##########################################
call npm install --global gulp-cli
echo.

cls
echo ##########################################
echo # Creating package.json		 (2/9)#
echo ##########################################
call npm init

cls
echo ##########################################
echo # Installing gulp (v4.0.0)          (3/9)#
echo ##########################################
call npm install --save-dev gulp@next
echo.

cls
echo ##########################################
echo # Installing gulp-uglify-es         (4/9)#
echo ##########################################
call npm install --save-dev gulp-uglify-es
echo.

cls
echo ##########################################
echo # Installing gulp-clean-css         (5/9)#
echo ##########################################
call npm install --save-dev gulp-clean-css
echo.

cls
echo ##########################################
echo # Installing gulp-del               (6/9)#
echo ##########################################
call npm install --save-dev del
echo.

cls
echo ##########################################
echo # Installing gulp-gzip              (7/9)#
echo ##########################################
call npm install --save-dev gulp-gzip
echo.

cls
echo ##########################################
echo # Installing gulp-htmlmin           (8/9)#
echo ##########################################
call npm install --save-dev gulp-htmlmin
echo.

cls
echo ##########################################
echo # Installing gulp-smosher           (9/9)#
echo ##########################################
call npm install --save-dev gulp-smoosher
echo.

echo ##########################################
echo Installation finished!
echo.
echo Press any key to exit...
pause >nul
exit