# **App Name**: StudyWise

## Core Features:

- Note Creation: Enable users to create notes with a title, body, and optional tags.
- Note Display: Display a searchable list of user notes, showing the original note and AI-generated context.
- AI Context Generation: Analyze note content using AI to provide definitions of key terms, explanations of related concepts, and suggested follow-up topics.
- AI Study Summary: Use AI to summarize all user notes into a concise "Study Summary", updated whenever a note is added or edited. The AI tool should use reasoning to identify the main points and themes across all notes, ensuring clarity and helpfulness for revision.
- Tag-Based Filtering: Allow users to filter notes by tag for easier organization and retrieval.

## Style Guidelines:

- Clean, mobile-friendly layout for easy access on any device.
- Use cards for notes with collapsible AI context sections to maintain a tidy interface.
- Primary color: Light teal (#A0DDE0) for a calming and studious atmosphere.
- Secondary color: Off-white (#F5F5F5) for backgrounds to ensure readability.
- Accent: Soft lavender (#E6E6FA) for highlighting key elements and buttons.
- Simple, clear icons for tags and actions (e.g., edit, delete, filter).
- Subtle animations for transitions and loading states to enhance user experience.

## Original User Request:
Prompt for Firebase Studio:

🚀 Build a Student Note-Taking Assistant web app with AI-powered context and summaries.

Main features:

Users can create notes with:

Title

Body text (freeform)

Optional tags/subject areas (e.g., "Science", "History")

When a note is created or edited, use AI to:

Analyze the note.

Provide additional helpful context:

Definitions of key terms in the note.

Quick explanations of related concepts.

Suggested follow-up topics to explore.

Display:

A searchable list of the user’s notes.

For each note:

Show the original note.

Show AI-generated context below.

Optional: Refresh AI context if the note changes.

Add a summary section:

Use AI to automatically summarize all user notes into a "Study Summary."

Update the summary whenever a new note is added or edited.

Display the summary at the top or bottom of the notes page.

AI Prompt: "Summarize the main points and themes from all of the student's notes. Keep it clear, concise, and helpful for revision."

Use Firebase to store:

Notes collection

Fields: title, body, tags, timestamp, AI context

(Optional) Summary document

Field: full summary text

Design:

Clean, mobile-friendly layout.

Use cards for notes with collapsible AI context.

Add a prominent "New Note" button.

Optional: Filter notes by tag.

Display the study summary at the end or in a dedicated section.

🎯 Goal: Build a working prototype in under an hour — focus on fast note creation, instant AI enrichment, and automatic study summary.
  