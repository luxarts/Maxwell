@ECHO OFF
CLS

:main
ECHO Select an option:
ECHO 1) No smoosh (JS and CSS files will not be inserted into HTML)
ECHO 2) Smoosh (JS and CSS files will be inserted into HTML)
ECHO 3) Package
CHOICE /C 123 /N
CLS

IF %errorlevel% == 1 GOTO nosmoosh
IF %errorlevel% == 2 GOTO smoosh
IF %errorlevel% == 3 GOTO package
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

:package
ECHO ######################################
ECHO # Option: Default                    #
ECHO ######################################
CALL gulp package
GOTO finished

:: call gulp nosmoosh

:finished
ECHO.
ECHO ######################################
ECHO Compression finished!
ECHO.
ECHO Press any key to exit...
PAUSE >NUL