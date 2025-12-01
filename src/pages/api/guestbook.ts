import type { APIRoute } from 'astro';

export const prerender = false;

// For GitHub API (Cloudflare Workers don't have file system access)
const GITHUB_TOKEN = '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';
const GITHUB_REPO = 'DaKingBear2/Arktos_Health_Website';
const GITHUB_FILEPATH = 'src/data/guestbook.json';
const GITHUB_BRANCH = 'main';

export const GET: APIRoute = async () => {
  try {
    // Fetch from GitHub API instead of file system
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILEPATH}?ref=${GITHUB_BRANCH}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      // If file doesn't exist, return empty array
      if (response.status === 404) {
        return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    // Decode base64 content
    const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));
    return new Response(JSON.stringify(content), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/guestbook error:', err);
    // Return empty array on error instead of failing
    return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, message } = await request.json();
    if (!name || !message) {
      return new Response(JSON.stringify({ error: 'Name and message required.' }), { status: 400 });
    }
    const timestamp = new Date().toISOString();
    let messages = [];
    let sha = null;

    // Fetch current messages from GitHub
    try {
      const getResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILEPATH}?ref=${GITHUB_BRANCH}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (getResponse.ok) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
        // Decode base64 content
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        messages = JSON.parse(content);
        if (!Array.isArray(messages)) {
          throw new Error('guestbook.json is not an array');
        }
      } else if (getResponse.status === 404) {
        // File doesn't exist yet, start with empty array
        console.warn('guestbook.json does not exist, initializing new file');
        messages = [];
      } else {
        throw new Error(`GitHub API error: ${getResponse.status}`);
      }
    } catch (fetchErr) {
      console.error('Error fetching guestbook from GitHub:', fetchErr);
      // Continue with empty array if fetch fails
      messages = [];
    }

    // Add new entry
    const newEntry = { name, message, timestamp };
    messages.push(newEntry);

    // Commit to GitHub
    try {
      console.log('Attempting to commit guestbook.json to GitHub...');
      const content = Buffer.from(JSON.stringify(messages, null, 2)).toString('base64');
      
      const commitRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILEPATH}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
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
        console.error('GitHub commit failed:', commitResText);
        // Still return success to user, but log the error
        console.warn('Message added locally but GitHub commit failed');
      } else {
        console.log('GitHub commit successful:', commitResText);
      }
    } catch (githubErr) {
      console.error('GitHub commit error:', githubErr);
      // Don't fail the request - message was processed successfully
    }

    return new Response(JSON.stringify(newEntry), { status: 201 });
  } catch (err) {
    console.error('POST /api/guestbook error:', err);
    return new Response(JSON.stringify({ error: 'Could not save message.' }), { status: 500 });
  }
}; 