cls
@echo off
echo ##########################################
echo # Installing global gulp-cli       (1/16)# 
echo ##########################################
call npm install --global gulp-cli
echo.

cls
echo ##########################################
echo # Creating package.json		(2/16)#
echo ##########################################
call npm init

cls
echo ##########################################
echo # Installing gulp (v4.0.0)         (3/16)#
echo ##########################################
call npm install --save-dev gulp@next
echo.

cls
echo ##########################################
echo # Installing gulp-jshint           (4/16)#
echo ##########################################
call npm install --save-dev gulp-jshint
echo.

cls
echo ##########################################
echo # Installing jshint                (5/16)#
echo ##########################################
call npm install --save-dev jshint
echo.

cls
echo ##########################################
echo # Installing gulp-if               (6/16)#
echo ##########################################
call npm install --save-dev gulp-if
echo.

cls
echo ##########################################
echo # Installing gulp-concat           (7/16)#
echo ##########################################
call npm install --save-dev gulp-concat
echo.

cls
echo ##########################################
echo # Installing gulp-uglify-es        (8/16)#
echo ##########################################
call npm install --save-dev gulp-uglify-es
echo.

cls
echo ##########################################
echo # Installing gulp-clean-css        (9/16)#
echo ##########################################
call npm install --save-dev gulp-clean-css
echo.

cls
echo ##########################################
echo # Installing gulp-remove-code     (10/16)#
echo ##########################################
call npm install --save-dev gulp-remove-code
echo.

cls
echo ##########################################
echo # Installing gulp-del             (11/16)#
echo ##########################################
call npm install --save-dev del
echo.

cls
echo ##########################################
echo # Installing gulp-zip             (12/16)#
echo ##########################################
call npm install --save-dev gulp-zip
echo.

cls
echo ##########################################
echo # Installing gulp-gzip            (13/16)#
echo ##########################################
call npm install --save-dev gulp-gzip
echo.

cls
echo ##########################################
echo # Installing gulp-htmlmin         (14/16)#
echo ##########################################
call npm install --save-dev gulp-htmlmin
echo.

cls
echo ##########################################
echo # Installing gulp-replace         (15/16)#
echo ##########################################
call npm install --save-dev gulp-replace
echo.

cls
echo ##########################################
echo # Installing gulp-smoosher        (16/16)#
echo ##########################################
call npm install --save-dev gulp-smoosher
echo.

echo ##########################################
echo Installation finished!
echo.
echo Press any key to exit...
pause >nul
exit