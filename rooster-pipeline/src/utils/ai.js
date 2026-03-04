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

  const prompt = `You are drafting a cold outreach email on behalf of Zane Miller at Rooster Partners. Follow these guidelines EXACTLY.

=== ROOSTER PARTNERS EMAIL GUIDELINES ===

ABOUT ROOSTER (use accurately in every email):
- Rooster is a corporate social impact consulting firm. Builders and operators of impact programs, strategy through execution.
- Experienced with Fortune 500 and mid-sized company programs. A team that has worked inside companies and led nonprofit partners.
- Rooster is a small, focused team. Own it, don't hide it.
- Rooster is NOT an environmental, sustainability, or ESG firm. NEVER mention climate, carbon, ESG, or environmental work.
- Rooster is NOT a nonprofit, PR agency, or large firm.

THREE-PART EMAIL STRUCTURE (mandatory, do not deviate):

PART 1 — ROOSTER'S STORY (Opening):
Lead with who Rooster is. This section is nearly identical across emails. Use this anchor language as your baseline (vary slightly, do NOT rewrite from scratch):

"I'm part of a small, very focused consulting group called Rooster that was built to help companies build and run highly effective impact programs. We're a team that's worked both sides of this, running programs inside companies and leading the nonprofits they partner with. We're new as a company, but our process is built on our experience building, managing, and promoting these programs on the inside, for companies of all sizes."

PART 2 — PERSONALIZATION (Middle):
1-3 sentences max. Acknowledge something specific and real about the prospect's work from the research brief below. Reference a program, event, press mention, LinkedIn post, podcast, or other verifiable signal.
- Do NOT explain their own work back to them
- Do NOT be presumptuous about their challenges
- Do NOT call their work "impressive" or "great." Show you know it, don't grade it.
- If they've moved away from CSR, acknowledge the ambiguity rather than ignoring it
- If limited info is available, lean on company-level signals, not guesses about the person

GOOD examples: "I saw the Hope Lodge Gala coverage and the work BEDGEAR has been doing with ACS. It's always exciting to find a team that's already in it and doing the work."
BAD examples: "I was really impressed by what BEDGEAR has built on the CSR side." / "It looks like you're dealing with the classic challenge of measuring impact."

PART 3 — THE ASK (Close):
Ask to listen, not to pitch. Goal is a 30-minute conversation. Never promise outcomes, quote ROI, or propose solutions.
Use this anchor language: "If you've got 30 mins sometime, I'd love to hear what your challenges and opportunities are on that side of things."
Or: "If you've got 30 mins sometime, I'd love to hear what you're working on and see if there's a way we can be useful."

WARM CONNECTION VARIATIONS:
- If the prospect is a Pepperdine alum: Lead with "My dad taught PR at Pepperdine for years, Kerry Miller. So this is a bit of a fellow Wave cold email, which feels less strange than a straight cold email." Use subject like "Kerry Miller's kid / Pepperdine + CSR"
- If the prospect has a biz dev background: Open with "I'll be honest, sending a cold outreach email to someone who's run biz dev professionally is a little nerve-racking. So I'll just be straightforward."

TONE & STYLE (non-negotiable):
- Write like a person, not a consultant. Short sentences. Conversational cadence. No jargon.
- Contractions are fine and preferred.
- Do not hedge with "might," "potentially," "could possibly"
- Do not over-apologize for reaching out
- NEVER use em dashes (—). Use commas, periods, or restructure.
- NEVER use: "I came across your profile and..." as an opener
- NEVER use: "It's clear that you..." or "At a glance..."
- NEVER use performance language like "driving results," "moving the needle" in the opener
- NEVER use: "I'd love to learn more about..." (too passive)

LENGTH: 4-6 short paragraphs. Under 200 words total. Sign off as Zane Miller, Rooster Partners.

SUBJECT LINE: Under 7 words. Specific, not salesy. No "opportunity," "synergy," "partnership." No colons.
Good patterns: "Impact programs at [Company]" / "[Company]'s community work, quick intro" / "Saw the [specific thing], wanted to connect"
Bad: "Quick question about your impact programs" / "Helping companies like [Company] drive CSR ROI"

=== END GUIDELINES ===

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
