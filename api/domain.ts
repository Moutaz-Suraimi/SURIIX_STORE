import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // We only accept POST and DELETE requests
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const VERCEL_TOKEN = process.env.VERCEL_ACCESS_TOKEN;
    const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

    if (!VERCEL_TOKEN || !PROJECT_ID) {
      return res.status(500).json({ error: 'Missing Vercel credentials in environment variables.' });
    }

    const { domain } = req.body || req.query;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required.' });
    }

    // Determine Action URL and Method
    let url = `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains`;
    let fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    if (req.method === 'POST') {
      fetchOptions.body = JSON.stringify({ name: domain });
    } else if (req.method === 'DELETE') {
      url = `${url}/${domain}`;
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      // Vercel returns error details inside data.error
      console.error('Vercel API Error:', data.error);
      return res.status(response.status).json({
        error: data.error?.message || 'Failed to map domain to Vercel project.',
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      message: req.method === 'POST' ? 'Domain added successfully' : 'Domain removed successfully',
      data
    });

  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'Internal server error processing the domain.' });
  }
}
