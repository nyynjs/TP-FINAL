// TourPlanner PWA Application Logic
class TourPlannerApp {
    constructor() {
        this.config = {
            username: '',
            password: '',
            bearerToken: '',
            proxyUrl: '',
            tokenExpires: null
        };
        this.data = {
            territories: [],
            events: [],
            points: [],
            users: []
        };
        this.init();
    }

    async init() {
        // Load saved configuration
        this.loadConfig();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Register service worker
        this.registerServiceWorker();
        
        // Handle PWA install prompt
        this.setupInstallPrompt();
        
        // Auto-detect proxy URL if empty
        if (!this.config.proxyUrl) {
            this.config.proxyUrl = window.location.origin;
            document.getElementById('proxyUrl').value = this.config.proxyUrl;
        }
        
        // Update token status
        this.updateTokenStatus();
        
        // Auto-login if we have credentials but no valid token
        if (this.config.username && this.config.password && !this.isTokenValid()) {
            setTimeout(() => {
                this.refreshToken();
            }, 1000);
        } else if (this.isTokenValid()) {
            // If we have a valid token, load territories
            console.log('Valid token found, loading territories...');
            this.loadTerritories();
        }
    }

    loadConfig() {
        const savedUsername = localStorage.getItem('tp_username');
        const savedPassword = localStorage.getItem('tp_password');
        const savedToken = localStorage.getItem('tp_bearer_token');
        const savedTokenExpires = localStorage.getItem('tp_token_expires');
        const savedProxy = localStorage.getItem('tp_proxy_url');
        
        if (savedUsername) {
            this.config.username = savedUsername;
            document.getElementById('username').value = savedUsername;
        }
        
        if (savedPassword) {
            this.config.password = savedPassword;
            document.getElementById('password').value = savedPassword;
        }
        
        if (savedToken) {
            this.config.bearerToken = savedToken;
        }
        
        if (savedTokenExpires) {
            this.config.tokenExpires = new Date(savedTokenExpires);
        }
        
        if (savedProxy) {
            this.config.proxyUrl = savedProxy;
            document.getElementById('proxyUrl').value = savedProxy;
        } else {
            this.config.proxyUrl = window.location.origin;
            document.getElementById('proxyUrl').value = this.config.proxyUrl;
        }
    }

    saveConfig() {
        localStorage.setItem('tp_username', this.config.username);
        localStorage.setItem('tp_password', this.config.password);
        localStorage.setItem('tp_bearer_token', this.config.bearerToken);
        localStorage.setItem('tp_token_expires', this.config.tokenExpires?.toISOString() || '');
        localStorage.setItem('tp_proxy_url', this.config.proxyUrl);
    }

    updateTokenStatus() {
        const statusEl = document.getElementById('tokenStatus');
        const actionForm = document.getElementById('actionForm');
        
        if (this.config.username && this.config.password) {
            const tokenValid = this.config.bearerToken && this.isTokenValid();
            
            if (tokenValid) {
                statusEl.className = 'token-status token-valid';
                statusEl.textContent = `✅ Zalogowany jako: ${this.config.username}`;
                actionForm.classList.remove('hidden');
            } else {
                statusEl.className = 'token-status token-warning';
                statusEl.textContent = `🔄 Dane logowania zapisane - pobieranie tokenu...`;
                actionForm.classList.add('hidden');
                // Automatycznie pobierz nowy token
                this.refreshToken();
            }
        } else {
            statusEl.className = 'token-status token-invalid';
            statusEl.textContent = '❌ Wprowadź dane logowania';
            actionForm.classList.add('hidden');
        }
    }

