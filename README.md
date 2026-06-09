# ASEP Sprint

A focused, two-day study companion for the INCOSE ASEP exam. All instructional content, explanations, and practice-question subject matter are derived from the uploaded **INCOSE Systems Engineering Handbook, Fifth Edition**.

## Question bank

The app provides **1,000 deterministic practice questions** built from a structured handbook concept catalog. The bank:

- covers foundations, system life-cycle processes, technical processes, analyses and methods, and tailoring/application considerations;
- places approximately 90% of its questions in the first four high-yield study domains;
- gives each item one correct answer, two closely related distractors, and one easy elimination;
- varies retrieval direction, scenario framing, and answer position rather than teaching a predictable answer pattern;
- provides a handbook section/page reference and rationale after every answer; and
- prioritizes unseen questions until the selected domain has been completed.

Choose sessions of 10, 25, 50, or 100 questions. Browser-local progress records unique questions attempted, accuracy, confidence, and missed questions for targeted retry.

## Run locally

No build step or external application dependency is required:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Study flow

- Follow the four sessions for each of the two study days.
- Answer from memory before reviewing the explanation.
- Mark confidence honestly; misses and guesses enter the retry queue.
- Use Rapid Review only after completing focused practice.
- Progress is stored locally in the browser.

The practice questions are original study questions, not actual INCOSE examination items.
