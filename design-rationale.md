# Design Rationale - HIV Peer Support Platform

## Executive Summary

This document explains the reasoning behind key UX and design decisions for an anonymous peer support platform for people diagnosed with HIV in Costa Rica. Every decision prioritizes safety, trauma-informed care, and cultural sensitivity.

---

## Core Design Philosophy

### 1. Trauma-Informed Design

**Principle:** People accessing this platform may be in acute emotional distress, recently traumatized by diagnosis, or experiencing stigma-related trauma.

#### Key Applications:

**Control & Autonomy**
- ✅ **Decision:** Users can exit conversations at any time with one tap
- ✅ **Decision:** All context questions during onboarding are optional
- ✅ **Decision:** No forced account creation to access support
- **Rationale:** Trauma survivors need to feel in control. Removing barriers and providing easy exits reduces anxiety.

**Predictability & Transparency**
- ✅ **Decision:** "What will happen next" explanations before every major action
- ✅ **Decision:** Persistent disclaimers during chat (always visible)
- ✅ **Decision:** Step indicators show progress through onboarding
- **Rationale:** Surprises can trigger trauma responses. Clear expectations build trust.

**Safety Signals**
- ✅ **Decision:** Anonymity guarantees displayed prominently
- ✅ **Decision:** Moderation notice on landing page
- ✅ **Decision:** Report/flag option always accessible but not aggressive
- **Rationale:** Explicit safety features help users feel protected without creating paranoia.

**Calm Visual Environment**
- ✅ **Decision:** Grayscale only (in wireframes; subtle calming colors in production)
- ✅ **Decision:** Generous white space, no visual clutter
- ✅ **Decision:** Large, readable text (16px minimum)
- **Rationale:** Visual simplicity reduces cognitive load for people in crisis.

---

### 2. Anonymity as Core Feature

**Challenge:** Balance anonymity with trust and accountability.

#### Design Decisions:

**No Profiles or Usernames**
- ✅ **Decision:** Users labeled simply as "you" and "peer" in chat
- ❌ **Rejected:** Display names, even anonymous ones
- **Rationale:** Even choosing an anonymous username can feel like exposure. Generic labels maintain maximum privacy.

**No Account Creation (Initially)**
- ✅ **Decision:** Immediate access to information and connection
- ✅ **Decision:** Optional account only for returning users (not in MVP)
- **Rationale:** Account creation is a barrier when someone needs immediate support.

**1:1 Conversations Only**
- ✅ **Decision:** No group chats, no forums, no public posts
- ❌ **Rejected:** Community bulletin boards or discussion threads
- **Rationale:** Public forums increase exposure risk and stigma concerns.

**Data Minimization**
- ✅ **Decision:** Collect only what's necessary for connection
- ✅ **Decision:** Clear data deletion option
- **Rationale:** GDPR compliance and ethical imperative for health-sensitive data.

---

### 3. Medical Boundaries

**Challenge:** Provide support without crossing into medical advice.

#### Design Decisions:

**Persistent Disclaimers**
- ✅ **Decision:** "Not medical advice" visible on every screen where support happens
- ✅ **Decision:** Disclaimers are informative, not legal jargon
- **Rationale:** Users need constant reminders that peers share experience, not expertise.

**Clear Content Separation**
- ✅ **Decision:** Peer chat and professional information are different sections
- ✅ **Decision:** FAQ content explicitly labeled as "professionally validated"
- **Rationale:** Visual and verbal separation prevents confusion about source credibility.

**Explicit Links to Professional Care**
- ✅ **Decision:** CCSS (public health system) referenced frequently
- ✅ **Decision:** Crisis resources accessible from multiple entry points
- **Rationale:** Platform should be a bridge to professional care, not a replacement.

**Consent & Understanding**
- ✅ **Decision:** Onboarding step 4 requires explicit consent acknowledgment
- ✅ **Decision:** Users must check boxes confirming understanding
- **Rationale:** Legal protection and ethical responsibility to ensure informed use.

---

### 4. Cultural Sensitivity (Costa Rica)

**Context:** HIV stigma is significant in Costa Rica, despite strong public healthcare.

#### Design Decisions:

**Language & Tone**
- ✅ **Decision:** Spanish as default (Costa Rican variants)
- ✅ **Decision:** Formal "usted" in written content, peers can choose in chat
- ✅ **Decision:** Person-first language ("persona con VIH" not "VIH positivo")
- **Rationale:** Language reflects respect and reduces internalized stigma.

