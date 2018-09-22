@ECHO OFF
CLS

:main
ECHO Select an option:
ECHO 1) Compressed
ECHO 2) Not compressed
CHOICE /C 12 /N
CLS

IF %errorlevel% == 1 GOTO compressed
IF %errorlevel% == 2 GOTO notcompressed
GOTO main

:compressed
ECHO ######################################
ECHO # Option: Compressed                 #
ECHO ######################################
CALL gulp compressed
GOTO finished

:notcompressed
ECHO ######################################
ECHO # Option: Not compressed             #
ECHO ######################################
CALL gulp notcompressed
GOTO finished

:finished
ECHO.
ECHO ######################################
ECHO Task finished!
ECHO.
ECHO Press any key to exit...
PAUSE >NUL