    isTokenValid() {
        if (!this.config.tokenExpires) return false;
        const now = new Date();
        const expiresIn5Min = new Date(this.config.tokenExpires.getTime() - 5 * 60 * 1000);
        return now < expiresIn5Min;
    }

setupEventListeners() {
    // Save configuration
    document.getElementById('saveConfig').addEventListener('click', () => {
        this.config.username = document.getElementById('username').value.trim();
        this.config.password = document.getElementById('password').value.trim();
        this.config.proxyUrl = document.getElementById('proxyUrl').value.trim() || window.location.origin;
        
        this.saveConfig();
        this.updateTokenStatus();
        this.showStatus('configStatus', 'Konfiguracja zapisana!', 'success');
    });

    // Test connection
    document.getElementById('testConnection').addEventListener('click', () => {
        this.testConnection();
    });

    // Refresh token manually
    document.getElementById('refreshToken').addEventListener('click', () => {
        this.refreshToken();
    });
    
    // Velo mode toggle
    document.getElementById('veloMode').addEventListener('change', (e) => {
        this.handleVeloModeToggle(e.target.checked);
    });
    
    // Territory selection
    document.getElementById('tpTerr').addEventListener('change', (e) => {
        const territoryData = e.target.value;
        const isVeloMode = document.getElementById('veloMode').checked;

        if (territoryData) {
            if (isVeloMode) {
                this.setupVeloMode(territoryData);
            } else {
                this.loadEvents(territoryData);
            }
            this.loadUsers(); // Load users when territory changes
        } else {
            this.clearEvents();
            this.clearPoints();
            this.clearUsers();
        }
    });

    // Event selection
    document.getElementById('tpEvent').addEventListener('change', (e) => {
        const eventData = e.target.value;
        const territoryData = document.getElementById('tpTerr').value;
        const isVeloMode = document.getElementById('veloMode').checked;
        
        if (eventData && territoryData) {
            if (isVeloMode) {
                this.setupVeloPoint();
            } else {
                this.loadPoints(territoryData, eventData);
                this.enablePointSearch();
            }
        } else {
            this.clearPoints();
            this.disablePointSearch();
        }
    });

    // Point search
    document.getElementById('tpPointSearch').addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            this.searchPoints(query);
        } else {
            this.hidePointDropdown();
        }
    });

    // User search
    document.getElementById('tpUserSearch').addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            this.searchUsers(query);
        } else {
            this.hideUserDropdown();
        }
    });

    // Time calculation
    document.getElementById('tpFromTime').addEventListener('change', () => {
        this.updateEndTime();
    });

    // Form submission
    document.getElementById('tpForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.createAction();
    });

    // Refresh data
    document.getElementById('refreshData').addEventListener('click', () => {
        this.refreshAllData();
    });

    // Set today's date and current time as default
    const now = new Date();
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    document.getElementById('tpDate').value = today;
    
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('tpFromTime').value = `${currentHour}:${currentMinute}`;
    
    // POPRAWKA: Wywołaj updateEndTime() PO ustawieniu czasu rozpoczęcia
    this.updateEndTime();
}
    // Poprawiona funkcja refreshToken w app.js - używa proxy server
