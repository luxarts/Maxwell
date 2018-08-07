@ECHO OFF
CLS

:main
ECHO Select an option:
ECHO 1) No smoosh (JS and CSS files will not be inserted into HTML)
ECHO 2) Smoosh (JS and CSS files will be inserted into HTML)
CHOICE /C 12 /N
CLS

IF %errorlevel% == 1 GOTO nosmoosh
IF %errorlevel% == 2 GOTO smoosh
GOTO main

:nosmoosh
ECHO ######################################
ECHO # Option: No smoosh                  #
ECHO ######################################
CALL gulp nosmoosh
GOTO finished

:smoosh
ECHO ######################################
ECHO # Option: Smoosh                     #
ECHO ######################################
CALL gulp smoosh
GOTO finished

:: call gulp nosmoosh

:finished
ECHO.
ECHO ######################################
ECHO Compression finished!
ECHO.
ECHO Press any key to exit...
PAUSE >NUL