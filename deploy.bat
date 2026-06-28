@echo off
echo ===================================================
echo FrontEndBattle RPA Operator Terminal Deployment
echo ===================================================
echo.
echo Running predeploy build steps...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed. Deployment aborted.
    pause
    exit /b %errorlevel%
)

echo.
echo Deploying dist folder to gh-pages branch...
call npx gh-pages -d dist
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Deployment failed. Please verify git repository configuration and internet connectivity.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo [SUCCESS] Application successfully deployed to gh-pages!
echo ===================================================
pause
