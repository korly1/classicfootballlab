# Notification Model

## Overview

When an evaluation is published, the coach is prompted to notify the parent. Notifications go via email (Resend), SMS (Twilio), or clipboard copy. All three can be sent together — the coach chooses what to use per player. Every send is logged to `notification_log`.

## Channels

| Channel   | Service | Cost          | When used                              |
| --------- | ------- | ------------- | -------------------------------------- |
| Email     | Resend  | Free tier ok  | Always shown if `parent_email` exists  |
| SMS       | Twilio  | ~$0.008/msg   | Shown if `parent_phone` exists         |
| Clipboard | None    | Free          | Always shown — coach sends manually    |

## Share Prompt Flow

The prompt appears in two situations:

1. After saving a new evaluation — "Ready to share this with the parent?"
2. After editing a published evaluation — "You updated this evaluation. Notify the parent?"

The prompt is a modal with:

- Player name + evaluation date
- Checkboxes for each available channel (pre-checked based on player data)
- Preview of the message that will be sent
- "Send" button and a "Skip for now" link

Clicking "Send" calls a Server Action that:

1. Sends email via Resend (if checked and `parent_email` exists)
2. Sends SMS via Twilio (if checked and `parent_phone` exists)
3. Marks `evaluation.is_published = true`
4. Logs each send to `notification_log`
5. Returns clipboard text (the share link + PIN reminder) regardless

Clicking "Skip for now":

- Closes the modal
- A banner stays on the evaluation page: "Not shared yet — Share with parent"

## Message Templates

### Email subject

`[Player name]'s CFL Evaluation — [Month Year]`

### Email body (`src/features/notifications/templates/evaluation-email.tsx`)

Hi [parent_name],

Eduardo has published [player_name]'s latest evaluation from [session_date].

You can view it here: `https://lab.football/report/[token]`

Your PIN: [pin — shown in plain text only in this send, not stored]

If you've already set your PIN, you don't need this reminder.

— Classic Football Lab

### SMS body

```
CFL: [player_name]'s evaluation is ready.
View: lab.football/report/[token]
PIN: [pin]
```

Note: SMS keeps the URL short. No `https://` prefix — Twilio adds link detection.

## Important: PIN Handling

The PIN is stored in the database as a bcrypt hash. The plain-text PIN is only available to the coach at the moment they set it. If the coach sends a notification with the PIN included, it goes in that one message. If the parent loses their PIN, the coach resets it from the player profile.

## Resend Setup

```ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'CFL <noreply@lab.football>',
  to: parent_email,
  subject: `${player_name}'s CFL Evaluation`,
  react: EvaluationEmailTemplate({ ... })
})
```

## Twilio Setup

```ts
import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

await client.messages.create({
  body: smsBody,
  from: process.env.TWILIO_FROM_NUMBER,
  to: parent_phone
})
```

Both calls happen inside a Server Action — never in Client Components.
