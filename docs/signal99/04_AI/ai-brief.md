# SIGNAL99 — Invisible AI Brief

## Principle
The AI is invisible. The magic is visible.

SIGNAL99 must never be presented as an AI app. The AI only personalizes the result after deterministic scoring.

## Default mode
`AI_PREGENERATE=false`

AI personalization runs **after payment** by default to control cost.

## Optional experimental mode
`AI_PREGENERATE=true`

Pre-generates after quiz completion to test “Your Signal is ready” instant effect. Not recommended at launch.

## Pipeline
Quiz answers → deterministic scoring → dominant + secondary Signal → AI personalization → JSON validation → safety validation → cache → display after payment.

## Fallback
If AI is slow, down, invalid, or unsafe, use premium templates. Never show an AI error to the user.
