# Scenario Availability Analysis

## Total Count
- **45 total scenarios** (including 8 newly added high-fame scenarios)
- **37 original scenarios** (before today's additions)

## Breakdown by Restrictions

### 1. Staff-Required Scenarios (3 scenarios)
These only appear if you have specific staff hired:
- Manager's Big Swing (requires Manager)
- Booker's Festival Slot (requires Booker, Fame 30+)
- Promoter's PR Stunt (requires Promoter)

### 2. Contract Scenarios (5 scenarios)
These require contractEligibilityUnlocked AND no current label:
- The Indie Label Offer
- The Major Label Bidding War
- The 360 Deal Temptation
- Distribution vs Full Label
- The Contract Renegotiation (requires label + achievement)

### 3. Achievement-Locked Scenarios (3 scenarios)
These require specific achievements:
- The Major Label Bidding War (requires PROJECT_ALBUM_1)
- Distribution vs Full Label (requires PROJECT_ALBUM_1)
- The Contract Renegotiation (requires PROJECT_ALBUM_1 + label)

### 4. Project-Required Scenarios (2 scenarios)
These only appear when you have an active project:
- The Language Choice (Fame 10-40, requires project)
- The Influencer Deal (Fame 15-50, requires project)

### 5. Once-Only Scenarios (26 scenarios marked `once: true`)
These appear once and never again:
- Manager's Big Swing, Booker's Festival Slot, Promoter's PR Stunt
- All 5 contract scenarios
- The Influencer Deal
- The Street Vendor Distribution
- The Producer's Royalty Demand
- The Collecting Society Registration
- The Sample Clearance Nightmare
- The Music Video Budget Decision
- The International Collaboration Offer
- The Traditional Instrument Fusion
- The Cultural Appropriation Accusation
- The Religious Music Crossover
- The Family Obligation vs Career
- The Language Barrier in Collaboration
- The Generational Sound Debate
- The Political Song Pressure
- The Gen Z Dance Challenge
- The Mental Health Crisis
- The Intergenerational Collaboration Offer
- The Stadium Show Catastrophe

### 6. Fame-Capped Scenarios (Blocked at High Fame)
These disappear after certain fame levels:
- The Open Mic Night (maxFame: 20)
- The Boomplay Decision (Fame 15-50)
- The Language Choice (Fame 10-40)
- The Radio Payola Request (Fame 20-60)
- The Influencer Deal (Fame 15-50)

## The REAL Problem

**At Fame 98 with 200+ decisions, you likely have:**

### Already Exhausted (once: true):
- ~26 scenarios seen once and now unavailable

### Blocked by Conditions:
- 3 staff scenarios (if you don't have all staff)
- 5 contract scenarios (you already have a label)
- 2 project scenarios (only appear during active projects)
- 5 low-fame scenarios (capped below your fame level)

### Actually Available:
**Only ~4-9 repeatable scenarios!**
- Social Media Controversy (Fame 30+)
- Sellout Opportunity (Fame 15+)
- Boomplay Decision (Fame 15-50) - BLOCKED if >50
- Piracy Problem (Fame 15+)
- WhatsApp Producer (Fame 20+)
- Diaspora Tour (Fame 25+)
- Radio Payola (Fame 20-60) - BLOCKED if >60
- Feature Request (Fame 25+)
- Festival Circuit (Fame 30+)
- + 8 new high-fame scenarios (Fame 60-100)

## Why You're Seeing Repetition

Most scenarios are marked `once: true`, meaning after 200 decisions, you've exhausted 70% of the content. The remaining repeatable scenarios have strict conditions that filter most of them out at your stats.

## Recommended Fixes

I should remove `once: true` from more scenarios that could realistically repeat in music careers. Many of these challenges are ongoing, not one-time events.
