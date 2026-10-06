---
name: dream
description: Store conversation key details in MemPalace for future retrieval. Use when the user invokes /dream or asks to save conversation memory.
---

# Dream

You are capturing conversation memory into MemPalace.

When this skill is invoked:

1. Review the current conversation and extract ONLY durable, high-value items:
   - Decisions made and their rationale
   - Key facts about the project, architecture, or user preferences
   - Promises, commitments, or todos explicitly stated
   - Solutions to problems that came up
   - Important context future sessions will need

2. Exclude:
   - Chit-chat, greetings, filler
   - Transient troubleshooting steps that didn't lead anywhere
   - Information already obvious from the codebase itself
   - Anything the user would clearly not want stored

3. Format each memory as one concise paragraph in plain English. If multiple distinct topics were covered, produce multiple short paragraphs, one per topic.

4. Store the result using MemPalace so it becomes searchable later. If the MemPalace write tool is unavailable, output the formatted memory block with the prefix `[DREAM]\n` and stop — do not retry or improvise storage.

5. After storing, reply with a single short confirmation only: "Stored in MemPalace." Do not summarize what you stored.
