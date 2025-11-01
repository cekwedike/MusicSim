# Dynamic Difficulty System

## Overview
The game now features a sophisticated, multi-layered dynamic difficulty system that evolves based on time, player performance, and market conditions. Difficulty is no longer static - it adapts to create a more realistic and challenging experience.

## Difficulty Modes

### Beginner Mode
- **Starting Cash**: $2,000
- **Grace Period**: 12 weeks
- **Static Difficulty**: No dynamic scaling
- **Perfect for**: Learning game mechanics without pressure

### Realistic Mode
- **Starting Cash**: $500
- **Grace Period**: 6 weeks
- **Dynamic Systems**: All enabled with moderate values
- **Reflects**: Real-world African music industry challenges

### Hardcore Mode
- **Starting Cash**: $200
- **Grace Period**: 3 weeks
- **Dynamic Systems**: All enabled with aggressive values
- **For**: Players seeking maximum challenge

## Dynamic Difficulty Systems

### 1. Time-Based Scaling
The game gets progressively harder as your career continues (every 26 weeks = 6 months):

**Realistic Mode:**
- +8% stat decay every 6 months
- +5% costs every 6 months
- -3% income every 6 months

**Hardcore Mode:**
- +15% stat decay every 6 months
- +10% costs every 6 months
- -8% income every 6 months

**Rationale**: Markets saturate, operating costs increase, and maintaining relevance becomes harder over time.

### 2. Performance-Based Scaling

**Success Penalty** (Career Progress ≥ Threshold):
- **Realistic**: +10% difficulty when doing well
- **Hardcore**: +25% difficulty when doing well
- **Why**: Success attracts more competition and higher expectations

**Failure Relief** (Career Progress < 60% of Threshold):
- **Realistic**: -15% difficulty when struggling
- **Hardcore**: -10% difficulty when struggling (less forgiving)
- **Why**: Adaptive difficulty prevents frustration spirals

### 3. Market Volatility

**Realistic Mode:**
- Cash events: ±15% variance
- Fame gains/losses: ±20% variance
- Hype changes: ±25% variance

**Hardcore Mode:**
- Cash events: -30% to +20% (skewed negative)
- Fame gains/losses: ±35% variance
- Hype changes: ±40% variance

**Impact**: All random events and income sources are affected by volatility, making outcomes less predictable.

### 4. Competition Pressure

**Realistic Mode:**
- -0.5 fame per week (other artists emerging)
- -1 hype per week (fans distracted by new music)
- Normal competitive event frequency

**Hardcore Mode:**
- -1.2 fame per week
- -2 hype per week
- +50% competitive event frequency

**Events Include:**
- Rival artists releasing competing albums
- Other artists stealing spotlight
- Increased market saturation

### 5. Economic Pressure

**Inflation** (Weekly compounding):
- **Realistic**: 0.2% per week (~10.4% annually)
- **Hardcore**: 0.5% per week (~26% annually)
- Affects: Staff salaries, living expenses, all costs

**Taxation**:
- **Realistic**: 15% tax on project income and label advances
- **Hardcore**: 25% tax on all positive income

**Living Expenses**:
- **Realistic**: $50/week minimum (increases with inflation)
- **Hardcore**: $150/week minimum (increases with inflation)

**Recoupment Pressure**:
- Labels demand faster recoupment in realistic/hardcore
- Can trigger pressure events in hardcore mode

## How Systems Interact

### Week 1 (Beginner Career)
- Static multipliers only
- No competitive pressure
- Predictable outcomes

### Week 26 (6 months in - Realistic Mode)
- Time scaling kicks in: +8% decay, +5% costs, -3% income
- Competition draining fame/hype weekly
- Random events with ±15-25% volatility
- Inflation affecting all expenses

### Week 52 (1 year - High Career Progress)
- Time scaling doubled: +16% decay, +10% costs, -6% income
- Performance penalty: Additional +10% difficulty
- Market highly volatile
- Competition intense

### Week 104 (2 years - Hardcore Mode)
- Time scaling quadrupled: +60% decay, +40% costs, -32% income
- Performance penalty: +25% on top
- Extreme volatility and competition
- Crushing economic pressure

## Dynamic Modifier Calculations

```typescript
// Simplified example for Week 52, Career Progress 70 (Realistic Mode)

Base Stats Decay: 1.0
+ Time Scaling (2 periods × 0.08): +0.16 = 1.16
+ Success Penalty (10 excess × 0.1 / 40): +0.025 = 1.185

Final Decay Multiplier: 1.185
→ Hype decays by ~2.4/week (vs 2.0 base)
→ Fame decays by ~1.2/week (vs 1.0 base)
→ Well-being decays by ~1.2/week (vs 1.0 base)

Plus Competition:
→ -0.5 fame/week
→ -1 hype/week

Total Weekly Losses:
→ Fame: -1.7/week
→ Hype: -3.4/week
→ Well-being: -1.2/week
```

## Strategic Implications

### Early Game (Weeks 1-26)
- Build foundation while difficulty is manageable
- Hire staff early to get bonuses
- Complete projects for income

### Mid Game (Weeks 27-78)
- Difficulty ramping up significantly
- Must maintain momentum to counter decay
- Competition becomes real threat
- Economic pressure builds

### Late Game (Weeks 79+)
- Survival mode - constant pressure
- Every decision critical
- Staff costs spiraling
- Market saturation hurting income
- Only the best strategies survive

## Balancing Philosophy

1. **Beginner Mode**: Learn without punishment
2. **Realistic Mode**: Mirrors real music industry challenges
3. **Hardcore Mode**: Only for masochists who want brutal realism

The dynamic systems ensure that:
- Early success doesn't guarantee late-game survival
- Strategic planning beats luck
- Different strategies work at different career stages
- Replayability is high (each run feels different)
- The game reflects reality: staying relevant is harder than breaking through

## Developer Notes

Dynamic modifiers are calculated in `calculateDynamicModifiers()` and applied to:
- All weekly stat decay
- Staff salaries and expenses
- Project income and label advances
- Random event impacts (through volatility)
- Tax and living expenses (through inflation)

This creates an interconnected system where difficulty evolves organically based on player choices and circumstances.
