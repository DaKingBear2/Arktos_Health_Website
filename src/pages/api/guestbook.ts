import type { APIRoute } from 'astro';

export const prerender = false;

// For GitHub API (Cloudflare Workers don't have file system access)
// Get token from environment variable (set in Cloudflare Dashboard)
// For local development, create a .env file with GITHUB_TOKEN=your_token
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.warn('GITHUB_TOKEN not set. Guestbook API may not work correctly.');
}
const GITHUB_REPO = 'DaKingBear2/Arktos_Health_Website';
const GITHUB_FILEPATH = 'src/data/guestbook.json';
const GITHUB_BRANCH = 'main';

// Helper functions for base64 encoding/decoding on Cloudflare Workers
function base64Decode(base64: string): string {
  // Decode base64 to binary string, then convert to UTF-8
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

function base64Encode(text: string): string {
  // Convert UTF-8 string to bytes, then encode to base64
  const bytes = new TextEncoder().encode(text);
  let binaryString = '';
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}

export const GET: APIRoute = async () => {
  try {
    // Fetch from GitHub API instead of file system
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILEPATH}?ref=${GITHUB_BRANCH}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`, // Updated to Bearer format (token format is deprecated)
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Arktos-Health-Website',
      },
    });

    if (!response.ok) {
      // If file doesn't exist, return empty array
      if (response.status === 404) {
        return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      // Log more details for 401 errors
      if (response.status === 401) {
        console.error('GitHub API 401: Token may be invalid, expired, or missing permissions');
        const errorText = await response.text();
        console.error('GitHub API error response:', errorText);
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    // Decode base64 content
    const content = JSON.parse(base64Decode(data.content));
    return new Response(JSON.stringify(content), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/guestbook error:', err);
    // Return empty array on error instead of failing
    return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if GITHUB_TOKEN is set
    if (!GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN is not set');
      return new Response(JSON.stringify({ error: 'Server configuration error. Please contact administrator.' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { name, message } = await request.json();
    if (!name || !message) {
      return new Response(JSON.stringify({ error: 'Name and message required.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const timestamp = new Date().toISOString();
    let messages = [];
    let sha = null;

    // Fetch current messages from GitHub
    try {
      const getResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILEPATH}?ref=${GITHUB_BRANCH}`, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Arktos-Health-Website',
        },
      });

      if (getResponse.ok) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
        // Decode base64 content
        const content = base64Decode(fileData.content);
        messages = JSON.parse(content);
        if (!Array.isArray(messages)) {
          throw new Error('guestbook.json is not an array');
        }
      } else if (getResponse.status === 404) {
        // File doesn't exist yet, start with empty array
        console.warn('guestbook.json does not exist, initializing new file');
        messages = [];
      } else {
        const errorText = await getResponse.text();
        console.error(`GitHub API error (${getResponse.status}):`, errorText);
        throw new Error(`GitHub API error: ${getResponse.status}`);
      }
    } catch (fetchErr) {
      console.error('Error fetching guestbook from GitHub:', fetchErr);
      // Continue with empty array if fetch fails (file might not exist yet)
      messages = [];
    }

    // Add new entry
    const newEntry = { name, message, timestamp };
    messages.push(newEntry);

    // Commit to GitHub - THIS MUST SUCCEED
    console.log('Attempting to commit guestbook.json to GitHub...');
    const content = base64Encode(JSON.stringify(messages, null, 2));
    
    const commitRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILEPATH}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Arktos-Health-Website',
      },
      body: JSON.stringify({
        message: `Add guestbook entry by ${name}`,
        content,
        branch: GITHUB_BRANCH,
        ...(sha && { sha }), // Include SHA only if file exists
      }),
    });

    const commitResText = await commitRes.text();
    if (!commitRes.ok) {
      console.error('GitHub commit failed:', commitRes.status, commitResText);
      let errorMessage = 'Failed to save message to GitHub.';
      
      // Provide more specific error messages
      if (commitRes.status === 401) {
        errorMessage = 'Authentication failed. Please contact administrator.';
      } else if (commitRes.status === 403) {
        errorMessage = 'Permission denied. Please contact administrator.';
      } else if (commitRes.status === 422) {
        errorMessage = 'File conflict. Please try again.';
      }
      
      return new Response(JSON.stringify({ error: errorMessage }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('GitHub commit successful');
    return new Response(JSON.stringify(newEntry), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('POST /api/guestbook error:', err);
    return new Response(JSON.stringify({ error: 'Could not save message.' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 