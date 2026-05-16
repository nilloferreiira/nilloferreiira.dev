---
name: admin-update-projects
description: Use when reading or updating project entries in the nilloferreira.dev admin panel — adding tags, changing category, or editing descriptions via Playwright browser automation.
allowed-tools: Bash(playwright-cli:*) Bash(curl:*) Bash(python3:*)
---

# Admin: Update Projects

Reference workflow for reading and updating project entries at `http://localhost:3000/admin` using Playwright CLI.

> **Auth:** Navigate to `/admin/login`, fill email and password — user provides credentials at runtime.

## Check Current State First

```bash
curl -s http://localhost:3000/api/projects | python3 -c "
import json, sys
data = json.load(sys.stdin)['data']
for p in data:
    print(f'ID {p[\"id\"]}: {p[\"title\"]} | category: {p[\"category\"]} | tags: {p[\"tags\"]}')
"
```

## Fields & Input Formats

| Field | Input type | Format |
|---|---|---|
| `title` | text input | plain text |
| `description_pt` | textarea | plain text |
| `description_en` | textarea | plain text |
| `imgSrc` | text input | URL |
| `url` | text input | URL |
| `category` | `<select>` | `personal` \| `freelance` \| `work` \| `evento` |
| `tags` | text input | comma-separated: `react, next.js, typescript` |

> `position`, `createdAt`, `updatedAt`, `deletedAt` are server-managed — never in the form.

## Playwright Workflow

```bash
# 1. Open admin and log in
playwright-cli open http://localhost:3000/admin/login
playwright-cli snapshot          # find email/password refs
playwright-cli fill <email-ref> "your@email.com"
playwright-cli fill <password-ref> "yourpassword"
playwright-cli click <submit-ref>

# 2. Snapshot the admin page — find the edit button ref for the target project
playwright-cli snapshot

# 3. Click the edit (pencil) icon for the target project row
playwright-cli click <edit-ref>

# 4. Snapshot the modal to get field refs
playwright-cli snapshot e242     # panel is always ref e242

# 5. Fill fields (fill clears and replaces — no manual clearing needed)
playwright-cli fill <tags-ref> "react, next.js, typescript, tailwind"
playwright-cli select <category-ref> "evento"   # lowercase matches option value

# 6. Save
playwright-cli click <save-ref>
```

## Verify After Saving

```bash
curl -s http://localhost:3000/api/projects | python3 -c "
import json, sys
data = json.load(sys.stdin)['data']
for p in data:
    print(f'{p[\"title\"]}: category={p[\"category\"]}, tags={p[\"tags\"]}')
"
```

## Tips

- Edit buttons are icon-only — always `playwright-cli snapshot` first to get their refs
- Process multiple projects in one session: save one, then click the next edit button without closing the browser
- Dev server must be running: `pnpm dev`
