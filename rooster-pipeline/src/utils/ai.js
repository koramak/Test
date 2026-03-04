const API_KEY_STORAGE = 'rooster_api_key'

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || ''
}

export function setApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key.trim())
}

export function hasApiKey() {
  return !!getApiKey()
}

async function callClaude(prompt, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.content[0].text
}

export async function generateBio(prospect) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('No API key configured. Go to Settings to add your Anthropic API key.')

  const prompt = `You are a sales research assistant for Rooster Partners, a social impact consultancy that helps companies build measurable social impact programs (employee engagement, community partnerships, impact storytelling, Snapshot Assessments).

Research brief for a potential prospect. Based on the information below, write a concise assessment (under 250 words) covering:
1. Who this person is and their likely role in social impact decisions
2. What their company is probably doing (or not doing) in social impact
3. Why they could be a good fit for Rooster Partners
4. A suggested angle for outreach

Be direct, specific, and actionable. No fluff.

Prospect info:
- Name: ${prospect.contactName || 'Unknown'}
- Title: ${prospect.contactTitle || 'Unknown'}
- Company: ${prospect.companyName || 'Unknown'}
- Industry: ${prospect.industry || 'Unknown'}
- Company Size: ${prospect.companySize || 'Unknown'}
- LinkedIn: ${prospect.contactLinkedIn || 'N/A'}
- Company Website: ${prospect.companyWebsite || 'N/A'}
- Source: ${prospect.source || 'N/A'}
${prospect.fitNotes ? `- Notes: ${prospect.fitNotes}` : ''}`

  return callClaude(prompt, apiKey)
}

export async function generateEmail(prospect, bio) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('No API key configured. Go to Settings to add your Anthropic API key.')

  const prompt = `You are writing a cold outreach email on behalf of Zane Miller, who leads new business at Rooster Partners — a social impact consultancy.

Rooster helps companies build and measure social impact programs: employee engagement, community partnerships, impact storytelling, and their flagship "Snapshot Assessment" diagnostic tool.

Write a personalized cold email to this prospect. The email should:
- Be warm but professional, not salesy
- Reference something specific about their company/role
- Be concise (under 200 words for the body)
- End with a soft CTA (conversation, not a hard sell)
- Sign off as Zane Miller, Rooster Partners

Format your response EXACTLY like this (no markdown, plain text only):
Subject: [subject line here]

[email body here]

Prospect info:
- Name: ${prospect.contactName || 'Unknown'}
- Title: ${prospect.contactTitle || 'Unknown'}
- Company: ${prospect.companyName || 'Unknown'}
- Industry: ${prospect.industry || 'Unknown'}
- Company Size: ${prospect.companySize || 'Unknown'}
- Email: ${prospect.contactEmail || 'N/A'}

Research brief:
${bio}`

  return callClaude(prompt, apiKey)
}
