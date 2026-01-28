# HIV Peer Support Platform - Wireframes

> App for helping HIV people to have support

## Overview
Low-fidelity wireframes for an anonymous peer support platform for people diagnosed with HIV in Costa Rica. Focus on emotional accompaniment, safety, and trauma-informed design.

## How to View the Wireframes

1. Open `wireframes.html` in any web browser
2. Use the dropdown menu to navigate between different screens
3. The wireframes are mobile-first (375px width) and fully responsive

## Included Screens

### 1. Landing Page
- **Focus:** Trust, anonymity, and immediate support
- **Key elements:** 
  - Non-threatening headline emphasizing companionship
  - Language selector (ES/EN) in top-right
  - Primary CTA: "Talk to someone now"
  - Trust indicators (anonymity, moderation, medical disclaimer)

### 2-5. Onboarding Flow (4 Steps)
- **Step 1:** Language confirmation
- **Step 2:** Clear explanation of what the platform is/isn't
- **Step 3:** Optional context gathering (no account required)
- **Step 4:** Consent and disclaimer acceptance
- **Design principle:** Progressive disclosure, no barriers to entry

### 6. Urgent Support Screen
- **Focus:** Clear path to immediate connection
- **Key elements:**
  - Large "Connect now" button
  - Explanation of what happens next
  - Persistent medical disclaimer
  - Link to CCSS (public health system)

### 7. 1:1 Chat Interface
- **Focus:** Minimal, distraction-free conversation
- **Key elements:**
  - Clear labeling: "Peer support - lived experience"
  - Persistent disclaimer visible during chat
  - Report/flag option (visible but not aggressive)
  - Easy exit mechanism

### 8. FAQ / Information Screen
- **Focus:** Professionally validated, reassuring information
- **Content areas:**
  - Post-diagnosis information
  - Treatment effectiveness (U=U messaging)
  - Links to CCSS and local resources
  - Medical terminology explained simply

### 9. Failure State - No Peer Available
- **Focus:** Empathetic messaging, alternatives offered
- **Key elements:**
  - Supportive, non-technical language
  - Retry option
  - Alternative: view information
  - No blame or guilt messaging

### 10. Crisis Resources
- **Focus:** Immediate safety resources
- **Key elements:**
  - Emergency numbers (911)
  - Local crisis lines (Hospital Nacional Psiquiátrico, IAFA)
  - Link to CCSS mental health services
  - Clear visual hierarchy for urgency

## Design Principles Applied

### Trauma-Informed UX
- **Calm visual design:** Grayscale, high contrast, minimal visual noise
- **Control:** Easy exit mechanisms, no forced progression
- **Safety:** Persistent disclaimers, clear expectations
- **No surprises:** Explain what will happen before it happens

### Anonymity & Privacy
- No profiles, usernames, or avatars
- No account creation required for basic access
- Language avoids identity markers
- 1:1 conversations only (no public forums)

### Cultural Sensitivity (Costa Rica)
- Spanish as default language
- References to CCSS (public healthcare) as trusted source
- Crisis resources specific to Costa Rica
- Acknowledges stigma without reinforcing it

### Accessibility
- Large, readable text (16px minimum)
- High contrast (grayscale ensures this)
- Clear navigation hierarchy
- Screen reader friendly structure
- Mobile-first responsive design

### Non-Clinical Tone
- Avoids medical jargon
- Uses "par" (peer) not "usuario" (user)
- Emphasizes "acompañamiento" (accompaniment) not "ayuda" (help)
- Conversational without being casual

## What's Explicitly Avoided

❌ **Social media patterns:** No likes, comments, followers, or public feeds
❌ **Gamification:** No points, badges, or achievement systems
❌ **Public profiles:** No display names, photos, or bio sections
❌ **Medical advice:** Clear boundaries maintained throughout
❌ **Forced sharing:** All context questions are optional
❌ **Aggressive design:** No bright colors, popups, or urgent notifications

## Technical Notes

### Technology Stack (Wireframe)
- Pure HTML/CSS/vanilla JavaScript
- No frameworks (for maximum compatibility)
- Mobile-first responsive design
- Accessible markup (semantic HTML)

### Production Recommendations
- WCAG 2.1 AA compliance minimum
- End-to-end encryption for chats
- No persistent data storage without consent
- Moderation system (human + automated)
- Integration with crisis intervention protocols

## Localization Considerations

### Spanish (Default)
- Costa Rican Spanish variants
- Formal "usted" vs informal "vos" consideration
- Medical terms localized appropriately

### English (Secondary)
- For expat community and English-speaking Costa Ricans
- Same trauma-informed tone
- Cultural context maintained

## Next Steps for Development

1. **User Testing:** Conduct testing with target audience (safely and ethically)
2. **Content Validation:** Medical/psychological professional review
3. **High-Fidelity Design:** Add subtle color (calming tones), refined typography
4. **Technical Implementation:** Build with accessibility and security as priorities
5. **Moderation System:** Design protocols for peer volunteer training
6. **Crisis Integration:** Establish protocols for escalation to professional help

## Contact & Collaboration

This is a health-sensitive product. Any implementation should involve:
- HIV advocacy organizations in Costa Rica
- Mental health professionals
- People living with HIV (participatory design)
- CCSS or other public health entities
- Privacy and security experts

---

**Document Version:** 1.0  
**Date:** January 22, 2026  
**Purpose:** Conceptual wireframes for stakeholder review
