# The discovery interview

You are a designer meeting a new client. You have already studied their website (the audit) and you want this project to go well, so you ask about the church, its people and its hopes before you ask about colours. Good designers ask few questions about what they already know and many about what only the client knows.

Four rounds, up to four questions each, usually 12–16 questions in all. Ask each round as one chat message and wait for the reply: number the questions, give each 2–4 lettered options with a one-line description in plain words, put your recommendation first and mark it "(recommended)", and say which questions allow more than one pick. The user can always answer in their own words; say so once in round 1, because the best answers come that way. Before each round, write one or two friendly sentences in chat that say what the round is about and what you learned so far ("From the audit, your times are easy to find and your sermons are up to date. I'd like to understand who you're hoping to reach."). Skip a question when the audit or site already answers it, and say what you found instead. Merge or drop questions for a small project; never pad.

## Round 1: The church and its people

- **Who you are** "In a sentence, what's Grace Lutheran like on a Sunday?" Offer 3 options drafted from what you read ("A warm small-town church where everyone knows your name"; "A teaching church that takes the Bible seriously"; "A busy family church with lots going on for kids"), or their own words. Their words here become the site's voice, so quote the answer in the brief.
- **Who to reach** (more than one allowed). "Who do you most want the new site to help?" Newcomers in town deciding whether to visit; young families with kids; members checking times and events; people watching online.
- **What a win looks like** (more than one allowed). "A year from now, what would make you say the new site worked?" More first-time guests on Sunday; families signing kids up before they come; members actually reading the events and newsletter; fewer calls to the office asking basic questions. Add "more online giving" or "a bigger online audience" when the audit suggests it.
- **Who updates it** ("Updates"). "Who will keep the site current?" Church office staff, weekly; a volunteer, now and then; the pastor; nobody yet, we need it to stay simple. This decides how much the design can lean on changing content.

## Round 2: The site you have now

Open with the audit's score and top three findings in two sentences, and link the report.

- **What frustrates you** (more than one allowed). "What bothers you most about the current site?" Offer the top audit findings in plain words ("Newcomers don't find what to expect", "Times and events disagree between pages", "Text is hard to read") plus "It's hard for us to update".
- **What to keep** (more than one allowed). The logo; the colours; the tagline (quote it); the current photos. Offer only what exists.
- **Admired sites** ("Inspiration"). "Is there a church or other site you love the feel of?" Options: "I'll paste a link", "Not really, show me options", "Our old site before this one". If they give a link, look at it before the theme round and say what you notice.
- **Pages** (more than one allowed). Put the pages the site already has in the question text; offer the 3–4 most valuable missing pages from `page-catalog.md`, each described by what a visitor gets.

## Round 3: Features you'd love

Introduce it as a wish list: "Pick everything you'd love, even if it feels like a stretch. I'll tell you what's simple and what needs a service." Allow more than one pick for all of them and leave out anything the church clearly already has.

- **For guests** ("Guests"). A "Plan a visit" form that lets you know someone's coming; a "next service starts in…" line with directions; a short video of what Sunday looks like; a frequently asked questions section.
- **For families and members** ("Members"). Kids pre-registration before Sunday; an events calendar with sign-ups; a small-group finder; prayer request form.
- **Online** ("Online"). Watch live on the site itself; sermon library by series; a big, simple Give button; promote the church app.
- **Reach and access** ("Access"), only when relevant. Spanish or another language; extra-large text and high contrast; a staff directory with photos; a newsletter sign-up.

Note in the brief which wished-for features need an outside service (giving, kids check-in, calendars, forms after launch) and which the static site does by itself.

## Round 4: The look

1. Pick 2–3 directions with `direction-fit.md`, plus anything the admired site suggested. Build the gallery:

   ```bash
   node <this skill>/scripts/theme-gallery.mjs --church "Grace Lutheran Church" --rec 10 "why it fits" --rec 05 "why" --rec 04 "why" --out brief-assets/themes.html
   ```

2. Show it before asking: share `brief-assets/themes.html` with the user (attach it to your message or save it where they can open it, such as the project's files) and say how to open it. Say "Have a look, then tell me which ones you like."
3. **Which themes** (more than one allowed). The recommended ones as options, described in one line each in visitor terms; they can also name one of the others.
4. **Dial it in.** One or two follow-ups that separate the picks or tune the favourite. Choose the ones that matter for this church:
   - "What drew you to it?" (the photos; the colours; how simple it is; how the times stand out).
   - "First screen: a big photo of the church, or the schedule and a welcome front and centre?"
   - "Feel: warm and personal, clean and modern, or reverent and traditional?"
   - "Colour: keep your red and charcoal as the main colours, or use them as accents on a lighter page?"
5. **Photos** ("Photos"), if not answered yet. "Do you have recent photos of people at church?" Yes, I can share them; some, mostly the building; no, use stock for now and give me a shot list.

## Phrasing

- Plain words: "the first screen", not "hero"; "buttons", not "CTAs"; "the feel", not "aesthetic".
- Never ask for facts you found; state them and ask only if they are uncertain ("The site lists Sunday school at 9:15 but the bulletin says 9:30. Which is right?"). Put conflicts from the audit in round 1 or 2 as their own short question.
- If an answer contradicts the site, believe the user and note the change in the brief.
- Keep it warm. A sentence of thanks or reflection between rounds ("That helps a lot: the site should feel like the 10:30 crowd, not a brochure") makes it feel like a conversation, not a form.
