// Background Service Worker

// Define menu items
const MENUS = [
    { id: 'json-formatter', title: 'Format JSON', path: '/json-formatter' },
    { id: 'base64-decode', title: 'Base64 Decode', path: '/base64-converter' }, // We'll handle mode via URL if possible, or default
    { id: 'url-encode', title: 'URL Encode/Decode', path: '/url-encoder' },
    { id: 'sql-format', title: 'Format SQL', path: '/sql-formatter' },
    { id: 'date-converter', title: 'Convert Timestamp', path: '/date-converter' }
];

// Create context menus on install
chrome.runtime.onInstalled.addListener(() => {
    console.log('Dulundu Tools: Extension Installed/Updated');

    // Clean up existing menus first to avoid errors during dev reload
    chrome.contextMenus.removeAll(() => {
        if (chrome.runtime.lastError) {
            console.warn('Dulundu Tools: Menu cleanup warning:', chrome.runtime.lastError);
        }

        // Create a parent item
        chrome.contextMenus.create({
            id: 'dulundu-tools-root',
            title: 'Dulundu Tools',
            contexts: ['selection']
        }, () => {
            if (chrome.runtime.lastError) console.error('Parent menu error:', chrome.runtime.lastError);
            else console.log('Parent menu created');
        });

        // Create sub-items
        MENUS.forEach(menu => {
            chrome.contextMenus.create({
                id: menu.id,
                parentId: 'dulundu-tools-root',
                title: menu.title,
                contexts: ['selection']
            }, () => {
                if (chrome.runtime.lastError) console.error(`Sub-menu ${menu.id} error:`, chrome.runtime.lastError);
            });
        });
    });
});

// Handle menu clicks
chrome.contextMenus.onClicked.addListener((info) => {
    const menu = MENUS.find(m => m.id === info.menuItemId);
    if (menu && info.selectionText) {
        const text = info.selectionText.trim();
        const encoded = encodeURIComponent(text);
        const baseUrl = import.meta.env.VITE_APP_URL;
        
        if (!baseUrl) {
            console.error('VITE_APP_URL not configured');
            return;
        }

        // Open in new tab
        chrome.tabs.create({
            url: `${baseUrl}${menu.path}#input=${encoded}`
        });
    }
});
