import { useState } from 'react'
import { getTouchCount } from '../utils/cadence'

const TEMPLATES = {
  cold: {
    label: 'Cold Intro',
    subject: (p) => `Social impact at ${p.companyName} — quick question`,
    body: (p) => `Hi${p.contactName ? ` ${p.contactName.split(' ')[0]}` : ''},

I'm reaching out because ${p.companyName} caught my attention — ${getPersonalizedHook(p)}

At Rooster Partners, we help companies like yours build social impact programs that actually move the needle — not just a page on the website, but programs that engage employees, build real community partnerships, and create measurable outcomes.

We recently developed a quick diagnostic called the Snapshot Assessment that helps companies understand where they stand across five dimensions of social impact maturity. It takes about 20 minutes and gives you a clear picture of where you are and where the opportunities are.

Would you be open to a quick conversation about what that could look like for ${p.companyName}?

Best,
Zane Miller
Rooster Partners
roosterpartners.co`,
  },
  followUp: {
    label: 'Follow-up',
    subject: (p) => `Re: Social impact at ${p.companyName}`,
    body: (p) => `Hi${p.contactName ? ` ${p.contactName.split(' ')[0]}` : ''},

I wanted to circle back on my previous note. I know things get busy, so I'll keep this short.

We work with companies at the stage where social impact is on the radar but hasn't yet been structured into something measurable and integrated. From what I've seen, ${p.companyName} fits that profile — and that's actually the ideal time to start.

Happy to share a few examples of what we've helped companies build if that would be useful. No pitch, just context.

Worth a 15-minute call?

Best,
Zane Miller
Rooster Partners`,
  },
  linkedin: {
    label: 'LinkedIn Note',
    subject: () => '',
    body: (p) => `Hi${p.contactName ? ` ${p.contactName.split(' ')[0]}` : ''} — I lead new business at Rooster Partners, a social impact consultancy. We help companies build and measure programs around employee engagement, community partnerships, and impact storytelling. Would love to connect — I think there's some interesting alignment with what ${p.companyName} is building.`,
  },
  finalFollowUp: {
    label: 'Final Follow-up',
    subject: (p) => `Last note — ${p.companyName} social impact`,
    body: (p) => `Hi${p.contactName ? ` ${p.contactName.split(' ')[0]}` : ''},

I'll keep this brief — I've reached out a couple of times about how Rooster Partners might support ${p.companyName}'s social impact efforts.

If the timing isn't right, I completely understand. But if this is something that's on your radar for this year, I'd love to have a quick conversation before things get locked into planning cycles.

Either way, no hard feelings. Wishing you and the team a great quarter.

Best,
Zane Miller
Rooster Partners`,
  },
  snapshot: {
    label: 'Snapshot Invite',
    subject: (p) => `Free social impact diagnostic for ${p.companyName}`,
    body: (p) => `Hi${p.contactName ? ` ${p.contactName.split(' ')[0]}` : ''},

We built a quick diagnostic tool called the Snapshot Assessment — it evaluates where a company stands across five key dimensions of social impact:

1. Leadership & Strategy
2. Employee Engagement
3. Partnership Ecosystem
4. Storytelling & Visibility
5. Measurement & Accountability

It takes about 20 minutes and gives you a clear, honest view of your current maturity — no sales pitch attached. We use it as a conversation starter because it genuinely helps companies understand where they are.

Would you be interested in running through it? I can walk you through it on a 30-minute call, or send it over for you to complete on your own time.

Best,
Zane Miller
Rooster Partners
roosterpartners.co`,
  },
}

function getPersonalizedHook(p) {
  const tier = (p.snapshotTier || '').toLowerCase()
  const notes = (p.fitNotes || '').toLowerCase()

  if (notes.includes('hiring') || notes.includes('coordinator')) {
    return "it looks like you're building out your social impact team, which tells me the commitment is there"
  }
  if (notes.includes('values') || notes.includes('culture')) {
    return "your company culture clearly prioritizes values, and I think there's an opportunity to channel that into something more structured"
  }
  if (notes.includes('competitor') || notes.includes('peer')) {
    return "I've noticed some of your peers in the space are starting to invest seriously in social impact programs"
  }
  if (tier === 'try-er') {
    return "it seems like you've started exploring social impact but may not have formalized it yet — that's actually the most exciting stage to be at"
  }
  if (tier === 'skeptic') {
    return "from the outside, it looks like social impact hasn't been a major focus yet — which means there's a real first-mover opportunity"
  }
  return "I've been following the work you're doing and think there's an interesting opportunity on the social impact side"
}

function suggestTemplate(prospect) {
  const touches = getTouchCount(prospect)
  if (touches === 0) return 'cold'
  if (touches === 1) return 'followUp'
  if (touches >= 3) return 'finalFollowUp'
  return 'followUp'
}

export default function EmailComposer({ prospect, onClose }) {
  const suggested = suggestTemplate(prospect)
  const [template, setTemplate] = useState(suggested)
  const [subject, setSubject] = useState(TEMPLATES[suggested].subject(prospect))
  const [body, setBody] = useState(TEMPLATES[suggested].body(prospect))
  const [copied, setCopied] = useState(null)

  function handleTemplateChange(key) {
    setTemplate(key)
    setSubject(TEMPLATES[key].subject(prospect))
    setBody(TEMPLATES[key].body(prospect))
    setCopied(null)
  }

  function copyToClipboard(text, field) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  function copyAll() {
    const full = subject ? `Subject: ${subject}\n\n${body}` : body
    copyToClipboard(full, 'all')
  }

  function openInGmail() {
    const to = ''
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, '_blank')
  }

  return (
    <div className="email-composer">
      <div className="composer-header">
        <h4>Compose Email — {prospect.companyName}</h4>
        <button className="btn btn-sm" onClick={onClose}>Close</button>
      </div>

      <div className="template-tabs">
        {Object.entries(TEMPLATES).map(([key, t]) => (
          <button
            key={key}
            className={`template-tab ${template === key ? 'active' : ''} ${key === suggested ? 'suggested' : ''}`}
            onClick={() => handleTemplateChange(key)}
          >
            {t.label}
            {key === suggested && <small> (suggested)</small>}
          </button>
        ))}
      </div>

      {subject && (
        <div className="composer-field">
          <label>
            Subject
            <button className="copy-btn" onClick={() => copyToClipboard(subject, 'subject')}>
              {copied === 'subject' ? 'Copied!' : 'Copy'}
            </button>
          </label>
          <input value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
      )}

      <div className="composer-field">
        <label>
          Body
          <button className="copy-btn" onClick={() => copyToClipboard(body, 'body')}>
            {copied === 'body' ? 'Copied!' : 'Copy'}
          </button>
        </label>
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={14} />
      </div>

      <div className="composer-actions">
        <button className="btn btn-primary" onClick={copyAll}>
          {copied === 'all' ? 'Copied to Clipboard!' : 'Copy All to Clipboard'}
        </button>
        <button className="btn btn-secondary" onClick={openInGmail}>
          Open in Gmail
        </button>
      </div>
    </div>
  )
}
