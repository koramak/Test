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

async function callClaude(prompt, apiKey, { maxTokens = 1024 } = {}) {
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
      max_tokens: maxTokens,
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

  const hasContact = prospect.contactName && prospect.contactName !== 'Unknown'

  const prompt = `You are a sales research assistant for Rooster Partners, a social impact consultancy that helps companies build measurable social impact programs (employee engagement, community partnerships, impact storytelling, Snapshot Assessments).

Research brief for a potential prospect. Based on the information below, write a concise assessment covering:

${!hasContact ? `**CRITICAL — IDENTIFY THE RIGHT CONTACT:**
This lead only has a company name. You MUST identify the best person to reach out to at this company. The ideal contact is:
- Primary: VP or Director of People & Culture / HR, Chief People Officer (CPO), Head of Employee Experience, Director of Communications or Brand
- Secondary: CMO (if purpose-driven brand positioning is the entry point), CEO at companies ≤500 employees
- AVOID: CSR/Sustainability titles at mature programs, Legal/Finance/Operations, Coordinator/Specialist level

Provide their full name, title, a plausible professional email (using common formats like first.last@companydomain.com), and LinkedIn profile URL.

Start your brief with:
RECOMMENDED CONTACT: [Full Name], [Title]
EMAIL: [plausible email]
LINKEDIN: [plausible LinkedIn URL]

Then continue with the assessment below.
` : ''}1. ${hasContact ? 'Who this person is and their likely role in social impact decisions' : 'Who the recommended contact is and why they are the right person for this outreach'}
2. What their company is probably doing (or not doing) in social impact
3. Why they could be a good fit for Rooster Partners
4. A suggested angle for outreach
${!hasContact && prospect.contactEmail ? '' : !hasContact ? '\n5. If no email was provided, suggest the most likely email format for this company and provide your best guess at the contact\'s email address' : ''}

Be direct, specific, and actionable. No fluff. Keep it under 300 words.

Prospect info:
- Name: ${prospect.contactName || 'Not provided — you must identify the right contact'}
- Title: ${prospect.contactTitle || 'Unknown'}
- Company: ${prospect.companyName || 'Unknown'}
- Industry: ${prospect.industry || 'Unknown'}
- Company Size: ${prospect.companySize || 'Unknown'}
- LinkedIn: ${prospect.contactLinkedIn || 'N/A'}
- Email: ${prospect.contactEmail || 'Not provided — suggest one'}
- Company Website: ${prospect.companyWebsite || 'N/A'}
- Source: ${prospect.source || 'N/A'}
${prospect.fitNotes ? `- Notes: ${prospect.fitNotes}` : ''}`

  return callClaude(prompt, apiKey)
}

export async function generateLeads(focus) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('No API key configured. Go to Settings to add your Anthropic API key.')

  const prompt = `You are a lead generation research assistant for Rooster Partners, a social impact consultancy.

ABOUT ROOSTER PARTNERS:
Rooster designs and runs corporate social impact programs — employee engagement, nonprofit partnerships, purpose-driven culture, and community investment.
Explicitly OUT OF SCOPE: Environmental consulting, sustainability strategy, ESG reporting, carbon programs, climate initiatives.

YOUR TASK: Generate exactly 10 realistic, plausible lead prospects that match Rooster's ideal customer profile. These should be real-sounding companies and contacts that could exist in the market. Make them specific and varied.

${focus ? `FOCUS AREA: ${focus}` : ''}

IDEAL CUSTOMER — "The Try-er":
- Has expressed some interest in social impact / CSR but has NOT built a mature, integrated program
- No dedicated measurement or accountability infrastructure
- Impact work housed inside People/Culture, HR, or Marketing — not a standalone CSR function
- Visible signals of purpose interest but thin or inconsistent follow-through

COMPANY-LEVEL FILTERS:
- Size: 200–10,000+ employees, Revenue $50M–$5B+
- Industry: Tech, financial services, consumer brands, professional services, retail, healthcare adjacent
- EXCLUDE: Heavy industrial, oil & gas, pure environmental/climate sectors
- Geography: US-based HQ or strong US operations
- For-profit only
- Budget capacity for $10K–$75K+ consulting engagement

POSITIVE SIGNALS to incorporate (vary these across leads):
- Job postings for CSR Coordinator, Impact Manager, Community Relations, Volunteer Program Manager, or People & Culture roles with purpose language (coordinator-level, not director — director signals maturity)
- Website references community involvement or employee volunteerism but has no dedicated impact page, no metrics, no annual report
- LinkedIn with occasional values-forward posts but no consistent impact content
- Employee-generated content mentioning volunteer days or charity events without a formal program name
- "About Us" or "Careers" pages that lead with values but lack substantive program descriptions
- Recent growth signals — funding, headcount growth, new office openings
- Trigger events — new CHRO/CPO/CEO hire, brand refresh, announced DEI initiatives

DISQUALIFIERS (do NOT include companies like these):
- Dedicated CSR Director or VP already at a mature program level
- Published annual impact report with quantitative outcomes
- B Corp certified
- Primary focus is environmental/sustainability
- Nonprofit, government, or public sector
- Fewer than 200 employees
- Active reputational crisis

CONTACT-LEVEL TARGETING:
Primary: VP or Director of People & Culture / HR, Chief People Officer (CPO), Head of Employee Experience, Director of Communications or Brand
Secondary: CMO (if purpose-driven brand positioning), CEO at smaller companies (≤500 employees)
AVOID: CSR/Sustainability-specific titles at mature programs, Legal/Finance/Operations titles, Coordinator or Specialist level

For each lead, you MUST identify a specific person at the company who matches the contact-level targeting criteria above. Generate a plausible professional email address for them using common corporate email formats (first.last@domain.com, first@domain.com, etc.) based on the company's website domain. Also generate a plausible LinkedIn profile URL.

Return ONLY a JSON array of exactly 10 objects with these fields (no markdown, no explanation, just the JSON array):
[
  {
    "contactName": "Full Name",
    "contactTitle": "Their Title",
    "contactEmail": "plausible email based on company domain",
    "contactLinkedIn": "https://linkedin.com/in/plausible-profile-slug",
    "companyName": "Company Name",
    "industry": "Industry",
    "companySize": "e.g. 500-1000",
    "companyWebsite": "https://...",
    "fitNotes": "2-3 sentences: why they're a fit, what signal you spotted, suggested angle",
    "source": "AI Discovery"
  }
]`

  const raw = await callClaude(prompt, apiKey, { maxTokens: 4096 })

  // Parse JSON from the response — handle possible markdown wrapping
  let jsonStr = raw.trim()
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }
  const leads = JSON.parse(jsonStr)
  if (!Array.isArray(leads)) throw new Error('AI did not return a valid lead list')
  return leads
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