**CCSS Integration**
- ✅ **Decision:** CCSS referenced as trusted resource, not competitor
- ✅ **Decision:** Links to local clinics and services
- **Rationale:** CCSS provides free treatment; platform should facilitate access.

**Local Crisis Resources**
- ✅ **Decision:** Crisis screen includes Costa Rica-specific phone numbers
- ✅ **Decision:** Hospital Nacional Psiquiátrico, IAFA prominently featured
- **Rationale:** Generic international resources aren't helpful in emergencies.

**Stigma Awareness**
- ✅ **Decision:** No requirement to "identify as" having HIV during onboarding
- ✅ **Decision:** Option to say "prefer not to specify"
- **Rationale:** Even in anonymous context, some users aren't ready to self-identify.

---

### 5. What We Explicitly Avoided (And Why)

#### ❌ Social Media Patterns

**Rejected Features:**
- Public profiles with avatars
- Follower/following mechanisms
- Public feeds or timelines
- Likes, reactions, or engagement metrics

**Rationale:**
Social media patterns encourage public sharing and identity creation, which conflicts with anonymity needs. They also create social comparison and performance pressure, harmful for vulnerable users.

#### ❌ Gamification

**Rejected Features:**
- Points or badges for participation
- Streaks or achievement systems
- Leaderboards or ranking

**Rationale:**
Gamification can trivialize serious health issues and create unhealthy pressure to participate for external rewards rather than genuine need.

#### ❌ Aggressive Conversion Tactics

**Rejected Features:**
- Countdown timers ("Talk now!")
- Scarcity messaging ("Only 2 peers available!")
- Pop-ups or interstitials
- Auto-play videos

**Rationale:**
High-pressure tactics can trigger anxiety in trauma-exposed users. Calm, clear options respect user agency.

#### ❌ Visual Branding That Resembles Social Networks

**Rejected Elements:**
- Bright, saturated colors
- Playful illustrations
- Emoji overuse
- Trendy UI patterns

**Rationale:**
This is a health intervention, not a social app. Visual design should feel safe and professional without being clinical.

---

## Key User Journeys & Design Decisions

### Journey 1: Crisis Access (Immediate Need)

**User Story:** Someone just received diagnosis and needs to talk to someone NOW.

**Design Decisions:**
1. **Landing → Urgent Support → Chat** (3 taps maximum)
2. Large "Talk to someone now" button on landing page
3. Minimal onboarding for first-time crisis users
4. Explanation of matching process to reduce anxiety
5. Fallback state if no peers available (empathetic, with alternatives)

**Why This Matters:**
In crisis, every second of friction matters. We optimize for speed while maintaining informed consent.

---

### Journey 2: Information Seeking (Not Ready to Talk)

**User Story:** Someone diagnosed weeks ago, wants to understand more before talking to anyone.

**Design Decisions:**
1. **Landing → FAQ** (2 taps)
2. Secondary CTA on landing page: "What is this platform?"
3. FAQ accessible without creating account
4. Content organized by common questions (not medical categories)
5. Clear path from FAQ to peer support when ready

**Why This Matters:**
Not everyone is ready for peer interaction immediately. Information seeking is a valid first step.

---

### Journey 3: Returning User (Has Used Before)

**User Story:** Someone who chatted once and wants to come back.

**Design Decisions:**
1. Optional account creation for returning users (not in MVP wireframes)
2. Browser-based recognition (not shown in wireframes)
3. Faster path to connection (skip full onboarding)
4. Access to previous resources shared

**Why This Matters:**
Reducing friction for returning users while maintaining anonymity option.

---

## Mobile-First Rationale

**Decision:** All wireframes designed at 375px width (iPhone SE/8 size).

**Why:**
1. **Privacy:** Users more likely to access sensitive health content on personal devices
2. **Accessibility:** Many Costa Ricans primarily access internet via mobile
3. **Discretion:** Easier to use privately than desktop
4. **Context:** People may seek support from anywhere, anytime

**Desktop Considerations (Future):**
- Same content, wider layout
- No additional features on desktop (feature parity)
- Responsive design principles (not mobile-only)

---

## Accessibility Decisions

### Screen Reader Compatibility

**Decisions:**
- Semantic HTML structure (`<header>`, `<nav>`, `<main>`)
- Alt text for all images/icons
- ARIA labels for interactive elements
- Logical tab order

### Visual Accessibility

**Decisions:**
- High contrast (grayscale ensures minimum 7:1 ratio)
- Minimum 16px body text, 28px headlines
- No color-only information conveyance
- Focus indicators on all interactive elements

