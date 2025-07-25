// @ts-ignore
// Use chrome.identity to get OAuth token and fetch Gmail data

/**
 * Get an OAuth token using chrome.identity API
 */
export async function getGmailAuthToken(interactive: boolean = true): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!chrome.identity) {
            reject('chrome.identity API not available');
            return;
        }
        chrome.identity.getAuthToken({ interactive }, function(token) {
            if (chrome.runtime.lastError || !token) {
                reject(chrome.runtime.lastError ? chrome.runtime.lastError.message : 'No token');
            } else {
                resolve(token as string);
            }
        });
    });
}

/**
 * Fetch a list of recent emails using Gmail API
 */
export async function fetchRecentEmails(maxResults: number = 5): Promise<any[]> {
    const token = await getGmailAuthToken();
    // List messages
    const listRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    const listData = await listRes.json();
    if (!listData.messages) return [];
    // Fetch details for each message
    const emails = await Promise.all(
        listData.messages.map(async (msg: any) => {
            const msgRes = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return await msgRes.json();
        })
    );
    return emails;
}