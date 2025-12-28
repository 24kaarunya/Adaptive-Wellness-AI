# Demo Video Recording Script

**Duration:** 5-7 minutes  
**Format:** Screen recording + voiceover  
**Tools:** OBS Studio / Loom / Zoom

---

## Pre-Recording Checklist

- [ ] Application running on `http://localhost:3000`
- [ ] Database cleared (fresh user experience)
- [ ] OPENAI_API_KEY configured in `.env`
- [ ] Browser window at 1920x1080 or 16:9 aspect ratio
- [ ] Close unnecessary tabs and notifications
- [ ] Test microphone audio quality
- [ ] Prepare demo user credentials
- [ ] Have architecture diagram ready
- [ ] Practice full script at least once

---

## Recording Script

### SEGMENT 1: Opening & Problem (0:00 - 1:00)

**[SCREEN: Title slide or landing page]**

**VOICEOVER:**
> "Hi, I'm [Name] from Team [Team Name], and we're excited to present **Adaptive Wellness AI** - our submission for the nnov-AI-tion Healthcare and Fitness Agentic Systems Challenge.
>
> Traditional fitness apps have a fundamental problem: **80% of fitness goals fail within 6 months**. Why? Because they treat human behavior as deterministic and predictable. They create rigid plans that collapse after a single missed workout.
>
> We built something different: an **autonomous agentic AI system** that doesn't just predict outcomes - it **reasons, plans, adapts, and learns** from your behavior."

**[ACTION: Click through landing page, highlight key features]**

---

### SEGMENT 2: Agentic Architecture (1:00 - 2:00)

**[SCREEN: Architecture diagram from COMPETITION_SUBMISSION.md]**

**VOICEOVER:**
> "Our system uses **6 specialized AI agents** working together in a continuous cognitive cycle:
>
> **1. Goal Formulation Agent** - transforms vague intentions like 'get healthier' into structured, failure-tolerant goals
>
> **2. Planning Agent** - generates multi-week plans with pre-built fallback strategies and recovery paths
>
> **3. Monitoring Agent** - continuously observes your behavior patterns without you having to ask
>
> **4. Adaptation Agent** - autonomously decides when and how to modify your plan based on real-world constraints
>
> **5. Reflection Agent** - performs weekly retrospective analysis to improve future planning
>
> **6. Explainability Agent** - ensures you understand exactly why any decision was made
>
> This isn't a chatbot that responds to queries - it's an **autonomous system** that proactively pursues your long-term wellness goals."

**[ACTION: Highlight each agent in diagram, show cognitive cycle flow]**

---

### SEGMENT 3: Live Demo - Onboarding (2:00 - 3:00)

**[SCREEN: Sign up page]**

**VOICEOVER:**
> "Let me show you how it works. First, I'll sign up as a new user."

**[ACTION: Sign up with email/password, navigate to onboarding]**

> "The onboarding captures what makes YOU unique - your available time, energy levels, current routine, barriers like low motivation or time constraints, and critically, **your history of past failures**.
>
> Notice how the system asks about adherence risk. Traditional apps ignore this - we make it central to our planning."

**[ACTION: Fill out wellness profile questionnaire quickly, showing:]**
- Primary intent: "Get healthier"
- Available time: 30 minutes/day
- Energy level: Low
- Barriers: Motivation, Time
- Adherence risk: High
- Historical failures: "Tried gym 2x, quit after 2 weeks"

**[ACTION: Submit profile]**

---

### SEGMENT 4: Goal Formulation (3:00 - 4:00)

**[SCREEN: Dashboard → Create New Goal]**

**VOICEOVER:**
> "Now I'll create a goal. Watch what happens when I enter something vague..."

**[ACTION: Navigate to /goals/new]**
**[TYPE in description:]** "I want to start exercising"

**[ACTION: Click "Create Goal & Generate Plan"]**

**[SCREEN: Show loading, then agent reasoning output]**

**VOICEOVER:**
> "The **Goal Formulation Agent** just analyzed my profile. Let's look at its reasoning...
>
> [READ AGENT OUTPUT - highlight key parts:]
> 
> 'User has high adherence risk and limited time. Based on historical failures, recommend conservative start: 15-minute walks, 3 times per week, with 1 allowed miss.'
>
> Notice the agent **reasoned about failure tolerance**. It didn't create an ambitious 5-day-a-week plan - it optimized for sustainability based on MY specific constraints."

**[ACTION: Show goal details, confidence score, structured output]**

---

### SEGMENT 5: Adaptive Planning (4:00 - 5:00)

**[SCREEN: Plan generation page or dashboard showing plan]**

**VOICEOVER:**
> "Now the **Planning Agent** creates a multi-week strategy. But here's what makes it agentic..."

**[ACTION: Navigate to plan details, show:]**
- Week-by-week progression
- Fallback plan section
- Recovery plan section
- Progression rules