### Cognitive Accessibility

**Decisions:**
- Short sentences (max 20-25 words)
- 8th-grade reading level
- Consistent navigation patterns
- Clear, descriptive button labels

**Rationale:**
Health literacy varies. Platform should be usable by people with varying education levels and cognitive states (including acute distress).

---

## Failure States & Edge Cases

### No Peer Available

**Design Decision:** Empathetic message + alternatives (information, retry, crisis resources)

**Rejected Approaches:**
- ❌ "Try back later" (dismissive)
- ❌ Technical error messages (scary)
- ❌ Queue system with wait time (creates pressure)

**Rationale:**
This is the moment of highest vulnerability. Failure must feel supportive, not like rejection.

### Connection Lost During Chat

**Design Decision:** Explain what happened + clear options (reconnect, new peer, exit)

**Rejected Approaches:**
- ❌ Silent disconnection (confusing, scary)
- ❌ Automatic reconnection (no control)
- ❌ Blame language ("You lost connection")

**Rationale:**
Technical failures in emotional moment need careful handling.

### Reported Content

**Design Decision:** Thank user, end conversation, offer alternatives

**Rejected Approaches:**
- ❌ Immediate ban feedback (vigilante justice)
- ❌ Detailed investigation explanation (too much info)
- ❌ Minimize report (user feels unheard)

**Rationale:**
Balance between user feeling heard and not over-sharing moderation process.

---

## Security & Moderation Considerations

### Human Moderation

**Approach:**
- Trained moderators review flagged conversations
- AI screening for harmful content (medical advice, crisis indicators)
- Peer volunteers complete trauma-informed training

**Not Shown in Wireframes:**
- Moderator dashboard
- Peer volunteer onboarding
- Training materials

### Data Security

**Principles:**
- End-to-end encryption for chat
- No persistent message storage (or time-limited)
- Minimal logging for safety only
- GDPR compliance

**Not Shown in Wireframes:**
- Technical infrastructure
- Data retention policies
- Privacy policy (would be linked)

---

## Localization Beyond Translation

### Spanish (Costa Rican)

**Considerations:**
- "Usted" vs "vos" (formal vs informal "you")
- Local idioms for emotional support
- Medical terminology (local usage)
- Cultural references (CCSS, local crisis lines)

### English (Secondary)

**Considerations:**
- Not just translation, but cultural adaptation
- Assumes user familiar with Costa Rican context (expats, bilingual locals)
- Same crisis resources (local to Costa Rica)
- Maintains person-first language standards

---

## Metrics for Success (Not Shown in Wireframes)

### User-Centered Metrics
- Time to first connection (speed)
- Completion rate of conversations (satisfaction)
- Return user rate (trust)
- Crisis escalation handled safely (safety)

### Anti-Metrics (What We DON'T Measure)
- ❌ "Engagement" time (not a social network)
- ❌ "User growth" as primary KPI (health outcome matters more)
- ❌ "Conversion" to paid features (free service)

---

## Future Enhancements (Beyond MVP)

### Phase 2 Possibilities
1. **Scheduled peer sessions** (not just immediate)
2. **Resource library** (videos, articles, beyond FAQ)
3. **Group support sessions** (facilitated, private)
4. **Integration with CCSS** (referral system)
5. **Peer volunteer portal** (dedicated interface)

### What Should NEVER Be Added
- ❌ Public profiles or social features
- ❌ Paid tiers or premium features
- ❌ Advertising or sponsorships
- ❌ Data selling or sharing with third parties

---

## Ethical Considerations

### Informed Consent
- Users understand platform limitations
- Clear about what happens to data
- Voluntary participation at every step

### Beneficence
- Platform designed to help, not harm
- Regular evaluation of outcomes
- Willingness to shut down if causing harm

### Justice
- Free access (no financial barriers)
- Language accessibility (bilingual)
- Mobile-first (reaches wider population)

### Autonomy
- Users control their participation
- Easy exit at any time
- No manipulation or coercion

---

## Conclusion

Every design decision in this platform stems from three core values:

1. **Safety First:** Physical, emotional, and data safety
2. **User Autonomy:** Control over participation and privacy
3. **Trauma-Informed:** Recognition that users may be in distress

This is not a social network, not a medical platform, and not a commercial product. It is a **health intervention** that requires the highest ethical standards and user-centered design.

---

**Document Version:** 1.0  
**Author:** Design Team  
**Date:** January 22, 2026  
**Purpose:** Internal design documentation for stakeholder review
