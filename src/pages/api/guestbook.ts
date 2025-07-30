import type { APIRoute } from 'astro';
import fs from 'fs/promises';

export const prerender = false;

const GUESTBOOK_PATH = 'src/data/guestbook.json';

// For GitHub commit
const GITHUB_TOKEN = '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';
const GITHUB_REPO = 'DaKingBear2/Arktos_Health_Website';
const GITHUB_FILEPATH = 'src/   data/guestbook.json';
const GITHUB_BRANCH = 'main';

export const GET: APIRoute = async () => {
  try {
    const data = await fs.readFile(GUESTBOOK_PATH, 'utf-8');
    return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/guestbook error:', err);
    return new Response(JSON.stringify({ error: 'Could not read guestbook.' }), { status: 500 });
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
    try {
      const data = await fs.readFile(GUESTBOOK_PATH, 'utf-8');
      messages = JSON.parse(data);
      if (!Array.isArray(messages)) {
        throw new Error('guestbook.json is not an array');
      }
    } catch (fileErr) {
      // If file does not exist or is invalid, start with empty array
      console.warn('guestbook.json missing or invalid, initializing new file:', fileErr);
      messages = [];
    }
    const newEntry = { name, message, timestamp };
    messages.push(newEntry);
    try {
      await fs.writeFile(GUESTBOOK_PATH, JSON.stringify(messages, null, 2));
    } catch (writeErr) {
      console.error('Error writing guestbook.json:', writeErr);
      return new Response(JSON.stringify({ error: 'Could not save message to file.' }), { status: 500 });
    }

    // Commit to GitHub
    if (GITHUB_TOKEN && GITHUB_REPO) {
      try {
        console.log('Attempting to commit guestbook.json to GitHub...');
        const content = Buffer.from(JSON.stringify(messages, null, 2)).toString('base64');
        // Get the current file SHA
        const shaRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILEPATH}?ref=${GITHUB_BRANCH}`);
        const shaData = await shaRes.json();
        if (!shaData.sha) {
          console.error('Could not get file SHA from GitHub:', shaData);
          throw new Error('Could not get file SHA from GitHub: ' + JSON.stringify(shaData));
        }
        const sha = shaData.sha;
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
            sha,
          }),
        });
        const commitResText = await commitRes.text();
        if (!commitRes.ok) {
          console.error('GitHub commit failed:', commitResText);
          throw new Error('GitHub commit failed: ' + commitResText);
        } else {
          console.log('GitHub commit successful:', commitResText);
        }
      } catch (githubErr) {
        console.error('GitHub commit error:', githubErr);
        // Do not fail the request if GitHub commit fails
      }
    }

    return new Response(JSON.stringify(newEntry), { status: 201 });
  } catch (err) {
    console.error('POST /api/guestbook error:', err);
    return new Response(JSON.stringify({ error: 'Could not save message.' }), { status: 500 });
  }
}; 