---
name: admin-update-experiences
description: Use when reading or updating experience entries in the nilloferreira.dev admin panel — filling company, years, location, responsibilities, stack, or descriptions via Playwright browser automation.
allowed-tools: Bash(playwright-cli:*) Bash(curl:*) Bash(python3:*)
---

# Admin: Update Experiences

Reference workflow for reading and updating experience entries at `http://localhost:3000/admin` using Playwright CLI.

> **Auth:** Navigate to `/admin/login`, fill email and password — user provides credentials at runtime.

## Check Current State First

```bash
curl -s http://localhost:3000/api/experiences | python3 -c "
import json, sys
data = json.load(sys.stdin)['data']
for e in data:
    print(f'ID {e[\"id\"]}: {e[\"title_en\"]} @ {e[\"company\"]}')
    print(f'  location: {e[\"location\"]} | years: {e[\"start_year\"]} - {e[\"end_year\"]}')
    print(f'  stack: {e[\"stack\"]}')
    print(f'  responsibilities_pt: {e[\"responsibilities_pt\"]}')
    print(f'  responsibilities_en: {e[\"responsibilities_en\"]}')
    print()
"
```

## Fields & Input Formats

| Field | Input type | Format |
|---|---|---|
| `title_pt` | text input | plain text |
| `title_en` | text input | plain text |
| `description_pt` | textarea | plain text |
| `description_en` | textarea | plain text |
| `company` | text input | plain text |
| `location` | text input | plain text (e.g. `Remote`) |
| `start_year` | number spinner | integer or empty for null |
| `end_year` | number spinner | integer or empty for null (omit if current) |
| `responsibilities_pt` | textarea | **one item per line** (`\n`-separated) |
| `responsibilities_en` | textarea | **one item per line** (`\n`-separated) |
| `stack` | text input | **comma-separated**: `PHP, Laravel, AWS` |

> `position`, `createdAt`, `updatedAt`, `deletedAt` are server-managed — never in the form.

## Playwright Workflow

```bash
# 1. Open admin and log in
playwright-cli open http://localhost:3000/admin/login
playwright-cli snapshot          # find email/password refs
playwright-cli fill <email-ref> "your@email.com"
playwright-cli fill <password-ref> "yourpassword"
playwright-cli click <submit-ref>

# 2. Snapshot — Experiences section is below Projects on the same page
playwright-cli snapshot

# 3. Click the edit (pencil) icon for the target experience
playwright-cli click <edit-ref>

# 4. Snapshot the modal to get field refs
playwright-cli snapshot e242     # panel is always ref e242

# 5. Fill fields
playwright-cli fill <desc-pt-ref> "Nova descrição em português..."
playwright-cli fill <desc-en-ref> "New description in English..."
playwright-cli fill <company-ref> "Company Name"
playwright-cli fill <location-ref> "Remote"
playwright-cli fill <stack-ref> "PHP, Laravel, AWS"

# For responsibilities — one item per line using \n
playwright-cli fill <resp-pt-ref> "Primeira responsabilidade
Segunda responsabilidade
Terceira responsabilidade"

playwright-cli fill <resp-en-ref> "First responsibility
Second responsibility
Third responsibility"

# 6. Save
playwright-cli click <save-ref>
```

## Verify After Saving

```bash
curl -s http://localhost:3000/api/experiences | python3 -c "
import json, sys
data = json.load(sys.stdin)['data']
for e in data:
    print(f'--- {e[\"title_en\"]} ---')
    print(f'  desc_en: {e[\"description_en\"][:80]}')
    print(f'  responsibilities_en: {e[\"responsibilities_en\"]}')
    print(f'  stack: {e[\"stack\"]}')
"
```

## Tips

- Edit buttons are icon-only — always `playwright-cli snapshot` first to get their refs
- `playwright-cli fill` clears and replaces — no manual clearing needed
- Responsibilities must use actual newlines in the fill value (not `\\n` as a string literal)
- Leave `end_year` spinner empty (don't fill it) for a current/ongoing role — that saves as `null`
- Dev server must be running: `pnpm dev`
