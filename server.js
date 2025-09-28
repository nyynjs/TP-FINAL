// server.js - TourPlanner PWA Proxy Server with Discord Integration
const express = require('express');
const cors = require('cors');
// Using built-in fetch (Node.js 18+) or https module for older versions
const https = require('https');
const { URL } = require('url');
const path = require('path');

// Custom fetch implementation using https module
function fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const requestOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || 443,
            path: parsedUrl.pathname + parsedUrl.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = https.request(requestOptions, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                const response = {
                    ok: res.statusCode >= 200 && res.statusCode < 300,
                    status: res.statusCode,
                    statusText: res.statusMessage,
                    headers: {
                        get: (name) => res.headers[name.toLowerCase()]
                    },
                    json: () => Promise.resolve(JSON.parse(data)),
                    text: () => Promise.resolve(data)
                };
                resolve(response);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(options.body);
        }

        req.end();
    });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1421928978087805021/TLWn_2zZp0Axwb5VRVkI2W73NbbECJAtPbdmjX34pnFsuJo_Fk34H9nxHsWk7Lco5fz-';

// Enable CORS for all origins
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Middleware for logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Function to send Discord notification
async function sendDiscordNotification(actionData, username) {
    try {
        const embed = {
            title: "🚀 Nowa akcja utworzona!",
            color: 0x00FF00, // Green color
            fields: [
                {
                    name: "👤 Utworzona przez",
                    value: username || "Nieznany użytkownik",
                    inline: true
                },
                {
                    name: "📝 Nazwa akcji",
                    value: actionData.name || "Brak nazwy",
                    inline: true
                },
                {
                    name: "🆔 ID akcji",
                    value: actionData.ident || "Brak ID",
                    inline: true
                },
                {
                    name: "🌍 Region",
                    value: actionData.territory?.ident || "Nieznany",
                    inline: true
                },
                {
                    name: "🎯 Event",
                    value: actionData.event?.name || "Nieznany",
                    inline: true
                },
                {
                    name: "👥 Personel",
                    value: actionData.users?.map(user => `${user.firstname} ${user.lastname} (${user.ident})`).join(', ') || "Brak",
                    inline: false
                },
                {
                    name: "📍 Punkt",
                    value: actionData.actionPoints?.[0]?.name || "Nieznany",
                    inline: true
                },
                {
                    name: "📅 Data",
                    value: actionData.since?.date ? new Date(actionData.since.date).toLocaleString('pl-PL') : "Nieznana",
                    inline: true
                },
                {
                    name: "🕒 Czas trwania",
                    value: actionData.since?.date && actionData.until?.date ? 
                        `${new Date(actionData.since.date).toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})} - ${new Date(actionData.until.date).toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}` : 
                        "Nieznany",
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "TourPlanner Pro"
            }
        };

        const discordPayload = {
            embeds: [embed]
        };

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(discordPayload)
        });

        if (response.ok) {
            console.log('✅ Discord notification sent successfully');
        } else {
            const errorText = await response.text();
            console.error('❌ Failed to send Discord notification:', response.status, errorText);
        }
    } catch (error) {
        console.error('❌ Discord notification error:', error.message);
    }
}

// Health check endpoint (no token required)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: 'TourPlanner Proxy Server is running'
    });
});