async refreshToken() {
    if (!this.config.username || !this.config.password) {
        this.showStatus('configStatus', 'Najpierw wprowadź dane logowania!', 'error');
        return false;
    }

    this.showStatus('configStatus', 'Pobieranie nowego tokenu...', 'warning');

    try {
        // ZMIANA: Używamy proxy server zamiast bezpośredniego połączenia
        const response = await fetch(`${this.config.proxyUrl}/api/tourplanner/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer temporary-for-login' // Tymczasowy header dla proxy
            },
            body: JSON.stringify({
                username: this.config.username,
                password: this.config.password
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Błąd HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (data.status && data.status.success && data.data && data.data.token) {
            this.config.bearerToken = data.data.token.uuid;
            this.config.tokenExpires = new Date(data.data.token.expires.date);
            
            this.saveConfig();
            this.updateTokenStatus();
            
            console.log(`✅ Nowy token pobrany! Wygasa: ${this.config.tokenExpires.toLocaleString()}`);
            this.showStatus('configStatus', `✅ Token odświeżony! Wygasa: ${this.config.tokenExpires.toLocaleString()}`, 'success');
            
            // Automatycznie załaduj dane po pobraniu tokenu
            this.loadTerritories();
            
            return true;
        } else {
            throw new Error('Niepoprawna odpowiedź API - brak tokenu');
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        this.showStatus('configStatus', `❌ Błąd pobierania tokenu: ${error.message}`, 'error');
        return false;
    }
}

    async ensureValidToken() {
        if (!this.isTokenValid()) {
            console.log('Token wygasł lub nie istnieje, pobieranie nowego...');
            return await this.refreshToken();
        }
        return true;
    }

    async apiRequest(endpoint, method = 'POST', body = null) {
        // Sprawdź czy token jest ważny przed każdym zapytaniem
        const tokenValid = await this.ensureValidToken();
        if (!tokenValid) {
            throw new Error('Nie można pobrać ważnego tokenu');
        }

        const url = `${this.config.proxyUrl}/api/tourplanner/${endpoint}`;
        
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${this.config.bearerToken}`,
                'Content-Type': 'application/json'
            }
        };

        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        console.log(`Making API request to: ${url}`);
        const response = await fetch(url, options);
        
        if (!response.ok) {
            // Jeśli błąd 401, spróbuj odświeżyć token i powtórzyć zapytanie
            if (response.status === 401) {
                console.log('Otrzymano 401, odświeżanie tokenu...');
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Powtórz zapytanie z nowym tokenem
                    options.headers['Authorization'] = `Bearer ${this.config.bearerToken}`;
                    const retryResponse = await fetch(url, options);
                    if (!retryResponse.ok) {
                        const errorText = await retryResponse.text();
                        throw new Error(`API Error ${retryResponse.status}: ${errorText}`);
                    }
                    return await retryResponse.json();
                }
            }
            
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        return await response.json();
    }

    async testConnection() {
        if (!this.config.username || !this.config.password) {
            this.showStatus('configStatus', 'Najpierw wprowadź dane logowania!', 'error');
            return;
        }

        this.showStatus('configStatus', 'Testowanie połączenia...', 'warning');

        try {
            // Najpierw pobierz token
            const tokenRefreshed = await this.refreshToken();
            if (!tokenRefreshed) {
                return;
            }

            // Potem przetestuj API
            const testData = await this.apiRequest('territory/list', 'POST', {
                pagination: { page: 0, pageSize: 1 }
            });

            if (testData && (testData.data || testData.length >= 0)) {
                this.showStatus('configStatus', '✅ Połączenie działa poprawnie!', 'success');
            } else {
                this.showStatus('configStatus', '⚠️ Połączenie działa, ale otrzymano nieoczekiwane dane', 'warning');
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            this.showStatus('configStatus', `❌ Błąd połączenia: ${error.message}`, 'error');
        }
    }

    handleVeloModeToggle(isVeloMode) {
    const territoryData = document.getElementById('tpTerr').value;
    
    if (isVeloMode) {
        // Velo mode - setup special event and point
        if (territoryData) {
            this.setupVeloMode(territoryData);
        }
    } else {
        // Normal mode - load regular events
        if (territoryData) {
            this.loadEvents(territoryData);
        } else {
            this.clearEvents();
        }
        this.clearPoints();
    }
}

setupVeloMode(territoryData) {
    console.log('Setting up Velo mode...');
    
    // Set up the Unconvencional event
    const eventSelect = document.getElementById('tpEvent');
    eventSelect.innerHTML = '<option value="">Wybierz event...</option>';
    
    const veloEventOption = document.createElement('option');
    veloEventOption.value = 'f6ab5b6c-8855-11ed-bb12-065ed9e1cfca|Unconvencional';
    veloEventOption.textContent = 'Unconvencional (Velo)';
    eventSelect.appendChild(veloEventOption);
    
    // Auto-select the Unconvencional event
    eventSelect.value = 'f6ab5b6c-8855-11ed-bb12-065ed9e1cfca|Unconvencional';
    
    // Setup the Velo point
    this.setupVeloPoint();
}

setupVeloPoint() {
    console.log('Setting up Velo point...');
    
    // Define the Velo point data
    const veloPoint = {
        uuid: "cdcea488-66f4-5ad3-acee-0dc4739e68b9",
        ident: "Unconvencional_R409D2S1",
        name: "Unconvencional_R409D2S1",
        address: {
            streetAddress: "",
            streetNumber: null,
            cityName: "",
            postalCode: null,
            geoLat: "0.00000000",
            geoLng: "0.00000000"
        }
    };
    
    // Set the point in the UI
    const pointSearchInput = document.getElementById('tpPointSearch');
    const pointHiddenInput = document.getElementById('tpPoint');
    
    pointSearchInput.value = `${veloPoint.ident} - ${veloPoint.name} (Velo)`;
    pointSearchInput.disabled = true;
    pointSearchInput.placeholder = 'Punkt Velo automatycznie ustawiony';
    
    pointHiddenInput.value = `${veloPoint.uuid}|${veloPoint.ident}|${veloPoint.name}|${JSON.stringify(veloPoint.address)}`;
    
    console.log('Velo point setup complete');
}

    async loadTerritories() {
    try {
        console.log('LOADTERRITORIES: Starting...');
        const response = await this.apiRequest('territory/list', 'POST', {
            pagination: { page: 0, pageSize: 100 }
        });

        console.log('LOADTERRITORIES: Full response:', JSON.stringify(response, null, 2));
        console.log('LOADTERRITORIES: Response type:', typeof response);
        console.log('LOADTERRITORIES: Response keys:', Object.keys(response || {}));
        
        // Obsługa różnych struktur odpowiedzi
        let territories = [];
        if (response.data && Array.isArray(response.data)) {
            territories = response.data;
            console.log('LOADTERRITORIES: Using response.data');
        } else if (response.items && Array.isArray(response.items)) {
            territories = response.items;
            console.log('LOADTERRITORIES: Using response.items');
        } else if (Array.isArray(response)) {
            territories = response;
            console.log('LOADTERRITORIES: Using response directly');
        } else {
            console.error('LOADTERRITORIES: Unexpected response structure:', response);
            territories = [];
        }

        console.log('LOADTERRITORIES: Extracted territories count:', territories.length);
        console.log('LOADTERRITORIES: First territory:', JSON.stringify(territories[0], null, 2));
        
        this.data.territories = territories;
        console.log('LOADTERRITORIES: Calling populateTerritories...');
        this.populateTerritories();
        console.log('LOADTERRITORIES: Done');
        
    } catch (error) {
        console.error('LOADTERRITORIES: Failed:', error);
        this.showStatus('configStatus', `Błąd ładowania regionów: ${error.message}`, 'error');
    }
}

populateTerritories() {
    console.log('POPULATE: Starting with', this.data.territories.length, 'territories');
    console.log('POPULATE: First territory structure:', JSON.stringify(this.data.territories[0], null, 2));
    
    const select = document.getElementById('tpTerr');
    console.log('POPULATE: Found select element:', !!select);
    select.innerHTML = '<option value="">Wybierz region...</option>';
    
    this.data.territories.forEach((territory, i) => {
        console.log(`POPULATE: Processing territory ${i}:`, territory);
        
        // Sprawdź różne możliwe struktury danych
        let territoryName = territory.ident || territory.name || territory.title || `Territory ${i + 1}`;
        let territoryUuid = territory.uuid || territory.id || '';
        
        console.log(`POPULATE: Territory ${i} - UUID: ${territoryUuid}, Name: ${territoryName}`);
        
        const option = document.createElement('option');
        option.value = `${territoryUuid}|${territoryName}`;
        option.textContent = territoryName;
        select.appendChild(option);
    });
    
    console.log('POPULATE: Done, select has', select.children.length, 'options');
}

    async loadEvents(territoryData) {
        try {
            console.log(`Loading events for territory: ${territoryData}`);
            const response = await this.apiRequest('event/list', 'POST', {
                pagination: { page: 0, pageSize: 500 }
            });

            console.log('Events response:', response);
            console.log('Events response type:', typeof response);
            console.log('Events response keys:', Object.keys(response || {}));
            
            let events = [];
            if (response.data && Array.isArray(response.data)) {
                events = response.data;
                console.log('Using response.data, first event:', events[0]);
            } else if (response.items && Array.isArray(response.items)) {
                events = response.items;
                console.log('Using response.items, first event:', events[0]);
            } else if (Array.isArray(response)) {
                events = response;
                console.log('Using response directly, first event:', events[0]);
            } else {
                console.error('Unexpected events response structure:', response);
            }

            this.data.events = events;
            this.populateEvents();
            
        } catch (error) {
            console.error('Failed to load events:', error);
            this.showStatus('configStatus', `Błąd ładowania eventów: ${error.message}`, 'error');
        }
    }

    populateEvents() {
        const select = document.getElementById('tpEvent');
        select.innerHTML = '<option value="">Wybierz event...</option>';
        
        this.data.events.forEach(event => {
            const option = document.createElement('option');
            option.value = `${event.uuid}|${event.name}`;
            option.textContent = event.name;
            select.appendChild(option);
        });
    }

    async loadPoints(territoryData, eventData) {
        if (!territoryData || !eventData) {
            this.data.points = [];
            return;
        }

        try {
            const [territoryUuid] = territoryData.split('|');
            const [eventUuid] = eventData.split('|');
            
            console.log(`Loading points for territory: ${territoryUuid}, event: ${eventUuid}`);
            const response = await this.apiRequest('point/list', 'POST', {
                event: { uuid: eventUuid },
                territory: { uuid: territoryUuid },
                pagination: { page: 0, pageSize: 1000 }
            });

            console.log('Points response:', response);
            console.log('Points response type:', typeof response);
            console.log('Points response keys:', Object.keys(response || {}));
            
            let points = [];
            if (response.data && Array.isArray(response.data)) {
                points = response.data;
                console.log('Using response.data, first point:', points[0]);
            } else if (response.items && Array.isArray(response.items)) {
                points = response.items;
                console.log('Using response.items, first point:', points[0]);
            } else if (Array.isArray(response)) {
                points = response;
                console.log('Using response directly, first point:', points[0]);
            } else {
                console.error('Unexpected points response structure:', response);
            }

            this.data.points = points;
            
            const input = document.getElementById('tpPointSearch');
            if (points.length > 0) {
                input.placeholder = `Szukaj punktu... (${points.length} dostępnych)`;
                input.disabled = false;
            } else {
                input.placeholder = 'Brak punktów dla tej kombinacji';
                input.disabled = true;
            }
            
        } catch (error) {
            console.error('Failed to load points:', error);
            this.data.points = [];
            document.getElementById('tpPointSearch').placeholder = 'Błąd ładowania punktów';
        }
    }

    async searchPoints(query) {
        if (!query || query.length < 2) {
            this.hidePointDropdown();
            return;
        }

        const filteredPoints = this.data.points.filter(point => {
            const address = point.address ? 
                `${point.address.streetAddress || ''} ${point.address.streetNumber || ''}, ${point.address.cityName || ''}` : '';
            const searchString = `${point.ident} ${point.name} ${address}`.toLowerCase();
            return searchString.includes(query.toLowerCase());
        });

        this.showPointDropdown(filteredPoints);
    }

    showPointDropdown(points) {
        const dropdown = document.getElementById('tpPointDropdown');
        dropdown.innerHTML = '';
        
        if (points.length === 0) {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = 'Brak wyników';
            dropdown.appendChild(item);
        } else {
            points.forEach(point => {
                const address = point.address ? 
                    `${point.address.streetAddress || ''} ${point.address.streetNumber || ''}, ${point.address.cityName || ''}` : '';
                const item = document.createElement('div');
                item.className = 'dropdown-item';
                item.innerHTML = `${point.ident} - ${point.name}${address ? `<span style="color:#666"> (${address})</span>` : ''}`;
                item.addEventListener('click', () => {
                    this.selectPoint(point);
                });
                dropdown.appendChild(item);
            });
        }
        
        dropdown.style.display = 'block';
    }

    selectPoint(point) {
        const address = point.address ? 
            `${point.address.streetAddress || ''} ${point.address.streetNumber || ''}, ${point.address.cityName || ''}` : '';
        const displayName = `${point.ident} - ${point.name}${address ? ` (${address})` : ''}`;
        
        document.getElementById('tpPointSearch').value = displayName;
        document.getElementById('tpPoint').value = `${point.uuid}|${point.ident}|${point.name}|${JSON.stringify(point.address || {})}`;
        this.hidePointDropdown();
    }

    hidePointDropdown() {
        document.getElementById('tpPointDropdown').style.display = 'none';
    }

    hideUserDropdown() {
        document.getElementById('tpUserDropdown').style.display = 'none';
    }

    updateEndTime() {
    try {
        const fromTimeEl = document.getElementById('tpFromTime');
        const toTimeEl = document.getElementById('tpToTime');
        
        if (!fromTimeEl || !toTimeEl) {
            console.warn('updateEndTime: Missing time elements');
            return;
        }
        
        const fromTime = fromTimeEl.value;
        
        if (fromTime) {
            const [hours, minutes] = fromTime.split(':');
            const startDate = new Date();
            startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
            const endHour = endDate.getHours().toString().padStart(2, '0');
            const endMinute = endDate.getMinutes().toString().padStart(2, '0');
            toTimeEl.value = `${endHour}:${endMinute}`;
        }
    } catch (error) {
        console.error('Error in updateEndTime:', error);
    }
}

    async loadUsers() {
        const territoryData = document.getElementById('tpTerr').value;
        if (!territoryData) {
            this.data.users = [];
            this.clearUsers();
            return;
        }

        try {
            const [territoryUuid] = territoryData.split('|');
            const today = new Date().toISOString().split('T')[0];
            
            console.log(`Loading users for territory: ${territoryUuid}`);
            const response = await this.apiRequest('user/list', 'POST', {
                pagination: { page: 0, pageSize: 1000 },
                availability: { since: today, until: today },
                territory: { uuids: [territoryUuid] }
            });

            console.log('Users response:', response);
            console.log('Users response type:', typeof response);
            console.log('Users response keys:', Object.keys(response || {}));
            
            let users = [];
            if (response.data && Array.isArray(response.data)) {
                users = response.data;
                console.log('Using response.data, first user:', users[0]);
            } else if (response.items && Array.isArray(response.items)) {
                users = response.items;
                console.log('Using response.items, first user:', users[0]);
            } else if (Array.isArray(response)) {
                users = response;
                console.log('Using response directly, first user:', users[0]);
            } else {
                console.error('Unexpected users response structure:', response);
            }

            this.data.users = users;
            
            const input = document.getElementById('tpUserSearch');
            if (users.length > 0) {
                input.placeholder = `Szukaj personelu... (${users.length} dostępnych)`;
                input.disabled = false;
            } else {
                input.placeholder = 'Brak personelu dla tego regionu';
                input.disabled = true;
            }
            
        } catch (error) {
            console.error('Failed to load users:', error);
            this.data.users = [];
            document.getElementById('tpUserSearch').placeholder = 'Błąd ładowania personelu';
        }
    }

    async searchUsers(query) {
        if (!query || query.length < 2) {
            this.hideUserDropdown();
            return;
        }

        const filteredUsers = this.data.users.filter(user => {
            const fullName = `${user.firstname} ${user.lastname}`;
            const searchString = `${fullName} ${user.ident}`.toLowerCase();
            return searchString.includes(query.toLowerCase());
        });

        this.showUserDropdown(filteredUsers);
    }

    showUserDropdown(users) {
        const dropdown = document.getElementById('tpUserDropdown');
        dropdown.innerHTML = '';
        
        if (users.length === 0) {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = 'Brak wyników';
            dropdown.appendChild(item);
        } else {
            users.forEach(user => {
                const item = document.createElement('div');
                item.className = 'dropdown-item';
                item.innerHTML = `${user.firstname} ${user.lastname} <span style="color:#666">(${user.ident})</span>`;
                item.addEventListener('click', () => {
                    this.selectUser(user);
                });
                dropdown.appendChild(item);
            });
        }
        
        dropdown.style.display = 'block';
    }


    selectUser(user) {
        const displayName = `${user.firstname} ${user.lastname} (${user.ident})`;
        document.getElementById('tpUserSearch').value = displayName;
        document.getElementById('tpUser').value = `${user.uuid}|${user.firstname}|${user.lastname}|${user.ident}`;
        this.hideUserDropdown();
    }

    enablePointSearch() {
        const input = document.getElementById('tpPointSearch');
        input.disabled = false;
        input.placeholder = 'Wpisz nazwę punktu...';
    }

    clearEvents() {
    try {
        const select = document.getElementById('tpEvent');
        if (select) {
            select.innerHTML = '<option value="">Najpierw wybierz region</option>';
        }
    } catch (error) {
        console.error('Error in clearEvents:', error);
    }
}

clearPoints() {
    try {
        this.disablePointSearch();
    } catch (error) {
        console.error('Error in clearPoints:', error);
    }
}

clearUsers() {
    try {
        const input = document.getElementById('tpUserSearch');
        const hiddenInput = document.getElementById('tpUser');
        
        if (input) {
            input.disabled = true;
            input.placeholder = 'Najpierw wybierz region';
            input.value = '';
        }
        
        if (hiddenInput) {
            hiddenInput.value = '';
        }
        
        this.hideUserDropdown();
    } catch (error) {
        console.error('Error in clearUsers:', error);
    }
}

disablePointSearch() {
    try {
        const input = document.getElementById('tpPointSearch');
        const hiddenInput = document.getElementById('tpPoint');
        
        if (input) {
            input.disabled = true;
            input.placeholder = 'Najpierw wybierz region i event';
            input.value = '';
        }
        
        if (hiddenInput) {
            hiddenInput.value = '';
        }
        
        this.hidePointDropdown();
    } catch (error) {
        console.error('Error in disablePointSearch:', error);
    }
}
async createAction() {
    const form = document.getElementById('tpForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');

    // Disable form
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        // Get form values with safety checks
        const nameEl = document.getElementById('tpName');
        const territoryEl = document.getElementById('tpTerr');
        const eventEl = document.getElementById('tpEvent');
        const pointEl = document.getElementById('tpPoint');
        const userEl = document.getElementById('tpUser');
        const dateEl = document.getElementById('tpDate');
        const fromTimeEl = document.getElementById('tpFromTime');
        const toTimeEl = document.getElementById('tpToTime');

        // Check if all required elements exist
        if (!nameEl || !territoryEl || !eventEl || !pointEl || !userEl || !dateEl || !fromTimeEl || !toTimeEl) {
            throw new Error('Brak wymaganych elementów formularza');
        }

        const name = nameEl.value.trim();
        const territoryData = territoryEl.value.split('|');
        const eventData = eventEl.value.split('|');
        const pointData = pointEl.value.split('|');
        const userData = userEl.value.split('|');
        const date = dateEl.value;
        const fromTime = `${date} ${fromTimeEl.value}:00`;
        const toTime = `${date} ${toTimeEl.value}:00`;

        // Validate required data
        if (!name) {
            throw new Error('Nazwa akcji jest wymagana');
        }
        if (territoryData.length < 2 || !territoryData[0]) {
            throw new Error('Wybierz region/terytorium');
        }
        if (eventData.length < 2 || !eventData[0]) {
            throw new Error('Wybierz event');
        }
        if (pointData.length < 4 || !pointData[0]) {
            throw new Error('Wybierz punkt');
        }
        if (userData.length < 4 || !userData[0]) {
            throw new Error('Wybierz personel');
        }
        if (!date) {
            throw new Error('Wybierz datę');
        }

        console.log('Form validation passed, creating action...');

        // Parse point address
        const pointAddress = JSON.parse(pointData[3] || '{}');

        // Create action payload
        const payload = {
            action: {
                new: true,
                ident: '',
                name: name,
                description: '',
                excerpt: '',
                since: { date: fromTime },
                until: { date: toTime },
                type: { ident: 'Standard' },
                territory: {
                    uuid: territoryData[0],
                    ident: territoryData[1]
                },
                area: { uuid: '80dba439-7ca8-11ef-816e-065ed9e1cfca' },
                event: {
                    uuid: eventData[0],
                    name: eventData[1]
                },
                actionPoints: [{
                    trash: false,
                    point: { uuid: pointData[0] },
                    ident: pointData[1],
                    name: pointData[2],
                    address: {
                        streetAddress: pointAddress.streetAddress || '',
                        streetNumber: pointAddress.streetNumber || '',
                        cityName: pointAddress.cityName || '',
                        postalCode: pointAddress.postalCode || '',
                        geoLat: pointAddress.geoLat || '52.51983050',
                        geoLng: pointAddress.geoLng || '19.81849910'
                    }
                }],
                users: [{
                    trash: false,
                    uuid: userData[0],
                    firstname: userData[1],
                    lastname: userData[2],
                    ident: userData[3]
                }]
            }
        };

        console.log('Creating action with payload:', payload);

        const response = await this.apiRequest('action/create', 'POST', payload);
        
        console.log('Action created:', response);

        if (response && response.status && response.status.success) {
            this.showStatus('formStatus', `✅ Akcja utworzona! ID: ${response.data.ident}`, 'success');
            
            // Try to auto-accept the action
            try {
                const acceptPayload = {
                    status: { ident: 'accepted' },
                    action: { uuid: response.data.uuid }
                };
                
                const acceptResponse = await this.apiRequest('action/set-status', 'POST', acceptPayload);
                
                if (acceptResponse && acceptResponse.status && acceptResponse.status.success) {
                    this.showStatus('formStatus', `✅ Akcja utworzona i zaakceptowana! ID: ${response.data.ident}`, 'success');
                }
            } catch (acceptError) {
                console.warn('Auto-accept failed:', acceptError);
                // Still show success for creation
            }
            
            // Reset form after successful creation - TYLKO TU!
            setTimeout(() => {
                console.log('=== RESET DEBUG START ===');
                try {
                    console.log('1. Calling form.reset()...');
                    form.reset();
                    console.log('2. Form reset completed');
                    
                    console.log('3. Calling clearEvents()...');
                    this.clearEvents();
                    console.log('4. ClearEvents completed');
                    
                    console.log('5. Calling clearPoints()...');
                    this.clearPoints();
                    console.log('6. ClearPoints completed');
                    
                    console.log('7. Calling clearUsers()...');
                    this.clearUsers();
                    console.log('8. ClearUsers completed');
                    
                    console.log('9. Setting date...');
                    const today = new Date().toISOString().split('T')[0];
                    const dateEl = document.getElementById('tpDate');
                    if (dateEl) {
                        dateEl.value = today;
                        console.log('10. Date set successfully');
                    } else {
                        console.log('10. Date element not found');
                    }
                    
                    console.log('11. Setting time...');
                    const now = new Date();
                    const currentHour = now.getHours().toString().padStart(2, '0');
                    const currentMinute = now.getMinutes().toString().padStart(2, '0');
                    const fromTimeEl = document.getElementById('tpFromTime');
                    if (fromTimeEl) {
                        fromTimeEl.value = `${currentHour}:${currentMinute}`;
                        console.log('12. From time set successfully');
                    } else {
                        console.log('12. From time element not found');
                    }
                    
                    console.log('13. Calling updateEndTime()...');
                    this.updateEndTime();
                    console.log('14. UpdateEndTime completed');
                    
                    console.log('15. Resetting velo checkbox...');
                    const veloEl = document.getElementById('veloMode');
                    if (veloEl) {
                        veloEl.checked = false;
                        console.log('16. Velo checkbox reset successfully');
                    } else {
                        console.log('16. Velo checkbox not found');
                    }
                    
                    console.log('=== RESET DEBUG SUCCESS ===');
                } catch (resetError) {
                    console.error('=== RESET DEBUG ERROR ===', resetError);
                    console.error('Error stack:', resetError.stack);
                }
            }, 2000);
            
        } else {
            this.showStatus('formStatus', '❌ Błąd podczas tworzenia akcji', 'error');
        }
        
        // USUŃ WSZELKIE RESETOWANIE FORMU TUTAJ - nie powinno być żadnego form.reset() poza setTimeout powyżej
        
    } catch (error) {
        console.error('Failed to create action:', error);
        this.showStatus('formStatus', `❌ Błąd tworzenia akcji: ${error.message}`, 'error');
    } finally {
        // Re-enable form - TYLKO włączenie przycisku, żadnego resetowania!
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        loading.classList.add('hidden');
    }
}
    async refreshAllData() {
        this.showStatus('configStatus', 'Odświeżanie danych...', 'warning');
        
        try {
            await this.loadTerritories();
            this.showStatus('configStatus', '✅ Dane zostały odświeżone', 'success');
        } catch (error) {
            this.showStatus('configStatus', `❌ Błąd odświeżania: ${error.message}`, 'error');
        }
    }

    showStatus(elementId, message, type) {
        const status = document.getElementById(elementId);
        status.textContent = message;
        status.className = `status ${type}`;
        status.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                status.style.display = 'none';
            }, 3000);
        }
    }

    // PWA functionality
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        let deferredPrompt;
        const installPrompt = document.getElementById('installPrompt');
        const installBtn = document.getElementById('installBtn');
        const dismissBtn = document.getElementById('dismissInstall');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installPrompt.style.display = 'block';
        });

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to install prompt: ${outcome}`);
                deferredPrompt = null;
                installPrompt.style.display = 'none';
            }
        });

        dismissBtn.addEventListener('click', () => {
            installPrompt.style.display = 'none';
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TourPlannerApp();
});
