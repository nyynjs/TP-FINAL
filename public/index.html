<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TourPlanner Pro</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#667eea">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="TourPlanner Pro">
    <link rel="apple-touch-icon" href="icon.png">
    <style>
        :root {
            --primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --primary-solid: #667eea;
            --primary-dark: #5a67d8;
            --secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --warning: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            --error: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            
            --bg-primary: #0f0f23;
            --bg-secondary: #1a1a2e;
            --bg-card: rgba(255, 255, 255, 0.05);
            --bg-glass: rgba(255, 255, 255, 0.1);
            
            --text-primary: #ffffff;
            --text-secondary: rgba(255, 255, 255, 0.7);
            --text-muted: rgba(255, 255, 255, 0.5);
            
            --border: rgba(255, 255, 255, 0.1);
            --border-hover: rgba(255, 255, 255, 0.2);
            
            --shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.4);
            --glow: 0 0 20px rgba(102, 126, 234, 0.3);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Animated background */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.05) 0%, transparent 50%);
            animation: float 20s ease-in-out infinite;
            pointer-events: none;
            z-index: -1;
        }

        @keyframes float {
            0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
        }

        /* Header */
        .header {
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
            box-shadow: var(--shadow);
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--primary);
            animation: shimmer 2s linear infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        .header h1 {
            font-size: clamp(28px, 5vw, 36px);
            font-weight: 800;
            background: var(--primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
            letter-spacing: -1px;
        }

        .header .subtitle {
            color: var(--text-secondary);
            font-size: 16px;
            font-weight: 500;
        }

        /* Install prompt */
        .install-prompt {
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 30px;
            display: none;
            align-items: center;
            gap: 15px;
            animation: slideDown 0.5s ease;
        }

        @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .install-prompt .icon {
            font-size: 24px;
            filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
        }

        .install-prompt .text {
            flex: 1;
            font-weight: 500;
        }

        /* Glassmorphism cards */
        .glass-card {
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .glass-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }

        .glass-card:hover {
            transform: translateY(-5px);
            border-color: var(--border-hover);
            box-shadow: var(--shadow-lg);
        }

        .card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 25px;
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
        }

        .card-header .icon {
            font-size: 24px;
            background: var(--primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.3));
        }

        /* Form elements */
        .form-group {
            margin-bottom: 24px;
            position: relative;
        }

        .form-group label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--text-primary);
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .form-control, select {
            width: 100%;
            padding: 16px 20px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid var(--border);
            border-radius: 12px;
            font-size: 16px;
            color: var(--text-primary);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .form-control:focus, select:focus {
            outline: none;
            border-color: var(--primary-solid);
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
            transform: translateY(-1px);
        }

        .form-control:disabled, select:disabled {
            background: rgba(255, 255, 255, 0.02);
            color: var(--text-muted);
            cursor: not-allowed;
        }

        .form-control::placeholder {
            color: var(--text-muted);
        }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 16px 28px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            min-height: 56px;
            gap: 10px;
            position: relative;
            overflow: hidden;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s;
        }

        .btn:hover::before {
            left: 100%;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            border: 1px solid var(--border);
        }

        .btn-secondary:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.15);
            border-color: var(--border-hover);
        }

        .btn-warning {
            background: var(--warning);
            color: var(--bg-primary);
        }

        .btn:disabled {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-muted);
            cursor: not-allowed;
            transform: none;
        }

        .btn-block {
            width: 100%;
            margin-bottom: 16px;
        }

        /* Status indicators */
        .status {
            padding: 16px 20px;
            border-radius: 12px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            display: none;
            backdrop-filter: blur(20px);
            border: 1px solid;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .status.success {
            background: rgba(79, 172, 254, 0.1);
            color: #4facfe;
            border-color: rgba(79, 172, 254, 0.3);
        }

        .status.error {
            background: rgba(250, 112, 154, 0.1);
            color: #fa709a;
            border-color: rgba(250, 112, 154, 0.3);
        }

        .status.warning {
            background: rgba(67, 233, 123, 0.1);
            color: #43e97b;
            border-color: rgba(67, 233, 123, 0.3);
        }

        .token-status {
            padding: 16px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 25px;
            backdrop-filter: blur(20px);
            border: 1px solid;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .token-valid {
            background: rgba(79, 172, 254, 0.15);
            color: #4facfe;
            border-color: rgba(79, 172, 254, 0.3);
            box-shadow: 0 4px 20px rgba(79, 172, 254, 0.1);
        }

        .token-invalid {
            background: rgba(250, 112, 154, 0.15);
            color: #fa709a;
            border-color: rgba(250, 112, 154, 0.3);
        }

        .token-warning {
            background: rgba(67, 233, 123, 0.15);
            color: #43e97b;
            border-color: rgba(67, 233, 123, 0.3);
        }

        /* Search container */
        .search-container {
            position: relative;
        }

        .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-card);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-top: none;
            border-radius: 0 0 12px 12px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            box-shadow: var(--shadow);
        }

        .dropdown-item {
            padding: 16px 20px;
            cursor: pointer;
            border-bottom: 1px solid var(--border);
            color: var(--text-primary);
            transition: all 0.2s ease;
        }

        .dropdown-item:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--primary-solid);
        }

        .dropdown-item:last-child {
            border-bottom: none;
        }

        /* Checkbox */
        .checkbox-container {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 16px 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 1px solid var(--border);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .checkbox-container:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: var(--primary-solid);
        }

        .checkbox {
            width: 22px;
            height: 22px;
            accent-color: var(--primary-solid);
            cursor: pointer;
            border-radius: 4px;
        }

        .checkbox-label {
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin: 0;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Loading animation */
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: var(--primary-solid);
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .hidden {
            display: none !important;
        }

        /* Grid layouts */
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
        }

        /* Time inputs styling */
        input[type="time"], input[type="date"] {
            color-scheme: dark;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
            .container {
                padding: 15px;
            }
            
            .glass-card {
                padding: 20px;
                border-radius: 16px;
            }
            
            .header {
                padding: 20px;
                border-radius: 16px;
            }
            
            .btn {
                min-height: 52px;
                padding: 14px 20px;
            }
            
            .form-control, select {
                padding: 14px 16px;
                font-size: 16px; /* Prevents zoom on iOS */
            }
        }

        /* Pulse animation for important elements */
        .pulse {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
            100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
        }

        /* Micro-interactions */
        .interactive {
            transition: all 0.2s ease;
        }

        .interactive:active {
            transform: scale(0.98);
        }

        /* Form hint */
        .form-hint {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* Success state styling */
        .success-state {
            background: rgba(79, 172, 254, 0.1);
            border-color: rgba(79, 172, 254, 0.3) !important;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Install Prompt -->
        <div id="installPrompt" class="install-prompt">
            <span class="icon">📱</span>
            <span class="text">Dodaj TourPlanner do ekranu głównego dla łatwiejszego dostępu!</span>
            <button id="installBtn" class="btn btn-primary">Zainstaluj</button>
            <button id="dismissInstall" class="btn btn-secondary">✕</button>
        </div>

        <!-- Header -->
        <div class="header">
            <h1>✨ TourPlanner Pro</h1>
            <div class="subtitle">Nowa generacja zarządzania akcjami • By Mikołaj B</div>
        </div>

        <!-- Token Configuration Section -->
        <div class="glass-card">
            <div class="card-header">
                <span class="icon">🔑</span>
                <span>Konfiguracja połączenia</span>
            </div>
            
            <div id="tokenStatus" class="token-status"></div>
            
            <div class="form-group">
                <label for="username"><span>👤</span> Nazwa użytkownika</label>
                <input type="text" id="username" class="form-control interactive" placeholder="Wprowadź swoją nazwę użytkownika" autocomplete="username">
            </div>

            <div class="form-group">
                <label for="password"><span>🔒</span> Hasło</label>
                <input type="password" id="password" class="form-control interactive" placeholder="Wprowadź swoje hasło" autocomplete="current-password">
            </div>

            <div class="form-group">
                <label for="proxyUrl"><span>🌐</span> Proxy Server URL</label>
                <input type="url" id="proxyUrl" class="form-control interactive" value="" placeholder="https://your-proxy-server.com">
                <div class="form-hint">
                    <span>💡</span>
                    <span>Zostaw puste aby użyć bieżącego serwera</span>
                </div>
            </div>
            
            <button id="saveConfig" class="btn btn-primary btn-block interactive">
                <span>💾</span> Zapisz konfigurację
            </button>
            <button id="refreshToken" class="btn btn-secondary btn-block interactive">
                <span>🔄</span> Odśwież token
            </button>
            <button id="testConnection" class="btn btn-warning btn-block interactive">
                <span>🔍</span> Test połączenia
            </button>
            
            <div id="configStatus" class="status"></div>
        </div>

        <!-- Action Creation Form -->
        <div id="actionForm" class="glass-card hidden">
            <div class="card-header">
                <span class="icon">📝</span>
                <span>Tworzenie nowej akcji</span>
            </div>

            <form id="tpForm">
                <div class="form-group">
                    <label for="tpName"><span>📝</span> Nazwa akcji</label>
                    <input type="text" id="tpName" class="form-control interactive" required placeholder="Wprowadź nazwę akcji">
                </div>

                <!-- Velo Mode Toggle -->
                <div class="form-group">
                    <div class="checkbox-container interactive">
                        <input type="checkbox" id="veloMode" class="checkbox">
                        <label for="veloMode" class="checkbox-label">
                            <span>🚴</span> Tryb Velo
                        </label>
                    </div>
                    <div class="form-hint">
                        <span>💡</span>
                        <span>Automatycznie ustawia event "Unconvencional" i dedykowany punkt</span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="tpTerr"><span>🌍</span> Region / Terytorium</label>
                    <select id="tpTerr" class="form-control interactive" required>
                        <option value="">⏳ Ładowanie regionów...</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="tpEvent"><span>🎯</span> Event</label>
                    <select id="tpEvent" class="form-control interactive" required>
                        <option value="">Najpierw wybierz region</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="tpPointSearch"><span>📍</span> Punkt akcji</label>
                    <div class="search-container">
                        <input type="text" id="tpPointSearch" class="form-control interactive" placeholder="Najpierw wybierz region i event" autocomplete="off" disabled>
                        <div id="tpPointDropdown" class="dropdown"></div>
                        <input type="hidden" id="tpPoint" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="tpDate"><span>📅</span> Data realizacji</label>
                    <input type="date" id="tpDate" class="form-control interactive" required>
                </div>

                <div class="form-group">
                    <label for="tpFromTime"><span>🕒</span> Godzina rozpoczęcia</label>
                    <input type="time" id="tpFromTime" class="form-control interactive" value="10:00" required>
                </div>

                <div class="form-group">
                    <label for="tpToTime"><span>🕘</span> Godzina zakończenia</label>
                    <input type="time" id="tpToTime" class="form-control interactive" value="14:00" required>
                    <div class="form-hint">
                        <span>💡</span>
                        <span>Automatycznie dodane +4h, możesz dostosować</span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="tpUserSearch"><span>👥</span> Przypisany personel</label>
                    <div class="search-container">
                        <input type="text" id="tpUserSearch" class="form-control interactive" placeholder="Najpierw wybierz region" autocomplete="off" disabled>
                        <div id="tpUserDropdown" class="dropdown"></div>
                        <input type="hidden" id="tpUser" required>
                    </div>
                </div>

                <button type="submit" id="submitBtn" class="btn btn-primary btn-block interactive pulse">
                    <span class="btn-text">
                        <span>🚀</span> Utwórz akcję
                    </span>
                    <span class="loading hidden"></span>
                </button>
            </form>

            <div id="formStatus" class="status"></div>
        </div>

        <!-- Quick Actions -->
        <div class="glass-card">
            <div class="card-header">
                <span class="icon">⚡</span>
                <span>Szybkie akcje</span>
            </div>
            
            <div class="quick-actions">
                <button id="refreshData" class="btn btn-secondary interactive">
                    <span>🔄</span> Odśwież dane
                </button>
                <a href="debug.html" class="btn btn-warning interactive">
                    <span>🔍</span> Panel debugowania
                </a>
            </div>
        </div>
    </div>

    <script src="app.js"></script>

    <script>
        // Enhanced interactions
        document.addEventListener('DOMContentLoaded', function() {
            // Add interactive feedback
            document.querySelectorAll('.interactive').forEach(element => {
                element.addEventListener('mousedown', function() {
                    this.style.transform = 'scale(0.98)';
                });
                
                element.addEventListener('mouseup', function() {
                    this.style.transform = '';
                });
                
                element.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                });
            });

            // Success state for forms
            const inputs = document.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.addEventListener('change', function() {
                    if (this.value && this.checkValidity()) {
                        this.classList.add('success-state');
                    } else {
                        this.classList.remove('success-state');
                    }
                });
            });

            // Smooth scroll for mobile
            if ('scrollBehavior' in document.documentElement.style) {
                document.documentElement.style.scrollBehavior = 'smooth';
            }
        });
    </script>
</body>
</html>
