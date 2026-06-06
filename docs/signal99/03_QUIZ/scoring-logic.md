# Scoring Logic

## Rules
- Each answer adds points to 1 or 2 Signals.
- Highest score = dominant Signal.
- Second highest score = secondary Signal.
- No random result.

## Tie-breaker
If equal scores:
1. Prefer the Signal boosted by question 7.
2. If still tied, prefer the Signal boosted by question 6.
3. If still tied, use stable priority:
   king_queen → strategist → visionary → builder → rebel → protector → oracle.

## Important
The AI never chooses the Signal. The AI only personalizes the text after deterministic scoring.
