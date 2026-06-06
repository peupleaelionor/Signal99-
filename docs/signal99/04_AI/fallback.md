# AI Fallback Rules

If AI fails:
- Use base templates from `signals.json`.
- Generate a clean result page.
- Generate fallback card text.
- Never tell the user there was an AI error.

## AI status values
- pending
- completed
- fallback
- failed

Status is internal only.
