@ECHO OFF
CLS
ECHO ######################################
ECHO # Building Materialize               #
ECHO ######################################
call sass sass/materialize/materialize.scss www/css/materialize.css
ECHO .
ECHO ######################################
ECHO # Building WEBUI                     #
ECHO ######################################
call sass sass/WEBUI/webui.scss www/css/main.css
ECHO .
ECHO ######################################
ECHO Task finished!
ECHO.
ECHO Press any key to exit...