**VOICEOVER:**
> "Look at this: the plan has **pre-generated fallback and recovery strategies**. If my energy is low, I can do a 10-minute walk instead. If I miss a week, there's already a recovery path defined.
>
> Traditional apps don't think this way - they're reactive. Our agents are **proactive and anticipatory**."

**[ACTION: Scroll through plan details]**

---

### SEGMENT 6: Autonomous Adaptation (5:00 - 6:00)

**[SCREEN: Monitoring/feedback page or simulated scenario]**

**VOICEOVER:**
> "Here's where the autonomy really shines. Let me simulate what happens when things go wrong..."

**[ACTION: Log some activities as completed, mark several as skipped]**
**[ACTION: Provide feedback: "Felt too tired" multiple times]**

**VOICEOVER:**
> "The **Monitoring Agent** is constantly observing these patterns. When it detects significant deviation, it automatically triggers the **Adaptation Agent**."

**[SCREEN: Show adaptation notification/modal]**

**[ACTION: Click to view adaptation reasoning]**

**VOICEOVER:**
> "Here's the remarkable part - the system **adapted my plan without me asking**. Let's read its reasoning...
>
> [READ AGENT REASONING:]
> 'Detected pattern: User completing only 2/7 activities with recurring low energy feedback. Analysis: Original plan overestimated user capacity. Autonomous decision: Reduce frequency to 2x/week, lower duration to 10 minutes. Confidence: 85%'
>
> This is autonomous agentic behavior - the system **reasoned, decided, and acted** on its own because it was confident the change would help."

**[ACTION: Show updated plan]**

---

### SEGMENT 7: Transparency & Explainability (6:00 - 6:30)

**[SCREEN: Explainability output or agent logs]**

**VOICEOVER:**
> "Every decision includes a transparent explanation. Here's what the **Explainability Agent** told me:
>
> [READ EXPLANATION - highlight user-friendly language:]
> 'I noticed you're feeling too tired for 3 workouts per week. I've reduced your plan to 2 times per week to match your energy level. This increases your success probability from 30% to 75%. We can gradually increase when you're ready.'
>
> No jargon, no blame - just clear reasoning that builds trust."

**[ACTION: Show agent activity log with timestamps, reasoning chains]**

---

### SEGMENT 8: Self-Reflection & Learning (6:30 - 6:50)

**[SCREEN: Reflection agent output or analytics page]**

**VOICEOVER:**
> "Finally, the **Reflection Agent** runs weekly retrospectives. It analyzes what worked, what didn't, and updates its internal reasoning heuristics.
>
> For example, after observing that conservative starts led to higher adherence for high-risk users, it updates its planning strategy for future similar profiles.
>
> The system **learns and improves over time** - that's agentic intelligence."

**[ACTION: Show reflection insights, lessons learned, recommendations]**

---

### SEGMENT 9: Closing (6:50 - 7:00)

**[SCREEN: Architecture diagram or team logo]**

**VOICEOVER:**
> "To recap - **Adaptive Wellness AI** demonstrates:
> - **Autonomous reasoning** across 6 specialized agents
> - **Multi-step planning** with 4-12 week horizons
> - **Proactive adaptation** without user prompts
> - **Self-reflective learning** that improves over time
> - **Transparent explanations** for every decision
>
> This isn't just another fitness app - it's a research prototype for how agentic AI can solve real human behavior problems in healthcare and wellness.
>
> Of course, we're aware of limitations - this is NOT medical advice, it requires user honesty, and LLM outputs can vary. But we believe it's a meaningful step toward truly intelligent, adaptive, and trustworthy wellness partners.
>
> Thank you for watching, and we're excited to discuss this further!"

**[SCREEN: Fade to contact info, GitHub repo link, team names]**

---

## Post-Recording Checklist

- [ ] Review video for audio clarity
- [ ] Check that all key features were demonstrated
- [ ] Ensure video length is 5-7 minutes
- [ ] Add subtitles/captions (optional but recommended)
- [ ] Export in high quality (1080p MP4)
- [ ] Upload to YouTube (unlisted) or Google Drive
- [ ] Test link accessibility
- [ ] Add link to README.md and COMPETITION_SUBMISSION.md

---

## B-Roll Suggestions (If Time Permits)

- Code snippets of agent implementation
- Database schema visualization
- API request/response examples
- Agent reasoning JSON outputs
- Terminal showing setup commands

---

## Common Pitfalls to Avoid

❌ Don't spend too long on introductions  
❌ Don't show bugs or errors (use edited footage)  
❌ Don't read code line-by-line (high-level only)  
❌ Don't use technical jargon without explanation  
❌ Don't forget to mention limitations and ethics  
❌ Don't exceed 7 minutes (judges won't watch long videos)  
❌ Don't forget to smile and be enthusiastic!

---

## Backup Plan

If live demo fails:
1. Have pre-recorded screen captures ready
2. Use screenshots with voiceover
3. Show agent reasoning outputs directly
4. Emphasize architecture and design over demo

---

**Good luck with your recording! 🎬**