// Main proxy endpoint for TourPlanner API - POPRAWIONA WERSJA z Discord integration
app.use('/api/tourplanner', async (req, res) => {
    try {
        // Extract the API path from the original URL
        let apiPath = req.url;
        
        // Remove leading slash if present
        if (apiPath.startsWith('/')) {
            apiPath = apiPath.substring(1);
        }
        
        const tourPlannerUrl = `https://api2.tourplanner.tdy-apps.com/${apiPath}`;
        
        console.log(`🔄 Proxy request details:`);
        console.log(`   Original URL: ${req.originalUrl}`);
        console.log(`   Processed path: ${apiPath}`);
        console.log(`   Target URL: ${tourPlannerUrl}`);
        console.log(`   Method: ${req.method}`);
        console.log(`   Has Auth: ${!!req.headers.authorization}`);
        
        // ZMIANA: Special handling for auth/login - nie wymaga Bearer tokenu
        if (apiPath === 'auth/login') {
            console.log('🔐 Auth/login request - skipping Bearer token validation');
            
            const headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'TourPlanner-PWA-Proxy/1.0',
                'Accept': 'application/json'
            };

            // Make request to TourPlanner API
            const response = await fetch(tourPlannerUrl, {
                method: req.method,
                headers: headers,
                body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
            });

            // Get response data
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
            
            console.log(`📈 Auth Response: ${response.status} ${response.statusText}`);
            console.log(`📊 Auth Data preview: ${JSON.stringify(data).substring(0, 200)}...`);
            
            // Forward response
            res.status(response.status);
            if (contentType) {
                res.set('Content-Type', contentType);
            }
            
            res.json(data);
            return; // Zakończ tutaj dla auth/login
        }
        
        // Check for Bearer token for all other endpoints
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Missing or invalid Authorization header',
                message: 'Bearer token required in Authorization header'
            });
        }

        // Prepare headers for TourPlanner API
        const headers = {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
            'User-Agent': 'TourPlanner-PWA-Proxy/1.0',
            'Accept': 'application/json'
        };

        // Make request to TourPlanner API
        const response = await fetch(tourPlannerUrl, {
            method: req.method,
            headers: headers,
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
        });

        // Get response data
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        console.log(`📈 Response: ${response.status} ${response.statusText}`);
        console.log(`📊 Data preview: ${JSON.stringify(data).substring(0, 200)}...`);
        
        // NOWE: Discord notification for successful action creation
        if (apiPath === 'action/create' && response.ok && data?.status?.success) {
            console.log('🎯 Action created successfully, sending Discord notification...');
            
            // Extract username from request headers (będzie dodane przez frontend)
            const username = req.headers['x-username'] || 'Nieznany użytkownik';
            
            // Send Discord notification in background (don't wait for it)
            setImmediate(() => {
                sendDiscordNotification(data.data || req.body.action, username);
            });
        }
        
        // Special debugging for territory/list
        if (apiPath.includes('territory/list')) {
            console.log('🔍 TERRITORY DEBUG - Full response:');
            console.log('   - Status:', response.status);
            console.log('   - Data type:', typeof data);
            console.log('   - Data keys:', Object.keys(data || {}));
            if (data && data.data && Array.isArray(data.data)) {
                console.log('   - Territory count:', data.data.length);
                console.log('   - First territory:', JSON.stringify(data.data[0], null, 2));
                console.log('   - Territory structure check:');
                console.log('     - Has uuid:', !!data.data[0]?.uuid);
                console.log('     - Has ident:', !!data.data[0]?.ident);
                console.log('     - UUID value:', data.data[0]?.uuid);
                console.log('     - Ident value:', data.data[0]?.ident);
            }
        }
        
        // Forward response
        res.status(response.status);
        if (contentType) {
            res.set('Content-Type', contentType);
        }
        
        res.json(data);

    } catch (error) {
        console.error('❌ Proxy error:', error.message);
        res.status(500).json({ 
            error: 'Proxy server error', 
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Test connection endpoint
app.post('/test-connection', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const response = await fetch('https://api2.tourplanner.tdy-apps.com/territory/list', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pagination: { page: 0, pageSize: 1 }
            })
        });

        const data = await response.json();

        if (response.ok) {
            res.json({ 
                success: true, 
                message: 'Connection successful',
                status: response.status,
                data: data
            });
        } else {
            res.status(response.status).json({ 
                success: false, 
                message: `API returned ${response.status}`,
                status: response.status,
                data: data
            });
        }
    } catch (error) {
        console.error('Test connection error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Debug endpoint for development
app.use('/debug', (req, res) => {
    const info = {
        url: req.url,
        originalUrl: req.originalUrl,
        method: req.method,
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
        path_extraction: {
            url: req.url,
            after_substring: req.url.substring('/debug/'.length)
        }
    };
    res.json(info);
});

// Serve PWA on main path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all for PWA routing - handle all other GET requests
app.use((req, res) => {
    // Only serve index.html for GET requests that aren't API or debug routes
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/debug')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else if (req.path.startsWith('/api') || req.path.startsWith('/debug')) {
        res.status(404).json({ error: 'API endpoint not found' });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('💥 Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TourPlanner Proxy Server running on port ${PORT}`);
    console.log(`📱 PWA available at: http://localhost:${PORT}`);
    console.log(`🔗 API proxy available at: http://localhost:${PORT}/api/tourplanner/`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`🐛 Debug endpoint: http://localhost:${PORT}/debug/`);
    console.log(`📢 Discord notifications enabled`);
    
    if (process.env.NODE_ENV === 'production') {
        console.log(`🌍 Production mode - CORS enabled for all origins`);
    }
});
