import type { Scenario } from '../types';

const fallbackScenario: Scenario = {
    title: "An Uneventful Week",
    description: "The phone isn't ringing off the hook, giving you a moment of peace. It's a quiet week, a chance to breathe and plan your next move. How will you use this downtime?",
    choices: [
        {
            text: "Rest and recuperate.",
            outcome: {
                text: "You take some well-deserved time off, clearing your head. Your well-being improves significantly.",
                cash: -50, fame: 0, wellBeing: 10, careerProgress: 0, hype: 0,
            }
        },
        {
            text: "Practice your craft.",
            outcome: {
                text: "You spend the week honing your skills. It costs a little, but you feel more prepared for what's next.",
                cash: -20, fame: 0, wellBeing: 5, careerProgress: 1, hype: 0,
            }
        },
        {
            text: "Go out and network.",
            outcome: {
                text: "You hit the local musician hangouts. It's tiring and costs some cash, but you make a few contacts and build a little buzz.",
                cash: -100, fame: 1, wellBeing: -5, careerProgress: 0, hype: 5,
            }
        }
    ]
};

export const scenarioBank: Scenario[] = [
    // Projects temporarily removed - will be reimplemented properly in the future

    // Staff hiring is now handled via the Management panel. Scenarios that directly hired staff were removed to avoid duplicate hiring paths.

     // --- STAFF-RELATED EVENTS ---
    {
        title: "Manager's Big Swing",
        description: "Your manager calls, ecstatic. 'I did it! I got you an opening slot for The Lumineers! The exposure will be insane!' The catch: it's unpaid and you have to fly to another city tomorrow.",
        conditions: { requiresStaff: ['Manager'] },
        once: true, // This major opportunity should only happen once
        choices: [
            {
                text: "Do it! This is a huge opportunity.",
                outcome: {
                    text: "You scramble to make it work. The show is incredible, you play for thousands of new people, and your fame skyrockets.",
                    cash: -1000, fame: 20, wellBeing: -15, careerProgress: 5, hype: 25,
                    lesson: {
                        title: "Seizing Career-Defining Moments",
                        explanation: "Big opportunities often come with short notice and personal costs. The artists who break through are usually those willing to sacrifice comfort for career-changing moments.",
                        realWorldExample: "Burna Boy took unpaid international gigs early in his career, spending his own money to fly to shows. These investments in exposure paid off when he gained global recognition.",
                        tipForFuture: "Calculate the long-term value, not just immediate costs. One great show can open doors that take years to open otherwise.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "It's too much, too soon. I have to pass.",
                outcome: {
                    text: "You decline the offer. Your manager is disappointed, arguing that you have to take risks to succeed. A massive opportunity is missed.",
                    cash: 0, fame: 0, wellBeing: 5, careerProgress: -2, hype: -10,
                    lesson: {
                        title: "The Cost of Playing It Safe",
                        explanation: "Music careers are built on momentum and timing. Passing on opportunities because they're inconvenient can stall your progress while other artists take the risks and reap the rewards.",
                        realWorldExample: "Many artists regret turning down early opportunities that seemed too difficult. Meanwhile, competitors who said yes to similar chances often advance their careers significantly.",
                        tipForFuture: "Ask yourself: Will I regret not trying this? Often the biggest career risks come from being too cautious.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
     {
        title: "Booker's Festival Slot",
        description: "Your booker pulled some strings and got you a slot at the 'Summer Haze' indie festival. It's a great chance to be seen.",
        conditions: { requiresStaff: ['Booker'], minFame: 30 },
        once: true, // Major festival opportunity should only happen once
        choices: [
            {
                text: "Play a crowd-pleasing set.",
                outcome: {
                    text: "You play your hits and the festival crowd loves it. You sell a lot of merch and gain a ton of new fans.",
                    cash: 2000, fame: 15, wellBeing: 5, careerProgress: 3, hype: 20,
                }
            },
            {
                text: "Play your new, experimental material.",
                outcome: {
                    text: "The set is challenging and a bit alienating for the casual festival-goer, but a few important critics take notice of your artistry.",
                    cash: 500, fame: 5, wellBeing: -5, careerProgress: 3, hype: 15,
                }
            }
        ]
    },
    {
        title: "Promoter's PR Stunt",
        description: "Your promoter has a wild idea: a surprise pop-up show on a subway platform. 'It'll be edgy, it'll get press!' they insist.",
        conditions: { requiresStaff: ['Promoter'] },
        once: true, // Unique PR stunt should only happen once
        choices: [
            {
                text: "Let's do it. What could go wrong?",
                outcome: {
                    text: "It's chaotic and you nearly get arrested, but a video of the performance goes viral. The stunt is a massive success.",
                    cash: -100, fame: 10, wellBeing: -10, careerProgress: 1, hype: 30,
                }
            },
            {
                text: "Absolutely not. It's cheesy and dangerous.",
                outcome: {
                    text: "You veto the idea. Your promoter is annoyed, claiming you're too conservative. Your hype remains unchanged.",
                    cash: 0, fame: 0, wellBeing: 5, careerProgress: 0, hype: 0,
                }
            }
        ]
    },
    // CONTRACT RENEWAL SCENARIO DISABLED
    // This scenario is currently disabled because:
    // 1. It has no proper trigger logic (appears even when contracts aren't expiring)
    // 2. The renewStaff/fireStaff outcome actions are not implemented in the game logic
    // 3. It conflicts with the staff management panel which handles contract extensions
    // Staff contract management is handled through the Management Hub instead.
    //
    // {
    //     title: "Contract Renewal",
    //     description: "Your manager's contract is up. They've done a good job, but are asking for a higher percentage. What do you do?",
    //     conditions: { requiresStaff: ['Manager'] },
    //     choices: [...]
    // },

    // --- LABEL SIGNING ---
    {
        title: "The Indie Label Offer",
        description: "A respected creative collective and indie label, 'SIRYUS A.M Collective', wants to sign you. They've sent over a contract for you to review. Should you examine their terms or hold out for something bigger?",
        conditions: {
            requiresContractEligibility: true, // Requires sustained 40/50/65 fame for 3 weeks (beginner/realistic/hardcore)
            noLabelRequired: true, // Only appears if player doesn't have a label
            maxFame: 100 // Can appear anytime after eligibility is unlocked
        }, // Contract unlock requires sustained fame based on difficulty
        // audio: first record deal voiceover
        audioFile: '/audio/scenarios/first-record-deal.m4a',
        autoPlayAudio: true,
        once: true,
        choices: [
            {
                text: "Review their contract carefully.",
                outcome: {
                    text: "You sit down to review SIRYUS A.M Collective's contract offer. Time to see what they're really offering.",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: 0,
                    viewContract: 'SIRYUS A.M Collective',
                    lesson: {
                        title: "Smart Contract Review",
                        explanation: "Always review contracts carefully before signing. Understanding terms, royalty rates, and creative control clauses can save your career from predatory deals.",
                        realWorldExample: "Many successful artists credit reading their contracts carefully with avoiding career-damaging deals. Frank Ocean famously reviewed his contract loopholes to regain control of his music.",
                        tipForFuture: "Never sign a music contract without understanding every clause. When in doubt, consult a music attorney or experienced industry professional.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "Hold out for a major label.",
                outcome: {
                    text: "You pass, believing you're destined for bigger things. The indie label signs another artist who then blows up. You wonder if you made a mistake.",
                    cash: 0, fame: 0, wellBeing: -5, careerProgress: -2, hype: 0,
                    lesson: {
                        title: "The Risk of Waiting for 'Better' Deals",
                        explanation: "Holding out for major label deals can backfire. Momentum in music is crucial, and sometimes a smaller opportunity now is better than a bigger one that never comes.",
                        realWorldExample: "Some artists turn down indie deals waiting for majors, only to lose momentum. Meanwhile, artists who took indie deals used them as stepping stones to bigger opportunities.",
                        tipForFuture: "Evaluate opportunities based on current career stage. Early in your career, any legitimate label support can be valuable for building credibility and connections.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "The Major Label Bidding War",
        description: "Your success has attracted the big sharks. Two major labels have sent contracts for you to review. 'Global Records' and 'Visionary Music Group' are both interested. Which contract should you examine first?",
        conditions: { minFame: 60, minCareerProgress: 50, noLabelRequired: true },
        // audio: contract signing / label negotiation (informational, don't autoplay by default)
        audioFile: '/audio/scenarios/contract-signing.m4a',
        autoPlayAudio: false,
        once: true,
        choices: [
            {
                text: "Review Global Records' contract offer.",
                outcome: {
                    text: "You examine Global Records' contract carefully. The numbers look big, but what's the fine print?",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: 0,
                    viewContract: 'Global Records',
                    lesson: {
                        title: "High Advance vs Creative Control",
                        explanation: "Large advances come with higher expectations and recoupment requirements. Labels need to make their money back, which often means commercial pressure and less creative freedom.",
                        realWorldExample: "Major labels often sign artists for huge advances but then demand radio-friendly changes to recoup their investment. Artists like Frank Ocean had conflicts with Def Jam over creative direction due to the pressure to recoup advances.",
                        tipForFuture: "Remember: advances are loans, not gifts. The more you take upfront, the more pressure there is to make commercially successful music. Consider if the money is worth the creative constraints.",
                        conceptTaught: "Predatory Deals"
                    }
                }
            },
            {
                text: "Review Visionary Music Group's contract offer.",
                outcome: {
                    text: "You carefully examine Visionary Music Group's contract. The royalty rates look promising, but let's see the full terms.",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: 0,
                    viewContract: 'Visionary Music Group',
                    lesson: {
                        title: "Comparing Multiple Offers",
                        explanation: "When you have multiple label offers, compare them systematically: advance amounts, royalty rates, creative control, marketing support, and contract length.",
                        realWorldExample: "Successful artists often have multiple labels bidding for them. The key is comparing the total package, not just the upfront money.",
                        tipForFuture: "Create a comparison chart of all contract terms when evaluating multiple offers. The best deal balances money, creative freedom, and career support.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Walk away from both offers.",
                outcome: {
                    text: "You decide neither offer feels right and walk away. It's a gutsy move that maintains your independence but means giving up major label resources.",
                    cash: 0, fame: 0, wellBeing: 5, careerProgress: -5, hype: -5,
                    lesson: {
                        title: "The Power of Walking Away",
                        explanation: "Sometimes the best deal is no deal. Walking away from unfavorable contracts maintains your leverage and independence, even if it means short-term sacrifice.",
                        realWorldExample: "Frank Ocean famously walked away from his Def Jam contract to maintain creative control, eventually releasing 'Blonde' independently to critical and commercial success.",
                        tipForFuture: "Don't let FOMO (fear of missing out) pressure you into bad deals. There will always be other opportunities if you keep building your career.",
                        conceptTaught: "Contract Basics"
                    }
                }
            }
        ]
    },
    {
        title: "The 360 Deal Temptation",
        description: "Empire Sound Entertainment is offering you a lucrative 360 deal. They want a piece of EVERYTHING - your music, tours, merch, even brand deals. But they're offering $100,000 upfront and full career support. Is it worth it?",
        conditions: { minFame: 45, minCareerProgress: 40, maxFame: 75, noLabelRequired: true },
        audioFile: '/audio/scenarios/contract-signing.m4a',
        autoPlayAudio: false,
        once: true,
        choices: [
            {
                text: "Review the 360 deal contract.",
                outcome: {
                    text: "You examine Empire Sound Entertainment's 360 deal. The advance is tempting, but they want a percentage of EVERYTHING you earn.",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: 0,
                    viewContract: 'Empire Sound Entertainment',
                    lesson: {
                        title: "Understanding 360 Deals",
                        explanation: "360 deals give labels a percentage of ALL your income streams - music sales, touring, merchandise, endorsements, brand deals, and more. While they provide more support, you give up control and money from income you could manage independently.",
                        realWorldExample: "Many artists have spoken out against 360 deals. While labels argue they invest more, artists often feel trapped giving away percentages of income streams they built themselves, especially touring and merch which traditionally belonged to artists.",
                        tipForFuture: "360 deals can make sense for brand new artists who need everything managed, but are usually bad deals for artists who can handle some aspects independently. Calculate what percentage of your non-music income you're comfortable giving up permanently.",
                        conceptTaught: "Predatory Deals"
                    }
                }
            },
            {
                text: "Decline and stay independent.",
                outcome: {
                    text: "You pass on the 360 deal, choosing to maintain control over all your revenue streams. It's scary turning down that money, but you know your worth.",
                    cash: 0, fame: 0, wellBeing: 5, careerProgress: 2, hype: 0,
                    lesson: {
                        title: "The Value of Independence",
                        explanation: "Staying independent means more work and financial risk, but you keep control of all your income and decisions. Many successful artists have built empires by maintaining independence.",
                        realWorldExample: "Chance the Rapper famously turned down major label deals to stay independent, maintaining ownership of his masters and all revenue streams. He became hugely successful and influential while keeping creative and financial control.",
                        tipForFuture: "Independence requires discipline and business savvy, but the long-term rewards often outweigh short-term label support.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "Distribution vs Full Label",
        description: "You're weighing options: sign with DistroFlow Digital for just distribution (you keep control and most money) or go with a traditional label for full support but less control. What's your priority?",
        conditions: { minFame: 35, minCareerProgress: 25, noLabelRequired: true },
        once: true,
        choices: [
            {
                text: "Review DistroFlow Digital's distribution deal.",
                outcome: {
                    text: "DistroFlow keeps it simple: they distribute your music worldwide, you keep 85% and all creative control. No strings attached.",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: 0,
                    viewContract: 'DistroFlow Digital',
                    lesson: {
                        title: "Modern Distribution Models",
                        explanation: "Distribution deals are not traditional record deals. Distributors just get your music on platforms - you handle everything else. You keep ownership, control, and most revenue, but you're responsible for all costs and marketing.",
                        realWorldExample: "Many independent artists use distributors like DistroKid, TuneCore, or CD Baby rather than labels. They maintain ownership and keep 80-90% of revenue, though they must fund and market everything themselves.",
                        tipForFuture: "Distribution deals work best if you can afford recording/marketing costs and handle the business side yourself. They're the most artist-friendly financial arrangement.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Keep searching for a better full-service deal.",
                outcome: {
                    text: "You decide distribution alone isn't enough support. You'll keep building your career while looking for a label that offers real value without predatory terms.",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 1, hype: 0,
                    lesson: {
                        title: "Patience in Deal-Making",
                        explanation: "Not every opportunity is the right opportunity. Sometimes waiting for a better deal that aligns with your goals is smarter than jumping at the first offer.",
                        realWorldExample: "H.E.R. took years building her fanbase independently before signing a favorable deal with RCA that gave her creative control and ownership. Her patience paid off with better terms than most new artists get.",
                        tipForFuture: "Build leverage before signing. The more successful you are independently, the better deals you can negotiate.",
                        conceptTaught: "Contract Basics"
                    }
                }
            }
        ]
    },
    {
        title: "The Contract Renegotiation Opportunity",
        description: "A major label that's been watching your success reaches out. They want to sign you to a fresh deal, and they're willing to offer better terms than standard contracts. Your recent achievements give you serious negotiating power.",
        conditions: { minCareerProgress: 60, minFame: 60 },
        once: true,
        choices: [
            {
                text: "Push for premium terms - 20% royalties and creative control.",
                outcome: {
                    text: "You come to the table confident and prepared. After tough negotiations, they agree to your terms: 20% royalty rate and significant creative control. Your leverage paid off!",
                    cash: 0, fame: 5, wellBeing: 5, careerProgress: 10, hype: 5,
                    lesson: {
                        title: "The Power of Leverage in Negotiations",
                        explanation: "Success gives you negotiating power. When you've proven your value with sales and streams, labels are motivated to keep you happy. Use this leverage to secure better terms.",
                        realWorldExample: "Taylor Swift famously renegotiated her contracts multiple times as her success grew, each time securing better terms until she eventually signed an unprecedented deal with Republic Records where she owns her masters.",
                        tipForFuture: "Track your metrics - streams, sales, social media growth. These numbers are your leverage in negotiations. Labels need successful artists more than successful artists need labels.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Demand ownership of your masters or walk away.",
                outcome: {
                    text: "You play hardball, making master ownership a dealbreaker. The label counters with 18% royalties and you keep ownership of future masters. Not perfect, but a major win.",
                    cash: 0, fame: 3, wellBeing: 3, careerProgress: 12, hype: 3,
                    lesson: {
                        title: "Strategic Negotiation Tactics",
                        explanation: "Being willing to walk away is your strongest negotiating position. Labels know you have options, especially in today's independent-friendly music landscape.",
                        realWorldExample: "Prince's famous battles with Warner Bros. showed him standing firm on ownership and creative control. While it was painful short-term, his willingness to walk away eventually got him his masters back.",
                        tipForFuture: "Never negotiate from fear. Know your worth, have alternatives lined up, and be genuinely willing to walk away. Desperation leads to bad deals.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "Play it safe with standard improvements.",
                outcome: {
                    text: "You negotiate a modest bump to 16% royalties and standard terms. It's safe and comfortable, but you wonder if you left money and control on the table when you had maximum leverage.",
                    cash: 0, fame: 0, wellBeing: -2, careerProgress: 3, hype: 0,
                    lesson: {
                        title: "The Cost of Playing It Safe",
                        explanation: "Sometimes the comfortable choice isn't the best choice. When you have leverage and don't use it, you're leaving value on the table that you may never get back.",
                        realWorldExample: "Many artists accept small increases rather than pushing for what they deserve. Years later, they realize they could have negotiated much better terms when they had momentum.",
                        tipForFuture: "Strike while the iron is hot. Leverage doesn't last forever. When you have success and options, maximize your position.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    
    // --- GENERAL SCENARIOS ---
    {
        title: "The Open Mic Night",
        description: "A local bar is hosting an open mic night. It's a small crowd, mostly regulars, but it's a chance to perform and maybe earn a little cash.",
        conditions: { maxFame: 20 },
        choices: [
            {
                text: "Perform your best song.",
                outcome: {
                    text: "You pour your heart out and the crowd loves it! A few people buy you drinks and you make a small amount from the tip jar.",
                    cash: 50, fame: 5, wellBeing: 5, careerProgress: 1, hype: 10,
                    lesson: {
                        title: "Building Your Local Fanbase",
                        explanation: "Small gigs are where careers start. Every industry connection, every new fan, every dollar earned at these shows builds your foundation. Most successful artists played hundreds of small shows before their breakthrough.",
                        realWorldExample: "Burna Boy performed at small Lagos clubs for years before gaining national recognition. Those early shows built his stage presence and local following that eventually supported his rise.",
                        tipForFuture: "Never underestimate small opportunities. They compound over time into bigger ones.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Try out some new, experimental material.",
                outcome: {
                    text: "The new song is a bit rough. Some people look confused, but one person, a local music blogger, is intrigued by your creativity.",
                    cash: 20, fame: 3, wellBeing: -5, careerProgress: 1, hype: 8,
                    lesson: {
                        title: "Testing New Material in Safe Spaces",
                        explanation: "Open mics are perfect for experimenting with new songs. The low stakes environment lets you test audience reactions and refine your material before bigger shows.",
                        realWorldExample: "Many artists use smaller venues to test new songs. Ed Sheeran famously played hundreds of small shows to perfect his craft and test new material before recording albums.",
                        tipForFuture: "Use small shows to take creative risks. Better to experiment here than at important gigs.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
        ]
    },
    {
        title: "The Social Media Controversy",
        description: "An old, embarrassing photo of you surfaces online and goes viral. The media is having a field day. How do you respond?",
        conditions: { minFame: 30 },
        choices: [
            {
                text: "Lean into it with humor and self-awareness.",
                outcome: {
                    text: "Your funny, humble response wins people over. Your follower count skyrockets and you're praised for being authentic. Your hype explodes.",
                    cash: 0, fame: 5, wellBeing: -10, careerProgress: 1, hype: 30,
                    lesson: {
                        title: "Crisis Management Through Authenticity",
                        explanation: "How you handle controversies can define your brand. Authentic, humorous responses often work better than corporate damage control because they humanize you.",
                        realWorldExample: "When old photos of celebrities surface, those who respond with humor and honesty (like Ryan Reynolds or Chrissy Teigen) often come out stronger than those who try to hide or over-apologize.",
                        tipForFuture: "Authenticity resonates more than perfection. Fans appreciate artists who can laugh at themselves and show vulnerability. It builds stronger connections than a polished corporate image.",
                        conceptTaught: "Branding and Image"
                    }
                }
            },
            {
                text: "Issue a formal, serious apology.",
                outcome: {
                    text: "The apology is seen as stiff and disingenuous by some, but sponsors and corporate partners appreciate the professional handling of the situation.",
                    cash: 0, fame: 0, wellBeing: -15, careerProgress: 2, hype: -10,
                    lesson: {
                        title: "Corporate Crisis Management",
                        explanation: "Formal apologies protect business relationships but can seem inauthentic to fans. This approach prioritizes corporate partnerships over fan connection.",
                        realWorldExample: "Many artists issue formal PR statements during controversies, which satisfy legal and business concerns but often feel disconnected from their artistic persona.",
                        tipForFuture: "Consider your priorities: corporate partnerships or fan loyalty. Formal responses protect business interests but may weaken your authentic brand connection with audiences.",
                        conceptTaught: "Branding and Image"
                    }
                }
            },
            {
                text: "Ignore it and hope it blows over.",
                outcome: {
                    text: "Your silence is interpreted as arrogance, and you lose fans and a potential sponsorship deal.",
                    cash: -500, fame: -10, wellBeing: -20, careerProgress: -5, hype: -20,
                    lesson: {
                        title: "The Dangers of Silence in Crisis",
                        explanation: "In the digital age, silence during controversies is often interpreted negatively. Fans and business partners expect some form of response to show you care about their concerns.",
                        realWorldExample: "Artists who stay silent during controversies often face worse backlash than those who respond poorly. Social media demands engagement, and silence can be seen as arrogance or guilt.",
                        tipForFuture: "Even a brief acknowledgment is better than silence. You don't have to over-explain, but showing you're aware and care about your audience's concerns maintains trust.",
                        conceptTaught: "Branding and Image"
                    }
                }
            }
        ]
    },
    {
        title: "The Sellout Opportunity",
        description: "A massive soda company wants to use your hit song in their next global advertising campaign. The payday is enormous, but many of your early fans will see it as the ultimate betrayal.",
        conditions: { minFame: 50, minHype: 40 },
        choices: [
            {
                text: "Take the money. This is a business.",
                outcome: {
                    text: "The commercial is everywhere. You make a fortune and gain mainstream recognition, but your 'cool' factor and hype from your core fans plummets.",
                    cash: 150000, fame: 20, wellBeing: 0, careerProgress: 2, hype: -20,
                    lesson: {
                        title: "Brand Partnerships and Artist Credibility",
                        explanation: "Brand partnerships can provide significant income but may alienate core fans who value artistic integrity. The impact depends on your brand alignment and fan expectations.",
                        realWorldExample: "When Iggy Azalea did multiple commercial endorsements, some fans felt it compromised her credibility. Conversely, brands aligned with artists' values (like Patagonia with environmentally conscious musicians) can enhance rather than damage reputation.",
                        tipForFuture: "Consider if the brand aligns with your values and image. High-paying deals can fund artistic freedom later, but ensure they don't fundamentally contradict your brand.",
                        conceptTaught: "Branding and Image"
                    }
                }
            },
            {
                text: "Turn it down. My art isn't for sale.",
                outcome: {
                    text: "You reject the offer. The story gets leaked and your core fanbase rallies around you, praising your integrity. Your credibility and hype soar.",
                    cash: 0, fame: -5, wellBeing: 15, careerProgress: 5, hype: 25,
                    lesson: {
                        title: "The Value of Artistic Integrity",
                        explanation: "Turning down lucrative deals can actually increase your value by building trust and credibility. Fans often support artists who prioritize art over money.",
                        realWorldExample: "Artists like Radiohead have turned down major brand deals to maintain credibility, which actually increased their cultural value and allowed them to command higher prices for tours and albums.",
                        tipForFuture: "Sometimes saying no to money creates more long-term value. Authentic artists often have more loyal fanbases and sustainable careers than those seen as purely commercial.",
                        conceptTaught: "Branding and Image"
                    }
                }
            }
        ]
    },
    
    // --- AFRICAN MUSIC INDUSTRY SCENARIOS ---
    {
        title: "The Boomplay Decision",
        description: "Boomplay, Africa's biggest streaming platform, offers to feature you on their 'New Fire' playlist reaching 5 million users. The exposure is massive across Nigeria, Ghana, and Kenya. However, they pay $0.003 per stream compared to Spotify's $0.004. Your manager insists you should focus on Spotify to build international credibility, but Boomplay is where your fans actually listen to music.",
        conditions: { minFame: 15, maxFame: 50 },
        choices: [
            {
                text: "Take the Boomplay feature - my audience is in Africa",
                outcome: {
                        // celebratory / chart-success style audio — play only when this outcome occurs
                        audioFile: '/audio/scenarios/chart-success.m4a',
                        autoPlayAudio: true,
                    text: "Your song explodes on Boomplay! You gain 80,000 streams in the first week across African markets. Local radio stations pick it up after seeing the numbers. Your fanbase becomes strongly African-centered, and you become a household name in Lagos, Accra, and Nairobi. International playlists remain out of reach for now.",
                    cash: 1200, fame: 25, wellBeing: 5, careerProgress: 8, hype: 30,
                    lesson: {
                        title: "Regional Platform Strategy",
                        explanation: "African streaming platforms often provide better discovery, higher engagement, and more relevant audiences for local artists. Building a strong regional base first gives you leverage for international expansion later.",
                        realWorldExample: "Rema built his entire early career on African platforms and African radio before Spotify featured him. His regional dominance made him attractive to international labels.",
                        tipForFuture: "Start where your fans actually are. International success usually comes after regional dominance, not before.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Hold out for Spotify - I want international reach",
                outcome: {
                    text: "You decline Boomplay and pitch to Spotify curators. After weeks of emails, you get added to a small playlist with 10,000 followers. You gain 2,000 streams, mostly from the US and Europe. Meanwhile, another artist takes the Boomplay slot and blows up across Africa. Your African fans complain they can't find your music easily.",
                    cash: 300, fame: 3, wellBeing: -10, careerProgress: 1, hype: -15,
                    lesson: {
                        title: "The International Chase Trap",
                        explanation: "Many African artists chase international platforms while ignoring their home audience. This often leads to being unknown everywhere instead of famous somewhere.",
                        realWorldExample: "Multiple Nigerian artists have failed internationally while neglecting their local fanbase, then returned home to find they'd been forgotten.",
                        tipForFuture: "Build strong local success before chasing international dreams. You need leverage.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Negotiate to do both platforms simultaneously",
                outcome: {
                    text: "You push for non-exclusive promotion. Boomplay agrees! You get featured on both platforms. The African streams dominate, but you're also building international numbers. It costs you more time managing both platforms, but you're not leaving money on the table.",
                    cash: 1500, fame: 20, wellBeing: -5, careerProgress: 10, hype: 25,
                    lesson: {
                        title: "Non-Exclusive Thinking",
                        explanation: "In the digital age, you rarely have to choose one platform. Smart artists maximize all available channels rather than picking sides.",
                        realWorldExample: "Burna Boy, Wizkid, and Davido are on every platform simultaneously, maximizing their reach globally.",
                        tipForFuture: "Always ask: Can I do both? Exclusivity should cost them more money.",
                        conceptTaught: "negotiation-basics"
                    }
                }
            }
        ]
    },
    {
        title: "The Language Choice",
        description: "You're in the studio recording your breakthrough single. The producer stops you mid-session. 'This Igbo verse is fire, but if you want radio play and playlist adds, you need to do it in English. The international market won't understand Igbo.' But you know your community connects most when you rap in your native language. This decision will define your identity.",
        conditions: { minFame: 10, maxFame: 40 },
        choices: [
            {
                text: "Keep it in Igbo/Yoruba/Kinyarwanda - stay authentic",
                outcome: {
                    text: "You record the entire song in your native language with just an English chorus. Your community goes wild! Local fans feel represented and proud. You become the voice of your people. African radio plays it constantly. International curators ignore it completely, calling it 'too regional.' But you're building something real.",
                    cash: 800, fame: 30, wellBeing: 15, careerProgress: 5, hype: 35,
                    lesson: {
                        title: "The Authenticity Premium",
                        explanation: "Artists who authentically represent their culture often build deeper, more loyal fanbases than those who chase international trends. Authenticity is a competitive advantage, not a limitation.",
                        realWorldExample: "Burna Boy sang in Pidgin English and Yoruba throughout his early career. It made him authentic and differentiated. When he went international, his Nigerian identity was his selling point, not something to hide.",
                        tipForFuture: "Your culture is your unique value. Don't erase it trying to appeal to everyone.",
                        conceptTaught: "brand-authenticity"
                    }
                }
            },
            {
                text: "Switch to English for broader commercial appeal",
                outcome: {
                    text: "You re-record in English. The song sounds more 'international' but less distinctive. Some African fans feel you've sold out. You get a few international blog mentions but no major traction. You're now competing in a very crowded English-language market without your cultural differentiation.",
                    cash: 500, fame: 8, wellBeing: -15, careerProgress: 2, hype: -10,
                    lesson: {
                        title: "The Cost of Assimilation",
                        explanation: "When African artists erase their cultural markers to sound 'international,' they often lose their unique voice without gaining international success. You become generic.",
                        realWorldExample: "Many Nigerian artists who abandoned their cultural identity in the 2000s and early 2010s failed to break through internationally while losing their local base.",
                        tipForFuture: "The international market often wants African artists who sound African, not African artists trying to sound American.",
                        conceptTaught: "cultural-identity"
                    }
                }
            },
            {
                text: "Mix both languages - give them the best of both worlds",
                outcome: {
                    text: "You record verses in Igbo/Yoruba/Kinyarwanda with English choruses and ad-libs. It's accessible but authentic. African fans love it, and international listeners find it exotic and interesting. You've created something that travels across cultures while staying rooted. The approach becomes your signature style.",
                    cash: 1000, fame: 35, wellBeing: 10, careerProgress: 8, hype: 40,
                    lesson: {
                        title: "Cultural Fusion Strategy",
                        explanation: "The most successful African artists often blend languages strategically. Native language for authenticity and emotional depth, English for accessibility. This fusion travels internationally while maintaining cultural roots.",
                        realWorldExample: "Wizkid's 'Ojuelegba' mixed Yoruba and English. It became a global hit while remaining deeply Nigerian. Drake heard it and wanted to collaborate specifically because of its authenticity.",
                        tipForFuture: "You can honor your roots AND reach new markets. Fusion, not erasure.",
                        conceptTaught: "cross-cultural-appeal"
                    }
                }
            }
        ]
    },
    {
        title: "The Piracy Problem",
        description: "It's 3 AM. Your phone explodes with messages. Your unreleased album just leaked on Naijaloaded and Tooxclusive. Thousands are downloading it for free. Your release strategy is ruined. Your manager is furious. The label is threatening to drop you, claiming you leaked it for publicity. You need to act fast.",
        conditions: { minFame: 30 },
        choices: [
            {
                text: "Officially release it immediately on all platforms",
                outcome: {
                    text: "You scramble to get it on streaming platforms within 12 hours. You announce: 'Since y'all wanted it so bad, here it is!' You turn the leak into a publicity moment. The rushed release gets media coverage. You lose some planned promotional momentum, but you're controlling the narrative. The album still performs decently.",
                    cash: 2000, fame: 15, wellBeing: -20, careerProgress: 5, hype: 20,
                    lesson: {
                        title: "Crisis Response and Adaptation",
                        explanation: "In African music markets, leaks are extremely common due to weak digital security infrastructure. The best response is often to embrace the chaos and officially release immediately rather than fighting the inevitable.",
                        realWorldExample: "When Wizkid's 'Made in Lagos' tracks leaked early, he accelerated the official release and turned it into a marketing moment, maintaining control of his narrative.",
                        tipForFuture: "Have a leak response plan ready. Speed matters more than perfection when content is already out there.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Send legal threats and takedown notices",
                outcome: {
                    text: "You spend $3,000 on lawyers sending cease and desist letters. Some sites take it down. Ten more pop up. The Streisand Effect kicks in - more people download it specifically because you're trying to stop them. You look like you're fighting your own fans. The official release, two weeks later, underperforms. People already have it.",
                    cash: -3000, fame: -10, wellBeing: -25, careerProgress: -5, hype: -30,
                    lesson: {
                        title: "The Futility of Fighting Digital Piracy",
                        explanation: "In markets with weak intellectual property enforcement, aggressive legal action against piracy often backfires. You spend money achieving nothing while alienating fans who see you as attacking them.",
                        realWorldExample: "Several Nigerian artists have spent fortunes fighting blog piracy with minimal success. The blogs simply change domains and continue operating.",
                        tipForFuture: "Accept that some piracy is inevitable in African markets. Focus energy on monetizing the attention, not fighting the leak.",
                        conceptTaught: "piracy-reality"
                    }
                }
            },
            {
                text: "Ignore it and stick to the planned release date",
                outcome: {
                    text: "You pretend the leak doesn't exist and proceed with your planned rollout two weeks later. By release day, the hype has died. Everyone who cared already downloaded it. Your official first-week numbers are disappointing. The label is upset. Radio programmers moved on to newer music. You missed your moment.",
                    cash: 800, fame: 5, wellBeing: -15, careerProgress: -3, hype: -20,
                    lesson: {
                        title: "The Cost of Ignoring Reality",
                        explanation: "When a crisis happens, pretending it doesn't exist rarely works. The music industry moves fast. If your music is already out there, your planned release strategy is already dead.",
                        realWorldExample: "Multiple artists have lost momentum by ignoring leaks and sticking to outdated release plans while their music circulated freely.",
                        tipForFuture: "When the situation changes dramatically, change your plan. Flexibility beats rigidity.",
                        conceptTaught: "adaptability"
                    }
                }
            }
        ]
    },
    {
        title: "The WhatsApp Producer",
        description: "A producer slides into your WhatsApp claiming he made beats for Davido and Burna Boy. He sends you a fire beat and wants $500 upfront, no contract, just trust. He promises exclusive rights and says he'll have the stems ready in 24 hours. But your friend warns you: 'Bro, I've seen this guy sell the same beat to five different artists.' The beat is perfect for your next single, but the red flags are everywhere.",
        conditions: { minFame: 8, maxCash: 2000 },
        // shady producer / warning audio — don't autoplay
        audioFile: '/audio/scenarios/shady-contract-warning.m4a',
        autoPlayAudio: false,
        choices: [
            {
                text: "Pay him - this beat is too good to pass up",
                outcome: {
                    text: "You send the $500 via mobile money. The producer goes silent for three days, then sends low-quality stems with missing elements. Two weeks later, you hear 'your' beat on another artist's hit single. You've been scammed, and now you need to start over with a new beat. The lesson is expensive.",
                    cash: -500, fame: 0, wellBeing: -25, careerProgress: -3, hype: -10,
                    lesson: {
                        title: "The Social Media Producer Trap",
                        explanation: "WhatsApp and Instagram producers often sell the same beats to multiple artists or disappear after payment. Without contracts, you have no legal protection and no guarantee of exclusivity or quality.",
                        realWorldExample: "Many Nigerian artists have been scammed by fake producers claiming connections to major artists. These scammers use social media to seem legitimate while running basic fraud schemes.",
                        tipForFuture: "Never pay producers without contracts. Verify their credits and ask for references. If they can't provide professional agreements, they're not professional producers.",
                        conceptTaught: "contract-basics"
                    }
                }
            },
            {
                text: "Demand a proper contract before any money changes hands",
                outcome: {
                    text: "You insist on a written agreement specifying exclusive rights, delivery timeline, and what you get. The producer gets defensive and accuses you of not trusting him. He disappears when you mention contracts. You saved $500, but you still need a beat. At least you avoided a scam.",
                    cash: 0, fame: 0, wellBeing: 5, careerProgress: 0, hype: 0,
                    lesson: {
                        title: "Professional Standards Save Money",
                        explanation: "Legitimate producers understand the need for contracts and proper business practices. Anyone who refuses to work professionally is either inexperienced or running a scam.",
                        realWorldExample: "Established producers like LeriQ, Pheelz, and Masterkraft always work with proper agreements. They built their reputations on professionalism and protecting artists' interests.",
                        tipForFuture: "Professional behavior is a filter for quality partners. If someone can't handle basic business practices, they probably can't handle your music either.",
                        conceptTaught: "professional-standards"
                    }
                }
            },
            {
                text: "Negotiate a split deal - no money upfront, revenue share instead",
                outcome: {
                    text: "You propose splitting future streaming revenue 70/30 in your favor. Surprisingly, he agrees! You get the beat with professional stems, and it becomes your biggest hit. The producer makes more money from the revenue split than he would have from a one-time fee. You both win, and he starts sending you more exclusive beats.",
                    cash: 0, fame: 20, wellBeing: 10, careerProgress: 8, hype: 25,
                    lesson: {
                        title: "Creative Deal Structures",
                        explanation: "Revenue sharing can align interests better than upfront payments. Both parties are invested in the song's success, and good producers often make more money from hits than from beat sales.",
                        realWorldExample: "Many successful Afrobeats collaborations use revenue splits rather than buyouts. This approach has created long-term partnerships between artists and producers.",
                        tipForFuture: "Consider revenue sharing when you're low on cash but high on potential. It can create stronger partnerships and better results.",
                        conceptTaught: "creative-partnerships"
                    }
                }
            }
        ]
    },
    {
        title: "The Diaspora Tour Opportunity",
        description: "African diaspora communities in London, Atlanta, and Toronto want to book you for a three-city tour. The shows could pay $15,000 total, and the exposure to international African communities could be huge. But visa applications cost $2,000, flights another $3,000, and there's no guarantee the visas will be approved in time. Your local promoter says: 'Why risk it? We can make that money with five local shows.'",
        conditions: { minFame: 35, minHype: 25 },
        choices: [
            {
                text: "Take the risk - international exposure is worth it",
                outcome: {
                    text: "You get the visas! The diaspora shows are incredible. African communities in each city embrace you like family. You gain international connections, and a US-based African label executive offers you a distribution deal. The financial risk paid off with long-term opportunities.",
                    cash: 8000, fame: 30, wellBeing: 10, careerProgress: 15, hype: 35,
                    lesson: {
                        title: "Diaspora Markets as International Bridges",
                        explanation: "African diaspora communities often serve as bridges to international markets. They maintain cultural connections while having economic power in their new countries. Success in diaspora markets can lead to broader international opportunities.",
                        realWorldExample: "Burna Boy and Wizkid built strong followings in African diaspora communities in the US and UK before breaking into mainstream international markets. These communities championed their music to local industry players.",
                        tipForFuture: "Diaspora markets are often more receptive to authentic African music than general international markets. They can be your entry point to global success.",
                        conceptTaught: "international-strategy"
                    }
                }
            },
            {
                text: "Play it safe with local shows instead",
                outcome: {
                    text: "You book five local shows and make $12,000 safely. No visa stress, no travel costs, no uncertainty. But six months later, you see the artist who replaced you on the diaspora tour getting major international press and signing with Atlantic Records. You wonder what could have been.",
                    cash: 12000, fame: 10, wellBeing: 5, careerProgress: 3, hype: 15,
                    lesson: {
                        title: "The Opportunity Cost of Playing Safe",
                        explanation: "While safe choices provide guaranteed returns, they often limit growth potential. In the music industry, calculated risks on international opportunities can yield disproportionate long-term benefits compared to safe local choices.",
                        realWorldExample: "Many African artists who focused only on safe local opportunities missed the Afrobeats global explosion. Those who took international risks early became the faces of the movement.",
                        tipForFuture: "Evaluate the long-term potential, not just immediate financial returns. Sometimes the riskier path leads to breakthrough moments.",
                        conceptTaught: "risk-assessment"
                    }
                }
            },
            {
                text: "Crowdfund the tour through your fanbase",
                outcome: {
                    text: "You launch a crowdfunding campaign: 'Help me bring our music to the diaspora!' Your fans contribute enthusiastically. You raise $4,000, covering most costs. The tour is successful, and fans feel personally invested in your international journey. You've built a stronger community while reducing financial risk.",
                    cash: 10000, fame: 25, wellBeing: 15, careerProgress: 12, hype: 40,
                    lesson: {
                        title: "Community-Funded Growth",
                        explanation: "Engaged fanbases will often support artists' growth if asked directly. Crowdfunding reduces financial risk while increasing fan investment and loyalty. It turns supporters into stakeholders.",
                        realWorldExample: "Several African artists have successfully crowdfunded international tours and recording projects. Fans appreciate transparency and the opportunity to directly support their favorite artists' growth.",
                        tipForFuture: "Don't be afraid to ask your fans for support on meaningful projects. Transparency about costs and goals builds trust and stronger relationships.",
                        conceptTaught: "fan-engagement"
                    }
                }
            }
        ]
    },
    {
        title: "The Radio Payola Request",
        description: "A popular radio DJ pulls you aside after your interview. 'Your song is hot, but playlist rotation is competitive. If you can show some love to help with my studio rent... let's say $300... I can guarantee heavy rotation during prime time.' You know this happens everywhere, but it feels wrong. Other artists warn you that refusing means your song never gets played.",
        conditions: { minFame: 20, maxFame: 60 },
        choices: [
            {
                text: "Pay the $300 - radio play is essential",
                outcome: {
                    text: "You discreetly slip the DJ the money. Your song gets heavy rotation and becomes a local hit. Your fame explodes, but you feel dirty about how you got there. Other DJs now expect similar payments. You've entered a pay-to-play system that will cost more each time.",
                    cash: -300, fame: 35, wellBeing: -15, careerProgress: 8, hype: 40,
                    lesson: {
                        title: "The Payola Cycle",
                        explanation: "Radio payola creates a cycle where DJs expect payment and artists feel forced to pay. While it may provide immediate results, it corrupts the system and makes radio play about money rather than music quality.",
                        realWorldExample: "Payola is common across African radio markets, from Lagos to Johannesburg. Artists who participate often find themselves trapped in escalating payment demands as their careers grow.",
                        tipForFuture: "Consider the long-term cost. If every song requires payment, your radio strategy becomes unsustainable. Look for DJs who support music based on quality.",
                        conceptTaught: "industry-ethics"
                    }
                }
            },
            {
                text: "Refuse to pay - my music should speak for itself",
                outcome: {
                    text: "You politely decline and leave with your dignity intact. Your song gets minimal radio play, and you watch inferior tracks with bigger budgets dominate the airwaves. Your growth is slower, but you sleep well at night. Some underground DJs respect your stance and support you.",
                    cash: 0, fame: 8, wellBeing: 10, careerProgress: 3, hype: 5,
                    lesson: {
                        title: "The Integrity Tax",
                        explanation: "Refusing to participate in corrupt practices often costs short-term opportunities but builds long-term credibility. Some industry players respect artists who won't compromise their values.",
                        realWorldExample: "Several successful African artists built careers without paying radio DJs, relying instead on digital platforms and live performances to grow their audiences.",
                        tipForFuture: "Integrity may slow your growth initially, but it creates sustainable success. Players who respect ethics often become your strongest supporters.",
                        conceptTaught: "ethical-business"
                    }
                }
            },
            {
                text: "Propose an interview trade instead of cash payment",
                outcome: {
                    text: "You offer to do a longer interview, bring your band for a live session, or help promote the DJ's events in exchange for playlist consideration. The DJ appreciates the creative thinking. You get moderate rotation without compromising your ethics, and you've built a legitimate relationship.",
                    cash: 0, fame: 20, wellBeing: 5, careerProgress: 5, hype: 25,
                    lesson: {
                        title: "Creative Value Exchange",
                        explanation: "Instead of cash payments, artists can offer value through content, promotion, or performances. This builds genuine relationships while avoiding outright corruption.",
                        realWorldExample: "Many established African artists maintain relationships with radio through content partnerships, exclusive interviews, and promotional support rather than direct payments.",
                        tipForFuture: "Think beyond money when building industry relationships. Your time, talent, and platform have value that can create win-win situations.",
                        conceptTaught: "relationship-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Feature Request",
        description: "A well-known artist with 500K followers wants you on their next single. They offer 60/40 split in their favor and second billing: 'It's my song, but your verse could make it special.' Your manager insists you should demand 50/50 and co-headline billing. But this collaboration could expose you to their massive fanbase. How do you handle this negotiation?",
        conditions: { minFame: 25 },
        choices: [
            {
                text: "Accept their terms - exposure is worth more than money",
                outcome: {
                    text: "You take the 40% and second billing. The song becomes a massive hit! You gain 100,000 new followers and your streaming numbers double. While you made less money, the exposure launches your career to the next level. Other major artists now see you as collaboration-worthy.",
                    cash: 2000, fame: 40, wellBeing: -5, careerProgress: 15, hype: 50,
                    lesson: {
                        title: "Strategic Collaboration Investment",
                        explanation: "Sometimes accepting less favorable financial terms in exchange for exposure can be a smart career investment. The key is recognizing when the long-term value exceeds short-term costs.",
                        realWorldExample: "Many breakthrough African artists took smaller splits on collaborations with established names like Davido or Burna Boy. The exposure often led to bigger solo opportunities and label interest.",
                        tipForFuture: "Evaluate collaborations based on total value, not just money. Ask: Will this partnership open doors that justify the financial compromise?",
                        conceptTaught: "strategic-partnerships"
                    }
                }
            },
            {
                text: "Hold firm on 50/50 and equal billing",
                outcome: {
                    text: "You demand equal terms and billing. The established artist gets offended: 'You haven't earned 50/50 yet.' They walk away and collaborate with someone more accommodating. You maintain your self-respect but miss a major opportunity. Your growth continues slowly.",
                    cash: 0, fame: 0, wellBeing: 5, careerProgress: -2, hype: -10,
                    lesson: {
                        title: "When Principle Costs Opportunity",
                        explanation: "While self-worth is important, inflexibility in negotiations can cost valuable opportunities. Sometimes building leverage requires accepting temporary disadvantages.",
                        realWorldExample: "Some artists have lost major collaboration opportunities by demanding equal treatment before earning it. Meanwhile, more flexible artists used these opportunities to build the credibility needed for better future deals.",
                        tipForFuture: "Consider your current market position. If you need the boost more than they need you, be strategic about which battles to fight.",
                        conceptTaught: "negotiation-leverage"
                    }
                }
            },
            {
                text: "Negotiate a compromise with escalation clauses",
                outcome: {
                    text: "You propose 60/40 now, but if the song hits certain stream thresholds, you get additional points. Plus you get equal billing. They appreciate your business thinking and agree. The song performs well, triggering the bonuses. You've established yourself as a smart negotiator.",
                    cash: 3000, fame: 30, wellBeing: 10, careerProgress: 12, hype: 35,
                    lesson: {
                        title: "Performance-Based Deal Structures",
                        explanation: "Escalation clauses align interests and reward success. They allow both parties to benefit more when the project succeeds, creating win-win scenarios and demonstrating business sophistication.",
                        realWorldExample: "Many successful music collaborations include performance bonuses and escalation clauses. This approach shows you understand business while being reasonable about current market position.",
                        tipForFuture: "Get creative with deal structures. Performance bonuses, escalation clauses, and future collaboration options can make deals work for everyone.",
                        conceptTaught: "advanced-negotiation"
                    }
                }
            }
        ]
    },
    {
        title: "The Festival Circuit Choice",
        description: "You have two festival offers for the same weekend. Afronation in Ghana offers $8,000, international exposure, and industry networking with global labels. Felabration in Lagos offers $3,000, massive local love, and deeper connection with your home audience. Your international booking agent pushes hard for Afronation: 'This is how you break globally.' But your heart says Felabration.",
        conditions: { minFame: 40, minHype: 30 },
        choices: [
            {
                text: "Choose Afronation - go for international breakthrough",
                outcome: {
                    text: "You perform at Afronation to 50,000 international fans. A UK label executive approaches you backstage with a distribution deal. International blogs cover your performance. You're building global recognition, but some Lagos fans feel you've abandoned your roots for international success.",
                    cash: 8000, fame: 35, wellBeing: 5, careerProgress: 20, hype: 25,
                    lesson: {
                        title: "International Festival Strategy",
                        explanation: "International festivals provide access to global industry networks and international audiences but can create distance from your home fanbase. The key is maintaining balance between global reach and local connection.",
                        realWorldExample: "Artists like Burna Boy used international festivals to build global recognition while still honoring their Nigerian roots. The international exposure helped them bring African music to global stages.",
                        tipForFuture: "International festivals are career investments. Use them to build global networks and credibility, but don't forget to maintain your home base.",
                        conceptTaught: "international-strategy"
                    }
                }
            },
            {
                text: "Choose Felabration - stay connected to your roots",
                outcome: {
                    text: "You perform at Felabration to a crowd that knows every word of your songs. The energy is incredible! Nigerian music industry veterans notice your loyalty to local culture. You trend on Nigerian Twitter for days. Your home fanbase grows stronger, but you wonder about missed international opportunities.",
                    cash: 3000, fame: 45, wellBeing: 15, careerProgress: 8, hype: 50,
                    lesson: {
                        title: "The Power of Local Loyalty",
                        explanation: "Strong home market support provides sustainable career foundation. Local audiences offer authentic connection and cultural credibility that international markets often can't replicate.",
                        realWorldExample: "Many successful African artists built massive local followings before going international. This strong home base provides financial stability and creative authenticity that supports international expansion.",
                        tipForFuture: "Your home market is your foundation. International success without strong local support is often unstable and short-lived.",
                        conceptTaught: "market-foundation"
                    }
                }
            },
            {
                text: "Negotiate to perform at both events on different days",
                outcome: {
                    text: "You contact both festivals explaining your dilemma. Afronation moves your slot to Friday, Felabration keeps you for Sunday. The travel is exhausting and costs you $2,000 extra, but you honor both audiences. Both performances are excellent, and you're seen as an artist who respects all fans.",
                    cash: 9000, fame: 40, wellBeing: -10, careerProgress: 15, hype: 40,
                    lesson: {
                        title: "Multi-Market Strategy",
                        explanation: "With careful planning, artists can often serve multiple markets simultaneously. This requires extra effort and investment but builds broader, more sustainable fan bases.",
                        realWorldExample: "Top African artists often perform at multiple festivals during peak season, building both local and international presence. The investment in travel and logistics pays off through broader market reach.",
                        tipForFuture: "Don't always think in either/or terms. Creative scheduling and extra investment can often allow you to serve multiple important markets.",
                        conceptTaught: "market-expansion"
                    }
                }
            }
        ]
    },
    {
        title: "The Influencer Deal",
        description: "A TikTok influencer with 2 million followers wants to use your unreleased song for a dance challenge. They say: 'I'll make your song viral! Just give me the track for free - the exposure is payment enough.' Your manager calculates that 2 million views could be worth $10,000 in promotion value. But you believe your art has monetary value. How do you price exposure?",
        conditions: { minFame: 15, maxFame: 50 },
        once: true,
        choices: [
            {
                text: "Give them the song for free - viral exposure is priceless",
                outcome: {
                    text: "The influencer creates a dance that explodes on TikTok! Your song gets 500,000 uses in two weeks. You gain 200,000 new followers and major label attention. But now every influencer expects free music from you. You've set a precedent that devalues your work.",
                    cash: 0, fame: 50, wellBeing: -10, careerProgress: 12, hype: 60,
                    lesson: {
                        title: "The Free Content Trap",
                        explanation: "While free content can generate massive exposure, it often establishes the expectation that your music has no monetary value. This makes it harder to monetize future opportunities.",
                        realWorldExample: "Many artists gave away music for 'exposure' during TikTok's early days. While some gained followers, they struggled to monetize those audiences because fans expected free content.",
                        tipForFuture: "Exposure has value, but so does your art. Consider whether free exposure actually converts to paying fans and sustainable income.",
                        conceptTaught: "value-assessment"
                    }
                }
            },
            {
                text: "Demand payment - influencers make money, so should I",
                outcome: {
                    text: "You quote $2,000 for the song usage. The influencer laughs and finds another artist who works for free. Their dance goes viral with someone else's song. You maintain your principles but miss a major viral opportunity. Your growth remains steady but slow.",
                    cash: 0, fame: 5, wellBeing: 10, careerProgress: 2, hype: 0,
                    lesson: {
                        title: "When Principle Meets Opportunity",
                        explanation: "Insisting on fair payment for your work is important, but rigid pricing can cost opportunities in the fast-moving influencer economy. The key is finding the balance between value and accessibility.",
                        realWorldExample: "Some artists have missed viral moments by overpricing music for influencer use, while others built careers by being accessible to content creators early in their careers.",
                        tipForFuture: "Consider your current stage. Early career exposure might be worth more than immediate payment, but establish clear boundaries.",
                        conceptTaught: "pricing-strategy"
                    }
                }
            },
            {
                text: "Propose a revenue-sharing partnership instead",
                outcome: {
                    text: "You offer to let them use the song for free, but they must credit you and share 30% of any sponsorship money they make from the viral content. They agree! The dance goes viral, they get brand deals, and you earn $3,000 from the arrangement while building a working relationship.",
                    cash: 3000, fame: 45, wellBeing: 5, careerProgress: 10, hype: 55,
                    lesson: {
                        title: "Creative Partnership Structures",
                        explanation: "Revenue sharing aligns interests and creates mutual investment in success. Both parties benefit more when the content performs well, leading to stronger partnerships and better outcomes.",
                        realWorldExample: "Smart artists and influencers often create revenue-sharing deals around viral content. This approach has led to long-term partnerships and sustainable income streams for both parties.",
                        tipForFuture: "Think beyond simple transactions. Partnership structures can create ongoing value and stronger relationships than one-time payments.",
                        conceptTaught: "partnership-development"
                    }
                }
            }
        ]
    },
    {
        title: "The Street Vendor Distribution",
        description: "An old-school street vendor network across Lagos and Abuja wants to sell your physical CDs. They guarantee 10,000 units sold at $2 profit per CD, but they want exclusive physical rights for six months. Your digital team says CDs are dead: 'Focus on streaming!' But the vendor leader insists: 'Young people still buy CDs for their cars and taxi drivers play them all day. This is money in your pocket today.'",
        conditions: { minFame: 30 },
        once: true,
        choices: [
            {
                text: "Sign with street vendors - physical sales still matter",
                outcome: {
                    text: "You press 10,000 CDs and give the vendors exclusive rights. They move every unit in four months! Taxi drivers and bus conductors play your album constantly. You make $20,000 and gain massive street credibility. Your music becomes the soundtrack of public transport across Lagos.",
                    cash: 20000, fame: 35, wellBeing: 10, careerProgress: 8, hype: 40,
                    lesson: {
                        title: "Traditional Distribution Networks",
                        explanation: "Street vendor networks in African markets often reach audiences that streaming doesn't touch. Physical sales can provide immediate income and deep community penetration, especially among working-class audiences.",
                        realWorldExample: "Many successful Nigerian artists still use street vendor networks for physical distribution. These vendors have established customer bases and can move significant units quickly.",
                        tipForFuture: "Don't ignore traditional distribution methods. Physical sales can complement digital strategies and reach audiences that streaming platforms miss.",
                        conceptTaught: "distribution-diversity"
                    }
                }
            },
            {
                text: "Focus only on digital streaming - the future is online",
                outcome: {
                    text: "You decline the CD deal and push everything to streaming platforms. Your streams grow steadily, but you miss the immediate cash flow and street-level saturation. Six months later, another artist dominates the physical market you ignored. You wonder if you chose progress over profit.",
                    cash: 5000, fame: 20, wellBeing: 5, careerProgress: 12, hype: 25,
                    lesson: {
                        title: "Digital-Only Strategy Limitations",
                        explanation: "While digital streaming represents the future, ignoring existing physical markets can cost immediate revenue and market penetration. In developing markets, physical sales often outperform streaming economically.",
                        realWorldExample: "Some African artists who went digital-only missed significant revenue opportunities while their competitors dominated physical markets that still generate substantial income.",
                        tipForFuture: "Consider the economic realities of your market. Digital may be the future, but physical sales might be today's rent money.",
                        conceptTaught: "market-reality"
                    }
                }
            },
            {
                text: "Do both - physical for immediate income, digital for long-term growth",
                outcome: {
                    text: "You negotiate shorter exclusivity (3 months) and do both physical and digital simultaneously. The CDs provide immediate cash flow while streaming builds your digital presence. Your total reach is maximized, and you're not dependent on any single distribution method.",
                    cash: 15000, fame: 30, wellBeing: 5, careerProgress: 15, hype: 35,
                    lesson: {
                        title: "Hybrid Distribution Strategy",
                        explanation: "Combining traditional and modern distribution methods maximizes reach and revenue streams. Different distribution channels serve different audiences and provide different types of value.",
                        realWorldExample: "Successful African artists often use hybrid distribution, combining streaming platforms, physical sales, and traditional networks to maximize market penetration and revenue.",
                        tipForFuture: "Don't put all your distribution eggs in one basket. Multiple channels provide security and reach different market segments.",
                        conceptTaught: "comprehensive-distribution"
                    }
                }
            }
        ]
    },
    {
        title: "The Producer's Royalty Demand",
        description: "The producer who made your biggest hit drops a bombshell: 'I want 50% of all streaming royalties, not just the beat sale price. This song is half my creation.' They threaten to block the release if you don't agree. Your lawyer says they might have a case since their production is so distinctive. But 50% seems excessive. The song could be your breakthrough.",
        conditions: { minFame: 25 },
        choices: [
            {
                text: "Give them 50% - I need this song released",
                outcome: {
                    text: "You agree to the 50/50 split. The song releases and becomes a massive hit, earning $50,000 in streaming revenue. You each get $25,000, which stings because you wrote the lyrics and melody. The producer now demands similar splits on all future collaborations. You've set an expensive precedent.",
                    cash: 25000, fame: 45, wellBeing: -15, careerProgress: 12, hype: 50,
                    lesson: {
                        title: "Producer Rights and Splits",
                        explanation: "Producers who create distinctive, recognizable beats often deserve significant royalty shares, especially if their production is the song's defining element. However, 50/50 splits should be reserved for truly equal creative partnerships.",
                        realWorldExample: "In Afrobeats, producers like Masterkraft and LeriQ often get 20-30% of publishing because their beats are so distinctive. However, 50/50 splits are rare unless the producer also co-writes melodies and lyrics.",
                        tipForFuture: "Negotiate producer splits before recording. Establish clear agreements about what percentage different contributions earn to avoid expensive disputes later.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Counter with 25% - that's fair for production",
                outcome: {
                    text: "You negotiate down to 25% for the producer, 75% for you as the songwriter and performer. After some back-and-forth, they accept. The song releases successfully, and the split feels fair to both parties. You've established a sustainable working relationship without giving away half your income.",
                    cash: 37500, fame: 40, wellBeing: 5, careerProgress: 10, hype: 45,
                    lesson: {
                        title: "Fair Collaboration Splits",
                        explanation: "Successful long-term collaborations require splits that feel fair to all parties. 25-30% for distinctive production work is often acceptable, while maintaining songwriter and performer rights.",
                        realWorldExample: "Most successful African producer-artist partnerships use 20-30% producer splits, allowing both parties to profit fairly while maintaining sustainable working relationships.",
                        tipForFuture: "Aim for splits that both parties can live with long-term. Extreme splits often damage relationships and future collaboration opportunities.",
                        conceptTaught: "Negotiation Basics"
                    }
                }
            },
            {
                text: "Find a new producer - I won't be held hostage",
                outcome: {
                    text: "You refuse their demands and find a different producer to recreate the vibe. The new version is good but lacks the magic of the original. You maintain control of your royalties but lose precious time and momentum. The replacement song performs moderately, not the breakthrough you needed.",
                    cash: 15000, fame: 20, wellBeing: -10, careerProgress: 5, hype: 25,
                    lesson: {
                        title: "The Cost of Starting Over",
                        explanation: "Sometimes walking away from unreasonable demands is necessary, but it comes with costs. Lost time, momentum, and the challenge of recreating magic can hurt your career progress.",
                        realWorldExample: "Some artists have walked away from great beats due to producer disputes, only to struggle recreating the same energy. The principle may be right, but the career impact can be significant.",
                        tipForFuture: "Consider the full cost of standing firm. Sometimes accepting less favorable terms is better than losing breakthrough opportunities.",
                        conceptTaught: "Strategic Decision Making"
                    }
                }
            }
        ]
    },
    {
        title: "The Collecting Society Registration",
        description: "A music lawyer advises you to register with COSON (Nigeria) or Rwanda (RSAU) - the local collecting society that monitors radio play and collects royalties. Registration costs $200, plus annual fees, but they claim you're losing thousands in uncollected radio royalties. 'Every time your song plays on radio, TV, or in public spaces, you should get paid.' But many artists say these societies are inefficient and keep most of the money.",
        conditions: { minFame: 35, minCash: 300 },
        choices: [
            {
                text: "Register with the collecting society - protect my rights",
                outcome: {
                    text: "You register and start receiving quarterly royalty checks. The amounts are smaller than promised - about $300 per quarter - but it's passive income for music you already made. You also gain legal protection when venues use your music without permission. It's not life-changing money, but it adds up.",
                    cash: -200, fame: 0, wellBeing: 5, careerProgress: 5, hype: 0,
                    lesson: {
                        title: "Collecting Society Reality",
                        explanation: "Collecting societies in African markets often provide modest but consistent income from public performance rights. While the amounts may be smaller than advertised, they provide passive income and legal protection.",
                        realWorldExample: "COSON and similar organizations across Africa collect millions in royalties, though individual artist payments are often modest. However, consistent registration helps establish your professional standing in the industry.",
                        tipForFuture: "View collecting societies as one small piece of your income puzzle, not a major revenue source. The legal protection and legitimacy may be worth more than the money.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Skip it - these societies don't pay artists fairly anyway",
                outcome: {
                    text: "You decide not to register, keeping your $200. Over the next year, you notice your songs playing in shops, clubs, and on radio but receive no payment. A venue uses your music in a commercial without permission, and you have no legal recourse. You've saved money upfront but lost ongoing revenue and protection.",
                    cash: 0, fame: 0, wellBeing: -5, careerProgress: 0, hype: 0,
                    lesson: {
                        title: "The Cost of Not Protecting Rights",
                        explanation: "While collecting societies have flaws, not registering means forfeiting all public performance income and legal protections. Even modest collections add up over time.",
                        realWorldExample: "Many African artists who avoid collecting societies miss out on legitimate royalty income. While the systems aren't perfect, registration provides basic protection and income that unregistered artists forfeit entirely.",
                        tipForFuture: "Don't let perfect be the enemy of good. Imperfect protection is better than no protection when it comes to your intellectual property.",
                        conceptTaught: "Rights Protection"
                    }
                }
            },
            {
                text: "Research alternatives - maybe there's a better way",
                outcome: {
                    text: "You spend time researching international alternatives like ASCAP, BMI, or PRS. You discover that as an African artist, you can register with multiple societies for different territories. This complex approach requires more paperwork but potentially higher royalties from international markets.",
                    cash: -100, fame: 0, wellBeing: -5, careerProgress: 8, hype: 0,
                    lesson: {
                        title: "International Rights Strategy",
                        explanation: "African artists can often register with multiple collecting societies in different territories to maximize royalty collection. This requires more administrative work but can increase income from international airplay.",
                        realWorldExample: "Successful African artists often register with local societies plus international ones like PRS (UK) or ASCAP (US) to collect royalties when their music plays in those territories.",
                        tipForFuture: "As your music gains international exposure, consider multi-territory registration strategies. More paperwork can mean significantly more income.",
                        conceptTaught: "International Rights"
                    }
                }
            }
        ]
    },
    {
        title: "The Sample Clearance Nightmare",
        description: "You want to sample a classic Fela Kuti horn line for your new album's lead single. The sample is perfect - it gives your track instant credibility and connects you to Afrobeat royalty. But clearing the sample will cost $10,000 upfront plus 50% of your publishing. Fela's estate is notoriously difficult about clearances. Your producer suggests: 'Just replay it with different musicians. Who's going to notice?'",
        conditions: { minFame: 30 },
        choices: [
            {
                text: "Pay for proper sample clearance - do it legally",
                outcome: {
                    text: "You pay the $10,000 and agree to the 50% publishing split. The song releases with official Fela Kuti credited as co-writer. Music critics praise your respect for the legend. The official clearance gives you credibility, but the costs eat heavily into your profits. At least you sleep well at night.",
                    cash: -10000, fame: 35, wellBeing: 10, careerProgress: 12, hype: 40,
                    lesson: {
                        title: "The Value of Legal Sampling",
                        explanation: "Proper sample clearance is expensive but provides legal protection and artistic credibility. Official clearances show respect for original artists and protect you from lawsuits, even if they reduce profits.",
                        realWorldExample: "Many international artists who sample African music now pay proper clearances after high-profile legal battles. This has created new revenue streams for African artist estates and families.",
                        tipForFuture: "Budget for sample clearances early in your creative process. Legal sampling costs are part of professional music production.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Replay the sample with session musicians - avoid the costs",
                outcome: {
                    text: "You hire horn players to recreate the Fela melody with slight modifications. The result is legally distinct but captures the vibe you wanted. You save $10,000 and keep full publishing. However, some fans and critics notice the similarity and question your creativity. You've saved money but raised ethical questions.",
                    cash: -2000, fame: 25, wellBeing: -5, careerProgress: 8, hype: 30,
                    lesson: {
                        title: "Interpolation vs Sampling",
                        explanation: "Recreating melodies or rhythms with new performances can avoid clearance costs while achieving similar artistic goals. However, this approach can still raise ethical questions about attribution and creativity.",
                        realWorldExample: "Many artists recreate famous melodies to avoid sampling costs. While legally safer, the practice can be controversial if the borrowing is too obvious or unacknowledged.",
                        tipForFuture: "If you interpolate existing works, consider crediting the original artists even when not legally required. Respect builds better industry relationships.",
                        conceptTaught: "Creative Ethics"
                    }
                }
            },
            {
                text: "Create something completely original inspired by Fela's style",
                outcome: {
                    text: "You abandon the sample and create new horn arrangements inspired by Fela's style without copying specific melodies. The result is fresh, original, and undeniably yours. Critics praise your ability to honor influences while creating something new. You keep all publishing and build your reputation as an original artist.",
                    cash: -1000, fame: 30, wellBeing: 15, careerProgress: 15, hype: 35,
                    lesson: {
                        title: "Inspiration vs Imitation",
                        explanation: "Drawing inspiration from musical legends while creating original content builds artistic credibility and avoids legal complications. Original compositions allow you to honor influences while establishing your unique voice.",
                        realWorldExample: "Artists like Burna Boy draw heavily from Fela's influence without directly sampling, creating music that feels connected to the tradition while being completely original.",
                        tipForFuture: "Let influences inspire new creations rather than direct copies. Original music gives you full control and builds your artistic identity.",
                        conceptTaught: "Creative Development"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Video Budget Decision",
        description: "Your breakthrough single needs a video, and you have three options. A high-end director wants $25,000 for a cinematic video with locations across Lagos and professional dancers. A mid-tier director offers $8,000 for a solid performance video. Your friend with a good camera says he'll do it for $1,000 plus food. YouTube success stories show both expensive flops and phone-shot viral hits. How much is the right investment?",
        conditions: { minFame: 20, minHype: 30 },
        once: true,
        choices: [
            {
                text: "Go big with the $25,000 cinematic video",
                outcome: {
                    text: "The video is stunning! Professional cinematography, beautiful locations, and high production values. It gets featured on MTV Base and major blogs. However, the song's success doesn't match the video's quality. You spent your entire budget on one video and have no money left for promotion or the next project.",
                    cash: -25000, fame: 40, wellBeing: -10, careerProgress: 10, hype: 45,
                    lesson: {
                        title: "Production Value vs Budget Balance",
                        explanation: "High-budget videos can create impressive content but may not guarantee proportional returns. Spending your entire budget on one video can limit other important investments like promotion and future projects.",
                        realWorldExample: "Some African artists have spent their entire advance money on expensive videos without leaving funds for tour support or follow-up singles, limiting their ability to capitalize on initial success.",
                        tipForFuture: "Consider the total cost of your campaign. An expensive video is worthless if you can't afford to promote it or create follow-up content.",
                        conceptTaught: "Budget Management"
                    }
                }
            },
            {
                text: "Choose the $8,000 professional middle ground",
                outcome: {
                    text: "The video looks professional and polished without breaking the bank. Good lighting, solid editing, and professional execution help your song get playlist consideration. You have budget left for promotion and your next single. The balanced approach allows sustainable growth rather than one expensive gamble.",
                    cash: -8000, fame: 30, wellBeing: 5, careerProgress: 12, hype: 35,
                    lesson: {
                        title: "Strategic Budget Allocation",
                        explanation: "Mid-tier professional videos often provide the best return on investment, offering quality production without exhausting your budget. This approach allows for sustainable content creation and proper promotion.",
                        realWorldExample: "Many successful African artists built their careers with consistently good mid-budget videos rather than one expensive production. Regular, quality content often outperforms sporadic expensive content.",
                        tipForFuture: "Aim for sustainable quality over one-time extravagance. Consistent professional content builds careers better than occasional expensive pieces.",
                        conceptTaught: "Content Strategy"
                    }
                }
            },
            {
                text: "Go DIY with your friend for $1,000 - creativity over budget",
                outcome: {
                    text: "Your friend surprises everyone with creative camera work and innovative editing. The raw, authentic feel resonates with fans who appreciate the genuine approach. The video goes viral on TikTok for its creativity rather than its budget. You prove that ideas matter more than money, and have budget left for everything else.",
                    cash: -1000, fame: 35, wellBeing: 10, careerProgress: 8, hype: 50,
                    lesson: {
                        title: "Creativity Over Budget",
                        explanation: "Innovative, authentic content can outperform expensive productions if the creative vision is strong. Social media audiences often prefer genuine, creative content over polished but generic videos.",
                        realWorldExample: "Many viral African music videos were shot on modest budgets with creative concepts. Artists like Rema gained initial recognition with relatively simple but highly creative videos.",
                        tipForFuture: "Focus on creative concepts that match your resources. A great idea with modest execution often beats a weak concept with high production values.",
                        conceptTaught: "Creative Innovation"
                    }
                }
            }
        ]
    },
    {
        title: "The International Collaboration Offer",
        description: "A mid-level American R&B artist wants to collaborate on a song for their upcoming album. They offer to fly you to Atlanta, cover all expenses, and split the song 50/50. But they want to own the master recording and handle all distribution through their US label. Your manager warns: 'You'll get writing credits but no control. If this song blows up, you won't own any of the recording.' The exposure could be massive, but the terms feel one-sided.",
        conditions: { minFame: 40 },
        once: true,
        choices: [
            {
                text: "Take the deal - international exposure is worth the trade-off",
                outcome: {
                    text: "You fly to Atlanta and create an amazing song together. It becomes their biggest hit and gets radio play across America. You gain massive international recognition and new opportunities, but watch them earn millions from the master recording while you only get songwriting royalties. The exposure was valuable, but expensive.",
                    cash: 15000, fame: 50, wellBeing: -5, careerProgress: 20, hype: 40,
                    lesson: {
                        title: "Exposure vs Ownership Trade-offs",
                        explanation: "International collaborations can provide massive exposure but often require giving up ownership rights. The key is evaluating whether the career boost justifies the financial sacrifice.",
                        realWorldExample: "Many African artists gained international recognition through collaborations where they gave up master ownership. While financially costly, these partnerships often led to bigger opportunities and eventual leverage for better deals.",
                        tipForFuture: "Consider international collaborations as marketing investments. If the exposure leads to bigger opportunities, the ownership sacrifice might be worthwhile.",
                        conceptTaught: "International Strategy"
                    }
                }
            },
            {
                text: "Negotiate for master ownership split or walk away",
                outcome: {
                    text: "You demand joint master ownership and equal distribution rights. After tense negotiations, they agree to a compromise: joint ownership with their label handling distribution but you keeping international rights outside the US. The collaboration happens on fairer terms, though the process was stressful.",
                    cash: 25000, fame: 45, wellBeing: 5, careerProgress: 18, hype: 35,
                    lesson: {
                        title: "International Negotiation Leverage",
                        explanation: "Strong negotiation can improve international collaboration terms, especially when you bring unique value. African artists increasingly have leverage to demand fairer deals as Afrobeats gains global popularity.",
                        realWorldExample: "As Afrobeats has grown globally, African artists have gained more negotiating power in international collaborations. Artists like Burna Boy and Wizkid now command equal terms with international partners.",
                        tipForFuture: "Don't accept the first international offer. As African music gains global respect, your negotiating position is stronger than you might think.",
                        conceptTaught: "Negotiation Power"
                    }
                }
            },
            {
                text: "Decline and focus on building my home market first",
                outcome: {
                    text: "You turn down the collaboration to focus on strengthening your African base. Six months later, you're the biggest artist in your region with multiple hit songs. When international offers come again, you have much more leverage. Patience allowed you to negotiate from a position of strength.",
                    cash: 5000, fame: 60, wellBeing: 10, careerProgress: 15, hype: 55,
                    lesson: {
                        title: "Building Leverage Through Regional Success",
                        explanation: "Strong regional success provides leverage for better international deals. Sometimes declining early international offers allows you to build the market position needed for fairer partnerships.",
                        realWorldExample: "Artists like Davido built massive African followings before pursuing international collaborations, giving them negotiating power to demand equal terms and ownership rights.",
                        tipForFuture: "Don't rush into international deals from a weak position. Build your regional strength first to negotiate better international terms later.",
                        conceptTaught: "Strategic Timing"
                    }
                }
            }
        ]
    },
    {
        title: "The Traditional Instrument Fusion",
        description: "You're in the studio working on your new album when a master kora player stops by. He offers to collaborate, adding traditional West African harp melodies to your modern production. He says: 'Young artist, our ancestors' music shouldn't die. Let me teach you.' But your producer worries: 'Traditional instruments don't translate well to streaming platforms. It might sound too niche.' Your A&R rep is silent, waiting for your decision.",
        conditions: { minFame: 25 },
        once: true,
        choices: [
            {
                text: "Embrace the fusion - add traditional kora to my sound",
                outcome: {
                    text: "The kora player adds beautiful, haunting melodies to three tracks. The fusion is stunning - ancient and modern coexisting perfectly. Critics praise your cultural authenticity, and music educators use your album in African studies courses. You've created something timeless while honoring tradition.",
                    cash: 1000, fame: 40, wellBeing: 15, careerProgress: 15, hype: 45,
                    lesson: {
                        title: "Cultural Heritage as Differentiation",
                        explanation: "Incorporating traditional instruments and cultural elements differentiates your music in a crowded market. It creates authentic cultural connections while offering something unique that pure Western production can't replicate.",
                        realWorldExample: "Burna Boy's use of traditional African rhythms and instruments became his signature sound, helping him win a Grammy. Angelique Kidjo built an international career by fusing traditional Benin music with modern production.",
                        tipForFuture: "Your cultural heritage is your competitive advantage. Artists worldwide chase 'exotic' sounds - you have authentic access to traditions others can only imitate.",
                        conceptTaught: "cultural-authenticity"
                    }
                }
            },
            {
                text: "Stick with modern production - stay commercially viable",
                outcome: {
                    text: "You politely decline the kora player's offer, sticking to conventional instrumentation. The album sounds professional and radio-ready but indistinguishable from countless other modern productions. It performs adequately but creates no lasting cultural impact or memorable signature sound.",
                    cash: 2000, fame: 20, wellBeing: -5, careerProgress: 8, hype: 25,
                    lesson: {
                        title: "The Cost of Playing It Safe",
                        explanation: "Avoiding cultural distinctiveness in favor of 'commercial viability' often leads to generic music that struggles to stand out. What seems safe can actually be the riskier choice in a saturated market.",
                        realWorldExample: "Many African artists who abandoned traditional elements for generic Western sounds failed to achieve international success because they sounded like inferior versions of Western artists rather than authentic voices.",
                        tipForFuture: "Commercial viability doesn't mean cultural erasure. The most commercially successful African artists often embrace their heritage most boldly.",
                        conceptTaught: "market-differentiation"
                    }
                }
            },
            {
                text: "Learn from him and incorporate elements subtly",
                outcome: {
                    text: "You spend a week learning kora techniques and traditional rhythmic patterns. You don't record him directly but incorporate what you learned into your composition approach. The album has subtle traditional influences that add depth without dominating. You've found balance between innovation and tradition.",
                    cash: 1500, fame: 35, wellBeing: 20, careerProgress: 18, hype: 40,
                    lesson: {
                        title: "Cultural Knowledge as Creative Tool",
                        explanation: "Learning traditional musical forms expands your creative vocabulary without requiring literal incorporation. Understanding your cultural musical heritage makes you a more sophisticated composer.",
                        realWorldExample: "Jacob Collier studied numerous world music traditions, which influenced his compositions in subtle ways. He doesn't play traditional instruments but his music shows deep understanding of global musical concepts.",
                        tipForFuture: "Study your cultural musical heritage even if you don't directly replicate it. The knowledge will inform your creativity in unexpected ways.",
                        conceptTaught: "creative-development"
                    }
                }
            }
        ]
    },
    {
        title: "The Cultural Appropriation Accusation",
        description: "A popular European DJ sampled your traditional Igbo wedding song without permission or credit, and it's climbing international charts. They're making millions while your original version has 50,000 streams. Music blogs are calling you 'the inspiration' without mentioning theft. African fans are furious, demanding you speak out. Your lawyer says you could sue, but it'll cost $50,000 with no guarantee of winning. How do you respond to this cultural theft?",
        conditions: { minFame: 35, minHype: 25 },
        once: true,
        choices: [
            {
                text: "Launch a public campaign calling out the theft",
                outcome: {
                    text: "You post a video explaining how the DJ stole your cultural heritage. The story goes viral! International media picks it up, the DJ faces massive backlash and eventually credits you and pays settlement. You become a voice against cultural appropriation, though the fight was exhausting and emotional.",
                    cash: 80000, fame: 55, wellBeing: -15, careerProgress: 20, hype: 70,
                    lesson: {
                        title: "Public Accountability for Cultural Theft",
                        explanation: "Social media has given African artists powerful tools to call out cultural appropriation. Public pressure can force accountability when legal systems fail to protect cultural intellectual property.",
                        realWorldExample: "When Lion King used African music without proper credit, African artists publicly called out Disney. The backlash led to better practices. Similarly, Nigerian artists have successfully called out international DJs for uncredited sampling.",
                        tipForFuture: "Document your cultural work publicly. When theft occurs, social media pressure can be more effective than expensive lawsuits in forcing acknowledgment and compensation.",
                        conceptTaught: "cultural-rights"
                    }
                }
            },
            {
                text: "Hire lawyers and sue for copyright infringement",
                outcome: {
                    text: "You spend $50,000 on international lawyers. The case drags on for two years. Eventually you win a settlement of $30,000 - less than your legal costs. The DJ's career continues largely unaffected. You've proven a point but at enormous personal and financial cost.",
                    cash: -20000, fame: 25, wellBeing: -30, careerProgress: 5, hype: 15,
                    lesson: {
                        title: "The Legal System's Limitations",
                        explanation: "International copyright law often fails to protect African artists adequately. Legal victories can be pyrrhic - costing more than they recover while draining energy from your creative work.",
                        realWorldExample: "Many African artists have spent fortunes fighting appropriation cases in Western courts with minimal success. The legal systems weren't designed to protect traditional cultural knowledge.",
                        tipForFuture: "Consider whether legal action serves your goals. Sometimes public pressure or creative responses work better than expensive lawsuits with uncertain outcomes.",
                        conceptTaught: "legal-reality"
                    }
                }
            },
            {
                text: "Release your own 'International Remix' to reclaim the narrative",
                outcome: {
                    text: "Instead of fighting, you release an epic international remix of your original song with major producers. You flood the market with your authentic version. Your remix outperforms theirs on African charts and gets picked up globally. You've turned theft into opportunity by flooding the market with the real thing.",
                    cash: -5000, fame: 60, wellBeing: 10, careerProgress: 25, hype: 80,
                    lesson: {
                        title: "Creative Response to Appropriation",
                        explanation: "Sometimes the best response to cultural theft is overwhelming the market with your authentic voice. Rather than fighting over who owns what, prove who does it better by out-creating and out-promoting the imitator.",
                        realWorldExample: "When Western artists copy African sounds, successful African artists often respond by releasing their own polished versions that demonstrate the authentic source. This approach builds their career rather than getting stuck in legal battles.",
                        tipForFuture: "Consider creative responses to theft. Reclaim the narrative by showing the world the authentic source performed at the highest level.",
                        conceptTaught: "strategic-response"
                    }
                }
            }
        ]
    },
    {
        title: "The Religious Music Crossover",
        description: "You've been making secular Afrobeats, but a major gospel label offers you $100,000 to record a Christian album. Your mother, a pastor, is thrilled: 'Finally, use your gifts for the Lord!' But your secular fans love your party music and club anthems. Your manager warns: 'Gospel doesn't stream like Afrobeats. You'll lose your core audience.' Yet the gospel market in Africa is massive and loyal. This decision could redefine your entire brand.",
        conditions: { minFame: 30 },
        once: true,
        choices: [
            {
                text: "Take the gospel deal - there's a massive untapped market",
                outcome: {
                    text: "You release a gospel album that sells massively in churches, crusades, and religious networks across Africa. You gain a completely new, older, more financially stable audience. But your club-going fans feel betrayed. Secular DJs stop playing your music. You've traded one audience for another.",
                    cash: 100000, fame: 45, wellBeing: 15, careerProgress: 10, hype: -25,
                    lesson: {
                        title: "Audience Switching Risks",
                        explanation: "Dramatically changing musical direction can gain new audiences while losing existing ones. Gospel music in Africa has strong commercial viability but appeals to fundamentally different listeners than secular music.",
                        realWorldExample: "Some Nigerian artists successfully transitioned to gospel music, building new careers with church audiences. Others lost their secular fanbase without gaining equivalent gospel success, leaving them between markets.",
                        tipForFuture: "Understand that genre switches aren't additions - they're replacements. Ensure the new audience is large and engaged enough to replace what you'll lose.",
                        conceptTaught: "audience-management"
                    }
                }
            },
            {
                text: "Stay secular - don't compromise your artistic identity",
                outcome: {
                    text: "You decline the gospel deal and continue making the music that feels authentic to you. Your existing fans remain loyal and your career continues its current trajectory. Your mother is disappointed but respects your decision. You've maintained artistic integrity, though you wonder about the path not taken.",
                    cash: 0, fame: 25, wellBeing: 5, careerProgress: 8, hype: 30,
                    lesson: {
                        title: "Artistic Authenticity",
                        explanation: "Making music that feels authentic to you creates more sustainable careers than chasing market opportunities that don't align with your identity. Audiences sense when artists are being genuine.",
                        realWorldExample: "Many successful artists turned down lucrative opportunities that didn't align with their artistic vision, maintaining fanbase loyalty and long-term credibility over short-term financial gains.",
                        tipForFuture: "Money is tempting, but artistic authenticity is your long-term asset. Fans support artists they believe are being genuine, not those obviously chasing trends or money.",
                        conceptTaught: "brand-consistency"
                    }
                }
            },
            {
                text: "Create a separate gospel alter-ego under a different name",
                outcome: {
                    text: "You negotiate to release the gospel album under a different artist name, keeping the audiences separate. You fulfill your mother's wishes and tap the gospel market while protecting your secular brand. Managing two identities is complex, but you're serving both markets without forcing them to overlap.",
                    cash: 80000, fame: 35, wellBeing: 10, careerProgress: 15, hype: 20,
                    lesson: {
                        title: "Multiple Artist Personas",
                        explanation: "Some artists successfully maintain multiple musical identities to serve different markets without confusing their audiences. This requires careful brand management but can access multiple revenue streams.",
                        realWorldExample: "Several artists across genres have used alter-egos or side projects to explore different musical directions. This approach allows creative experimentation without alienating existing fanbases.",
                        tipForFuture: "If you want to explore dramatically different musical territories, consider separate artist projects rather than forcing your existing audience to follow every creative direction.",
                        conceptTaught: "brand-diversification"
                    }
                }
            }
        ]
    },
    {
        title: "The Family Obligation vs Career",
        description: "Your younger sister's university fees are due - $3,000. Your mother calls in tears: 'You're successful now. The family needs you.' You have $8,000 in savings for your next music video, and three months before your album release. In your culture, family success is communal, and helping family is non-negotiable. But your manager insists: 'If you don't invest in your career now, you won't be able to help anyone later.' The extended family is waiting to see what kind of person success has made you.",
        conditions: { minFame: 25, minCash: 5000 },
        once: true,
        choices: [
            {
                text: "Pay the fees - family comes first, always",
                outcome: {
                    text: "You send the $3,000 immediately. Your sister cries with gratitude, your mother praises you publicly, and your extended family shares the story with pride. Your community loves you for staying humble. But you have to make a cheaper music video, and your album rollout suffers from limited promotional budget. Family loyalty costs career momentum.",
                    cash: -3000, fame: 30, wellBeing: 15, careerProgress: -5, hype: 15,
                    lesson: {
                        title: "African Communal Success Philosophy",
                        explanation: "In many African cultures, individual success is viewed as family success. This creates strong support networks but also financial pressures that Western artists rarely face. Managing these expectations is crucial for sustainable careers.",
                        realWorldExample: "Many successful African artists struggle with extended family financial demands. Those who maintain boundaries while still supporting family strategically tend to have more sustainable careers than those who give unlimited support.",
                        tipForFuture: "You can support family while maintaining career sustainability. Consider setting clear boundaries, creating family trusts, or establishing regular support rather than responding to every crisis.",
                        conceptTaught: "financial-boundaries"
                    }
                }
            },
            {
                text: "Invest in your career - you'll help more people later",
                outcome: {
                    text: "You explain that you need to invest in your career to be able to help family long-term. You don't send the money. Your sister has to delay university for a year. Your mother stops speaking to you. Family WhatsApp groups call you selfish and 'too Western.' The social cost is enormous, and the guilt weighs heavily on you.",
                    cash: 0, fame: 25, wellBeing: -25, careerProgress: 10, hype: 30,
                    lesson: {
                        title: "The Cultural Cost of Boundaries",
                        explanation: "Setting financial boundaries with family in communal cultures often results in severe social consequences. While financially rational, these decisions can damage relationships and mental health in ways Western career advice doesn't account for.",
                        realWorldExample: "Some African artists who prioritized career over family obligations faced years of estrangement and community criticism, even after achieving success. The emotional toll can be significant regardless of financial outcomes.",
                        tipForFuture: "Understand that Western 'hustle culture' advice often ignores African cultural realities. You'll need to find your own balance between career needs and family obligations.",
                        conceptTaught: "cultural-context"
                    }
                }
            },
            {
                text: "Find a middle ground - pay half now, negotiate extended payment",
                outcome: {
                    text: "You send $1,500 immediately and call the university to arrange a payment plan for the rest. You sacrifice a less expensive part of your budget (maybe fewer Instagram ads) to cover the second payment next month. Your family sees you tried to help, and your career doesn't suffer dramatically. It's not perfect for anyone, but it works.",
                    cash: -1500, fame: 28, wellBeing: 5, careerProgress: 5, hype: 25,
                    lesson: {
                        title: "Practical Compromise in Family Obligations",
                        explanation: "Creative solutions can often satisfy both family obligations and career needs. Payment plans, partial support, and budget reallocation can demonstrate family commitment while protecting career investments.",
                        realWorldExample: "Successful African artists often develop systems for family support that don't derail their careers - monthly stipends instead of crisis payments, education funds instead of cash gifts, or co-investment opportunities that benefit both family and career.",
                        tipForFuture: "Train your family to work with you on solutions rather than expecting instant full support. Structure support in ways that are sustainable for your career and helpful for them.",
                        conceptTaught: "sustainable-support"
                    }
                }
            }
        ]
    },
    {
        title: "The Language Barrier in Collaboration",
        description: "A huge French artist wants to collaborate with you for the European market. You only speak English and Yoruba fluently. They want lyrics in French, which you don't speak. They offer a translator and suggest you phonetically sing French lyrics you don't understand. Your Nigerian fans wonder why you're singing in French when you rep Yoruba pride. Your international team sees this as your European breakthrough. You could learn some French, but the song needs to be recorded this week.",
        conditions: { minFame: 40 },
        once: true,
        choices: [
            {
                text: "Phonetically sing French - fake it till you make it",
                outcome: {
                    text: "You record French lyrics phonetically without understanding them. The song becomes a European hit, but French speakers mock your terrible accent online. African fans call you a sellout singing languages you don't understand. The commercial success feels hollow because you can't even sing your own song with understanding.",
                    cash: 25000, fame: 40, wellBeing: -15, careerProgress: 15, hype: 25,
                    lesson: {
                        title: "Authenticity vs Market Access",
                        explanation: "Singing in languages you don't understand for market access can succeed commercially but damages artistic credibility. Audiences often sense when artists are being inauthentic, especially native speakers of the language being mimicked.",
                        realWorldExample: "Several artists have attempted to record in languages they don't speak for market access. While some succeed commercially, many face ridicule from native speakers and lose respect from their original fanbase.",
                        tipForFuture: "Consider whether linguistic authenticity matters for your brand. If your identity is built on cultural pride, singing languages you don't understand contradicts your brand message.",
                        conceptTaught: "brand-integrity"
                    }
                }
            },
            {
                text: "Sing in English and Yoruba - stay authentic to yourself",
                outcome: {
                    text: "You propose recording your verses in English and Yoruba while they sing in French - a true multilingual collaboration. They respect your position. The song becomes a celebration of linguistic diversity. It performs well in both markets while maintaining your authenticity. You've proven you don't need to abandon your identity for international success.",
                    cash: 20000, fame: 50, wellBeing: 15, careerProgress: 20, hype: 45,
                    lesson: {
                        title: "Multilingual Collaboration Authenticity",
                        explanation: "True international collaborations celebrate linguistic diversity rather than requiring cultural assimilation. Maintaining your linguistic identity often creates more interesting and authentic music than forcing yourself into unfamiliar languages.",
                        realWorldExample: "Successful international collaborations like Beyoncé and Wizkid's 'Brown Skin Girl' or Major Lazer's work with African artists celebrate linguistic diversity rather than requiring everyone to sing in one language.",
                        tipForFuture: "Propose authentic multilingual collaborations rather than abandoning your linguistic identity. Your native language is part of your unique value proposition.",
                        conceptTaught: "multicultural-collaboration"
                    }
                }
            },
            {
                text: "Learn basic French for this specific song - meet them halfway",
                outcome: {
                    text: "You spend the week intensely learning the French phrases you need for this song, working with a tutor. Your French is accented but sincere. French audiences appreciate the effort, your Nigerian fans respect that you learned rather than faked it, and you've gained a new skill. The collaboration feels like genuine cultural exchange.",
                    cash: 22000, fame: 45, wellBeing: 5, careerProgress: 18, hype: 40,
                    lesson: {
                        title: "Cultural Exchange Through Learning",
                        explanation: "Making genuine effort to learn elements of collaborators' cultures shows respect and creates authentic cross-cultural moments. Audiences appreciate when artists make sincere efforts even if execution is imperfect.",
                        realWorldExample: "Artists who make genuine efforts to learn and understand the languages and cultures they're engaging with tend to build stronger international relationships and more respectful cross-cultural collaborations.",
                        tipForFuture: "When entering new markets, invest time in learning cultural and linguistic basics. Sincerity matters more than perfection, and the learning process often enriches your artistry.",
                        conceptTaught: "cultural-respect"
                    }
                }
            }
        ]
    },
    {
        title: "The Generational Sound Debate",
        description: "You're producing your new album when your father, a legendary highlife musician from the '70s, visits the studio. He listens and shakes his head: 'This electronic music has no soul. You've forgotten our musical heritage.' He challenges you to incorporate live horns, traditional percussion, and organic instrumentation. Your young producer argues the opposite: 'Old-school sounds won't connect with Gen Z. They want hard-hitting 808s and digital production.' Both have sold millions of records in their respective eras. Whose wisdom do you trust?",
        conditions: { minFame: 30 },
        once: true,
        choices: [
            {
                text: "Honor my father's tradition - add organic instrumentation",
                outcome: {
                    text: "You incorporate live horns, traditional drums, and organic elements. Your father personally contributes guitar parts. The album has warmth and depth that digital production can't replicate. Older audiences love it, music critics praise the sophistication, but Gen Z streaming numbers are lower than expected. You've created something timeless, but is it timely?",
                    cash: 3000, fame: 35, wellBeing: 20, careerProgress: 15, hype: 20,
                    lesson: {
                        title: "Generational Musical Values",
                        explanation: "Different generations value different musical qualities. Older listeners prioritize musicianship and organic sounds, while younger audiences often prefer digital production and contemporary sounds. Neither is 'wrong' - they're different aesthetic values.",
                        realWorldExample: "Artists like Jon Batiste and Anderson .Paak successfully blend traditional musicianship with contemporary production, creating music that appeals across generations by respecting both values.",
                        tipForFuture: "Don't view generational musical differences as conflicts. The richest music often comes from respectfully blending different generational perspectives.",
                        conceptTaught: "musical-evolution"
                    }
                }
            },
            {
                text: "Follow current trends - stick with modern production",
                outcome: {
                    text: "You stick with your young producer's vision - hard 808s, digital production, and contemporary sounds. The album streams well with Gen Z, gets added to youth playlists, and performs commercially. But your father is heartbroken, older music critics dismiss it as generic, and you feel disconnected from musical heritage.",
                    cash: 8000, fame: 40, wellBeing: -10, careerProgress: 10, hype: 50,
                    lesson: {
                        title: "The Generational Disconnect Cost",
                        explanation: "Fully embracing contemporary trends while abandoning traditional musicianship can succeed commercially but creates disconnection from musical heritage and older audiences who support long-term careers.",
                        realWorldExample: "Some African artists who fully embraced Western digital production lost the distinctive cultural sound that made them special, becoming indistinguishable from global competitors.",
                        tipForFuture: "Commercial success isn't just about today's streams. Long-term careers often require maintaining connections across generational divides.",
                        conceptTaught: "career-sustainability"
                    }
                }
            },
            {
                text: "Blend both approaches - create a generational fusion",
                outcome: {
                    text: "You challenge both your father and producer to collaborate. Live horns over 808s. Traditional percussion with digital effects. Your father's guitar weaving through modern production. The result is innovative - respecting tradition while pushing forward. Both generations find elements they love. You've created a bridge between past and future.",
                    cash: 5000, fame: 55, wellBeing: 15, careerProgress: 25, hype: 45,
                    lesson: {
                        title: "Generational Musical Synthesis",
                        explanation: "The most innovative music often comes from synthesizing generational perspectives rather than choosing one over the other. Blending traditional musicianship with contemporary production creates distinctive sounds that stand out.",
                        realWorldExample: "Burna Boy's Grammy-winning 'Twice as Tall' successfully blended his grandfather's Fela-inspired horns and traditional percussion with modern Afrobeats production, creating music that appealed across generations and continents.",
                        tipForFuture: "Don't see generational musical values as either/or choices. The most interesting music often comes from unexpected combinations of old and new.",
                        conceptTaught: "creative-innovation"
                    }
                }
            }
        ]
    },
    {
        title: "The Political Song Pressure",
        description: "Protests have erupted across your country over corruption and police brutality. Your fans are begging you to release a protest song: 'You have the platform! Speak for us!' Opposition politicians offer to fund a music video if you make a political statement. But your manager warns: 'The government has shut down artists for less. We could lose radio play, government event bookings, and you might face harassment.' Your biggest sponsor is government-connected. Your conscience says speak out, but your career safety says stay silent.",
        conditions: { minFame: 45, minHype: 35 },
        once: true,
        choices: [
            {
                text: "Release a bold protest song - use your platform for change",
                outcome: {
                    text: "You release a powerful protest song calling out corruption directly. Young people hail you as a hero, international media covers it, and the song goes viral. However, you're banned from state media, lose government contracts, and your sponsor drops you. Police harass you at airports. You've made a stand, but the professional consequences are severe.",
                    cash: -15000, fame: 70, wellBeing: -20, careerProgress: 10, hype: 90,
                    lesson: {
                        title: "Political Art and Consequences",
                        explanation: "Political music can create massive cultural impact and build powerful legacies, but in many African countries, it comes with real professional and personal risks. Artists must weigh their social responsibility against career and safety concerns.",
                        realWorldExample: "Fela Kuti faced constant government harassment for political music. Recently, artists like Falz and Burna Boy faced various pressures after releasing politically charged music during protests, though international attention provided some protection.",
                        tipForFuture: "If you choose political music, understand the real risks and have support systems ready. International attention can provide protection, and being prepared for consequences reduces their impact.",
                        conceptTaught: "art-activism"
                    }
                }
            },
            {
                text: "Stay silent - protect your career and safety",
                outcome: {
                    text: "You remain quiet, releasing only entertainment music. Your career continues smoothly, government bookings continue, and sponsors are happy. But fans accuse you of cowardice and selling out. Your social media is flooded with disappointment. You're financially secure but wonder if you've failed your generation's moment.",
                    cash: 5000, fame: -15, wellBeing: -15, careerProgress: 5, hype: -30,
                    lesson: {
                        title: "The Cost of Silence",
                        explanation: "Staying silent during important social moments protects your career but can damage your relationship with fans and your own sense of purpose. In the age of social media, silence itself is a political statement.",
                        realWorldExample: "Several prominent African artists faced significant backlash for staying silent during major protests and social movements. Fans remembered their silence long after the immediate events passed.",
                        tipForFuture: "Silence has costs too. If you choose safety over activism, understand that your audience may lose respect, affecting your long-term relationship with them.",
                        conceptTaught: "artist-responsibility"
                    }
                }
            },
            {
                text: "Make a subtle, metaphorical statement - speak carefully",
                outcome: {
                    text: "You release a song using metaphors and allegory to address the issues without direct accusations. Listeners understand the message, but you have plausible deniability. You walk the tightrope - showing solidarity without making yourself an obvious target. It's not the bold statement fans wanted, but it's a statement nonetheless.",
                    cash: 2000, fame: 40, wellBeing: -5, careerProgress: 12, hype: 35,
                    lesson: {
                        title: "Strategic Political Expression",
                        explanation: "Metaphorical political art can communicate messages while providing deniability and reducing risk. Throughout history, artists in oppressive contexts have used allegory and symbolism to speak truth while maintaining some safety.",
                        realWorldExample: "Many African musicians during colonial and authoritarian periods used metaphorical lyrics to criticize power. Bob Marley's political songs often used biblical and metaphorical language that provided multiple interpretations.",
                        tipForFuture: "If direct political statement is too risky, metaphorical art can still make meaningful contributions. Subtle messages can be powerful without making you an obvious target.",
                        conceptTaught: "strategic-messaging"
                    }
                }
            }
        ]
    },
    {
        title: "The Gen Z Dance Challenge",
        description: "A dance challenge using your new song is exploding on TikTok, but Gen Z is creating choreography you never imagined - some of it sexually suggestive, some politically charged, some just weird. Your label is thrilled at the organic virality. But some dances completely misinterpret your song's meaning, and conservative family members are shocked by the sexual dances. Do you try to control how people use your music, or let the internet do its thing?",
        conditions: { minFame: 30, minHype: 40 },
        once: true,
        choices: [
            {
                text: "Embrace it all - let the internet run wild with my music",
                outcome: {
                    text: "You publicly celebrate all the dance challenges, even reposting the wild ones. The song explodes to 50 million views across platforms. Your conservative family is mortified, and some fans say you've lost control of your image. But Gen Z claims you as their artist, and the virality is undeniable. You've traded respectability for relevance.",
                    cash: 15000, fame: 65, wellBeing: -10, careerProgress: 15, hype: 85,
                    lesson: {
                        title: "Viral Music and Loss of Control",
                        explanation: "Viral success on social platforms often means losing control of how your art is interpreted and used. Gen Z audiences create their own meanings and uses for music, which can conflict with artists' original intentions or personal values.",
                        realWorldExample: "Many artists have watched their songs take on completely unintended meanings through TikTok challenges. Some embrace it, others try to fight it, but the platform's nature means artists can't control cultural interpretation.",
                        tipForFuture: "Decide early whether you value viral success or message control more. You rarely get both with social media challenges. Viral success requires releasing control.",
                        conceptTaught: "social-media-dynamics"
                    }
                }
            },
            {
                text: "Try to guide the 'correct' interpretation of my song",
                outcome: {
                    text: "You post videos explaining your song's real meaning and creating your own 'official' dance that's more family-friendly. Gen Z mocks you for being controlling and out-of-touch. The organic virality dies as you try to manage it. Your attempt to maintain control killed the spontaneous energy. The song's momentum stalls.",
                    cash: 3000, fame: 20, wellBeing: -20, careerProgress: 2, hype: -15,
                    lesson: {
                        title: "The Futility of Controlling Viral Moments",
                        explanation: "Trying to control how the internet interprets and uses your music usually backfires. Social media audiences value authenticity and freedom, and attempts to manage organic movements often kill the momentum.",
                        realWorldExample: "Artists who've tried to control TikTok interpretations of their music typically fail and get mocked. The platform's culture is about user creativity and freedom, not artist control.",
                        tipForFuture: "Once music enters social media culture, you can influence but not control it. Fighting organic interpretations usually damages more than it helps.",
                        conceptTaught: "digital-culture"
                    }
                }
            },
            {
                text: "Engage playfully while setting subtle boundaries",
                outcome: {
                    text: "You join some dances yourself, show appreciation for creative interpretations, but casually promote more family-friendly versions when you engage. You're part of the fun without endorsing everything. Gen Z respects that you're not controlling, just participating. Your engagement keeps the momentum going while gently shaping the narrative.",
                    cash: 12000, fame: 50, wellBeing: 5, careerProgress: 18, hype: 60,
                    lesson: {
                        title: "Participatory Influence in Social Media",
                        explanation: "Rather than controlling social media use of your music, you can participate and gently influence by example. Being part of the conversation while modeling your preferred interpretations works better than trying to manage it.",
                        realWorldExample: "Artists like Lizzo successfully engage with social media trends around their music by participating playfully while subtly highlighting versions that align with their values, without being controlling.",
                        tipForFuture: "Lead by example rather than by command. Participate in trends you like, create content that models your values, but don't try to police how others engage.",
                        conceptTaught: "community-engagement"
                    }
                }
            }
        ]
    },
    {
        title: "The Mental Health Crisis",
        description: "You've been working non-stop - constant recording, touring, endless promotion. The pace is relentless. You're exhausted, anxious, and having panic attacks before shows. Your therapist says you need to take three months off completely. But you're at the peak of your career momentum. Your manager says: 'Three months off now could kill everything we've built. Your competitors won't rest.' Your family says 'push through it.' But you can barely get out of bed some mornings.",
        conditions: { minFame: 50, maxWellBeing: 40, minCareerProgress: 40 },
        once: true,
        choices: [
            {
                text: "Take the mental health break - my health comes first",
                outcome: {
                    text: "You cancel all engagements and take three months off. Your team is furious. Fans worry. Competitors fill the space you left. When you return, rebuilt and healthy, you have to fight for relevance again. But you're alive, functioning, and grateful you chose yourself. Some momentum was lost, but you avoided complete breakdown.",
                    cash: -30000, fame: -20, wellBeing: 50, careerProgress: -10, hype: -25,
                    lesson: {
                        title: "Mental Health as Career Foundation",
                        explanation: "No career can be sustained without mental health. While breaks have costs, burnout can end careers permanently. Taking time to recover, while professionally costly, is often the only path to long-term sustainability.",
                        realWorldExample: "Artists like Kid Cudi, Kendrick Lamar, and Billie Eilish have publicly taken mental health breaks. While these breaks affected momentum, they returned healthier and more creative, with sustained long-term careers.",
                        tipForFuture: "Your mental health is the foundation of your career. Without it, everything else collapses. Protect it even when external pressures demand otherwise.",
                        conceptTaught: "self-care"
                    }
                }
            },
            {
                text: "Push through - I can rest when I'm established",
                outcome: {
                    text: "You ignore your therapist and keep grinding. Six weeks later, you have a complete breakdown on stage - you walk off mid-performance, crying uncontrollably. The video goes viral. You're forced to cancel everything anyway, but now with public trauma and professional damage. You needed the break then; now you need it even more desperately.",
                    cash: -50000, fame: -35, wellBeing: -50, careerProgress: -25, hype: -40,
                    lesson: {
                        title: "The Inevitable Cost of Ignoring Mental Health",
                        explanation: "Mental health issues don't disappear because you ignore them - they escalate until they force attention, usually in more damaging ways. Proactive care is less costly than crisis intervention.",
                        realWorldExample: "Multiple artists have experienced very public mental health breakdowns after ignoring warning signs. These public crises are more career-damaging than strategic breaks would have been.",
                        tipForFuture: "Mental health problems don't wait for convenient times. Addressing them proactively costs less than waiting for crisis to force your hand.",
                        conceptTaught: "crisis-prevention"
                    }
                }
            },
            {
                text: "Take a strategic partial break - reduce but don't stop completely",
                outcome: {
                    text: "You negotiate a middle path: cancel touring but continue light studio work. Do one interview per month, not five per week. See your therapist twice weekly. You maintain some presence while dramatically reducing pressure. It's not perfect rest, but it's manageable. You're healing while staying relevant.",
                    cash: -10000, fame: -5, wellBeing: 25, careerProgress: 5, hype: 10,
                    lesson: {
                        title: "Sustainable Pace Adjustments",
                        explanation: "Complete stops and unsustainable grinding aren't the only options. Significantly reducing workload while maintaining minimal presence can provide needed recovery while limiting professional damage.",
                        realWorldExample: "Several artists have successfully reduced schedules without full disappearances - fewer shows, longer breaks between projects, selective media engagement. This allows recovery while maintaining career presence.",
                        tipForFuture: "Consider whether you need to stop completely or just dramatically slow down. Sustainable reduced pace might provide recovery while keeping you relevant.",
                        conceptTaught: "work-life-balance"
                    }
                }
            }
        ]
    },
    {
        title: "The Intergenerational Collaboration Offer",
        description: "A legendary African artist from your parents' generation - think someone like Angelique Kidjo, Youssou N'Dour, or Salif Keita level - wants to collaborate with you. They see you as the future and want to bridge generations. But they insist on recording in their traditional style, using only organic instruments, and singing partially in languages you don't speak fluently. Your Gen Z fans might not understand it. Your producer thinks it'll hurt your streaming numbers. But this is a once-in-a-lifetime honor from a living legend.",
        conditions: { minFame: 40 },
        once: true,
        choices: [
            {
                text: "Accept the honor exactly as they propose it",
                outcome: {
                    text: "You record the song their way - traditional instrumentation, ancestral languages, no compromises. The collaboration is magical and deeply meaningful. You learn about musical traditions you never knew. Critics call it a masterpiece. But your Gen Z fans are confused, and streaming numbers are modest. You've created art for the ages, not the algorithms.",
                    cash: 2000, fame: 45, wellBeing: 25, careerProgress: 20, hype: 15,
                    lesson: {
                        title: "Artistic Legacy vs Commercial Success",
                        explanation: "Some collaborations are about artistic legacy and cultural preservation rather than commercial success. Working with legends creates historical documentation and artistic growth that transcends streaming metrics.",
                        realWorldExample: "When young artists collaborate with African legends like Angelique Kidjo or Baaba Maal, they often create culturally significant work that doesn't top charts but builds artistic credibility and documents intergenerational knowledge transfer.",
                        tipForFuture: "Not every decision should optimize for streams. Some career moves are about artistic development, legacy building, and cultural contribution that will matter long after streaming platforms are gone.",
                        conceptTaught: "artistic-legacy"
                    }
                }
            },
            {
                text: "Propose modernizing their approach for younger audiences",
                outcome: {
                    text: "You suggest blending their traditional approach with modern production and adding English verses for accessibility. They're disappointed and pull out of the collaboration entirely. 'I wanted someone who respected tradition, not someone trying to change it,' they say. You've lost the opportunity by asking them to compromise their artistic vision.",
                    cash: 0, fame: -10, wellBeing: -15, careerProgress: -5, hype: 0,
                    lesson: {
                        title: "Respecting Elders' Artistic Vision",
                        explanation: "When legends offer collaboration, asking them to change their approach shows disrespect. These artists have proven their value and vision. If you can't work within their framework, decline respectfully rather than trying to change them.",
                        realWorldExample: "Several young artists have lost collaboration opportunities with legends by trying to modernize the elders' artistic approaches. Legends typically have artistic integrity and don't need to chase contemporary trends.",
                        tipForFuture: "When working with established artists, especially cultural elders, enter their world rather than asking them to enter yours. You learn more by adapting than by trying to change them.",
                        conceptTaught: "cultural-respect"
                    }
                }
            },
            {
                text: "Do both versions - their traditional vision plus a remix for my audience",
                outcome: {
                    text: "You propose recording their traditional vision as the album version, then creating a separate 'Gen Z remix' for streaming. They appreciate that you're honoring their vision while also serving your audience. Both versions are released. The traditional version wins awards and critical acclaim, while the remix gets streams. Everyone wins.",
                    cash: 5000, fame: 55, wellBeing: 20, careerProgress: 25, hype: 40,
                    lesson: {
                        title: "Multiple Versions for Multiple Audiences",
                        explanation: "Creating different versions of songs allows you to honor artistic integrity while serving commercial needs. This approach respects all stakeholders - the legend's vision, your artistic development, and your audience's preferences.",
                        realWorldExample: "Many successful collaborations between generations use this approach - an album version that respects artistic intent, plus remixes or alternate versions that serve contemporary audiences and commercial needs.",
                        tipForFuture: "When facing artistic vision conflicts, consider whether multiple versions can satisfy different needs rather than forcing one compromise that satisfies nobody.",
                        conceptTaught: "creative-solutions"
                    }
                }
            }
        ]
    },
    {
        title: "The Stadium Show Catastrophe",
        description: "You booked a 20,000-seat stadium for your biggest show ever. You've sold only 4,000 tickets with two weeks until the concert. The deposit is non-refundable ($50,000), and canceling will destroy your reputation and leave fans who bought tickets angry. Your promoter suggests 'papering the house' - giving away thousands of free tickets to fill seats and avoid embarrassment. Your accountant says you'll lose $80,000 total. This could be career-defining success or devastating failure. What do you do?",
        conditions: { minFame: 50, minCash: 30000, minHype: 35 },
        choices: [
            {
                text: "Paper the house - fill it with free tickets to save face",
                outcome: {
                    text: "You give away 12,000 free tickets to make the venue look full. The show looks successful in photos, media coverage is positive, and paid attendees don't know the venue was mostly free. But you lose $85,000, and word slowly leaks that you couldn't actually sell tickets. Future promoters know you're not as popular as you seemed.",
                    cash: -85000, fame: 20, wellBeing: -25, careerProgress: 5, hype: 15,
                    lesson: {
                        title: "The Cost of Fake Success",
                        explanation: "Papering the house preserves short-term image but industry insiders always find out. The financial cost is real, and the deception damages long-term credibility with promoters, venues, and media who discover the truth.",
                        realWorldExample: "Many artists have papered venues to create illusion of success. Industry professionals track actual ticket sales, and this practice often leads to difficulty booking future shows as promoters lose trust.",
                        tipForFuture: "Honest failure often serves your career better than fabricated success. Industry respect comes from integrity, not from creating illusions that industry insiders will eventually see through.",
                        conceptTaught: "career-honesty"
                    }
                }
            },
            {
                text: "Downsize to a smaller venue and be honest",
                outcome: {
                    text: "You announce you're moving to a 5,000-capacity venue for 'a more intimate experience.' You lose the stadium deposit but sell out the smaller venue. The show is electric. Fans appreciate the intimate setting, and media respect your honest adjustment. You lost money but gained credibility. Sometimes smaller and real beats bigger and empty.",
                    cash: -40000, fame: 30, wellBeing: 10, careerProgress: 15, hype: 35,
                    lesson: {
                        title: "Strategic Downsizing",
                        explanation: "Adjusting to reality rather than maintaining false ambitions often yields better outcomes. A sold-out smaller venue creates better atmosphere, media coverage, and fan experience than a partially empty large venue.",
                        realWorldExample: "Smart artists regularly adjust venue sizes based on actual demand. A sold-out club creates more buzz than a half-empty arena, even though the arena is physically larger.",
                        tipForFuture: "Sold-out shows at your actual fan base size create more career value than struggling to fill oversized venues. Right-size your ambitions to your actual reach.",
                        conceptTaught: "realistic-planning"
                    }
                }
            },
            {
                text: "Aggressive last-minute marketing blitz to sell tickets",
                outcome: {
                    text: "You spend $30,000 on emergency marketing - radio ads, influencer promotions, social media blitz. You sell 6,000 more tickets, reaching 10,000 total. The show happens to a half-full stadium, which looks bad but isn't completely empty. You've lost $60,000 total, but you fulfilled your commitment and some fans had a great time. Lesson learned about overambitious booking.",
                    cash: -60000, fame: 15, wellBeing: -15, careerProgress: 8, hype: 20,
                    lesson: {
                        title: "Expensive Lessons in Audience Sizing",
                        explanation: "Sometimes you pay dearly to learn your actual market size. This expensive lesson will make you more careful about future bookings and more realistic about your current reach.",
                        realWorldExample: "Many artists have had to learn the hard way that their perceived fame doesn't match their actual ticket-selling ability. These expensive lessons often lead to more sustainable touring strategies going forward.",
                        tipForFuture: "Build venue size gradually. Book venues you're certain you can sell out, then scale up slowly. Underselling and upgrading is better than overselling and embarrassing yourself.",
                        conceptTaught: "market-awareness"
                    }
                }
            }
        ]
    },

    // --- HIGH-FAME SCENARIOS (60-100 Fame) ---
    // These scenarios provide endgame variety for established artists
    {
        title: "The Presidential State Dinner Invitation",
        description: "You've received a formal invitation to perform at a presidential state dinner hosting foreign dignitaries. It's a 30-minute acoustic set at the presidential palace. The honor is immense, but the payment is symbolic ($2,000) and the rules are strict - no political statements, no controversial songs, and you must clear your setlist in advance. This is pure prestige.",
        conditions: { minFame: 85, minCareerProgress: 70 },
        choices: [
            {
                text: "Accept - this is a historic honor",
                outcome: {
                    text: "You perform at the presidential palace before heads of state. The photos of you shaking hands with the president circulate globally. Your status as a cultural ambassador is cemented. While the payment is negligible, the prestige opens doors to international opportunities you never imagined.",
                    cash: 2000, fame: 8, wellBeing: 5, careerProgress: 10, hype: 30,
                    lesson: {
                        title: "Prestige as Currency",
                        explanation: "At the highest levels of success, prestige and access become more valuable than direct payment. Being recognized as culturally significant by governments creates opportunities that money can't buy.",
                        realWorldExample: "Artists like Angelique Kidjo and Youssou N'Dour have performed for presidents and at UN events. These appearances position them as cultural ambassadors, leading to UNESCO positions and international recognition beyond music.",
                        tipForFuture: "When you're already established, some opportunities are about legacy and positioning, not money. Choose what elevates your cultural significance.",
                        conceptTaught: "legacy-building"
                    }
                }
            },
            {
                text: "Decline - I don't perform for politicians",
                outcome: {
                    text: "You respectfully decline, citing your preference to keep art separate from politics. Your core fans applaud your principles, though some mainstream media criticize you as ungrateful. You maintain your artistic independence but miss a once-in-a-lifetime prestige moment.",
                    cash: 0, fame: -3, wellBeing: 10, careerProgress: 0, hype: -10,
                    lesson: {
                        title: "Principled Refusals at High Fame",
                        explanation: "Even prestigious opportunities can be declined if they conflict with your values. At your level, you can afford to say no to things that don't align with your artistic identity.",
                        realWorldExample: "Several prominent artists have declined White House invitations based on political disagreements. These refusals often enhance their credibility with their core audience while potentially limiting mainstream appeal.",
                        tipForFuture: "When you're established, protecting your artistic identity matters more than any single opportunity. Your brand is more valuable than any one event.",
                        conceptTaught: "values-vs-opportunity"
                    }
                }
            }
        ]
    },
    {
        title: "The Billionaire's Private Island Performance",
        description: "A tech billionaire offers you $250,000 to perform a 90-minute private concert at their island estate for 50 guests. It's a birthday party. The money is extraordinary, but the performance won't be public - no recording, no posting, complete privacy. Your team says this is 'easy money,' but some fans might see it as 'selling out to the rich.'",
        conditions: { minFame: 70, minCareerProgress: 60 },
        choices: [
            {
                text: "Take the money - $250k for one show is smart business",
                outcome: {
                    text: "You perform for an intimate crowd of wealthy guests at a stunning tropical estate. The pay is incredible, the setting is surreal, and the host treats you like royalty. You bank a quarter million for a single day's work. Word eventually leaks, and reactions are mixed - some fans think you've 'made it,' others grumble about inequality.",
                    cash: 250000, fame: 2, wellBeing: 5, careerProgress: 3, hype: -5,
                    lesson: {
                        title: "Private Corporate vs Public Art",
                        explanation: "At the top level, private performances for wealthy clients pay exponentially more than public shows. These gigs fund your ability to take creative risks elsewhere and provide financial security.",
                        realWorldExample: "Major artists regularly do private corporate shows and billionaire events. Beyoncé, Coldplay, and others have earned millions from private performances. It's a standard revenue stream for established acts.",
                        tipForFuture: "Private bookings are legitimate income streams. As long as they don't define your public image, they provide financial freedom to pursue artistic projects that don't pay as well.",
                        conceptTaught: "diversified-income"
                    }
                }
            },
            {
                text: "Decline - I perform for the people, not for private wealth",
                outcome: {
                    text: "You turn down the quarter million, stating you prefer performing for real fans. Your core audience loves your integrity, and the story becomes a talking point about your values. You miss out on massive money, but your reputation as an artist 'of the people' strengthens.",
                    cash: 0, fame: 5, wellBeing: 15, careerProgress: 0, hype: 15,
                    lesson: {
                        title: "Values Over Wealth",
                        explanation: "Even at the highest levels, some artists prioritize public connection over private wealth. Turning down large sums for private shows can actually enhance your brand if authenticity is core to your identity.",
                        realWorldExample: "Some politically conscious artists refuse private bookings for billionaires and corporations, preferring to maintain their image as artists for everyday people. This stance strengthens their connection with working-class audiences.",
                        tipForFuture: "Your brand is your most valuable asset. If your image depends on being accessible and anti-elite, private shows for billionaires can damage what makes you valuable to your audience.",
                        conceptTaught: "brand-consistency"
                    }
                }
            }
        ]
    },
    {
        title: "The International Music Award Nomination",
        description: "You've been nominated for a major international music award (think Grammy/MOBO/BET equivalent). Attending the ceremony requires flying to another continent, buying expensive formal attire, and covering $15,000 in expenses. Your chances of winning are maybe 20%. But the networking and visibility could be massive.",
        conditions: { minFame: 75, minCareerProgress: 65 },
        choices: [
            {
                text: "Attend - being nominated is an honor itself",
                outcome: {
                    text: "You attend the ceremony in your finest attire. You don't win, but you network with industry legends, take photos that circulate globally, and perform a 2-minute medley on the pre-show. The visibility and connections you make are worth more than the trophy would have been. Months later, a collaboration opportunity emerges from a connection you made that night.",
                    cash: -15000, fame: 6, wellBeing: 0, careerProgress: 8, hype: 25,
                    lesson: {
                        title: "Awards as Networking Platforms",
                        explanation: "Major award ceremonies are as much about networking and visibility as about winning. Simply being in the room with industry power players creates opportunities that can change your career trajectory.",
                        realWorldExample: "Many African artists credit Grammy nominations (even without wins) as career-turning points. The visibility from attending and being nominated opened doors to international collaborations and tours.",
                        tipForFuture: "At your level, invest in face time with industry decision-makers. Being present at elite events matters more than you think for future opportunities.",
                        conceptTaught: "networking-investment"
                    }
                }
            },
            {
                text: "Skip it - not worth $15k to maybe lose",
                outcome: {
                    text: "You watch the ceremony from home as someone else wins your category. You saved the money and avoided the stress, but you also missed a room full of industry titans. Some collaborators you could have met that night will never cross your path. The photos and connections others made that night could have been yours.",
                    cash: 0, fame: 1, wellBeing: 5, careerProgress: -2, hype: -10,
                    lesson: {
                        title: "The Cost of Not Showing Up",
                        explanation: "In the music industry, being present at key moments creates serendipitous opportunities that can't be planned. Missing major events means missing chance encounters that could have changed your trajectory.",
                        realWorldExample: "Many artists regret not attending ceremonies where they could have networked with legends. Random conversations at these events often lead to career-changing collaborations.",
                        tipForFuture: "When you're at this level, invest in being where the industry gatekeepers are. The $15k could return 10x through connections made in one night.",
                        conceptTaught: "opportunity-cost"
                    }
                }
            }
        ]
    },
    {
        title: "The Elite Industry Gala",
        description: "You're invited to an exclusive industry gala where record executives, producers, and A-list artists mingle. Entry requires donating $10,000 to a music education charity. It's expensive, but everyone who matters will be there. Your manager says 'This is where deals happen in side conversations.'",
        conditions: { minFame: 70, minCash: 20000 },
        choices: [
            {
                text: "Attend and network aggressively",
                outcome: {
                    text: "You work the room strategically, exchanging contacts with producers and executives. A legendary producer mentions they're looking for African artists for a new project. You exchange numbers. Two months later, they call. The $10,000 donation becomes the best investment you ever made. Plus, you supported music education.",
                    cash: -10000, fame: 4, wellBeing: -5, careerProgress: 10, hype: 20,
                    lesson: {
                        title: "Strategic Access Investment",
                        explanation: "At the highest levels, access to decision-makers costs money. Elite events with high entry barriers ensure only serious players attend, making them ideal for meaningful connections.",
                        realWorldExample: "Industry galas and exclusive events have launched countless collaborations. Being in rooms with power players creates opportunities that can't happen through normal channels.",
                        tipForFuture: "When you're established, invest in access. The right conversation at an elite event can generate more value than a year of regular networking.",
                        conceptTaught: "access-economics"
                    }
                }
            },
            {
                text: "Skip it - $10k for networking seems excessive",
                outcome: {
                    text: "You skip the gala. A week later, you hear that a major collaboration was born there between two artists at your level. You wonder what conversations you missed. The $10,000 you saved stays in your account, but the potential connections remain unmade.",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: -5,
                    lesson: {
                        title: "Opportunity Windows",
                        explanation: "Some networking opportunities are one-time events. Missing them means missing specific conversations and connections that will never happen again.",
                        realWorldExample: "Industry veterans often talk about key moments - one conversation, one introduction - that changed everything. These moments usually happen at events you have to intentionally attend.",
                        tipForFuture: "Evaluate if saving money now means losing potential future income. Sometimes the most expensive choice is not spending when you should.",
                        conceptTaught: "investment-mindset"
                    }
                }
            }
        ]
    },
    {
        title: "The Documentary Opportunity",
        description: "A major streaming platform wants to make an intimate documentary about your rise to fame. They'll follow you for 3 months, film studio sessions, and interview your family. They're offering $100,000 for exclusive access. The exposure would be massive, but they'll see everything - your struggles, your doubts, your creative process. Are you ready to be that vulnerable?",
        conditions: { minFame: 80, minCareerProgress: 70 },
        choices: [
            {
                text: "Do it - full transparency builds deeper connection",
                outcome: {
                    text: "The documentary crew follows you through triumphs and breakdowns. When it airs, millions watch you at your most vulnerable. Some critics say you're brave, others say you overshared. But your existing fans feel closer to you than ever, and your story inspires aspiring artists worldwide. The $100k is nice, but the legacy impact is priceless.",
                    cash: 100000, fame: 12, wellBeing: -10, careerProgress: 15, hype: 40,
                    lesson: {
                        title: "Vulnerability as Connection",
                        explanation: "At the highest level of fame, showing vulnerability can deepen fan loyalty more than polished perfection. Documentaries that show real struggles create emotional connections that last.",
                        realWorldExample: "Documentaries like 'Homecoming' (Beyoncé) and 'Miss Americana' (Taylor Swift) showed vulnerability that enhanced their brands. Fans appreciate seeing the human behind the success.",
                        tipForFuture: "When you're secure in your success, strategic vulnerability can strengthen your connection with fans and inspire others. Authenticity sells at every level.",
                        conceptTaught: "authentic-branding"
                    }
                }
            },
            {
                text: "Decline - I want to protect my privacy",
                outcome: {
                    text: "You turn down the documentary, preferring to keep your creative process and personal life private. The filmmakers make a documentary about a different artist instead. You maintain your mystique, but you also miss a chance to control your own narrative and inspire others with your story.",
                    cash: 0, fame: -2, wellBeing: 10, careerProgress: 0, hype: -10,
                    lesson: {
                        title: "Mystique vs Transparency Trade-off",
                        explanation: "Some artists build brands on mystique and privacy. This can work, but it means others will control your narrative. Declining to tell your own story leaves space for others to tell it inaccurately.",
                        realWorldExample: "Artists who avoid documentaries and deep profiles often find unauthorized biographies and inaccurate media narratives fill the void. When you don't tell your story, others will - often incorrectly.",
                        tipForFuture: "Consider that declining to share your story doesn't mean no story gets told. It just means you won't control the narrative.",
                        conceptTaught: "narrative-control"
                    }
                }
            }
        ]
    },
    {
        title: "The Cross-Continental Festival Tour",
        description: "A major promoter offers you a 8-week, 15-show tour across Africa, Europe, and North America - all major festivals. The payment is $500,000 total, but it's grueling: different city every 3 days, constant travel, living on tour buses. Your family worries about burnout. Your manager says 'This is the dream - take it while you can.'",
        conditions: { minFame: 75, minCareerProgress: 65, minWellBeing: 50 },
        choices: [
            {
                text: "Do the full tour - this is what I've worked for",
                outcome: {
                    text: "You spend 8 weeks on the road, performing to massive festival crowds across continents. The money is life-changing. You're exhausted to your core, but you've performed for hundreds of thousands of people. Your global profile expands massively. When you finally come home, you sleep for three days straight. Was it worth it? Yes. But you can't do this often.",
                    cash: 500000, fame: 15, wellBeing: -35, careerProgress: 20, hype: 50,
                    lesson: {
                        title: "Peak Career Intensity",
                        explanation: "At the top of your career, opportunities come that require extreme sacrifice. These intense periods can generate wealth and exposure that set you up for years, but they're not sustainable long-term.",
                        realWorldExample: "Many top artists have done brutal touring schedules during their peak years. These tours generate financial security that allows them to be more selective later. But they often cite these periods as nearly breaking them.",
                        tipForFuture: "When peak opportunities come, consider taking them knowing they're temporary. Bank the money and exposure, then recover. Just don't make this your permanent lifestyle.",
                        conceptTaught: "strategic-intensity"
                    }
                }
            },
            {
                text: "Negotiate a shorter tour - cut it to 4 weeks/8 shows",
                outcome: {
                    text: "You negotiate down to 4 weeks and 8 shows for $280,000. The promoter isn't thrilled, but agrees. The tour is still intense, but manageable. You come home tired but not destroyed. Your global reach expands significantly, and you preserved your health. Sometimes half the opportunity is still more than most artists ever get.",
                    cash: 280000, fame: 10, wellBeing: -15, careerProgress: 12, hype: 30,
                    lesson: {
                        title: "Sustainable Success Negotiation",
                        explanation: "You don't have to take every opportunity exactly as offered. Negotiating for sustainability often works, especially when you're in demand. Half of a massive opportunity is still massive.",
                        realWorldExample: "Successful artists learn to negotiate tour lengths and intensity. Many have shortened offered tours to protect their health while still capitalizing on opportunities. Promoters often agree because they want you more than you need them.",
                        tipForFuture: "When you're in demand, you have negotiating power. Use it to protect your wellbeing while still capitalizing on opportunities. Sustainable success beats burnout.",
                        conceptTaught: "power-negotiation"
                    }
                }
            }
        ]
    },
    {
        title: "The Masterclass Teaching Opportunity",
        description: "A prestigious music academy wants you to teach a 6-week masterclass series for emerging artists. Pay is $80,000, but it requires 2 days per week commitment. Some artists at your level see teaching as 'career decline,' others see it as legacy-building. Your former mentor says 'The greatest artists teach. Don't be too proud.'",
        conditions: { minFame: 70, minCareerProgress: 65 },
        choices: [
            {
                text: "Accept - teaching is how I give back",
                outcome: {
                    text: "You spend 6 weeks teaching emerging artists. It's humbling and energizing. Their questions force you to articulate things you do instinctively. Three students go on to have breakthrough moments, crediting your mentorship. You've become part of their origin story. The $80k is good, but the legacy impact feels better.",
                    cash: 80000, fame: 5, wellBeing: 15, careerProgress: 8, hype: 10,
                    lesson: {
                        title: "Teaching as Legacy",
                        explanation: "At the highest levels, teaching isn't about needing money - it's about shaping the next generation. Great artists become greater when they mentor others. Your knowledge has value beyond just your own performances.",
                        realWorldExample: "Quincy Jones, Hans Zimmer, and other legends teach masterclasses. This enhances their legacy and ensures their knowledge lives beyond them. Students carry forward their wisdom.",
                        tipForFuture: "When you've achieved success, sharing knowledge elevates you further. Teaching forces you to refine your own understanding and builds goodwill in the industry.",
                        conceptTaught: "legacy-mentorship"
                    }
                }
            },
            {
                text: "Decline - I'm at my peak, this is performing time",
                outcome: {
                    text: "You decline, saying you're focused on your own career right now. The academy understands but is disappointed. You continue performing and creating. Years later, you wonder if you missed a chance to impact the next generation when you had the time and credibility to do so.",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: 0,
                    lesson: {
                        title: "Opportunity Windows for Impact",
                        explanation: "Legacy-building opportunities come at specific moments in your career. Declining them isn't wrong, but recognize they might not come again. Teaching requires credibility you have now but might not always have.",
                        realWorldExample: "Some artists regret not mentoring when they were at their peak credibility. Later in careers, teaching opportunities are still available but carry less weight because students want to learn from artists in their prime.",
                        tipForFuture: "Consider that your time, energy, and credibility are at their peak now. Legacy opportunities taken now have more impact than the same opportunities taken later.",
                        conceptTaught: "timing-awareness"
                    }
                }
            }
        ]
    },
    {
        title: "The Controversial Political Endorsement Request",
        description: "A major political party asks you to publicly endorse their presidential candidate and perform at a rally. They're offering $150,000 and promising your issues (arts funding, youth programs) will be campaign priorities. But endorsing will alienate roughly half your fanbase who oppose this party. Your team is divided on whether it's worth it.",
        conditions: { minFame: 80, minCareerProgress: 70 },
        choices: [
            {
                text: "Endorse - use my platform for issues I believe in",
                outcome: {
                    text: "You publicly endorse the candidate and perform at the rally. Your core political allies celebrate you, but roughly 40% of your fanbase is furious. You lose significant followers on social media. The $150k is immediate, but your streaming numbers drop 15% for months. Your political allies defend you, but your brand is now politically coded. You've used your platform for your beliefs, but it cost you commercial reach.",
                    cash: 150000, fame: -8, wellBeing: -20, careerProgress: 5, hype: -25,
                    lesson: {
                        title: "Political Positioning Trade-offs",
                        explanation: "Political endorsements can advance causes you believe in, but they fundamentally narrow your commercial appeal. At high fame levels, taking political stances means accepting you'll lose some audience to gain deeper connection with those who remain.",
                        realWorldExample: "Artists like John Legend and Common have taken strong political stances. They've gained respect and influence in certain circles but narrowed their commercial appeal. This is a conscious trade-off of broad reach for deep alignment.",
                        tipForFuture: "Political stances are legitimate uses of your platform, but understand they're business decisions too. You're trading some commercial reach for ideological consistency. Make sure the trade is worth it to you.",
                        conceptTaught: "platform-responsibility"
                    }
                }
            },
            {
                text: "Stay neutral - my music is for everyone",
                outcome: {
                    text: "You politely decline, saying you prefer to keep your music separate from politics. Both sides criticize you - one for not standing up for what's right, the other for being cowardly. But your fanbase remains intact. You've maintained commercial neutrality, but some politically engaged fans see you as taking the easy road. Your music remains accessible to everyone, but some question your courage.",
                    cash: 0, fame: -2, wellBeing: 5, careerProgress: 0, hype: -5,
                    lesson: {
                        title: "Neutrality as Strategy",
                        explanation: "Staying politically neutral preserves commercial reach but can be seen as avoiding responsibility. At your level of influence, some people expect you to use your platform for change. Neutrality is a choice too - and it has consequences.",
                        realWorldExample: "Many massive artists (like Taylor Swift early in her career) remained politically neutral to preserve commercial appeal. This worked commercially but drew criticism from those who wanted them to speak out.",
                        tipForFuture: "Neutrality isn't 'no choice' - it's choosing commercial reach over political positioning. Both stances have costs and benefits. Neither is objectively right.",
                        conceptTaught: "strategic-neutrality"
                    }
                }
            }
        ]
    },
    {
        title: "The Spotify Playlist Pitch",
        description: "A playlist curator with 500K followers on Spotify reaches out. They'll add your song to their playlist for $800. Your manager says: 'Playlist placements are how songs blow up now. This could get you 100K streams.' But paying for playlist placement violates Spotify's terms - if caught, your music gets taken down. Other artists say everyone does it and Spotify turns a blind eye.",
        conditions: { minFame: 15, minCash: 1000 },
        choices: [
            {
                text: "Pay for the placement - it's how the game works",
                outcome: {
                    text: "You pay $800 and get added to the playlist. Your streams jump by 50K in the first week. The algorithm picks up the momentum and pushes your song further. You gained visibility, but you're now part of a pay-to-play system. If Spotify ever cracks down, you could lose everything.",
                    cash: -800, fame: 8, wellBeing: -5, careerProgress: 4, hype: 20,
                    lesson: {
                        title: "Playlist Economy Reality",
                        explanation: "Playlist placements drive modern music discovery, but paid placements create an unfair system where money matters more than quality. While common practice, it's risky and perpetuates inequality in music.",
                        realWorldExample: "Many African artists pay for playlist placements to compete with artists backed by major labels. Spotify periodically removes songs and bans curators caught in pay-for-play schemes.",
                        tipForFuture: "Paid placements can boost visibility short-term, but focus on building genuine fan relationships that don't depend on gaming algorithms. Organic growth is more sustainable.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Decline and pitch them your music organically",
                outcome: {
                    text: "You send them your music without payment, hoping they'll add it based on quality. They never respond. Your song doesn't get the playlist boost. You maintained your integrity, but you're competing against artists who paid. The playing field isn't level.",
                    cash: 0, fame: 1, wellBeing: 5, careerProgress: 0, hype: -5,
                    lesson: {
                        title: "The Organic Growth Challenge",
                        explanation: "Playing by the rules feels right, but when competitors pay for advantages, organic growth becomes harder. You're fighting an uphill battle against a pay-to-win system.",
                        realWorldExample: "Artists who refuse to pay for placements often find their music buried under paid promotions. The system rewards those willing to pay, not necessarily those making the best music.",
                        tipForFuture: "If you choose organic growth, invest heavily in direct fan engagement and touring. Build a fanbase that doesn't depend on playlist algorithms.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Report them to Spotify for violating terms",
                outcome: {
                    text: "You report the curator to Spotify. A month later, the playlist gets taken down and the curator banned. Other curators hear about it and blacklist you. You've been labeled a snitch. Your moral stand has consequences - now legitimate curators won't work with you either. The industry remembers.",
                    cash: 0, fame: -5, wellBeing: -10, careerProgress: -3, hype: -15,
                    lesson: {
                        title: "The Whistleblower Cost",
                        explanation: "Reporting industry corruption can have severe career consequences. The music industry often punishes whistleblowers more than wrongdoers. Fighting the system from inside is risky.",
                        realWorldExample: "Artists who've reported industry corruption often face blacklisting and reduced opportunities. The industry protects its own, even when practices are clearly wrong.",
                        tipForFuture: "Changing corrupt systems often requires collective action, not individual reports. Consider whether you're willing to pay the career cost of being a whistleblower.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Mobile Money Split",
        description: "You performed at a club in Lagos/Kigali and the promoter wants to pay you via mobile money (MTN MoMo/Airtel Money). They're offering ₦50,000 ($60 USD). Problem: the transfer limit is ₦30,000 per day, so they'll send it in two transactions over two days. Your friend warns: 'Once they send the first payment, they might ghost you on the second one. Get cash only.' The promoter insists mobile money is safer and more convenient.",
        conditions: { minFame: 5, maxFame: 35 },
        choices: [
            {
                text: "Accept mobile money - trust the promoter",
                outcome: {
                    text: "They send the first ₦30,000 immediately. You wait for the second payment. Three days pass. They stop responding to your calls. You've been scammed out of ₦20,000 ($24). It's a expensive lesson about payment terms in Africa's cash-based entertainment economy.",
                    cash: 36, fame: 2, wellBeing: -15, careerProgress: 1, hype: 5,
                    lesson: {
                        title: "Mobile Money Payment Risks",
                        explanation: "Mobile money is convenient but creates vulnerabilities when payments are split. Without legal contracts and recourse, trust-based systems favor those in power. Always secure full payment upfront or use escrow.",
                        realWorldExample: "Many African artists have been scammed through split mobile money payments. Promoters exploit transaction limits and lack of legal recourse to underpay performers.",
                        tipForFuture: "For split payments, demand half upfront in cash before performing, then the rest via mobile money. Never perform without securing significant payment first.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Demand full cash payment before performing",
                outcome: {
                    text: "You insist on cash upfront. The promoter is offended, saying you don't trust them. They grudgingly pay in cash. You perform and leave with your full ₦50,000 ($60). Other artists at the venue whisper that you're 'difficult to work with.' But you got paid in full.",
                    cash: 60, fame: 3, wellBeing: 0, careerProgress: 2, hype: 8,
                    lesson: {
                        title: "Payment Security First",
                        explanation: "Protecting your earnings isn't being difficult - it's being professional. Artists who demand proper payment are labeled 'difficult,' but those who don't often get scammed. Choose financial security over reputation.",
                        realWorldExample: "Successful African artists learn quickly: cash before performance or walk away. The ones who don't establish boundaries end up working for free.",
                        tipForFuture: "Your reputation for being 'difficult' fades. Your reputation for being 'easy to scam' sticks forever. Demand respect through payment terms.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "The Instagram Algorithm Change",
        description: "Instagram's algorithm just changed. Your posts that used to get 50K views now get 3K. Engagement is down 94%. A social media consultant offers to 'fix your algorithm' for $1,200/month. They promise to restore your reach through 'strategic posting and engagement tactics.' Other artists say it's a scam. Some say it works.",
        conditions: { minFame: 25, minHype: 20 },
        choices: [
            {
                text: "Hire the social media consultant",
                outcome: {
                    text: "You pay $1,200 and they start 'optimizing' your account. Your reach stays the same. After three months and $3,600 spent, you realize they're just posting at 'optimal times' and using trending hashtags - things you could've Googled for free. You've been sold basic advice dressed as expertise.",
                    cash: -3600, fame: 2, wellBeing: -10, careerProgress: 0, hype: 5,
                    lesson: {
                        title: "Social Media Snake Oil",
                        explanation: "Most 'algorithm experts' sell common knowledge as secret expertise. Algorithm changes hurt everyone equally. There's no magic fix - just consistent, authentic content and adaptation to platform changes.",
                        realWorldExample: "Countless artists waste thousands on social media consultants who deliver basic tactics available in free YouTube tutorials. The 'algorithm secrets' industry thrives on creator desperation.",
                        tipForFuture: "When platforms change algorithms, everyone suffers. Don't pay for 'secrets' - invest time learning free resources and testing strategies yourself.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Adapt your content strategy yourself",
                outcome: {
                    text: "You study successful artists' current strategies, experiment with different content types (Reels, Stories, behind-the-scenes), and post more consistently. After two months, your reach partially recovers to 20K views. It's not what it was, but you've adapted without spending thousands on 'experts.' You learned the platform yourself.",
                    cash: 0, fame: 4, wellBeing: 5, careerProgress: 3, hype: 12,
                    lesson: {
                        title: "Platform Adaptation Skills",
                        explanation: "Learning platform skills yourself is more valuable than paying consultants. Algorithms change constantly - the skill of adapting is more important than any single strategy. Build your own expertise.",
                        realWorldExample: "Artists like Burna Boy and Tems adapted to TikTok and Instagram changes by experimenting themselves. They built internal teams that understand platforms, rather than relying on expensive consultants.",
                        tipForFuture: "Invest time in understanding platforms yourself. The ability to adapt to changes is more valuable than any consultant's 'secrets.' Learn, test, iterate.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Streaming Fraud Scheme",
        description: "A 'digital promoter' offers you 500K Spotify streams for $400. They use bot farms and click farms to inflate your numbers. 'Spotify can't tell the difference,' they claim. The inflated numbers could attract real label attention. But if caught, Spotify deletes your entire catalog and blacklists you permanently. The temptation is real - your competitors are probably doing it.",
        conditions: { minFame: 12, minCash: 500 },
        choices: [
            {
                text: "Buy the fake streams - everyone's doing it",
                outcome: {
                    text: "Your streams jump from 10K to 510K overnight. For two weeks, you feel like you've made it. Then Spotify's fraud detection flags your account. All your music gets removed. Your artist profile is deleted. Years of work erased. You're blacklisted. Your music career on Spotify is over. Trying to game the system cost you everything.",
                    cash: -400, fame: -30, wellBeing: -35, careerProgress: -20, hype: -50,
                    lesson: {
                        title: "Streaming Fraud Consequences",
                        explanation: "Platforms are getting better at detecting fake streams. The short-term boost isn't worth permanent blacklisting. Fake numbers don't translate to real fans, real money, or sustainable careers. The fraud always catches up.",
                        realWorldExample: "Spotify regularly purges millions of fake-streamed songs. Artists lose not just fake streams but their entire catalogs. African artists have lost years of work to fraud detection systems.",
                        tipForFuture: "Never buy fake streams, followers, or engagement. Platforms can detect it, and the punishment is career-ending. Build slowly and authentically.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Reject the offer and build organically",
                outcome: {
                    text: "You turn down the fake streams. Your numbers stay modest but real. You focus on live shows, social media, and genuine fan engagement. Growth is slow - 10K this month, 15K next month. But every stream is real. Every fan actually listened. Your foundation is solid, not fraudulent.",
                    cash: 0, fame: 3, wellBeing: 10, careerProgress: 4, hype: 8,
                    lesson: {
                        title: "Organic Growth Integrity",
                        explanation: "Real streams from real fans are more valuable than fake numbers. Algorithms reward engagement, not just streams. Authentic growth builds sustainable careers and protects you from platform purges.",
                        realWorldExample: "Artists with organic followings survive algorithm changes and platform purges. Fraudulent artists get wiped out overnight. Slow, real growth always beats fast, fake growth.",
                        tipForFuture: "Your numbers might be smaller, but they're real. Real fans buy tickets, merch, and tell friends. Fake streams do nothing but put you at risk.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Data Bundle Dilemma",
        description: "You want to release your music video on YouTube, but internet data is expensive in your market. A professional upload in 1080p costs ₦3,000 ($3.60) in data just to upload. A fan offers to upload it for you using their unlimited WiFi at work. Or you could upload a lower-quality 480p version for ₦800 ($0.96). Quality matters, but so does budget.",
        conditions: { minFame: 8, maxFame: 30, maxCash: 5000 },
        choices: [
            {
                text: "Pay ₦3,000 for full 1080p quality upload",
                outcome: {
                    text: "You buy data and upload the full HD video. It looks professional and sharp. Western audiences with fast internet appreciate the quality. But many African fans on slow mobile networks can't stream it smoothly. The video buffers constantly for your core audience. You optimized for the wrong market.",
                    cash: -3.6, fame: 4, wellBeing: -2, careerProgress: 2, hype: 10,
                    lesson: {
                        title: "Infrastructure-Aware Content Strategy",
                        explanation: "High quality content is meaningless if your audience can't access it. In markets with slow, expensive internet, lower-quality accessible content often performs better than high-quality inaccessible content.",
                        realWorldExample: "Many African artists upload multiple versions: HD for international fans, compressed for local fans. Understanding your audience's internet infrastructure is crucial for reach.",
                        tipForFuture: "Know your audience's technical reality. If they're on mobile data, optimize for that. Accessibility beats quality when infrastructure is a barrier.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Upload 480p - optimize for your audience's reality",
                outcome: {
                    text: "You upload a compressed 480p version. It loads instantly on mobile data. Your local fanbase watches and shares it easily. Your video goes viral locally because everyone can actually watch it. International viewers complain about quality, but you're building where your audience actually is. Smart optimization.",
                    cash: -0.96, fame: 8, wellBeing: 5, careerProgress: 4, hype: 20,
                    lesson: {
                        title: "Accessible Content Strategy",
                        explanation: "Optimizing for your actual audience's conditions is smarter than chasing international standards your local fans can't access. Viral content needs to be accessible first, high-quality second.",
                        realWorldExample: "Many successful African artists prioritize compressed, mobile-friendly content over HD. Their videos go viral locally while HD competitors struggle with reach. Accessibility wins.",
                        tipForFuture: "Design for your audience's reality, not your aspirations. If they're on slow mobile data, give them content that works on slow mobile data.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Let the fan upload it from their work WiFi",
                outcome: {
                    text: "Your fan uploads it in HD using their work's internet. The upload is free, and quality is great. A week later, your video gets flagged and removed - YouTube detected it was uploaded from a corporate network flagged for spam/bots. Your music video is gone. Free solutions often have hidden costs.",
                    cash: 0, fame: -5, wellBeing: -10, careerProgress: -2, hype: -15,
                    lesson: {
                        title: "Free Help Hidden Costs",
                        explanation: "Borrowing resources (WiFi, equipment, software) can backfire when platforms detect unusual activity. Professional infrastructure, even if expensive, protects your content from removal or bans.",
                        realWorldExample: "Videos uploaded from flagged networks or shared accounts often get removed. Artists lose content and opportunities when trying to save money on infrastructure.",
                        tipForFuture: "Some corners shouldn't be cut. Upload infrastructure is one. Pay for legitimate access to protect your content from platform removals.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Language Controversy",
        description: "A Western music blog wants to interview you, but they insist you do the interview in English. Your English is functional but not fluent. You could do it in your native language (Yoruba/Kinyarwanda/Lingala) and they'll translate, but they say 'translations don't capture personality.' Your manager says: 'Just do it in English, even if you struggle. International media wants English.' This feels like erasure.",
        conditions: { minFame: 20, minCareerProgress: 15 },
        choices: [
            {
                text: "Do the interview in English despite discomfort",
                outcome: {
                    text: "You struggle through the interview in English. Your answers are shorter and less nuanced than they'd be in your language. The blog publishes it, but you sound stiff and less charismatic than you actually are. You've accommodated their language barrier, not yours. International readers don't see the real you.",
                    cash: 0, fame: 5, wellBeing: -10, careerProgress: 3, hype: 10,
                    lesson: {
                        title: "Linguistic Accommodation Costs",
                        explanation: "Speaking in a non-native language for interviews often results in lost nuance, personality, and authenticity. The burden of translation shouldn't always fall on non-English speakers when they're the ones being interviewed about their art.",
                        realWorldExample: "Many African artists feel pressure to conduct international interviews in English, resulting in less compelling interviews than they'd give in their native languages. Some media outlets now embrace translation to capture authentic voices.",
                        tipForFuture: "Your voice matters more than the language it's in. Consider whether the opportunity is worth diluting your authentic self. Some outlets will respect translation.",
                        conceptTaught: "cultural-identity"
                    }
                }
            },
            {
                text: "Insist on your language with translation",
                outcome: {
                    text: "You tell them you'll do the interview in your native language or not at all. They initially resist, then agree. The interview is amazing - you're articulate, funny, deep. The translation captures your personality. The article goes viral for its authenticity. Your boldness paid off.",
                    cash: 0, fame: 12, wellBeing: 15, careerProgress: 6, hype: 25,
                    lesson: {
                        title: "Linguistic Sovereignty",
                        explanation: "Insisting on your linguistic comfort can produce better content and demonstrate cultural confidence that audiences respect. Translation technology is good enough that language shouldn't be a barrier to authentic storytelling.",
                        realWorldExample: "Artists like Burna Boy have done major international interviews in Pidgin English with subtitles. The authenticity resonated more than perfect English would have. Cultural confidence is attractive.",
                        tipForFuture: "Your authentic voice in your language is more compelling than a diluted voice in someone else's language. Don't shrink yourself for others' convenience.",
                        conceptTaught: "cultural-identity"
                    }
                }
            }
        ]
    },
    {
        title: "The Studio Time Exchange",
        description: "A producer offers you free studio time if you promote their production services on your social media (30K followers). They want 3 posts tagging their studio. Studio time usually costs $100/hour, and they're offering 8 hours ($800 value). But your followers might see it as selling out or spam. Is the trade worth your audience's trust?",
        conditions: { minFame: 18, minHype: 15, maxCash: 1500 },
        choices: [
            {
                text: "Accept the trade - promote the studio",
                outcome: {
                    text: "You post about the studio three times. Several followers comment 'Are you getting paid for this?' and 'Stop with the ads.' You lose 500 followers who see you as a sellout. The studio time is good, but your audience feels used. You've traded trust for free studio access.",
                    cash: 0, fame: 1, wellBeing: -5, careerProgress: 3, hype: -10,
                    lesson: {
                        title: "Audience Trust as Currency",
                        explanation: "Your audience's trust is valuable. Trading promotional posts for services can make them feel like they're just an advertising platform to you, not a genuine community. Maintain the line between content and ads.",
                        realWorldExample: "Artists who constantly do promotional trades often see engagement and follower counts drop. Audiences value authenticity over promotional partnerships. Protect your credibility carefully.",
                        tipForFuture: "If you do promotional trades, be transparent ('Thanks to [Studio] for the opportunity') and limit frequency. Your audience's trust is worth more than free studio time.",
                        conceptTaught: "Branding and Image"
                    }
                }
            },
            {
                text: "Decline and pay for studio time yourself",
                outcome: {
                    text: "You pay the $100 for studio time you can afford (1 hour instead of 8). Your social media stays authentic and promotional-free. Your audience respects that you don't spam them. Progress is slower, but your relationship with fans is intact. Quality over quantity.",
                    cash: -100, fame: 2, wellBeing: 10, careerProgress: 1, hype: 5,
                    lesson: {
                        title: "Authentic Audience Relationships",
                        explanation: "Slower progress with audience trust beats faster progress with audience resentment. Your followers are people, not advertising impressions to trade. Maintain authenticity even when it costs money.",
                        realWorldExample: "Artists with strong, organic followings often refuse promotional trades to protect their credibility. Their smaller but more engaged audiences drive more sustainable careers than large, resentful audiences.",
                        tipForFuture: "Your audience relationship is a long-term asset. Don't trade it for short-term free services. Invest in maintaining their trust and they'll support you for years.",
                        conceptTaught: "Branding and Image"
                    }
                }
            }
        ]
    },
    {
        title: "The Copyright Strike Misunderstanding",
        description: "You uploaded a cover of a popular song to YouTube. You disclosed it's a cover and don't monetize the video. Still, you get a copyright strike. The original rights holder is demanding $500 or they'll escalate to full channel deletion. Your lawyer says fighting it costs $2,000. Many artists just pay the $500 and move on. But it feels like extortion.",
        conditions: { minFame: 15, minCareerProgress: 10, minFameByDifficulty: { beginner: 10, realistic: 15, hardcore: 22 } },
        choices: [
            {
                text: "Pay the $500 to resolve it quickly",
                outcome: {
                    text: "You pay the $500. The strike is removed. Your channel is safe. But you've learned that even non-monetized covers can result in expensive takedowns. The music industry's rights system doesn't care about your intentions - only about their revenue. It's an expensive lesson.",
                    cash: -500, fame: 0, wellBeing: -8, careerProgress: 1, hype: 0,
                    lesson: {
                        title: "Copyright Reality Check",
                        explanation: "Copyright law favors rights holders, not artists doing covers. Even non-commercial use can trigger expensive takedowns. Understanding copyright is crucial for avoiding costly mistakes. Fair use is narrower than most artists think.",
                        realWorldExample: "Thousands of African artists have faced copyright strikes for covers and samples. The system is automated and aggressive. Not monetizing doesn't protect you - you need explicit permission or licenses.",
                        tipForFuture: "Before uploading covers, get mechanical licenses or use platforms designed for covers (like Harry Fox Agency). Prevention is cheaper than resolution.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Fight it - hire a lawyer",
                outcome: {
                    text: "You hire a lawyer for $2,000 to fight the claim. After 6 months of legal back-and-forth, you win. The strike is removed and you're vindicated. But you spent $2,000 and six months of stress to fight a $500 claim. You won the battle but lost financially. Was it worth it on principle?",
                    cash: -2000, fame: 3, wellBeing: -15, careerProgress: 2, hype: 5,
                    lesson: {
                        title: "Legal Battles Cost-Benefit",
                        explanation: "Winning on principle is satisfying, but legal battles are expensive and time-consuming. Sometimes paying an unfair settlement is financially smarter than fighting. Calculate the true cost of being right.",
                        realWorldExample: "Many artists spend more fighting copyright claims than the claims themselves cost. Legal victories don't always mean financial victories. Choose battles based on long-term strategy, not anger.",
                        tipForFuture: "Assess legal battles rationally: Will winning cost more than losing? Is the principle worth the financial and emotional cost? Sometimes you have to swallow unfair treatment.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Remove the video and accept the strike",
                outcome: {
                    text: "You remove the video and accept the strike on your channel. Your channel is limited for 3 months. You can't upload during that time. The 3 months of silence kills your momentum. Your audience forgets about you. By the time the strike expires, you've lost 5,000 subscribers and your engagement is dead. The 'free' option cost you the most.",
                    cash: 0, fame: -8, wellBeing: -10, careerProgress: -5, hype: -20,
                    lesson: {
                        title: "Copyright Strike Hidden Costs",
                        explanation: "Copyright strikes freeze your ability to grow. The momentum loss and audience attrition during strike periods often costs more than paying the settlement. Sometimes paying is the cheapest option.",
                        realWorldExample: "Artists who accept strikes and can't upload for months often lose their algorithmic momentum permanently. The 'free' option of accepting strikes is often the most expensive long-term choice.",
                        tipForFuture: "Channel strikes have compounding costs through lost momentum and audience. Often, paying to resolve quickly is the smartest financial decision, even if it feels unfair.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            }
        ]
    },
    {
        title: "The TikTok Viral Moment Decision",
        description: "Your song is going viral on TikTok - 50K videos using your audio in 3 days. A TikTok marketing agency offers to 'amplify the trend' for $1,500, promising to get influencers to use your sound and push it to 500K videos. Your friend warns: 'Viral trends are organic. Forcing it kills authenticity.' Do you let it grow naturally or invest to push it further?",
        conditions: { minFame: 18, minHype: 25 },
        choices: [
            {
                text: "Pay $1,500 to amplify the trend",
                outcome: {
                    text: "The agency gets influencers to use your sound, but their videos feel forced and inauthentic. TikTok's algorithm detects the coordinated behavior and suppresses your audio. The trend dies. You spent $1,500 to kill your own organic virality. Forced amplification backfired.",
                    cash: -1500, fame: 2, wellBeing: -10, careerProgress: -2, hype: -15,
                    lesson: {
                        title: "Organic Virality vs Paid Amplification",
                        explanation: "Viral trends thrive on authenticity. When platforms detect coordinated inauthentic behavior, they suppress content. Forcing virality often kills it. Let organic trends breathe and ride the wave naturally.",
                        realWorldExample: "Many artists have killed their own viral TikTok trends by hiring agencies to 'boost' them. TikTok's algorithm is sophisticated enough to detect inauthentic coordination and punishes it.",
                        tipForFuture: "When something goes viral organically, don't interfere. Ride the wave, engage authentically, and let it run its course. Forced amplification usually backfires.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Let it grow organically and engage with creators",
                outcome: {
                    text: "You let the trend grow naturally while engaging with creators using your sound. You comment on videos, duet creators, and show appreciation. The trend grows to 200K videos over two weeks. It's not the 500K promised by the agency, but it's real. Real fans emerge from the trend. Organic wins.",
                    cash: 0, fame: 15, wellBeing: 10, careerProgress: 8, hype: 40,
                    lesson: {
                        title: "Authentic Viral Engagement",
                        explanation: "Organic viral moments create real fans when you engage authentically. Responding to creators, showing appreciation, and participating in your own trend builds community. Authenticity scales better than paid amplification.",
                        realWorldExample: "Artists who engage authentically with their TikTok trends (like Lil Nas X with 'Old Town Road') turn viral moments into sustainable careers. Paid amplification creates numbers, not fans.",
                        tipForFuture: "When you go viral, engage with it genuinely. Comment, duet, show love to creators. Turn virality into community, not just numbers.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Festival No-Show Crisis",
        description: "You're booked for a major festival, but your flight got canceled due to weather. The festival is in 12 hours, 400 miles away. Options: 1) Charter a private car for $800 and arrive exhausted, 2) Skip it and lose your $2,000 performance fee plus damage your reputation, or 3) Beg the festival to reschedule your slot to tomorrow (unlikely). Your management contract might hold you liable for lost festival revenue ($10,000+). What do you do?",
        conditions: { minFame: 35, minCareerProgress: 30 },
        choices: [
            {
                text: "Charter the car for $800 - honor the commitment",
                outcome: {
                    text: "You hire a car and drive through the night. You arrive exhausted, 30 minutes before your slot. The performance is rough - you're tired and your voice is strained. But you showed up. The festival respects your commitment. Your reputation for professionalism is intact, even if the performance wasn't your best.",
                    cash: -800, fame: 8, wellBeing: -20, careerProgress: 5, hype: 10,
                    lesson: {
                        title: "Professionalism Under Crisis",
                        explanation: "Showing up despite obstacles builds your reputation for reliability. Festivals remember artists who honor commitments even when it's difficult. Sometimes a rough performance beats a no-show for career longevity.",
                        realWorldExample: "Artists who consistently show up despite travel disasters build reputations for professionalism that lead to more bookings. Festival organizers value reliability over perfection.",
                        tipForFuture: "When emergencies threaten commitments, exhaust all options to honor them. Your reputation for showing up matters more than one perfect performance.",
                        conceptTaught: "career-professionalism"
                    }
                }
            },
            {
                text: "Skip it - prioritize your wellbeing and safety",
                outcome: {
                    text: "You decide driving through the night isn't safe. You call the festival and explain. They're furious - they can't fill your slot on short notice. You lose your $2,000 fee and they threaten to blacklist you from their festival network. Your agent gets angry calls from other promoters. Was your safety worth the career damage?",
                    cash: -2000, fame: -10, wellBeing: 10, careerProgress: -8, hype: -20,
                    lesson: {
                        title: "The Cost of Cancellations",
                        explanation: "No-shows, even for legitimate reasons, damage your industry reputation significantly. Promoters network closely and blacklist unreliable artists. Sometimes protecting yourself costs you professionally.",
                        realWorldExample: "Artists who cancel shows, even for good reasons, often find future bookings dry up. The live music industry values reliability above almost everything. One cancellation can cost you dozens of future opportunities.",
                        tipForFuture: "Build a reputation for reliability early in your career. When emergencies happen, work harder than you think possible to honor commitments. Industry memory is long.",
                        conceptTaught: "career-professionalism"
                    }
                }
            }
        ]
    },
    {
        title: "The Remix Rights Negotiation",
        description: "A major DJ wants to remix your song and release it commercially. They're offering you 20% of remix revenue. Your lawyer says you should get 50% since it's your song. The DJ argues their production work and fanbase will drive most of the success. Industry standard varies wildly (20-50%). If you push too hard, they might walk away and remix someone else's song instead.",
        conditions: { minFame: 28, minCareerProgress: 20 },
        choices: [
            {
                text: "Accept 20% - secure the collaboration",
                outcome: {
                    text: "You accept 20%. The remix becomes huge - 2 million streams. You earn $1,600 from your 20% share while the DJ earns $6,400. The remix introduces you to their fanbase and you gain 10K new followers. The collaboration was worth more than the money, but watching them earn 4x more from your song stings.",
                    cash: 1600, fame: 12, wellBeing: -5, careerProgress: 8, hype: 30,
                    lesson: {
                        title: "Exposure vs Equity Trade-offs",
                        explanation: "Sometimes accepting less money for exposure and collaboration is strategically smart, especially early in your career. But it establishes a precedent that you undervalue your work. Balance immediate opportunity with long-term respect.",
                        realWorldExample: "Many African artists accept low percentages on remixes with established DJs/producers. Some of these collaborations launch careers, others just leave artists feeling exploited while others profit.",
                        tipForFuture: "Early career, exposure matters. Mid-career, start demanding fair equity. Know when you're building and when you're being underpaid. Adjust your negotiation stance as you grow.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Negotiate for 40% - find middle ground",
                outcome: {
                    text: "You counter with 40%. After some back and forth, you settle at 35%. The DJ agrees but is less enthusiastic. The remix still happens and does well (1 million streams), earning you $2,800 (vs $1,600 at 20%). You stood up for your value and got paid more fairly. Negotiation works when you're willing to find middle ground.",
                    cash: 2800, fame: 10, wellBeing: 10, careerProgress: 10, hype: 25,
                    lesson: {
                        title: "Effective Negotiation Strategy",
                        explanation: "Asking for middle ground shows you value yourself while respecting the other party's contribution. Most negotiations settle between initial positions. Starting high but being flexible gets you better deals than immediately accepting first offers.",
                        realWorldExample: "Successful artists rarely accept first offers. They negotiate toward fair middle ground. The willingness to walk away (but preference to find agreement) gives you negotiating power.",
                        tipForFuture: "Never accept the first offer without negotiating. Propose something higher but be willing to compromise. Most deals settle in the middle. Know your minimum acceptable terms before negotiating.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Demand 50% - it's your song",
                outcome: {
                    text: "You insist on 50/50. The DJ walks away, saying you don't understand the remix market. They remix another artist's song instead. That remix goes platinum while you watch from the sidelines. You held your ground on principle, but you lost a massive opportunity. Your lawyer apologizes - they should have advised 40% as realistic.",
                    cash: 0, fame: 0, wellBeing: -15, careerProgress: -5, hype: 0,
                    lesson: {
                        title: "Overvaluation Risk",
                        explanation: "Knowing your value is important, but overestimating it kills opportunities. In collaborations, both parties need to feel the split is fair. Rigid demands without market awareness leave you with nothing.",
                        realWorldExample: "Artists who demand unrealistic splits often watch opportunities go to more flexible collaborators. Understanding market standards while negotiating upward is smarter than rigid demands.",
                        tipForFuture: "Research market standards before negotiating. Ask for more than the initial offer, but don't price yourself out of opportunities. Flexibility is a negotiation tool, not weakness.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Video Sponsorship Offer",
        description: "A local telecom company wants to sponsor your music video for $5,000. In exchange, their logo must appear for 3 seconds in the video and you must mention them in promotional posts. Your creative team says the logo will ruin the video's aesthetic. But $5,000 could fund a much better video than your $2,000 budget allows. Artistic integrity vs budget upgrade?",
        conditions: { minFame: 22, minCareerProgress: 15, minCash: 3000 },
        choices: [
            {
                text: "Accept the sponsorship - upgrade the video quality",
                outcome: {
                    text: "You accept the $5,000 and include their logo. The video looks incredible - professional cameras, lighting, locations. But comments focus on the sponsorship: 'Sellout!' The amazing quality gets overshadowed by the 3-second logo. Your fans feel like they're watching an ad, not art. The video underperforms despite its quality.",
                    cash: 5000, fame: 5, wellBeing: -8, careerProgress: 4, hype: 10,
                    lesson: {
                        title: "Sponsorship Integration Challenges",
                        explanation: "Visible sponsorships in creative content can undermine artistic credibility and audience connection. Even brief brand appearances can make audiences feel they're being sold to rather than experiencing art.",
                        realWorldExample: "Many artists have struggled with balancing sponsorship money and artistic integrity. Audiences increasingly resent obvious brand integration, especially in music videos meant to be artistic expressions.",
                        tipForFuture: "If you take sponsorships, integrate them subtly and organically. A logo slapped into art feels like a sellout. Consider behind-the-scenes sponsorships that fund content without appearing in it.",
                        conceptTaught: "Branding and Image"
                    }
                }
            },
            {
                text: "Decline - maintain creative control",
                outcome: {
                    text: "You turn down the $5,000 and make a $2,000 video. It's lower budget but creatively pure. Your fans love it for its authenticity and artistic vision. It goes more viral than your previous higher-budget videos because there's no corporate interference. Sometimes constraints force better creativity. Artistic integrity paid off.",
                    cash: -2000, fame: 10, wellBeing: 15, careerProgress: 8, hype: 30,
                    lesson: {
                        title: "Creative Purity Value",
                        explanation: "Audiences often connect more with authentic, lower-budget art than polished corporate content. Creative freedom and authenticity can be more valuable than production budget. Don't underestimate the power of artistic integrity.",
                        realWorldExample: "Some of the most viral African music videos were low-budget but authentic. Videos like 'Ye' by Burna Boy succeeded on creativity and authenticity, not massive budgets.",
                        tipForFuture: "Don't let lack of budget paralyze you. Great ideas beat big budgets. Maintain creative control and work within your means. Authenticity resonates more than polish.",
                        conceptTaught: "Branding and Image"
                    }
                }
            }
        ]
    },
    {
        title: "The Cross-Border Collaboration Complication",
        description: "An artist from another African country wants to collaborate. You're Nigerian, they're Kenyan. Both your fan bases are excited. Problem: international money transfers are expensive and slow. They want to split production costs ($2,000 total) but transferring $1,000 to Kenya costs $180 in fees and takes 5 days via bank. Western Union is faster but costs $220. Crypto transfer costs $15 but neither of you have experience with it.",
        conditions: { minFame: 25, minCash: 2500 },
        choices: [
            {
                text: "Use bank transfer despite fees - traditional method",
                outcome: {
                    text: "You send $1,000 via bank, paying $180 in fees. It takes 5 days. The delay pushes back the recording session, costing momentum. After fees, you've spent $1,180 for your $1,000 share. Cross-border African collaboration is expensive thanks to colonial banking infrastructure that routes money through European banks. Frustrating but familiar.",
                    cash: -1180, fame: 8, wellBeing: -10, careerProgress: 5, hype: 18,
                    lesson: {
                        title: "Intra-African Financial Infrastructure Failures",
                        explanation: "Africa's financial infrastructure still routes most cross-border transactions through Western intermediaries, creating high fees and delays for African-to-African transactions. This colonial legacy makes pan-African collaboration expensive.",
                        realWorldExample: "African artists pay 10-20% in fees for cross-border collaborations that would cost 1-2% in Western markets. This infrastructure barrier limits pan-African creative partnerships and reinforces regional silos.",
                        tipForFuture: "Advocate for better intra-African payment systems. Consider mobile money, cryptocurrency, or in-person cash exchanges for collaborations when possible. The current system is extractive.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Try cryptocurrency - learn new tech",
                outcome: {
                    text: "You both learn to use USDC (stablecoin) and transfer money for just $15 in fees. It arrives in 10 minutes. The low fees and speed blow your minds. You've discovered a way around the extractive banking system. The learning curve was steep, but now you have a tool for all future international collaborations. Technology freed you from legacy systems.",
                    cash: -1015, fame: 9, wellBeing: 5, careerProgress: 8, hype: 20,
                    lesson: {
                        title: "Financial Technology Liberation",
                        explanation: "Cryptocurrency and blockchain technology can bypass exploitative legacy financial systems. While they have learning curves and risks, they offer African creators tools to collaborate globally without excessive fees or intermediaries.",
                        realWorldExample: "Growing numbers of African artists use cryptocurrency for cross-border payments to avoid bank fees. This technological adoption is one way to route around colonial infrastructure that extracts wealth.",
                        tipForFuture: "Invest time learning financial technologies that reduce dependency on extractive systems. Crypto, mobile money, and peer-to-peer platforms can save you thousands over your career.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "The Soundalike Accusation",
        description: "A bigger artist's fans are accusing you of copying their style - similar beat patterns, vocal delivery, even similar ad-libs. The accusations are spreading on social media. Legally, you're fine (you can't copyright a style). But the court of public opinion is harsh. Do you address it, ignore it, or lean into it?",
        conditions: { minFame: 20, minHype: 15 },
        choices: [
            {
                text: "Address it publicly - defend your originality",
                outcome: {
                    text: "You post a statement defending your creativity and explaining your influences. The other artist's fans attack you harder, calling you defensive. You've amplified the controversy. More people now think you copied. Engaging with online controversies rarely works - you've made it worse. The internet remembers your 'defense' as an admission.",
                    cash: 0, fame: -5, wellBeing: -15, careerProgress: -2, hype: -10,
                    lesson: {
                        title: "The Streisand Effect",
                        explanation: "Publicly defending yourself against online accusations often amplifies the controversy. More people learn about the accusation through your defense than would have seen the original claim. Sometimes silence is the best response.",
                        realWorldExample: "Many artists have made soundalike controversies worse by addressing them. The internet rarely rewards defensive explanations. Letting controversies die through silence often works better than feeding them with responses.",
                        tipForFuture: "Most online controversies burn out in 48 hours if ignored. Responding extends their lifespan and legitimizes them. Only address accusations when silence would be interpreted as admission.",
                        conceptTaught: "Branding and Image"
                    }
                }
            },
            {
                text: "Ignore it completely - let your work speak",
                outcome: {
                    text: "You post nothing and keep releasing music. After a week, the controversy fades - people move on to new drama. Your fans defend you without prompting. Six months later, no one remembers the accusation. Your continued output of original work proved the claims wrong better than any statement could have. Silence won.",
                    cash: 0, fame: 4, wellBeing: 10, careerProgress: 5, hype: 8,
                    lesson: {
                        title: "Strategic Silence",
                        explanation: "Not every accusation deserves a response. Letting your body of work speak for itself is often more effective than defending yourself. Consistency over time beats any single explanation.",
                        realWorldExample: "Most successful artists ignore soundalike accusations and let their evolving artistry prove their originality. The ones who engage defensively often damage themselves more than the accusations did.",
                        tipForFuture: "When accused of copying, respond by creating more original work, not by writing defensive statements. Let your output be your defense.",
                        conceptTaught: "Branding and Image"
                    }
                }
            },
            {
                text: "Lean into it with humor - make it your brand",
                outcome: {
                    text: "You post: 'If I'm copying [Artist], I'm doing a great job because my version is also fire 🔥' The humor diffuses the tension. Both fanbases laugh. The other artist even reshares it with laughing emojis. What could have been beef becomes a funny moment. Sometimes acknowledging criticism with confidence disarms it. Humor and confidence beat defensiveness.",
                    cash: 0, fame: 8, wellBeing: 10, careerProgress: 6, hype: 20,
                    lesson: {
                        title: "Confidence Diffuses Criticism",
                        explanation: "Responding to criticism with humor and confidence shows you're comfortable with yourself. It disarms accusers and makes you likable. Self-assuredness is more attractive than defensiveness.",
                        realWorldExample: "Artists who respond to criticism with humor and confidence often turn controversies into positive moments. Lil Nas X mastered this strategy, turning potential criticism into viral marketing through confident, humorous responses.",
                        tipForFuture: "When criticized, consider whether humor and confidence could work better than silence or defense. Owning criticism with personality can flip it to your advantage.",
                        conceptTaught: "Branding and Image"
                    }
                }
            }
        ]
    },
    {
        title: "The Equipment Financing Trap",
        description: "A music store offers you a 'rent-to-own' deal on production equipment (laptop, interface, mic) worth $3,000. Monthly payments of $200 for 24 months ($4,800 total - 60% markup). You need the equipment now but don't have $3,000 cash. Alternatively, you could buy used equipment for $1,500, but it's riskier and might break down. Or save for 8 months and buy new with cash.",
        conditions: { minFame: 12, maxCash: 2000 },
        choices: [
            {
                text: "Take the rent-to-own deal - start producing now",
                outcome: {
                    text: "You sign the contract and get the equipment immediately. You start producing music right away. But the $200 monthly payments are crushing. For two years, a huge chunk of every performance payment goes to this debt. You end up paying $4,800 for $3,000 of equipment - a $1,800 poverty tax. The convenience cost you dearly.",
                    cash: -200, fame: 5, wellBeing: -10, careerProgress: 6, hype: 10,
                    lesson: {
                        title: "The Poverty Tax",
                        explanation: "Rent-to-own and financing schemes marketed to low-income people charge massive markups (30-100%). Not having capital upfront forces you to pay far more over time. This is how poverty perpetuates itself - you pay more for everything.",
                        realWorldExample: "Many African artists get trapped in equipment financing deals that cost 150-200% of retail price. The inability to pay cash upfront means paying massive premiums that set them further behind financially.",
                        tipForFuture: "Avoid rent-to-own and high-interest financing whenever possible. The total cost is almost always predatory. Save, buy used, or find alternatives before accepting these terms.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Buy used equipment for $1,500 - accept risk",
                outcome: {
                    text: "You buy used gear. It works well for 6 months, then the mic breaks. You spend another $400 on repairs/replacement. Your total is now $1,900 - still less than new, but the downtime when equipment broke cost you recording opportunities. Used gear is cheaper but riskier. You've learned the hidden costs of 'cheap' options.",
                    cash: -1900, fame: 4, wellBeing: -5, careerProgress: 4, hype: 8,
                    lesson: {
                        title: "Used Equipment Risk Calculation",
                        explanation: "Used equipment costs less upfront but carries breakdown risks. When equipment fails, you lose both money (repairs) and time (missed opportunities). Balance initial savings against reliability needs for your workflow.",
                        realWorldExample: "Many artists start with used equipment to save money. Some get lucky with reliable gear; others spend almost as much on repairs as new equipment would have cost. Factor in risk and opportunity cost.",
                        tipForFuture: "Buy used equipment for non-critical items, new equipment for items you depend on daily. A used MIDI keyboard is fine; your main recording interface should be reliable. Prioritize reliability for essentials.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Wait 8 months, save, buy new with cash",
                outcome: {
                    text: "You wait and save $400/month. After 8 months, you buy the equipment outright for $3,000 cash. No debt, no interest. But during those 8 months, you couldn't produce much. You lost momentum and opportunities. You saved money but lost time - time you can't get back. The waiting game has its own costs.",
                    cash: -3000, fame: 2, wellBeing: 5, careerProgress: 2, hype: -5,
                    lesson: {
                        title: "Opportunity Cost of Waiting",
                        explanation: "Delaying investments to avoid debt saves money but costs time and opportunities. In creative careers where momentum matters, waiting can mean missed windows. Balance financial prudence with strategic timing.",
                        realWorldExample: "Some artists wait too long to invest in essential equipment, missing their momentum windows. Others finance rashly and get trapped in debt. The right balance depends on your specific opportunity landscape.",
                        tipForFuture: "Evaluate whether waiting to save money costs you more in lost opportunities than financing would cost in interest. Sometimes strategic debt is worth it; sometimes waiting is smarter. Calculate both sides.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },

    // --- BATCH 2: NEW SCENARIOS (10 scenarios) ---
    {
        title: "The Radio Payola Reality",
        description: "A major radio station DJ offers to put your song on rotation for ₦150,000 ($180). They play songs 5 times daily, reaching 2 million listeners. 'Everyone pays,' they say. 'How do you think songs get airplay?' Your distributor confirms this is standard practice in your market. But it's technically illegal and morally questionable. Pay-for-play or stay off the radio?",
        conditions: { minFame: 20, minCash: 250, minFameByDifficulty: { beginner: 15, realistic: 20, hardcore: 28 } },
        choices: [
            {
                text: "Pay the ₦150,000 for radio rotation",
                outcome: {
                    text: "You pay for rotation. Your song plays 5 times daily for a month. You gain 15K new followers and 100K streams. The exposure is real. But you've normalized corruption. You're now part of a system where only artists who can pay get heard. Quality doesn't matter - only money.",
                    cash: -180, fame: 18, wellBeing: -12, careerProgress: 10, hype: 35,
                    lesson: {
                        title: "Payola Economics",
                        explanation: "Pay-for-play radio is common in many markets but creates an unfair system where financial resources matter more than artistic merit. It's effective for exposure but perpetuates corruption and inequality.",
                        realWorldExample: "Radio payola is standard practice across Africa. Major artists pay heavily for rotation. Independent artists without money struggle to get airplay regardless of quality. The system rewards wealth, not talent.",
                        tipForFuture: "Payola works for exposure but reinforces corrupt systems. If you pay, know you're buying access to an unfair system. Consider whether digital platforms offer better ROI than corrupt radio.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Refuse to pay - pursue digital-first strategy",
                outcome: {
                    text: "You refuse to pay and focus on digital platforms instead. Your song never gets radio play. Older audiences who listen to radio don't discover you. But your Spotify/YouTube/TikTok numbers grow organically. You're building a younger, digital-native fanbase. Different strategy, different audience.",
                    cash: 0, fame: 8, wellBeing: 10, careerProgress: 6, hype: 15,
                    lesson: {
                        title: "Digital-First Artist Strategy",
                        explanation: "Skipping corrupt traditional media to focus on digital platforms is viable in 2025. You'll miss older radio audiences but reach younger digital audiences. Different distribution strategies reach different demographics.",
                        realWorldExample: "Many successful African artists bypass radio entirely, building careers on YouTube, TikTok, and streaming platforms. Artists like Rema and Tems found success digitally before radio played them.",
                        tipForFuture: "Radio isn't mandatory anymore. If payola feels wrong or too expensive, invest in digital strategy. You can build sustainable careers without traditional radio.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Report the DJ to media regulatory authorities",
                outcome: {
                    text: "You report the DJ. Nothing happens - the regulatory body is underfunded and corrupt. Word spreads that you reported someone. Now every radio DJ in your market blacklists you. You've been labeled a troublemaker. Your stand against corruption killed your traditional media access completely. Whistleblowing backfired.",
                    cash: 0, fame: -15, wellBeing: -20, careerProgress: -10, hype: -25,
                    lesson: {
                        title: "Whistleblowing in Corrupt Systems",
                        explanation: "Reporting corruption to authorities in corrupt systems rarely works and often backfires. The industry protects its own and punishes outsiders who report wrongdoing. Individual action can't fix systemic corruption.",
                        realWorldExample: "Artists who've reported media corruption in African markets typically face industry-wide blacklisting while the corrupt figures continue business as usual. The system punishes whistleblowers more than wrongdoers.",
                        tipForFuture: "Fighting systemic corruption requires collective action or policy change, not individual reports. Individual whistleblowing often just hurts you while changing nothing.",
                        conceptTaught: "crisis-management"
                    }
                }
            }
        ]
    },
    {
        title: "The Feature Verse Pricing Dilemma",
        description: "An established artist offers to feature on your song for $3,000. Their name would boost your credibility and expose you to their 200K followers. But $3,000 is nearly your entire marketing budget. Alternative: collaborate with three smaller artists for $500 each. One big feature or multiple smaller collaborations?",
        conditions: { minFame: 18, minCash: 3500, minCareerProgress: 12 },
        choices: [
            {
                text: "Pay $3,000 for the big-name feature",
                outcome: {
                    text: "You pay for the feature. The song drops and gets attention from their fanbase. You gain 12K followers. The collaboration legitimizes you in the industry. But you spent your entire marketing budget on one feature. You have no money left to promote the song. Good feature, but no promotional plan.",
                    cash: -3000, fame: 15, wellBeing: -5, careerProgress: 12, hype: 35,
                    lesson: {
                        title: "Feature Cost-Benefit Analysis",
                        explanation: "Big features provide credibility and audience access but consume resources that could fund broader campaigns. Balance the value of one big collaboration against multiple smaller initiatives. Don't spend everything on one bet.",
                        realWorldExample: "Many artists spend their entire budgets on expensive features, then can't afford to promote the resulting song. The feature helps, but without promotion, the song doesn't reach its potential.",
                        tipForFuture: "Never spend your entire budget on one element. Reserve resources for promotion. A smaller feature with promotion often outperforms a bigger feature with no promotional push.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Collaborate with three smaller artists for $500 each",
                outcome: {
                    text: "You work with three smaller artists, creating three different songs. Each brings 20-40K followers. Combined, you gain 15K new followers across three releases. You've diversified your collaborations, built multiple relationships, and still have $1,500 left for promotion. Strategic networking beats one big bet.",
                    cash: -1500, fame: 12, wellBeing: 10, careerProgress: 15, hype: 30,
                    lesson: {
                        title: "Diversified Collaboration Strategy",
                        explanation: "Multiple smaller collaborations can deliver comparable results to one expensive feature while building broader networks and keeping resources for other needs. Diversification reduces risk and builds more relationships.",
                        realWorldExample: "Many successful artists built careers through numerous smaller collaborations rather than expensive features. Wizkid collaborated widely with peers before landing big international features.",
                        tipForFuture: "Especially early in your career, multiple peer collaborations build more sustainable networks than expensive features. Save big features for when you have marketing budgets to match.",
                        conceptTaught: "networking-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Piracy Platform Dilemma",
        description: "Your music is being pirated on a popular local download site. They're offering free downloads of your songs - you get nothing while they profit from ads. The site gets 500K visitors monthly. You could: 1) DMCA takedown (costs $300, takes 2 months), 2) Negotiate with them to split ad revenue, or 3) Ignore it and focus on legitimate platforms. What's the move?",
        conditions: { minFame: 25, minCareerProgress: 18 },
        choices: [
            {
                text: "Pay $300 for DMCA takedown",
                outcome: {
                    text: "You hire a lawyer to issue DMCA notices. After 2 months and $300, your music is removed. Three weeks later, it's back up on a different domain. You've learned that piracy is a whack-a-mole game you can't win. You spent $300 and two months to solve nothing permanently. Fighting piracy is expensive and futile.",
                    cash: -300, fame: 0, wellBeing: -15, careerProgress: -2, hype: -5,
                    lesson: {
                        title: "The Piracy Whack-A-Mole",
                        explanation: "Piracy takedowns are expensive, time-consuming, and temporary. Pirates move domains faster than you can take them down. Fighting piracy directly is usually a losing battle that wastes resources better spent elsewhere.",
                        realWorldExample: "Countless artists have spent thousands fighting piracy sites that simply re-upload or change domains. The economics favor the pirates. Very few artists successfully eliminate piracy through legal action.",
                        tipForFuture: "Don't waste resources fighting piracy directly. Focus on making legitimate platforms more convenient and valuable than piracy. Accessibility beats enforcement.",
                        conceptTaught: "piracy-reality"
                    }
                }
            },
            {
                text: "Negotiate ad revenue split with the piracy site",
                outcome: {
                    text: "You reach out and negotiate a 50/50 ad revenue split. They agree. You start earning $200/month from their piracy of your music. You've turned piracy into a revenue stream. Unconventional, but pragmatic. If you can't stop them, profit with them. The music industry is changing.",
                    cash: 200, fame: 5, wellBeing: 5, careerProgress: 8, hype: 10,
                    lesson: {
                        title: "Pragmatic Piracy Response",
                        explanation: "If you can't stop piracy, monetizing it is pragmatic. Some artists negotiate with piracy platforms to share revenue rather than fighting expensive legal battles. It's not ideal, but it's better than nothing.",
                        realWorldExample: "Some African artists have successfully negotiated revenue shares with piracy platforms. It legitimizes the platforms somewhat but puts money in artists' pockets that they'd otherwise never see.",
                        tipForFuture: "Piracy exists whether you like it or not. Sometimes working with pirates to monetize your content is smarter than fighting them. Choose pragmatism over principle when resources are limited.",
                        conceptTaught: "piracy-reality"
                    }
                }
            },
            {
                text: "Ignore piracy - focus on streaming and live shows",
                outcome: {
                    text: "You ignore the piracy site and focus on making your music easily accessible on legitimate platforms. You invest in Spotify, YouTube, and live performances. People who want to support you use legitimate platforms. Pirates were never going to pay anyway. You're building where the revenue actually is.",
                    cash: 0, fame: 8, wellBeing: 10, careerProgress: 10, hype: 15,
                    lesson: {
                        title: "Piracy Acceptance Strategy",
                        explanation: "Accepting that piracy exists and focusing on legitimate revenue streams is often the most effective strategy. People who pirate were unlikely to pay anyway. Build your business where the willing customers are.",
                        realWorldExample: "Most successful African artists don't fight piracy aggressively. They accept it as reality and focus on streaming, YouTube ads, and live performances where actual revenue exists. Fighting piracy wastes time and money.",
                        tipForFuture: "Piracy is annoying but largely unavoidable. Accept it and focus on revenue streams you can control: streaming, live shows, merch, brand deals. Don't waste resources on unwinnable battles.",
                        conceptTaught: "piracy-reality"
                    }
                }
            }
        ]
    },
    {
        title: "The Mental Health Crisis Point",
        description: "You've been grinding hard - 6 shows in 8 days, constant social media posting, studio sessions until 3 AM. You're exhausted and developing anxiety. Your therapist says you need to take 2 weeks off completely. But you have shows booked ($4,000 income) and your momentum is building. Taking time off could kill your momentum. Your health or your career?",
        conditions: { minFame: 30, minCareerProgress: 25, maxWellBeing: 35, minFameByDifficulty: { beginner: 22, realistic: 30, hardcore: 38 } },
        choices: [
            {
                text: "Cancel everything - prioritize mental health",
                outcome: {
                    text: "You cancel shows and social media. You rest for 2 weeks. Your anxiety decreases and you feel human again. But you lost $4,000 in show fees and some promoters are frustrated. When you return, you've lost some momentum. But you're healthier and sustainable. You chose long-term health over short-term gains.",
                    cash: -4000, fame: -5, wellBeing: 40, careerProgress: -3, hype: -15,
                    lesson: {
                        title: "Mental Health Investment",
                        explanation: "Burnout prevention is cheaper than burnout recovery. Taking breaks feels like losing momentum, but burning out completely ends careers. Your mental health is infrastructure - maintain it or everything collapses.",
                        realWorldExample: "Many artists who ignored mental health warnings ended up with multi-month or permanent breakdowns. Artists like Kid Cudi and Kendrick Lamar have publicly taken mental health breaks, returning stronger.",
                        tipForFuture: "Schedule rest before you collapse. Career longevity requires sustainable practices. Burning bright for two years then collapsing beats burning steadily for a decade.",
                        conceptTaught: "career-sustainability"
                    }
                }
            },
            {
                text: "Push through - maintain momentum",
                outcome: {
                    text: "You ignore your therapist and keep grinding. You complete the shows and earn $4,000. Two weeks later, you have a breakdown during a performance - panic attack on stage. You cancel the next month of shows. You're forced to take 6 weeks off for recovery. Pushing through short-term cost you far more long-term. Your body shut you down.",
                    cash: 4000, fame: -12, wellBeing: -40, careerProgress: -15, hype: -35,
                    lesson: {
                        title: "Burnout Consequences",
                        explanation: "Ignoring mental health warnings doesn't save your career - it delays the inevitable collapse and makes it worse. Your body will force you to rest eventually. Choosing when to rest is smarter than being forced to rest.",
                        realWorldExample: "Numerous artists have had public mental health crises from ignoring warning signs. The resulting forced breaks are always longer and more damaging than preventive breaks would have been.",
                        tipForFuture: "Mental health warnings are serious. If a professional tells you to rest, rest. Ignoring it won't save your career - it will make the eventual collapse worse and longer.",
                        conceptTaught: "career-sustainability"
                    }
                }
            },
            {
                text: "Compromise - take 1 week off, keep crucial shows",
                outcome: {
                    text: "You take 1 week off and reschedule what you can. You keep two of the biggest shows ($2,500) and cancel the smaller ones. You rest partially and complete some commitments. It's not perfect - you're still tired and you lost some income. But you've balanced health and career. Neither ideal, but both intact.",
                    cash: -1500, fame: 0, wellBeing: 15, careerProgress: 3, hype: -5,
                    lesson: {
                        title: "Sustainable Compromise",
                        explanation: "Sometimes full rest isn't possible, but partial rest is better than nothing. Finding middle ground between burnout and momentum loss is a valuable skill. Perfect solutions are rare - workable compromises are realistic.",
                        realWorldExample: "Many working artists manage mental health through strategic partial breaks - canceling smaller commitments while keeping major ones, reducing social media while maintaining key performances.",
                        tipForFuture: "When you can't fully rest, strategic partial rest is better than nothing. Prioritize the commitments that matter most and be willing to let smaller things go. Sustainability requires flexibility.",
                        conceptTaught: "career-sustainability"
                    }
                }
            }
        ]
    },
    {
        title: "The Sample Clearance Nightmare",
        description: "You released a song sampling a classic Afrobeat track. The song went viral - 800K streams. Now the original artist's estate wants $15,000 for the uncleared sample or they'll sue and take all your royalties ($6,000 so far). Your lawyer says fighting costs $20,000. You didn't know you needed clearance. Ignorance of copyright law is expensive.",
        conditions: { minFame: 28, minCareerProgress: 20, minCash: 2000 },
        choices: [
            {
                text: "Pay the $15,000 settlement",
                outcome: {
                    text: "You borrow money and pay $15,000 for retroactive clearance. You keep your $6,000 in royalties and the song stays up. But you're $9,000 in debt. The viral song that should have been your breakthrough became a financial disaster. You've learned an expensive lesson about sample clearance.",
                    cash: -15000, fame: 5, wellBeing: -20, careerProgress: 2, hype: 10,
                    lesson: {
                        title: "Sample Clearance Reality",
                        explanation: "All samples require clearance before release, even small ones. Clearing samples after a song goes viral costs 10-100x more than clearing upfront. Always clear samples before release or don't sample at all.",
                        realWorldExample: "Countless artists have lost viral songs or paid massive settlements for uncleared samples. The Verve lost all 'Bitter Sweet Symphony' royalties for decades over an uncleared sample. Sample clearance is not optional.",
                        tipForFuture: "Never release music with uncleared samples. Clear samples before release or use royalty-free loops. One uncleared sample can destroy your profits and career.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Take down the song - avoid legal costs",
                outcome: {
                    text: "You remove the song from all platforms. The viral moment dies immediately. You keep your $6,000 in royalties earned so far, but you've lost future earnings. Your fans are confused why your biggest hit disappeared. The momentum is gone. You saved legal costs but lost your breakthrough moment.",
                    cash: 6000, fame: -8, wellBeing: -15, careerProgress: -10, hype: -40,
                    lesson: {
                        title: "Viral Momentum Lost",
                        explanation: "Removing viral content stops your momentum completely. The fans who discovered you through that song lose access to it. Taking down hits to avoid legal costs saves money but kills careers. Sample clearance should happen before release, not after virality.",
                        realWorldExample: "Artists who remove viral songs for legal reasons rarely recover the momentum. The algorithmic boost disappears, fans lose interest, and the opportunity is gone. Prevention through clearance is always better than post-viral takedown.",
                        tipForFuture: "Never put yourself in this position. Clear samples before release. If you can't afford clearance, don't sample. Using uncleared samples is gambling your entire career on not getting caught.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            }
        ]
    },
    {
        title: "The Brand Deal Values Conflict",
        description: "A major alcohol brand offers you $25,000 to be their brand ambassador for a year. You'd need to post about their products monthly and appear at their events. Your music has a young fanbase (15-25 years old). Your family has a history of alcoholism. The money would change your life, but promoting alcohol to young fans conflicts with your values. Money or principles?",
        conditions: { minFame: 35, minCareerProgress: 28, minFameByDifficulty: { beginner: 28, realistic: 35, hardcore: 42 } },
        choices: [
            {
                text: "Accept the $25,000 - secure your financial future",
                outcome: {
                    text: "You take the money. You post about their alcohol products. Some fans unfollow, saying you've sold out and are promoting harmful products to young people. Your family is disappointed. The money helps, but you feel like you've compromised yourself. You chose financial security over personal values. The money doesn't feel as good as you hoped.",
                    cash: 25000, fame: 8, wellBeing: -25, careerProgress: 10, hype: 15,
                    lesson: {
                        title: "Values vs Money Trade-offs",
                        explanation: "Large paydays that conflict with your values create long-term discomfort and reputational damage. Money solves immediate problems but doesn't resolve the internal conflict of compromising principles. Some deals cost more than they pay.",
                        realWorldExample: "Many artists regret brand deals that conflicted with their values. The money is temporary; the reputational damage and internal conflict can last careers. Artists like Macklemore have publicly refused alcohol sponsorships despite financial pressure.",
                        tipForFuture: "Large paydays are tempting, but deals that conflict with core values create lasting damage to your brand and mental health. Know your boundaries before you're offered money to cross them.",
                        conceptTaught: "Branding and Image"
                    }
                }
            },
            {
                text: "Decline - protect your values and brand",
                outcome: {
                    text: "You turn down $25,000. You publicly explain that you can't promote alcohol to young fans given your family history. Your honesty resonates - your fanbase respects you more. Other brands notice. Three months later, a sports brand offers you $18,000 for a deal that aligns with your values. Integrity attracted better opportunities.",
                    cash: 0, fame: 12, wellBeing: 20, careerProgress: 15, hype: 25,
                    lesson: {
                        title: "Values-Based Brand Building",
                        explanation: "Turning down money that conflicts with your values strengthens your brand authenticity. Audiences respect artists with consistent principles. Value-aligned opportunities often follow when you demonstrate integrity.",
                        realWorldExample: "Artists who've publicly declined deals that conflict with their values often attract better, value-aligned opportunities. Authenticity is a brand asset that attracts conscious brands willing to pay for genuine partnerships.",
                        tipForFuture: "Your values are part of your brand. Protecting them attracts opportunities that fit who you are. Short-term money isn't worth long-term brand damage or internal conflict.",
                        conceptTaught: "Branding and Image"
                    }
                }
            }
        ]
    },
    {
        title: "The Influencer Promo Scam",
        description: "An 'Instagram influencer' with 800K followers offers to promote your music for $1,500. They claim they'll create 5 posts featuring your song. You check their account - high follower count but very low engagement (20-50 likes per post). Their followers might be fake. But 800K is 800K. Is it worth the risk?",
        conditions: { minFame: 16, minCash: 2000 },
        choices: [
            {
                text: "Pay $1,500 - hope the reach is real",
                outcome: {
                    text: "You pay $1,500. They post about your music 5 times. Each post gets 30-40 likes from bot accounts. Your music gets zero new streams or followers. The 800K followers were fake. You've been scammed. You spent $1,500 on promotion that reached virtually no one. The low engagement should have warned you.",
                    cash: -1500, fame: 0, wellBeing: -20, careerProgress: -2, hype: 0,
                    lesson: {
                        title: "Fake Influencer Detection",
                        explanation: "High follower counts mean nothing without engagement. Check likes, comments, and engagement rates before paying influencers. Engagement rate below 1-2% suggests fake followers. Bots don't stream your music or buy tickets.",
                        realWorldExample: "The fake influencer industry is massive. Accounts with hundreds of thousands of fake followers sell promotions to artists who don't check engagement rates. Thousands of artists lose money to fake influencer promotions monthly.",
                        tipForFuture: "Always calculate engagement rate (likes+comments/followers) before paying influencers. Under 1% is suspicious, under 0.1% is definitely fake. Small accounts with real engagement beat large accounts with fake followers.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Decline - research their engagement first",
                outcome: {
                    text: "You calculate their engagement rate: 40 likes / 800K followers = 0.005% engagement. That's fake. You decline and search for smaller influencers with real engagement. You find one with 50K followers but 3-5% engagement (1,500-2,500 likes per post). You pay them $300 and get 2K new streams and 500 followers. Real engagement beats fake followers.",
                    cash: -300, fame: 5, wellBeing: 10, careerProgress: 6, hype: 12,
                    lesson: {
                        title: "Real Engagement Value",
                        explanation: "Small audiences with high engagement deliver better results than large fake audiences. Authenticity and real fans beat numbers on paper. Always prioritize engagement rate over follower count.",
                        realWorldExample: "Micro-influencers (10K-100K followers) with real engagement consistently outperform fake mega-influencers. Smart brands and artists prioritize engagement quality over follower quantity.",
                        tipForFuture: "Work with smaller influencers who have real, engaged audiences. Their recommendations actually influence behavior. Fake followers are worthless no matter how many there are.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The International Tour Visa Problem",
        description: "You're invited to perform at a festival in Europe - $10,000 performance fee. But getting a visa costs $400, requires extensive documentation, and has a 50% rejection rate for artists from your country. If rejected, you lose the $400 and the show. Plus flights ($1,200) must be booked before visa approval or prices double. Risk $1,600 on a 50/50 visa gamble?",
        conditions: { minFame: 32, minCareerProgress: 25, minCash: 3000 },
        choices: [
            {
                text: "Apply for visa and book flight - take the risk",
                outcome: {
                    text: "You pay $400 for the visa application and book the $1,200 flight. Three weeks later: visa rejected, no explanation given. You've lost $1,600 and the show. The promoter finds another artist. You've learned that being from your country means European visa systems treat you as a risk. Geography is destiny.",
                    cash: -1600, fame: 0, wellBeing: -20, careerProgress: -5, hype: -10,
                    lesson: {
                        title: "Visa Inequality Realities",
                        explanation: "Artists from certain countries face systematic visa discrimination that costs money and opportunities. High rejection rates force expensive gambles. The global music industry's 'openness' has geographic barriers built in.",
                        realWorldExample: "African artists routinely lose thousands on rejected visa applications for European/American shows. The visa rejection rates (often 40-60%) create financial risks that artists from Western countries never face.",
                        tipForFuture: "Factor visa rejection risk into international opportunities. Demand visa support from promoters. Consider whether opportunities with high visa risk are worth the gamble. Geography shapes your career opportunities.",
                        conceptTaught: "international-barriers"
                    }
                }
            },
            {
                text: "Negotiate for promoter to cover visa costs",
                outcome: {
                    text: "You ask the promoter to cover visa costs since rejection risk is high. They agree - they've worked with artists from your region before and understand. Visa gets rejected. You lost nothing. The promoter reschedules you for their next festival and reapplies. Second time, approved. You perform and earn $10,000. Negotiation protected you from visa lottery losses.",
                    cash: 10000, fame: 15, wellBeing: 10, careerProgress: 18, hype: 35,
                    lesson: {
                        title: "Smart International Negotiation",
                        explanation: "Artists from visa-restricted countries should negotiate for promoters to cover visa costs due to high rejection risk. Good promoters understand this and budget for it. Protecting yourself from visa gambles is professional, not unreasonable.",
                        realWorldExample: "Established African artists routinely negotiate visa cost coverage from international promoters. Promoters who work internationally understand rejection risks and build it into budgets. Don't absorb their costs.",
                        tipForFuture: "Always negotiate visa support for international shows. Promoters inviting you should cover visa risks if your rejection rate is high. Don't gamble your money on visa lotteries - make them share the risk.",
                        conceptTaught: "negotiation-basics"
                    }
                }
            },
            {
                text: "Decline the show - visa risk too high",
                outcome: {
                    text: "You decline the opportunity. The risk is too high. You focus on regional tours with no visa barriers. You build your career in markets you can reliably access. You miss the $10,000 payday, but you also avoid potentially losing $1,600. Risk-averse strategy for a career with built-in geographic barriers.",
                    cash: 0, fame: 0, wellBeing: -5, careerProgress: -2, hype: 0,
                    lesson: {
                        title: "Geographic Strategic Limitations",
                        explanation: "For artists from visa-restricted countries, focusing on accessible markets is sometimes the safest strategy. International expansion carries risks that artists from other countries don't face. Playing where you can reliably access is valid.",
                        realWorldExample: "Some African artists focus on building pan-African careers rather than fighting visa barriers to Western markets. Artists like Diamond Platnumz built massive careers touring Africa before attempting Western markets.",
                        tipForFuture: "Don't let visa barriers prevent you from building regional success. Africa has 1.3 billion people. The West isn't the only path to success. Build where barriers are lowest first.",
                        conceptTaught: "strategic-neutrality"
                    }
                }
            }
        ]
    },
    {
        title: "The Social Media Algorithm Conspiracy",
        description: "Your social media reach has dropped 70% over 3 months despite posting consistently. A 'social media expert' says: 'The algorithm is shadowbanning you because you don't post enough Reels.' Another expert says: 'You're posting too much and the algorithm thinks you're spam.' A third says: 'Buy this $800 course and I'll teach you the algorithm.' Everyone has different advice. What's real?",
        conditions: { minFame: 22, minHype: 10 },
        choices: [
            {
                text: "Buy the $800 algorithm course",
                outcome: {
                    text: "You buy the course. It's 8 hours of basic advice available on YouTube for free: 'post consistently,' 'use trending sounds,' 'engage with comments.' You've paid $800 for information you could have Googled. The algorithm mystery persists. You've been sold snake oil disguised as expertise.",
                    cash: -800, fame: 1, wellBeing: -15, careerProgress: 0, hype: 2,
                    lesson: {
                        title: "Algorithm Snake Oil Industry",
                        explanation: "Most 'algorithm experts' sell basic publicly-available information as secret knowledge. Social media algorithms are intentionally opaque. No one outside the platforms has secret access. Don't pay hundreds for free information.",
                        realWorldExample: "The 'social media expert' industry is massive and largely fraudulent. Most courses contain generic advice repackaged as secrets. Real algorithm knowledge comes from platforms themselves or experimentation, not paid courses.",
                        tipForFuture: "Algorithm advice should be free. Platforms publish their own creator guidelines. Expensive courses are almost always scams. Learn from free resources and experimentation, not paid 'experts.'",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Experiment yourself - test different strategies",
                outcome: {
                    text: "You run your own tests: posting at different times, varying content types, different caption lengths, Reels vs posts. After 6 weeks, you identify what works for YOUR audience: short-form video + behind-the-scenes content at 6 PM local time. Your reach recovers to 80% of previous levels. You taught yourself more than any course could.",
                    cash: 0, fame: 6, wellBeing: 10, careerProgress: 8, hype: 18,
                    lesson: {
                        title: "Self-Directed Platform Learning",
                        explanation: "Systematic self-experimentation teaches you more about algorithms than any course. Every audience is different. What works for one artist may not work for you. Develop your own platform expertise through testing.",
                        realWorldExample: "Successful creators across platforms share a common trait: they experiment constantly and learn from data. They don't follow gurus - they test strategies and measure results for their specific audiences.",
                        tipForFuture: "No expert knows your audience better than you will after systematic testing. Track your metrics, test strategies, learn what works. Build your own expertise through experimentation.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Producer Credit Dispute",
        description: "You worked with a producer on a song that's now blowing up (500K streams). You paid them $500 upfront for the beat. Now they want producer credit and 20% of the royalties, claiming they 'co-created' the song. Your agreement was 'beat purchase - full rights.' They're threatening to publicly claim you stole from them if you don't pay. No written contract exists. It's your word against theirs.",
        conditions: { minFame: 26, minCareerProgress: 18 },
        choices: [
            {
                text: "Give them 20% to avoid public drama",
                outcome: {
                    text: "You agree to give them 20% of royalties going forward. The drama stops, but you've set a precedent: anyone who worked on your music can retroactively demand more. Other producers hear about this and start making similar demands. Your 'generosity' became a liability. Being easy to pressure is expensive.",
                    cash: -1000, fame: 2, wellBeing: -10, careerProgress: 3, hype: 5,
                    lesson: {
                        title: "Boundary Setting in Disputes",
                        explanation: "Giving in to threats creates a pattern where everyone thinks they can pressure you for more money. Protecting boundaries is crucial even when drama is uncomfortable. Weakness invites exploitation.",
                        realWorldExample: "Artists who give in to retroactive demands often face cascading claims from everyone they've worked with. Word spreads that you'll pay to avoid drama, making you a target for opportunistic claims.",
                        tipForFuture: "Stand firm on agreed terms. If you paid for full rights, those are the terms. Don't let threats of drama make you renegotiate completed deals. Enforce boundaries consistently.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "Refuse and document your purchase agreement",
                outcome: {
                    text: "You refuse and share proof of payment. You post screenshots of your conversation where they sold you 'full rights' for $500. The producer looks like they're retroactively changing terms after your success. The music community sides with you. You've protected yourself by documenting everything and standing firm.",
                    cash: 0, fame: 5, wellBeing: 5, careerProgress: 8, hype: 10,
                    lesson: {
                        title: "Documentation Protects Rights",
                        explanation: "When disputes arise, documentation determines outcomes. Payment receipts and message histories prove agreements when contracts don't exist. Always save communications about rights and payments.",
                        realWorldExample: "Artists who document transactions and communications win disputes more often. Screenshots, receipts, and message histories serve as informal contracts when written agreements don't exist.",
                        tipForFuture: "Document everything: payments, rights discussions, agreement terms. Screenshot conversations about ownership and credits. Documentation is your protection when disputes arise.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "Offer a one-time settlement payment",
                outcome: {
                    text: "You offer a one-time $1,500 payment to settle all future claims. They accept. You pay more than the original $500 beat cost, but you've capped the liability. They get compensated for the success; you retain full control going forward. Expensive but clean resolution. Both parties leave somewhat satisfied.",
                    cash: -1500, fame: 3, wellBeing: -5, careerProgress: 5, hype: 8,
                    lesson: {
                        title: "Strategic Dispute Settlement",
                        explanation: "One-time settlements can be worth paying to avoid ongoing royalty splits and future disputes. Capping liability through lump sum payments gives you certainty and control. Sometimes paying more upfront costs less than ongoing percentages.",
                        realWorldExample: "Many artists settle retroactive claims with lump sum payments rather than ongoing royalties. It's more expensive immediately but prevents years of split ownership and accounting complexity.",
                        tipForFuture: "When facing retroactive claims, consider one-time settlements that cap your liability. Ongoing royalty splits create permanent financial entanglement. Buy out disputes when possible.",
                        conceptTaught: "Contract Basics"
                    }
                }
            }
        ]
    },

    // --- BATCH 3: HIGH-STAKES SCENARIOS (10 scenarios with career-destroying potential) ---
    {
        title: "The Drug Dealer Investment Offer",
        description: "A wealthy local figure offers to invest $50,000 in your music career - studio time, videos, promotion, everything you need. Your friend quietly warns you: 'That money comes from drug trade. Everyone knows it. If you take it, you're connected to him forever. When he goes down, you go down.' But $50,000 could make you a star overnight. Do you take dirty money?",
        conditions: { minFame: 25, minCareerProgress: 18, maxCash: 5000, minFameByDifficulty: { beginner: 18, realistic: 25, hardcore: 32 } },
        choices: [
            {
                text: "Accept the $50,000 investment",
                outcome: {
                    text: "You take the money. For 6 months, your career explodes - professional videos, radio rotation, billboard ads. You hit Fame 65 and $30K in cash. Then he gets arrested. Police investigate his finances. Your name appears in the case - you received $50,000 from a drug trafficker. Media destroys you. Brands drop you. Radio stations blacklist you. Your career is over. You're toxic. Prison isn't your only cell - public opinion imprisoned you too.",
                    cash: -25000, fame: -55, wellBeing: -60, careerProgress: -70, hype: -80,
                    lesson: {
                        title: "Blood Money Career Death",
                        explanation: "Money from illegal sources is career poison. When the source gets exposed, everyone connected falls. No explanation saves you - the association alone destroys reputations. Dirty money always comes with strings that strangle careers.",
                        realWorldExample: "Numerous African and global artists have seen careers destroyed by connections to drug dealers, corrupt politicians, or money launderers. The short-term boost creates long-term catastrophe when authorities investigate.",
                        tipForFuture: "Never accept money from illegal or questionable sources, no matter how much you need it. The origin of money matters as much as the amount. One bad investor can destroy decades of work.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Decline politely - find clean money",
                outcome: {
                    text: "You decline, saying you appreciate the offer but want to build independently. He's insulted but doesn't push. Your career grows slower - but clean. Six months later, he's arrested and everyone who took his money is publicly shamed. You dodged a career-ending bullet. Slower, cleaner growth saved your future.",
                    cash: 0, fame: 6, wellBeing: 15, careerProgress: 8, hype: 10,
                    lesson: {
                        title: "Clean Money Patience",
                        explanation: "Building slowly with clean money preserves your career long-term. Fast money from questionable sources creates catastrophic vulnerabilities. Patience and clean funding protect your future.",
                        realWorldExample: "Artists who refuse dirty money struggle initially but survive industry purges that destroy those who took shortcuts. Clean careers withstand scrutiny; dirty money careers collapse overnight.",
                        tipForFuture: "Vet your investors and money sources carefully. If you can't publicly explain where money came from, don't take it. Your reputation is worth more than any investment.",
                        conceptTaught: "crisis-management"
                    }
                }
            }
        ]
    },
    {
        title: "The Sexual Assault Accusation Response",
        description: "You're accused of sexual assault by someone you met after a show. They post their story on social media. It's gaining traction - 50K shares in 24 hours. You know you're innocent, but your lawyer says: 'We can't stop social media. This will define you unless you respond perfectly.' Your options: 1) Aggressive denial with counter-lawsuit threats, 2) Empathetic statement supporting survivors while denying this claim, 3) Say nothing and let lawyers handle it. Each approach has massive risks.",
        conditions: { minFame: 45, minCareerProgress: 40, minFameByDifficulty: { beginner: 35, realistic: 45, hardcore: 55 } },
        choices: [
            {
                text: "Aggressive denial - threaten to sue for defamation",
                outcome: {
                    text: "You post: 'These allegations are completely false. I'm suing for defamation and will expose the truth.' The internet explodes against you. Your aggressive response is seen as attacking a victim. Even people who believed you initially turn against you. Brands drop you within hours. Your aggressive defense made you look guilty. Your career is destroyed. Your lawyers say the defamation suit will take years and cost hundreds of thousands. You're finished.",
                    cash: -15000, fame: -40, wellBeing: -70, careerProgress: -60, hype: -85,
                    lesson: {
                        title: "Aggressive Defense Backfire",
                        explanation: "In sexual assault allegations, aggressive denial and legal threats against accusers are seen as intimidation tactics. The court of public opinion judges aggressive responses as guilt. Even innocent people must respond with careful empathy.",
                        realWorldExample: "Many artists who responded aggressively to assault allegations saw their careers end regardless of truth. Public opinion turned against them for attacking alleged victims. The response matters as much as the truth.",
                        tipForFuture: "If falsely accused, never attack the accuser publicly. Express empathy for survivors generally while calmly denying the specific claim. Aggression is career suicide in these situations.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Empathetic statement + denial of this specific claim",
                outcome: {
                    text: "You post: 'I deeply respect survivors and support their courage in speaking out. However, this specific allegation is false. I'm cooperating fully with any investigation to clear my name while respecting the process.' The response is mixed but not universally negative. Some support you, some doubt you. You lose 15% of your fanbase but retain your career. Your lawyers work quietly behind the scenes. Six months later, evidence proves your innocence. You rebuild slowly. You survived by responding carefully.",
                    cash: -8000, fame: -12, wellBeing: -30, careerProgress: -15, hype: -25,
                    lesson: {
                        title: "Measured Crisis Response",
                        explanation: "In serious allegations, showing empathy for the broader issue while calmly denying the specific claim is the least damaging approach. You acknowledge the seriousness without admitting guilt or attacking the accuser.",
                        realWorldExample: "Artists who respond to allegations with measured, empathetic statements while denying specific claims fare better than those who attack or stay silent. The tone of response shapes public perception significantly.",
                        tipForFuture: "Serious allegations require expert PR and legal guidance. Show empathy for the broader issue, deny the specific claim calmly, cooperate with investigations. Your response tone matters enormously.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Say nothing publicly - let lawyers handle it",
                outcome: {
                    text: "You post nothing. Your silence is interpreted as guilt. 'If he was innocent, he'd say something!' The narrative runs wild without your voice. Brands drop you. Shows are canceled. Your lawyer finally releases a statement three weeks later, but the damage is done. Your silence allowed the story to define you. By not speaking, you let others write your story. Your career is crippled.",
                    cash: -10000, fame: -30, wellBeing: -50, careerProgress: -45, hype: -65,
                    lesson: {
                        title: "Silence Allows Narrative Control Loss",
                        explanation: "In the social media age, silence in serious allegations is interpreted as guilt. While legal advice often recommends silence, public relations requires timely, careful response. You must speak to maintain some narrative control.",
                        realWorldExample: "Many public figures who stayed silent during allegations found the narrative spiraled beyond control. While lawyers prefer silence, PR reality requires carefully crafted responses to prevent others from defining you.",
                        tipForFuture: "Balance legal caution with PR necessity. You need both lawyers and PR experts for serious allegations. Complete silence surrenders narrative control and is often interpreted as admission.",
                        conceptTaught: "crisis-management"
                    }
                }
            }
        ]
    },
    {
        title: "The Ponzi Scheme Partnership",
        description: "A 'fintech company' wants you as brand ambassador - $40,000 for one year. They offer high-return investments to your fans: '20% monthly returns guaranteed!' Your financial advisor says: 'This is a Ponzi scheme. It will collapse. When it does, your fans will lose money and blame you.' But $40,000 is transformative. They say it's legit. Papers look real.",
        conditions: { minFame: 35, minCareerProgress: 30, minFameByDifficulty: { beginner: 28, realistic: 35, hardcore: 42 } },
        choices: [
            {
                text: "Take the $40,000 and promote the investment",
                outcome: {
                    text: "You become their ambassador. You post: 'I've invested in [Company] and so should you! 20% monthly returns!' Hundreds of your fans invest their savings - $2 million total. Eight months later, the scheme collapses. Your fans lose everything. They turn on you violently - death threats, lawsuits, public harassment. You're sued in a class action for $500,000. You're criminally investigated for fraud promotion. Your music career is over. You destroyed your fans and yourself.",
                    cash: 40000, fame: -60, wellBeing: -80, careerProgress: -85, hype: -90,
                    lesson: {
                        title: "Ponzi Scheme Career Annihilation",
                        explanation: "Promoting scams to your fans is career suicide and potentially criminal. When people lose money following your recommendation, they will destroy you. No amount of money is worth promoting investments you don't understand or that seem too good to be true.",
                        realWorldExample: "Multiple celebrities and influencers have faced criminal charges and career destruction for promoting Ponzi schemes and fraudulent investments. Kim Kardashian, Floyd Mayweather, and DJ Khaled faced SEC charges for crypto scams.",
                        tipForFuture: "Never promote financial products to fans unless you fully understand them and believe in them. If returns seem impossible, it's a scam. Your reputation for honesty is more valuable than any endorsement fee.",
                        conceptTaught: "Predatory Deals"
                    }
                }
            },
            {
                text: "Decline and warn your fans about the scheme",
                outcome: {
                    text: "You decline and post: 'I was approached by [Company] but something feels off. Be careful with any investment promising 20% monthly returns - that's usually a scam.' The company threatens to sue you. Three months later, they collapse and defraud thousands. Your fans thank you for the warning. You're seen as someone who protects their community. Your honesty strengthened your brand.",
                    cash: 0, fame: 15, wellBeing: 20, careerProgress: 18, hype: 25,
                    lesson: {
                        title: "Protective Leadership",
                        explanation: "Warning your fans about scams builds trust and positions you as protective of your community. Short-term loss of endorsement money is worth long-term trust and reputation as someone who looks out for fans.",
                        realWorldExample: "Artists who warn fans about scams build reputations as trustworthy and protective. This loyalty is worth more than endorsement money and protects you from association when schemes collapse.",
                        tipForFuture: "If something feels like a scam, say so publicly. Protecting your fans from fraud builds the kind of loyalty money can't buy. Be a shield for your community, not a funnel into scams.",
                        conceptTaught: "Predatory Deals"
                    }
                }
            }
        ]
    },
    {
        title: "The Political Endorsement Trap",
        description: "The ruling political party offers you $75,000 to perform at their campaign rally and wear their party colors. Your country is deeply divided - the opposition accuses this party of corruption and human rights abuses. Half your fanbase supports them, half opposes them. Taking political sides could split your audience permanently. But $75,000 is life-changing money.",
        conditions: { minFame: 50, minCareerProgress: 45, minFameByDifficulty: { beginner: 40, realistic: 50, hardcore: 60 } },
        choices: [
            {
                text: "Accept $75,000 - perform at the rally",
                outcome: {
                    text: "You perform at the rally wearing their colors. Photos go viral. Half your fanbase is furious - they see you as supporting corruption. They organize boycotts. Radio stations owned by opposition supporters ban your music. You've lost 50% of your audience permanently. When the political tide shifts (parties lose power), the new government blacklists you too. You've become a political pawn. Your music career is now hostage to political fortunes. You're toxic to half the country forever.",
                    cash: 75000, fame: -35, wellBeing: -45, careerProgress: -50, hype: -60,
                    lesson: {
                        title: "Political Endorsement Career Split",
                        explanation: "Explicit political endorsements in divided countries permanently alienate portions of your audience. Music careers outlast political terms - tying yourself to one party makes you toxic when power shifts. Stay out of partisan politics.",
                        realWorldExample: "Artists who endorse politicians in divided countries routinely lose half their audience and face blacklisting when political winds change. Nigerian, Kenyan, and Ugandan artists have all learned this the hard way.",
                        tipForFuture: "Never explicitly endorse political parties, especially in deeply divided countries. Your music career must outlast any political term. Partisan politics splits audiences permanently.",
                        conceptTaught: "strategic-neutrality"
                    }
                }
            },
            {
                text: "Decline - maintain political neutrality",
                outcome: {
                    text: "You decline politely: 'I appreciate the offer but I prefer to keep my music separate from politics.' Both sides respect your neutrality. You keep your full audience. Some criticize you for not taking a stand, but you've protected your career from political volatility. When governments change, you're still performing. Neutrality preserved your longevity.",
                    cash: 0, fame: 5, wellBeing: 10, careerProgress: 12, hype: 8,
                    lesson: {
                        title: "Strategic Political Neutrality",
                        explanation: "Political neutrality protects artists from audience splits and political volatility. You can have personal political views without making public partisan endorsements. Your career longevity depends on not alienating large audience segments.",
                        realWorldExample: "Long-lasting African artists like Fally Ipupa and Diamond Platnumz maintain political neutrality to preserve their pan-African and multi-demographic appeal. Political neutrality is career protection.",
                        tipForFuture: "Keep partisan politics separate from your art. You can advocate for issues (education, health, corruption) without endorsing specific parties. Neutrality preserves your full audience.",
                        conceptTaught: "strategic-neutrality"
                    }
                }
            }
        ]
    },
    {
        title: "The Label Contract With Hidden Enslavement",
        description: "A major label offers you a 3-album deal: $150,000 advance, professional production, international distribution. Your lawyer reads the fine print: 'They own your masters forever, 360-deal takes 30% of ALL your income (including tours, merch, brand deals), and you can't release music elsewhere for 10 years even if they drop you.' This is a golden cage. Take the money and lose control forever, or stay independent and struggle?",
        conditions: { minFame: 40, minCareerProgress: 35, minFameByDifficulty: { beginner: 32, realistic: 40, hardcore: 50 } },
        choices: [
            {
                text: "Sign the deal - take the $150,000 advance",
                outcome: {
                    text: "You sign. You get $150,000 upfront. They produce one album that does moderately well. Then they lose interest - no promotion, no marketing for albums 2 and 3. But you still owe them 2 albums and can't release music elsewhere. For 7 years, you're stuck. You can't put out music without their permission (they decline). They take 30% of your tour income even though they do nothing. Your career is frozen. The $150,000 cost you 7 years and your masters. You're enslaved by a contract.",
                    cash: 150000, fame: -25, wellBeing: -60, careerProgress: -55, hype: -70,
                    lesson: {
                        title: "Contract Enslavement Reality",
                        explanation: "Predatory label contracts can freeze careers for years. Advances seem huge but often cost you your career, your masters, and your freedom. 360-deals where labels take percentage of all income are especially exploitative. Read everything before signing.",
                        realWorldExample: "Countless artists have been trapped in predatory label deals - TLC declared bankruptcy despite platinum albums, Prince fought Warner Bros for decades, African artists regularly get trapped in exploitative contracts with minimal support.",
                        tipForFuture: "Never sign contracts giving away masters permanently or taking percentages of all income. Advances are loans, not gifts. Bad contracts are worse than no contracts. Hire experienced entertainment lawyers.",
                        conceptTaught: "Predatory Deals"
                    }
                }
            },
            {
                text: "Walk away - negotiate better terms or stay independent",
                outcome: {
                    text: "You tell them the terms are unacceptable. They refuse to negotiate. You walk away. For 2 years, you struggle independently. Then streaming revenue grows. You build a solid independent career keeping 100% of your masters and income. Five years later, you've earned more than the $150,000 advance would have paid, and you own everything. Patience and ownership beat fast money and enslavement.",
                    cash: 0, fame: 8, wellBeing: 15, careerProgress: 20, hype: 12,
                    lesson: {
                        title: "Independence Over Enslavement",
                        explanation: "Walking away from predatory deals preserves your long-term value. Independent careers are harder initially but give you control and ownership. You keep your masters and full income. Patience and ownership beat advances and servitude.",
                        realWorldExample: "Artists like Chance the Rapper, Macklemore, and African artists like Burna Boy (initially independent) built successful careers without major label deals, keeping ownership and control.",
                        tipForFuture: "Predatory contracts are career killers. If terms are bad, walk away. Independent paths are viable in the streaming era. Ownership is more valuable than advances. Never give up your masters.",
                        conceptTaught: "Predatory Deals"
                    }
                }
            }
        ]
    },
    {
        title: "The Tax Evasion Scheme",
        description: "Your accountant suggests: 'We can hide income in offshore accounts and pay almost no taxes. Saves you $30,000/year. Everyone does it - audits are rare.' Your lawyer warns: 'If caught, it's prison time plus career destruction. Pay your taxes.' But $30,000 annually is massive savings. The government is corrupt anyway - why give them money?",
        conditions: { minFame: 55, minCareerProgress: 50, minCash: 40000 },
        choices: [
            {
                text: "Evade taxes using offshore accounts",
                outcome: {
                    text: "You hide income offshore for 3 years, saving $90,000 in taxes. Then the government launches an anti-corruption drive targeting wealthy tax evaders. Your accountant is arrested and cooperates with investigators. Your name is leaked to media. Public outrage is massive - you're a rich artist stealing from the people. You're arrested, charged with tax evasion, and ordered to pay $200,000 (back taxes + penalties + interest). Your reputation is destroyed. Brands drop you. You're seen as a thief. Career over. Prison time likely.",
                    cash: -200000, fame: -70, wellBeing: -85, careerProgress: -80, hype: -90,
                    lesson: {
                        title: "Tax Evasion Career Annihilation",
                        explanation: "Tax evasion is criminal and career-ending when exposed. Public opinion turns viciously against wealthy people who don't pay taxes. Penalties far exceed the savings. No career survives tax evasion scandals. Always pay your taxes.",
                        realWorldExample: "Numerous celebrities have faced prison and career destruction for tax evasion: Wesley Snipes (prison), Lauryn Hill (prison), Shakira (charges), Lionel Messi (convicted). Tax evasion is not worth the risk.",
                        tipForFuture: "Always pay your taxes legally. Use legal tax optimization strategies if needed, but never evade taxes. The risk is catastrophic, and no amount of savings is worth prison and career destruction.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Pay taxes legally - fire the corrupt accountant",
                outcome: {
                    text: "You fire the accountant and hire one who handles your taxes legally. You pay what you owe. When the government's anti-corruption drive hits, your name isn't on any list. Artists who evaded taxes are arrested and shamed publicly. You're clean. Your integrity protected you. The government later offers you a tax ambassador position for artists - paying taxes openly made you a role model.",
                    cash: -30000, fame: 12, wellBeing: 20, careerProgress: 15, hype: 10,
                    lesson: {
                        title: "Tax Compliance Protection",
                        explanation: "Paying taxes legally protects you from criminal liability and career destruction. When governments crack down on tax evasion, compliant taxpayers are safe. Legal tax payment is career insurance. Integrity has value.",
                        realWorldExample: "Artists who pay taxes openly often become respected figures when governments pursue tax evaders. Tax compliance is boring but protective. Legal status is a competitive advantage when crackdowns happen.",
                        tipForFuture: "Pay your taxes. Use legal strategies to minimize them if you want, but never evade. Tax compliance protects your career and reputation. When crackdowns happen, you're safe.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "The Plagiarism Accusation With Evidence",
        description: "A smaller artist publicly accuses you of stealing their song. They post side-by-side videos showing your hit song and their unreleased demo from 2 years ago. The melodies are nearly identical. You didn't steal it - your producer gave you the beat. But the internet doesn't care about nuance. The evidence looks damning. 5 million views in 48 hours. Your response?",
        conditions: { minFame: 48, minCareerProgress: 42 },
        choices: [
            {
                text: "Deny everything - call it coincidence",
                outcome: {
                    text: "You post: 'This is pure coincidence. Songs have similar melodies all the time.' Music experts analyze both songs and confirm they're too similar to be coincidence. Your denial looks like gaslighting. The internet turns against you completely. Media coverage explodes - you're labeled a thief and liar. Streaming platforms start pulling your music. Your hit song is removed. Your career implodes. Denying obvious evidence made everything worse.",
                    cash: -20000, fame: -50, wellBeing: -70, careerProgress: -65, hype: -80,
                    lesson: {
                        title: "Denial of Evidence Backfire",
                        explanation: "Denying obvious evidence makes you look dishonest and compounds the original problem. When caught, admitting error and offering resolution is less damaging than denial. Gaslighting the victim and public destroys credibility completely.",
                        realWorldExample: "Artists who deny obvious plagiarism face worse backlash than those who admit mistakes. Ed Sheeran, Robin Thicke, and others faced major consequences for plagiarism denials with strong evidence against them.",
                        tipForFuture: "If caught in wrongdoing with strong evidence, don't deny it. Admit the mistake, compensate the wronged party, and show accountability. Denial of evidence is career suicide.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Investigate, admit fault, and compensate the artist",
                outcome: {
                    text: "You investigate and discover your producer gave you a beat they created from the other artist's demo without telling you. You post: 'I was unaware this melody was taken from another artist's work. This is my producer's fault, but I take responsibility. I'm removing the song, compensating the artist, and crediting them.' You pay them $50,000 and give co-writing credit. The situation resolves. You lose money and some reputation, but your honesty limited the damage. You survived by owning the mistake.",
                    cash: -50000, fame: -15, wellBeing: -25, careerProgress: -10, hype: -20,
                    lesson: {
                        title: "Accountability Damage Control",
                        explanation: "When caught in wrongdoing (even unknowingly), quick accountability, compensation, and correction limit damage. Admitting fault and making it right preserves more of your career than denial or fighting. Own mistakes fast.",
                        realWorldExample: "Artists who quickly admit plagiarism mistakes and compensate the wronged parties face shorter scandals and keep more of their careers. Sam Smith admitted plagiarism to Tom Petty's estate and resolved it with credits and royalties.",
                        tipForFuture: "If you're caught plagiarizing (knowingly or not), immediately admit fault, compensate the artist, and fix it. Quick accountability limits damage. Don't fight obvious wrongs - own them.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Blame the producer publicly and sue them",
                outcome: {
                    text: "You publicly throw your producer under the bus: 'My producer stole this melody and gave it to me without disclosure. I'm suing them.' The internet sees you as spineless - dodging responsibility by blaming someone else. Your producer fights back, leaking messages showing you knew about issues with the beat. Now you look like a liar AND someone who betrays collaborators. Your reputation is destroyed. No producer will work with you again. Your career is over.",
                    cash: -35000, fame: -45, wellBeing: -60, careerProgress: -70, hype: -75,
                    lesson: {
                        title: "Blame-Shifting Reputation Destruction",
                        explanation: "Publicly blaming collaborators to save yourself destroys your reputation in the industry. Even if they're at fault, throwing them under the bus makes you look weak and untrustworthy. No one will work with someone who betrays collaborators publicly.",
                        realWorldExample: "Artists who publicly blame and sue their collaborators during scandals rarely recover their careers. The industry blacklists people who betray teams. Internal accountability is better than public blame-shifting.",
                        tipForFuture: "Never publicly throw collaborators under the bus to save yourself. Take responsibility as the artist, handle disputes privately, and maintain industry relationships. Betraying teams destroys your career.",
                        conceptTaught: "crisis-management"
                    }
                }
            }
        ]
    },
    {
        title: "The Dangerous Venue Collapse",
        description: "You're about to perform at a festival. An engineer quietly tells you: 'The stage structure is unsafe - overloaded equipment, no safety inspections. If you perform and something collapses, people could die. I reported it but organizers won't cancel - they'll lose $500,000.' You're the headliner. If you cancel, you lose your $15,000 fee and face lawsuits. But people's lives might be at risk.",
        conditions: { minFame: 52, minCareerProgress: 48, minFameByDifficulty: { beginner: 42, realistic: 52, hardcore: 62 } },
        choices: [
            {
                text: "Perform - the organizers say it's safe",
                outcome: {
                    text: "You perform. Halfway through your set, part of the stage collapses. Five people die, dozens are injured. Video shows you were warned but performed anyway. You're criminally charged with negligence. Families sue you for millions. Your career ends instantly. You're seen as someone who valued $15,000 over human lives. Even if you avoid prison, you're morally destroyed. Your music career is over. Five families will never be whole again because you didn't cancel.",
                    cash: 15000, fame: -80, wellBeing: -95, careerProgress: -90, hype: -95,
                    lesson: {
                        title: "Safety Over Everything",
                        explanation: "Human life is always more valuable than performance fees or contractual obligations. If safety is genuinely questionable, cancel. No amount of money is worth people dying. You will be held morally and legally responsible if you proceed despite warnings.",
                        realWorldExample: "Multiple concert disasters (Indiana State Fair stage collapse, Travis Scott's Astroworld) have destroyed careers and resulted in criminal charges. Artists who perform despite safety warnings face catastrophic consequences when disasters occur.",
                        tipForFuture: "If credible safety concerns exist, cancel immediately regardless of financial costs. Document the concerns and your decision. Human life always comes first. Your career can't survive mass casualties.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Cancel immediately and explain publicly why",
                outcome: {
                    text: "You cancel and post: 'I was informed of serious safety concerns with the stage structure. I cannot in good conscience perform when lives may be at risk. I'm canceling my performance.' Organizers are furious. They sue you for $50,000. But an independent inspection the next day confirms the stage was dangerously unsafe. You're vindicated. People thank you for prioritizing safety over money. Your reputation for integrity grows. The lawsuit is dropped. You saved lives and your soul.",
                    cash: -5000, fame: 20, wellBeing: 30, careerProgress: 25, hype: 15,
                    lesson: {
                        title: "Moral Courage Career Protection",
                        explanation: "Prioritizing safety over money, even at financial cost, builds reputation for integrity. When you're vindicated, your moral courage becomes career asset. People want to work with artists who value human life.",
                        realWorldExample: "Artists who cancel shows for genuine safety concerns and explain publicly are almost always vindicated and respected. Their careers benefit from demonstrating values. Safety-first reputations attract better opportunities.",
                        tipForFuture: "Trust safety experts over event organizers with financial incentives. Cancel if safety is genuinely questionable. Document concerns. Your reputation for valuing human life is a career asset.",
                        conceptTaught: "crisis-management"
                    }
                }
            }
        ]
    },
    {
        title: "The Substance Abuse Spiral Public Meltdown",
        description: "You've been using cocaine heavily for 6 months to keep up with touring demands. You're dependent now. You're scheduled for a major televised performance - biggest opportunity of your career, 10 million viewers. But you're high and unstable. Your manager says: 'Go on stage or lose the career-making opportunity.' You're in no condition to perform. Go on high or cancel?",
        conditions: { minFame: 58, minCareerProgress: 55, maxWellBeing: 30 },
        choices: [
            {
                text: "Perform high - don't miss the opportunity",
                outcome: {
                    text: "You go on stage high. Midway through the performance, you forget lyrics, stumble, and have a visible breakdown on live TV. 10 million people watch you collapse. The video goes viral - 50 million views. You're rushed to hospital. Media reports confirm substance abuse. Your career implodes - shows canceled, sponsors flee, label drops you. You've become a cautionary tale. Rehab takes 6 months. You emerge to find your career dead. The industry has moved on. You're yesterday's tragic story.",
                    cash: -40000, fame: -65, wellBeing: -80, careerProgress: -75, hype: -85,
                    lesson: {
                        title: "Public Meltdown Career Death",
                        explanation: "Performing while visibly impaired on major platforms destroys careers instantly. The video lives forever. Substance abuse issues require treatment, not performance through them. No opportunity is worth a public meltdown that ends your career.",
                        realWorldExample: "Numerous artists have suffered career-ending public breakdowns while performing impaired: Amy Winehouse's later performances, Britney Spears' 2007 VMAs, and many others. Public impairment becomes your legacy.",
                        tipForFuture: "If you have substance issues, get treatment before major performances. No single opportunity is worth the risk of public collapse. Career-making moments become career-ending when you're visibly impaired.",
                        conceptTaught: "career-sustainability"
                    }
                }
            },
            {
                text: "Cancel and check into rehab immediately",
                outcome: {
                    text: "You cancel the performance and check into rehab, releasing a statement: 'I'm dealing with substance abuse issues and need treatment. I'm sorry to disappoint fans but I need to get healthy first.' Public reaction is sympathetic. You spend 90 days in treatment. When you return, you're clean and focused. The industry respects your honesty. You rebuild slowly but authentically. Three years later, you're bigger than before. Getting help saved your life and career.",
                    cash: -25000, fame: -10, wellBeing: 50, careerProgress: -5, hype: -15,
                    lesson: {
                        title: "Seeking Help Saves Careers",
                        explanation: "Publicly admitting substance issues and seeking treatment preserves more career than performing impaired. Audiences respect vulnerability and recovery. Treatment is career protection, not career ending. Honesty about struggles builds authenticity.",
                        realWorldExample: "Artists like Demi Lovato, Robert Downey Jr., and Eminem rebuilt massive careers after publicly seeking substance abuse treatment. Recovery stories inspire loyalty and respect. Getting help is career-saving, not career-ending.",
                        tipForFuture: "If you develop substance issues, seek treatment immediately and be honest about it. Don't perform through addiction - get help. Recovery is possible and respected. Your health enables your career.",
                        conceptTaught: "career-sustainability"
                    }
                }
            }
        ]
    },
    {
        title: "The Stolen Music Distribution Deal",
        description: "A distributor offers you an 'exclusive' global distribution deal. They'll get your music on all platforms worldwide for just $500 upfront. Your current distributor charges 10% of royalties. This seems like a better deal. You sign. Three months later, you discover: they're not licensed distributors. They uploaded your music illegally using fake accounts. When platforms detect fraud, your entire catalog is removed from Spotify, Apple Music, everywhere. All your streaming history, playlists, algorithms - gone.",
        conditions: { minFame: 30, minCareerProgress: 28, minCash: 2000 },
        choices: [
            {
                text: "Sign with the unlicensed distributor - save money",
                outcome: {
                    text: "You sign and pay $500. Your music goes up on all platforms. For 3 months, everything seems fine. Then platforms detect the fraudulent accounts. Your entire catalog is removed. Worse: you're flagged in Spotify's and Apple's systems as associated with fraud. When you try to re-upload through legitimate distributors, you're blocked. Your artist profiles are banned. Years of streaming history, followers, playlist placements - all erased. You can't get your music back on platforms. The $500 savings cost you your entire digital career. You're blacklisted.",
                    cash: 500, fame: -55, wellBeing: -70, careerProgress: -80, hype: -85,
                    lesson: {
                        title: "Fraud Distribution Career Destruction",
                        explanation: "Unlicensed distributors who upload music fraudulently get artists permanently banned from streaming platforms. Once flagged for fraud, you can't recover your profiles or history. Saving money on distribution can cost you your entire digital presence forever.",
                        realWorldExample: "Thousands of artists have been permanently banned from Spotify, Apple Music, and YouTube for using fraudulent distributors. Platform blacklists are permanent. Never use unlicensed distributors - the risk is career annihilation.",
                        tipForFuture: "Only use licensed, verified distributors (DistroKid, TuneCore, CD Baby, Ditto, etc.). If a distribution deal seems too cheap, it's fraudulent. Platform bans are permanent - protect your digital presence.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Research them first - verify licensing",
                outcome: {
                    text: "You research them before signing. You discover they're not on Spotify's or Apple's official distributor lists. You ask for proof of licensing - they can't provide it. You decline. A month later, artists who signed with them have their catalogs removed and profiles banned. You dodged a career-ending bullet. Your 10% with a legitimate distributor is suddenly looking very cheap compared to permanent platform bans.",
                    cash: 0, fame: 5, wellBeing: 15, careerProgress: 8, hype: 6,
                    lesson: {
                        title: "Distribution Due Diligence",
                        explanation: "Always verify distributors are officially licensed by platforms before signing. Check Spotify's and Apple's official distributor lists. Unlicensed distributors cause permanent bans. Due diligence protects your digital career.",
                        realWorldExample: "Smart artists only use verified distributors on official platform lists. The music industry is full of scam distributors who get artists banned. Five minutes of research can save your entire career.",
                        tipForFuture: "Before choosing a distributor, verify they're on Spotify's, Apple's, and YouTube's official lists. Never use unlicensed distributors. Your digital presence is too valuable to risk on unverified services.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },

    // --- BATCH 4: MIXED SCENARIOS (10 scenarios - moderate to high stakes) ---
    {
        title: "The Regional Rivalry Beef",
        description: "An artist from a rival city/region disses you on a track, claiming you're fake and your music is trash. They have 80K followers vs your 50K. Your fans are demanding you respond. Social media is blowing up. A diss track could boost your visibility but escalate into real violence - your regions have actual tension. Your manager says: 'Ignore it and look weak, or respond and risk things getting dangerous.'",
        conditions: { minFame: 28, minCareerProgress: 22, minFameByDifficulty: { beginner: 22, realistic: 28, hardcore: 35 } },
        choices: [
            {
                text: "Release a hard diss track - defend your reputation",
                outcome: {
                    text: "You drop a brutal diss track. Your fans love it - you gain 15K followers. But his fans are furious. Online beef becomes offline tension. Someone from his city confronts your DJ at a show - a fight breaks out. Three people are hospitalized. Police investigate. You're blamed for inciting violence through music. Shows in his region ban you. The beef cost more than it gained.",
                    cash: -5000, fame: 10, wellBeing: -25, careerProgress: -5, hype: 20,
                    lesson: {
                        title: "Beef Escalation Risks",
                        explanation: "Musical beef can escalate to real-world violence, especially with regional tensions. Short-term visibility gains aren't worth violence, legal issues, and market access loss. Some battles aren't worth fighting.",
                        realWorldExample: "Hip-hop beefs have resulted in deaths (Biggie, Tupac), career damage, and market blacklisting. Regional rivalries in Africa (Kenya, Nigeria, South Africa) have similarly escalated from music to violence.",
                        tipForFuture: "Assess whether beef will escalate beyond music. If real regional tensions exist, responding with aggression risks violence. Consider whether temporary hype is worth potential tragedy.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Release a competitive track but no direct disses",
                outcome: {
                    text: "You release a track showcasing your skills without directly dissing them. You prove your talent without escalating. Neutral observers respect your maturity. You gain 8K followers and keep the moral high ground. His fans can't rally around defending him because you didn't attack. Smart play - you elevated yourself without creating enemies.",
                    cash: -800, fame: 8, wellBeing: 10, careerProgress: 10, hype: 15,
                    lesson: {
                        title: "Competitive Without Combative",
                        explanation: "You can respond to challenges by demonstrating your skills without direct attacks. This shows confidence without escalating conflict. You prove superiority through quality, not insults. Strategic maturity beats aggressive reaction.",
                        realWorldExample: "Many successful artists respond to disses with elevated content rather than direct attacks. Kendrick Lamar's 'Control' verse challenged peers without specific beef. Quality responses beat aggressive ones long-term.",
                        tipForFuture: "When challenged, you can respond with skill demonstrations rather than direct attacks. This shows confidence and maturity while avoiding escalation. Rise above rather than descend to the level of attacks.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Ignore completely - focus on your work",
                outcome: {
                    text: "You post nothing and continue making music. Initially, some fans call you weak. But after two weeks, everyone forgets about the diss - it was designed to bait you into giving him attention. By ignoring him, you denied him the publicity he wanted. His diss track flops. You keep growing while he stays stagnant. Silence was the ultimate power move.",
                    cash: 0, fame: 5, wellBeing: 15, careerProgress: 8, hype: 5,
                    lesson: {
                        title: "Strategic Silence Power",
                        explanation: "Not all challenges deserve responses. Often, rivals diss you to gain attention from your larger platform. Ignoring them denies them the publicity they need. Silence can be the most powerful response when someone is trying to provoke you.",
                        realWorldExample: "Many major artists ignore smaller artists' diss tracks because responding would give them attention. Drake, Jay-Z, and Beyoncé regularly ignore disses from smaller artists, denying them the publicity.",
                        tipForFuture: "Evaluate whether responding gives them more than it gives you. If they're seeking attention through provocation, silence denies them what they want. Not every diss deserves a response.",
                        conceptTaught: "crisis-management"
                    }
                }
            }
        ]
    },
    {
        title: "The Unauthorized Sample Lawsuit",
        description: "You're served papers - a lawsuit for $200,000. An artist claims you sampled their song without permission. You don't remember sampling anything, but your producer might have used a loop that contained their work. The case is weak but fighting it costs $30,000 in legal fees. You could settle for $25,000, fight for $30,000+, or offer them royalty splits going forward.",
        conditions: { minFame: 38, minCareerProgress: 32, minCash: 10000 },
        choices: [
            {
                text: "Settle immediately for $25,000",
                outcome: {
                    text: "You settle. The case ends quickly. You pay $25,000 and sign an NDA. It's expensive but resolved. However, word spreads in the industry that you'll pay settlements to avoid fights. Three months later, another 'sample lawsuit' arrives from someone else - they see you as an easy target. Your quick settlement created a pattern that invites opportunistic lawsuits.",
                    cash: -25000, fame: -3, wellBeing: -10, careerProgress: 2, hype: -5,
                    lesson: {
                        title: "Settlement Invitation Pattern",
                        explanation: "While settlements end disputes quickly, paying weak claims makes you a target for opportunistic lawsuits. Word spreads that you settle easily. Fighting at least some weak claims deters future opportunistic suits.",
                        realWorldExample: "Artists and companies known for quick settlements attract more lawsuits. Patent trolls and copyright opportunists target those with patterns of settling. Sometimes fighting weak claims is strategic deterrent.",
                        tipForFuture: "Assess each case individually. Don't create patterns of settling weak claims - you'll invite more. Sometimes fighting expensive battles deters cheaper future ones. Reputation for fighting matters.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Fight the lawsuit - spend $30,000 on lawyers",
                outcome: {
                    text: "You hire lawyers and fight. The case drags for 8 months. Discovery reveals your producer unknowingly used a loop pack that contained their sample. Technically, you're liable. You lose and pay $180,000 plus your $30,000 legal fees. Total cost: $210,000. Fighting the weak case made it worse because you were technically wrong. You should have settled.",
                    cash: -210000, fame: -10, wellBeing: -35, careerProgress: -15, hype: -20,
                    lesson: {
                        title: "Legal Battle Risk Assessment",
                        explanation: "Fighting lawsuits makes sense when you're clearly right. When liability is possible, settlements are often cheaper than fighting and losing. Legal victories require being right on the facts - if you're liable, settlements are safer.",
                        realWorldExample: "Many artists spend more fighting sample cases than settlements would have cost, then lose anyway. Robin Thicke spent millions fighting 'Blurred Lines' plagiarism, lost, and paid even more. Weak cases to fight are those you can win.",
                        tipForFuture: "Before fighting, assess your actual liability honestly. If you might be technically wrong, settle. Fight cases you can win. Expensive legal battles that you lose are worst-case scenarios.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Offer 5% royalty split going forward + small payment",
                outcome: {
                    text: "You offer them 5% of future royalties on the song plus $5,000 now. They accept - they get ongoing income instead of a one-time payout. You pay less upfront and the song stays up. This creative solution costs less than settlement or fighting while giving them fair compensation. Both parties benefit.",
                    cash: -5000, fame: 2, wellBeing: 5, careerProgress: 5, hype: 3,
                    lesson: {
                        title: "Creative Dispute Resolution",
                        explanation: "Royalty splits can resolve sample disputes more affordably than settlements or lawsuits. Original artists get ongoing income, you pay less upfront, and everyone benefits from the song's success. Creative solutions often beat adversarial approaches.",
                        realWorldExample: "Many sample disputes are resolved through retroactive royalty splits rather than lawsuits. This approach is increasingly common and often satisfies both parties better than lump sum settlements.",
                        tipForFuture: "When facing sample or copyright claims, consider royalty split offers. They're often cheaper than settlements while giving original creators fair ongoing compensation. Both sides can win.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            }
        ]
    },
    {
        title: "The Ghost Producer Secret",
        description: "You've been working with a ghost producer - they make your beats, you pay them flat fees, and you take full production credit. It's common practice. They now want credit and producer royalties on your hit song (2M streams). They threaten to expose that you don't make your own beats. Your 'producer' image is part of your brand. Give them credit or protect the illusion?",
        conditions: { minFame: 42, minCareerProgress: 38, minHype: 30 },
        choices: [
            {
                text: "Pay them more - keep the secret",
                outcome: {
                    text: "You pay them $15,000 to stay quiet. They agree. But six months later, they approach you again with the same threat for another song. You're now being blackmailed repeatedly. You pay another $10,000. This pattern continues - you're trapped in a cycle of hush payments. Your secret is expensive to maintain and they have all the power.",
                    cash: -25000, fame: 0, wellBeing: -30, careerProgress: 5, hype: 10,
                    lesson: {
                        title: "Blackmail Never Ends",
                        explanation: "Paying people to keep secrets creates ongoing blackmail relationships. Once you pay once, they know they can extract more. Secrets maintained through payments are expensive and unsustainable. You become permanently vulnerable.",
                        realWorldExample: "Countless artists and public figures have been trapped in ongoing blackmail relationships over secrets. The payment never ends - it just gets more expensive. Secrets are leverage that grows more costly over time.",
                        tipForFuture: "Don't create secrets that can be used for blackmail. If you use ghost producers, be upfront about it or structure contracts that prevent future claims. Secrets become expensive liabilities.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "Give them proper credit and royalties",
                outcome: {
                    text: "You credit them properly and give them producer royalties. Your fans learn you don't make all your own beats. Some are disappointed, but most don't care - many artists work with producers. You're seen as honest. Your relationship with the producer becomes professional and healthy. Other talented producers now want to work with you because you credit collaborators fairly. Honesty paid off.",
                    cash: -3000, fame: -5, wellBeing: 15, careerProgress: 12, hype: 5,
                    lesson: {
                        title: "Transparency in Collaboration",
                        explanation: "Most audiences accept that artists collaborate with producers and writers. Being honest about collaborations is less damaging than fans believe. Crediting collaborators properly builds better professional relationships and attracts more talent.",
                        realWorldExample: "Many successful artists openly work with producers and writers. Drake, Rihanna, and most pop stars credit their collaborators. Fans care more about honesty than whether you make every beat yourself.",
                        tipForFuture: "Credit collaborators honestly. Fans value authenticity more than solo genius myths. Proper credits attract better collaborators and prevent future disputes. Transparency beats secrets.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "Refuse and dare them to expose you",
                outcome: {
                    text: "You refuse to pay. They expose you on social media with receipts. Your 'producer artist' image collapses. Fans feel deceived. You lose 20K followers and credibility. Media coverage focuses on the deception, not the music. You're labeled fake. The exposure damaged your brand significantly. Protecting an unsustainable secret backfired - you should have been honest from the start.",
                    cash: 0, fame: -20, wellBeing: -40, careerProgress: -18, hype: -30,
                    lesson: {
                        title: "Unsustainable Secrets Cost More When Exposed",
                        explanation: "Secrets that require ongoing maintenance will eventually be exposed. The damage from exposure is worse than voluntary transparency. Deceptive branding that gets exposed causes more harm than honest branding from the start.",
                        realWorldExample: "Artists exposed for ghost producers, ghost writers, or fake skills suffer worse damage than those who are upfront. Milli Vanilli's career ended when their lip-syncing was exposed. Honesty prevents catastrophic exposure.",
                        tipForFuture: "Don't build your brand on lies that can be exposed. Unsustainable secrets will eventually come out. Be honest about collaborations from the start - the exposure damage is always worse than transparency.",
                        conceptTaught: "Branding and Image"
                    }
                }
            }
        ]
    },
    {
        title: "The Venue Deposit Scam",
        description: "You're organizing your first headlining concert. A venue wants $8,000 deposit to book the space (capacity 2,000). They say ticket sales will cover it. Your friend warns: 'I've heard of promoters who book venues, collect the deposit from artists, then cancel claiming 'permit issues' and disappear with the money.' But this venue has good reviews online. Trust them or demand protections?",
        conditions: { minFame: 32, minCareerProgress: 28, minCash: 10000 },
        choices: [
            {
                text: "Pay the $8,000 deposit - trust their reviews",
                outcome: {
                    text: "You pay $8,000. Two weeks before the show, they cancel: 'Permit issues, we'll refund you in 30 days.' 30 days pass - no refund. You call - number disconnected. You've been scammed. The good reviews were fake. You lost $8,000 and have no venue. You have to cancel, refund ticket buyers, and damage your reputation. Trust cost you everything.",
                    cash: -8000, fame: -15, wellBeing: -35, careerProgress: -20, hype: -25,
                    lesson: {
                        title: "Deposit Scam Reality",
                        explanation: "Venue deposit scams are common - fake reviews, fake venues, or venues that collect deposits then cancel with excuses. Never pay large deposits without insurance, contracts, and verification. Online reviews can be fabricated.",
                        realWorldExample: "Thousands of artists lose money annually to venue deposit scams. Fake venues, unlicensed promoters, and deposit scammers are widespread in the music industry. Verification and contracts are essential.",
                        tipForFuture: "Never pay large venue deposits without: verified business registration, contract with refund terms, insurance, and independent reviews. If it feels risky, demand protections or walk away.",
                        conceptTaught: "Predatory Deals"
                    }
                }
            },
            {
                text: "Demand escrow or payment milestones",
                outcome: {
                    text: "You propose: 'Let's use escrow - deposit held by third party until the show happens.' They refuse and become defensive: 'Don't you trust us?' Their resistance confirms your suspicion - this was a scam. You walk away. Later, you learn three artists lost money to the same 'venue.' Your caution saved you $8,000. You find a legitimate venue with proper contracts.",
                    cash: -3000, fame: 8, wellBeing: 15, careerProgress: 12, hype: 15,
                    lesson: {
                        title: "Escrow and Payment Protection",
                        explanation: "Legitimate businesses accept escrow or milestone payments. Those who refuse or get defensive are usually scams. Payment protection mechanisms reveal who's honest. Resistance to reasonable protections is a red flag.",
                        realWorldExample: "Professional venues and promoters accept escrow, deposits held by ticketing platforms, or milestone payments. Those who insist on direct large upfront payments without protections are often scammers.",
                        tipForFuture: "Always propose payment protections (escrow, milestones, insurance) for large deposits. Legitimate businesses accept protections; scammers resist. Their reaction tells you everything.",
                        conceptTaught: "Predatory Deals"
                    }
                }
            }
        ]
    },
    {
        title: "The Streaming Farm Temptation",
        description: "Your latest single has only 5K streams after 2 weeks. You're discouraged. A service offers: '100K guaranteed streams for $600. Real accounts, looks completely organic, Spotify can't detect it.' Many artists you know use them. Your manager says it's risky but common. Boost your numbers artificially or accept organic growth?",
        conditions: { minFame: 22, minCash: 1000, maxHype: 20 },
        choices: [
            {
                text: "Buy the 100K streams for $600",
                outcome: {
                    text: "You buy the streams. Your count jumps to 105K. For three weeks, it looks good. Then Spotify's fraud detection flags your song. All your music is removed from Spotify - not just this song, your entire catalog. Your artist profile is deleted. You're blacklisted. Years of legitimate work erased because you bought fake streams for one song. The $600 cost you your Spotify career permanently.",
                    cash: -600, fame: -35, wellBeing: -50, careerProgress: -60, hype: -70,
                    lesson: {
                        title: "Stream Fraud Permanent Ban",
                        explanation: "Spotify, Apple Music, and YouTube detect stream farms and permanently ban artists. You lose not just the fake streams but your entire catalog and profile. Platform bans are career-destroying. No amount of fake streams is worth permanent blacklisting.",
                        realWorldExample: "Spotify removes 40,000+ songs daily for artificial streaming. Artists caught using stream farms lose their entire catalogs permanently. Platform bans are career killers. The risk vastly exceeds any reward.",
                        tipForFuture: "Never buy fake streams, followers, or engagement. Platforms detect it and the punishment is permanent blacklisting. Build slowly with real fans. Your platform presence is too valuable to risk.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Accept organic growth - keep building",
                outcome: {
                    text: "You decline the fake streams. Your song stays at 5K for a month. Then it gets added to a small playlist. Growth accelerates - 15K, 30K, 60K. After three months, you're at 120K real streams. The algorithm recognized your real engagement and pushed your music. Slow and real beat fast and fake. Plus, you kept your account safe.",
                    cash: 0, fame: 8, wellBeing: 10, careerProgress: 10, hype: 18,
                    lesson: {
                        title: "Organic Growth Algorithm Benefits",
                        explanation: "Platform algorithms reward genuine engagement over fake numbers. Real listeners save songs, share them, and return. This signals quality to algorithms. Organic growth is slower but compounds better and carries no risk.",
                        realWorldExample: "Virally successful artists almost always have organic growth stories. Algorithms detect and promote songs with genuine engagement. Fake streams don't trigger algorithmic promotion - real listening does.",
                        tipForFuture: "Trust organic growth. Platforms reward real engagement with algorithmic promotion. Focus on making music people genuinely want to listen to and share. Real growth compounds; fake growth gets deleted.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Manager Embezzlement Discovery",
        description: "You're reviewing finances and notice discrepancies. Your manager has been paying themselves 40% of your income instead of the 20% in your contract. Over 2 years, they've taken an extra $35,000. Confronting them could explode the relationship. You need them for bookings and industry connections. But they've been stealing from you.",
        conditions: { minFame: 45, minCareerProgress: 40, minCash: 15000, minFameByDifficulty: { beginner: 38, realistic: 45, hardcore: 52 } },
        choices: [
            {
                text: "Confront them - demand the money back",
                outcome: {
                    text: "You confront them with the evidence. They deny it initially, then admit it: 'I needed the money, I was helping you grow.' You demand repayment and fire them. They refuse to pay and turn the industry against you, telling promoters you're 'difficult' and 'ungrateful.' Bookings dry up. You lost your manager, $35,000, and industry relationships. Being right didn't protect you from the consequences.",
                    cash: -35000, fame: -10, wellBeing: -30, careerProgress: -25, hype: -20,
                    lesson: {
                        title: "Manager Split Consequences",
                        explanation: "Confronting manager theft is right but has consequences - lost relationships, industry blacklisting, and coordinated retaliation. Managers have industry connections that can damage you. Being right doesn't always win.",
                        realWorldExample: "Many artists who fire managers for embezzlement face industry retaliation. Managers talk to each other and promoters. Some artists can't get new representation after firing managers who then trash their reputations.",
                        tipForFuture: "Document everything. Consider whether confrontation or quiet replacement is smarter. Sometimes transitioning away quietly preserves more value than confrontation. Pick battles you can win.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Document everything and transition quietly to new management",
                outcome: {
                    text: "You document the theft but say nothing. You find new management and transition gradually: 'Thanks for everything, I'm trying a new direction.' You leave professionally without accusations. Once you're secure with new management, you sue the old manager with your evidence. You win a $35,000 judgment. You got justice without industry drama. Strategic patience won.",
                    cash: 25000, fame: 5, wellBeing: 10, careerProgress: 15, hype: 8,
                    lesson: {
                        title: "Strategic Manager Transition",
                        explanation: "Securing new support before confronting theft gives you leverage and protection. Once you're safe, you can pursue justice without career risk. Strategic timing beats emotional confrontation. Document, transition, then act.",
                        realWorldExample: "Smart artists document issues, secure new representation, then address grievances from positions of strength. Taylor Swift waited until she had new deals before publicly fighting her old label. Timing matters.",
                        tipForFuture: "When facing manager issues, secure new representation first. Once safe, address wrongdoing from position of strength. Don't confront from vulnerability. Document everything, transition safely, then seek justice.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Let it go - avoid the drama and keep the relationship",
                outcome: {
                    text: "You decide it's not worth the fight. You adjust the contract going forward to prevent more theft but say nothing about the past. Three years later, you discover they're still taking extra money - they just got better at hiding it. You've lost another $50,000. Your tolerance taught them they can steal without consequences. You should have acted when you first discovered it.",
                    cash: -85000, fame: 0, wellBeing: -40, careerProgress: -10, hype: -5,
                    lesson: {
                        title: "Theft Tolerance Escalation",
                        explanation: "Ignoring theft signals that stealing has no consequences. Thieves interpret tolerance as permission to continue. Addressing theft early limits losses. Ignoring it costs more over time as theft escalates.",
                        realWorldExample: "Artists who ignore financial theft by managers or business partners typically lose more over time. Thieves who face no consequences just get better at stealing. Early action prevents long-term losses.",
                        tipForFuture: "Address theft immediately. Tolerance isn't kindness - it's enabling more theft. Boundaries matter. If someone steals from you once and faces no consequences, they'll steal again. Act on evidence.",
                        conceptTaught: "Contract Basics"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Video Director Hostage Situation",
        description: "You paid a director $8,000 for a music video. They filmed it but now won't release the raw footage unless you pay an additional $5,000 for 'editing and color grading' - costs not in your original agreement. They're holding your footage hostage. You could pay, fight legally, or hire someone else and reshoot.",
        conditions: { minFame: 30, minCareerProgress: 25, minCash: 6000 },
        choices: [
            {
                text: "Pay the extra $5,000 - get your footage",
                outcome: {
                    text: "You pay the ransom. They deliver the footage with minimal editing. You've paid $13,000 total for what should have cost $8,000. Word spreads that you'll pay extra when pressured. Other contractors start pulling similar moves - 'Oh, this will cost extra that we didn't mention.' You've trained your industry to exploit you.",
                    cash: -5000, fame: 3, wellBeing: -15, careerProgress: 2, hype: 8,
                    lesson: {
                        title: "Hostage Payment Pattern",
                        explanation: "Paying ransom for services you already purchased creates a pattern where contractors know they can extract more. You become known as someone who pays extra when pressured. This invites ongoing exploitation.",
                        realWorldExample: "Artists who pay hostage demands from contractors face repeat situations. The industry learns who can be pressured for extra payments. Setting boundaries early prevents pattern exploitation.",
                        tipForFuture: "Don't pay hostage demands. Fight them legally or walk away. Paying teaches contractors they can extort you. Establish boundaries - even if this project suffers, future ones will benefit.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "Sue them for breach of contract",
                outcome: {
                    text: "You sue. After 4 months and $4,000 in legal fees, you win and get the footage plus compensation. Total cost: $4,000 + time. You've sent a message to the industry: don't try to extort you. Future contractors see you'll fight. No one tries this again. Your willingness to fight saved you money long-term.",
                    cash: -4000, fame: 5, wellBeing: -10, careerProgress: 8, hype: 5,
                    lesson: {
                        title: "Legal Boundary Enforcement",
                        explanation: "Fighting hostage situations costs money short-term but establishes boundaries that save money long-term. When industry sees you'll fight, exploitation attempts decrease. Legal action is sometimes strategic investment.",
                        realWorldExample: "Artists who fight contractor extortion attempts establish reputations for having boundaries. Future contractors work professionally because they know exploitation won't work. Fighting once prevents many future attempts.",
                        tipForFuture: "When contractors hold work hostage, consider legal action as boundary-setting investment. Short-term legal costs can prevent long-term exploitation pattern. Reputation for fighting matters.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "Walk away - reshoot with new director",
                outcome: {
                    text: "You walk away from the $8,000 and hire a new director for another $8,000. Total cost: $16,000 for one video. It's expensive, but the new video is better and you established you won't be extorted. The original director never releases your footage - they were bluffing about having anything usable. Walking away was expensive but prevented ongoing hostage patterns.",
                    cash: -8000, fame: 5, wellBeing: -5, careerProgress: 6, hype: 12,
                    lesson: {
                        title: "Walk Away Power",
                        explanation: "Sometimes walking away from sunk costs is cheaper than continued engagement with bad actors. Starting over with better partners beats trying to salvage bad relationships. Sunk cost fallacy keeps you trapped with exploiters.",
                        realWorldExample: "Many artists restart projects with new contractors rather than fighting with extortionists. Clean starts with good partners often produce better results than salvaging bad situations.",
                        tipForFuture: "Don't let sunk costs trap you with bad contractors. Walking away and starting over is sometimes cheaper and produces better results. Cut losses with bad actors decisively.",
                        conceptTaught: "Contract Basics"
                    }
                }
            }
        ]
    },
    {
        title: "The Retirement vs Comeback Pressure",
        description: "You're 3 years into your career. You're tired - constant touring, social media pressure, financial stress. You're thinking about taking a 2-year break or even retiring. But your team says: 'If you disappear now, fans will forget you. The algorithm will forget you. You'll never come back.' Your wellbeing is suffering. Stay visible and burn out, or take time off and risk irrelevance?",
        conditions: { minFame: 50, minCareerProgress: 45, maxWellBeing: 40, minFameByDifficulty: { beginner: 42, realistic: 50, hardcore: 58 } },
        choices: [
            {
                text: "Take 2 years off completely - prioritize mental health",
                outcome: {
                    text: "You announce a hiatus and disappear. For 2 years, you rest, recover, and rediscover why you loved music. When you return, your team was partially right - you've lost 40% of your audience and algorithmic momentum. But you're healthy and creative again. You rebuild with authenticity. Three years post-return, you're bigger than before you left. The break saved your career by saving you.",
                    cash: -15000, fame: -20, wellBeing: 60, careerProgress: -15, hype: -30,
                    lesson: {
                        title: "Strategic Career Breaks",
                        explanation: "Long breaks cost momentum but prevent burnout that ends careers. You can rebuild audience; you can't rebuild health after complete collapse. Strategic rest is career investment. Better to lose 40% and rebuild than lose 100% to burnout.",
                        realWorldExample: "Many artists take breaks and return successfully: Adele took years off between albums, Kendrick Lamar spaces albums with years between them, African artists like Fally Ipupa have taken breaks. Sustainable careers require rest.",
                        tipForFuture: "Career longevity requires breaks. You'll lose some audience, but burnout loses everything. Plan breaks strategically, announce them properly, and return refreshed. Audiences forgive absences more than they forgive burnout collapse.",
                        conceptTaught: "career-sustainability"
                    }
                }
            },
            {
                text: "Push through - maintain visibility at all costs",
                outcome: {
                    text: "You keep grinding. Six months later, you have a complete mental breakdown. You're hospitalized for exhaustion and depression. You're forced to cancel 9 months of obligations. The unplanned, dramatic collapse does far more damage than a planned break would have. You lost more audience through breakdown than you would have through rest. Your body forced the break you wouldn't take voluntarily.",
                    cash: -25000, fame: -35, wellBeing: -60, careerProgress: -40, hype: -55,
                    lesson: {
                        title: "Forced Breaks Worse Than Planned Breaks",
                        explanation: "Ignoring burnout doesn't prevent breaks - it just makes them unplanned and catastrophic. Collapses cause more damage than planned rest. Your body will force breaks if you won't take them voluntarily. Planned rest beats forced collapse.",
                        realWorldExample: "Artists who push through burnout warnings typically collapse publicly and dramatically. Demi Lovato, Kid Cudi, and countless others have had public breakdowns from refusing to rest. Forced breaks are more damaging than planned ones.",
                        tipForFuture: "When your body and mind signal need for rest, listen. Planned breaks preserve more career value than breakdowns. You can't outwork burnout - it always wins. Rest strategically or collapse catastrophically.",
                        conceptTaught: "career-sustainability"
                    }
                }
            },
            {
                text: "Reduce schedule by 60% - semi-hiatus compromise",
                outcome: {
                    text: "You cut touring by 60%, reduce social media, and focus on creating music you love. You lose some momentum but stay visible. After a year, you're healthier and your work is better. Your smaller but more intentional output builds stronger connection with fans. Quality over quantity worked. You found sustainable balance without full disappearance.",
                    cash: -8000, fame: -8, wellBeing: 30, careerProgress: 10, hype: -10,
                    lesson: {
                        title: "Sustainable Career Pacing",
                        explanation: "You don't have to choose between burnout and disappearance. Reducing output to sustainable levels preserves presence while protecting health. Quality, intentional work beats exhausted quantity. Balance is possible.",
                        realWorldExample: "Many successful artists maintain careers through intentional pacing rather than constant output. Frank Ocean, SZA, and others release infrequently but meaningfully. Sustainable pacing extends careers.",
                        tipForFuture: "Don't see it as binary: burnout or retirement. You can reduce output to sustainable levels. Do less but do it better. Protect your health while maintaining presence. Sustainable careers beat burnout or disappearance.",
                        conceptTaught: "career-sustainability"
                    }
                }
            }
        ]
    },
    {
        title: "The Collaborative Album Profit Split",
        description: "You and another artist created a collaborative album together - equal work, equal creative input. Now it's time to split the profits ($80,000 so far). They claim they deserve 60% because they have more followers and brought more fans. You contributed equally. 50/50 split or fight for fair distribution?",
        conditions: { minFame: 40, minCareerProgress: 35, minCash: 20000 },
        choices: [
            {
                text: "Accept 40% to keep the peace",
                outcome: {
                    text: "You accept 40% ($32,000). You get less for equal work. Word spreads that you accepted unfair terms. Future collaborators see you as someone who'll accept less. You've devalued yourself. The extra $8,000 they took could have been yours. Your tolerance for unfairness became your brand.",
                    cash: 32000, fame: 3, wellBeing: -15, careerProgress: 5, hype: 10,
                    lesson: {
                        title: "Fair Split Self-Valuation",
                        explanation: "Accepting unfair splits to avoid conflict teaches the industry you undervalue yourself. Equal work deserves equal pay. Your willingness to accept less becomes known and repeated. Defend fair compensation even when uncomfortable.",
                        realWorldExample: "Artists who accept unfair splits find themselves repeatedly offered unfair terms. The industry tests boundaries and exploits those who don't defend their value. Fair compensation requires defending it.",
                        tipForFuture: "Equal work means equal split. Don't accept less because someone has more followers - you both created the work equally. Defend your value even in uncomfortable negotiations. Your precedent matters.",
                        conceptTaught: "negotiation-basics"
                    }
                }
            },
            {
                text: "Demand 50/50 - fight for equal split",
                outcome: {
                    text: "You insist on 50/50 for equal work. They resist but eventually agree. You get $40,000 (your fair share). The relationship is strained but professional. Future collaborators know you demand fair terms. You've established you value your work appropriately. The difficult conversation was worth $8,000 and your self-respect.",
                    cash: 40000, fame: 5, wellBeing: 10, careerProgress: 12, hype: 15,
                    lesson: {
                        title: "Negotiation Boundary Setting",
                        explanation: "Demanding fair compensation might strain relationships but establishes boundaries that protect you long-term. Being difficult about fairness is actually being professional about value. Uncomfortable negotiations beat comfortable exploitation.",
                        realWorldExample: "Artists who consistently demand fair splits establish reputations for professionalism and self-respect. This actually attracts better collaborators who value fairness. Boundaries are attractive to good partners.",
                        tipForFuture: "Fight for fair terms even when it's uncomfortable. Short-term tension is worth long-term respect. Those who resent you demanding fairness aren't good partners anyway. Value yourself appropriately.",
                        conceptTaught: "negotiation-basics"
                    }
                }
            },
            {
                text: "Propose 45/55 compromise - meet in the middle",
                outcome: {
                    text: "You propose 45/55 ($36,000 for you). They agree. It's not perfectly fair, but it's better than 40/60 and resolves quickly. You both compromise. The relationship stays positive. Future collaboration is possible. Sometimes partial fairness beats fighting for perfect fairness. Pragmatic compromise worked.",
                    cash: 36000, fame: 4, wellBeing: 0, careerProgress: 8, hype: 12,
                    lesson: {
                        title: "Pragmatic Negotiation Compromise",
                        explanation: "Perfect fairness isn't always achievable. Strategic compromise can preserve relationships while getting closer to fair terms. Sometimes 45/55 is better than fighting for 50/50 or accepting 40/60. Pragmatism has value.",
                        realWorldExample: "Many successful collaborations use compromise splits that both parties can accept. 45/55 or 55/45 deals are common when both sides have different leverage. Workable deals beat perfect deals that don't happen.",
                        tipForFuture: "Know when to compromise and when to fight. If 45/55 resolves the issue and preserves the relationship, it might be smarter than fighting for 50/50. Choose battles strategically.",
                        conceptTaught: "negotiation-basics"
                    }
                }
            }
        ]
    },
    {
        title: "The Sponsor Conflict of Interest",
        description: "You have a 2-year endorsement deal with Brand A (energy drink, pays you $2,000/month). Now Brand B (beverage company) offers you a one-time $50,000 deal. But your Brand A contract has a non-compete clause - no other beverage endorsements. Breaking it risks lawsuit ($100,000 penalty) and industry blacklisting. Honor your contract or take the bigger money?",
        conditions: { minFame: 48, minCareerProgress: 42, minCash: 30000 },
        choices: [
            {
                text: "Break the contract - take Brand B's $50,000",
                outcome: {
                    text: "You sign with Brand B. Brand A immediately sues you for $100,000 breach of contract. You lose the case. You pay $100,000 in penalties plus your own legal fees ($20,000). Net result: you're down $70,000 from the Brand B deal that paid $50,000. Plus, you're now known in the industry as someone who breaks contracts. Other brands won't work with you. The breach cost you everything.",
                    cash: -70000, fame: -25, wellBeing: -40, careerProgress: -35, hype: -30,
                    lesson: {
                        title: "Contract Breach Catastrophic Cost",
                        explanation: "Breaking contracts for better deals triggers lawsuits, penalties, and industry blacklisting. Breach penalties often exceed the new deal's value. Your reputation for honoring contracts matters enormously. One breach can cost you all future deals.",
                        realWorldExample: "Athletes, artists, and influencers who break endorsement contracts face massive lawsuits and industry blacklisting. Nike, Adidas, and major brands share breach information. One violation destroys your endorsement career.",
                        tipForFuture: "Never break endorsement contracts for better deals. Penalties exceed rewards and you lose industry trust permanently. Honor commitments or negotiate releases. Breach is career suicide.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "Honor Brand A contract - decline Brand B",
                outcome: {
                    text: "You decline Brand B's offer, explaining you're under contract. They respect your integrity. Brand A hears about this and rewards your loyalty with a contract extension at $3,500/month. Over the next 3 years, this adds up to $63,000 - more than Brand B's $50,000 one-time offer. Honoring contracts paid off. Plus, you're known as reliable - more brands want to work with you.",
                    cash: 21000, fame: 10, wellBeing: 15, careerProgress: 20, hype: 15,
                    lesson: {
                        title: "Contract Honor Rewards",
                        explanation: "Honoring contracts builds reputation for reliability that attracts better, longer-term deals. Brands reward loyalty. Your reputation for keeping commitments is worth more than any single opportunity. Integrity compounds.",
                        realWorldExample: "Athletes and artists known for honoring contracts get better, longer deals. LeBron's loyalty to Nike over decades created billionaire status. Contract honor is a competitive advantage that pays long-term.",
                        tipForFuture: "Honor your contracts even when better offers appear. Your reputation for reliability attracts premium long-term deals that exceed short-term opportunities. Integrity is a career asset.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "Negotiate with Brand A for early termination",
                outcome: {
                    text: "You approach Brand A honestly: 'I have a larger offer but I respect our contract. Can we discuss early termination or adjustment?' They appreciate your honesty. You agree to a $10,000 buyout. You pay $10,000, end the Brand A deal, take Brand B's $50,000. Net gain: $40,000. You handled it professionally - both brands respect you. Honesty and negotiation beat breaching or missing opportunities.",
                    cash: 40000, fame: 8, wellBeing: 10, careerProgress: 15, hype: 18,
                    lesson: {
                        title: "Honest Contract Negotiation",
                        explanation: "Many contracts can be renegotiated or bought out through honest conversation. Approaching current partners transparently about better opportunities often results in mutually acceptable solutions. Communication beats breach or missed chances.",
                        realWorldExample: "Professional athletes and artists regularly negotiate contract modifications when circumstances change. Honest, respectful negotiation preserves relationships while allowing flexibility. Most brands prefer buyouts to breaches.",
                        tipForFuture: "When better opportunities conflict with current contracts, approach current partners honestly about negotiating changes. Buyouts, early termination, or adjustment are often possible. Communication beats secretive breach.",
                        conceptTaught: "negotiation-basics"
                    }
                }
            }
        ]
    },

    // --- BATCH 5: LOW-RISK POSITIVE SCENARIOS (10 scenarios - opportunities & growth moments) ---
    {
        title: "The Community Radio Interview Opportunity",
        description: "A local community radio station (20K weekly listeners) invites you for a 30-minute interview and live performance. They don't pay, but they'll promote the interview heavily and let you plug your upcoming shows. It's authentic community building vs waiting for bigger media opportunities. Your schedule is flexible this week.",
        conditions: { minFame: 8, maxFame: 40 },
        choices: [
            {
                text: "Accept the interview - build local community",
                outcome: {
                    text: "You do the interview. The hosts are genuine music lovers who ask thoughtful questions. Your performance is great. Local listeners call in with support. You gain 800 local followers and sell out your next local show (extra $600). Community radio connected you with real fans who actually come to shows. Grassroots building works.",
                    cash: 600, fame: 4, wellBeing: 12, careerProgress: 6, hype: 10,
                    lesson: {
                        title: "Community Media Value",
                        explanation: "Local community media builds genuine connections with audiences who become loyal fans. While reach is smaller than major media, engagement is higher. Local supporters attend shows, buy merch, and spread word authentically.",
                        realWorldExample: "Many successful independent artists built careers through community radio and local media before mainstream attention. These early supporters remain core fanbases. Community building creates sustainable foundation.",
                        tipForFuture: "Don't overlook community and local media. Smaller audiences with high engagement beat large audiences with low engagement. Build local before thinking global. Your community is your foundation.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Decline - wait for bigger opportunities",
                outcome: {
                    text: "You decline, hoping for bigger media. Months pass with no other interview offers. Meanwhile, artists who did the community radio show built local fanbases and are selling out shows. You realize you've been waiting for opportunities instead of taking available ones. Sometimes 20K engaged listeners beat waiting for millions of disengaged ones.",
                    cash: 0, fame: 0, wellBeing: -5, careerProgress: 0, hype: 0,
                    lesson: {
                        title: "Opportunity Cost of Waiting",
                        explanation: "Waiting for 'bigger' opportunities while declining available ones creates stagnation. Growth comes from taking opportunities at your current level, not waiting for opportunities at higher levels. Build momentum with what's available.",
                        realWorldExample: "Many artists stagnate by declining 'small' opportunities while waiting for 'big' ones that never come. Successful artists take every legitimate opportunity to connect with audiences, regardless of size.",
                        tipForFuture: "Take opportunities at your current level rather than waiting for opportunities at levels you haven't reached yet. Small platforms build toward bigger ones. Momentum comes from action, not waiting.",
                        conceptTaught: "audience-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Production Workshop Teaching Offer",
        description: "A youth center wants you to teach a weekend music production workshop to aspiring young artists (ages 16-22). They'll pay you $400 for two days. It's not huge money, but you'd be mentoring the next generation and giving back to your community. Plus, teaching often helps you learn. Worth your weekend?",
        conditions: { minFame: 15, minCareerProgress: 12 },
        choices: [
            {
                text: "Teach the workshop - mentor young artists",
                outcome: {
                    text: "You teach the workshop. The students are eager and talented. Teaching forces you to articulate techniques you use instinctively - you learn as much as they do. Three students become your interns, helping with social media and production. One becomes a talented collaborator. You earned $400, gained help, and built goodwill in your community. Giving back multiplied your resources.",
                    cash: 400, fame: 3, wellBeing: 15, careerProgress: 5, hype: 6,
                    lesson: {
                        title: "Teaching Multiplies Knowledge",
                        explanation: "Teaching forces you to articulate and refine your skills. Students often offer fresh perspectives and become collaborators or team members. Mentorship builds community goodwill and identifies emerging talent. Teaching benefits the teacher.",
                        realWorldExample: "Many successful artists mentor young talent and build teams from workshop participants. Pharrell, Timbaland, and African producers like MasterKraft have mentored artists who became collaborators and friends.",
                        tipForFuture: "Take teaching opportunities when they align with your schedule. Teaching clarifies your own knowledge, builds community relationships, and often identifies talented people to work with. Mentorship has mutual benefits.",
                        conceptTaught: "community-building"
                    }
                }
            },
            {
                text: "Decline - focus on your own career",
                outcome: {
                    text: "You decline to focus on your music. The weekend is productive - you finish two songs. But you miss the chance to connect with emerging talent and community. The youth center brings in another artist who gains local respect and three talented interns. Your solo productivity was good, but you missed relationship-building opportunities that compound over time.",
                    cash: 0, fame: 1, wellBeing: 0, careerProgress: 3, hype: 2,
                    lesson: {
                        title: "Community Building Trade-offs",
                        explanation: "Solo productivity is valuable, but community building and mentorship create opportunities that compound. Sometimes stepping away from your own work to help others returns more value through relationships, reputation, and unexpected collaborations.",
                        realWorldExample: "Artists who engage in community mentorship often build stronger local support networks. While it takes time from personal projects, the relationships and goodwill create opportunities that solo work doesn't.",
                        tipForFuture: "Balance solo productivity with community engagement. Teaching, mentoring, and community involvement build networks that create opportunities. Not everything valuable shows immediate ROI. Relationships compound.",
                        conceptTaught: "community-building"
                    }
                }
            }
        ]
    },
    {
        title: "The DIY Music Video With Friends",
        description: "You want a music video but can't afford a professional ($5,000+). Your friends offer to help make one for free - one has a decent camera, another does amateur editing, others will act in it. It won't be high-budget quality, but it could have authentic energy. Professional later or DIY now?",
        conditions: { minFame: 12, maxCash: 8000 },
        choices: [
            {
                text: "Make the DIY video with friends now",
                outcome: {
                    text: "You shoot a fun, energetic video with your friends. It's not Hollywood quality, but the authentic energy and creativity shine through. Fans love the realness - it gets 50K views in two weeks, way more than your previous content. The DIY aesthetic feels genuine. You spent $200 on props and food for the crew. Sometimes creativity beats budget.",
                    cash: -200, fame: 8, wellBeing: 15, careerProgress: 10, hype: 20,
                    lesson: {
                        title: "DIY Authenticity Appeal",
                        explanation: "Audiences often connect more with authentic, creative DIY content than overproduced professional videos lacking personality. Energy and creativity can compensate for production budget. Start with what you have rather than waiting for what you don't.",
                        realWorldExample: "Many viral music videos are low-budget DIY productions. Childish Gambino's 'This Is America' was powerful through concept and performance, not budget. Tyler, The Creator's early videos were DIY and connected strongly with audiences.",
                        tipForFuture: "Don't let lack of budget prevent you from creating. DIY videos with strong concepts and authentic energy often outperform expensive, soulless productions. Use what you have creatively.",
                        conceptTaught: "creative-resourcefulness"
                    }
                }
            },
            {
                text: "Save money for professional video later",
                outcome: {
                    text: "You decide to wait and save. Six months later, you have $5,000. You hire a professional crew. The video looks great but feels generic - the director doesn't really understand your vision. It gets 20K views. The amateur video your friends offered might have had more authentic energy. Professional doesn't always mean better.",
                    cash: -5000, fame: 6, wellBeing: -5, careerProgress: 5, hype: 12,
                    lesson: {
                        title: "Budget vs Authenticity Balance",
                        explanation: "Professional production doesn't guarantee better results if the vision and authenticity are lost. Sometimes waiting for professional quality means sacrificing the creative energy and timing that make content resonate. Balance matters more than budget.",
                        realWorldExample: "Many artists' low-budget early videos outperform their later high-budget ones because they captured raw energy and authenticity. Professionalism can sometimes sand away the edges that made the art interesting.",
                        tipForFuture: "Evaluate whether professional production will enhance or dilute your vision. Sometimes DIY captures something professional can't. Don't always assume more budget equals better result. Authenticity has value.",
                        conceptTaught: "creative-resourcefulness"
                    }
                }
            }
        ]
    },
    {
        title: "The Surprise Playlist Addition",
        description: "You wake up to messages - a Spotify editorial playlist curator added your song to a 150K follower playlist without telling you! Your streams are jumping. The playlist is 'African Rising Stars' or 'Indie Hustle' depending on your genre. This is pure algorithmic luck meeting quality. How do you capitalize on this momentum?",
        conditions: { minFame: 18, minCareerProgress: 15 },
        choices: [
            {
                text: "Push marketing hard - capitalize on the momentum",
                outcome: {
                    text: "You immediately boost social media posts, run targeted ads to the playlist's audience, and engage heavily with new listeners. You spend $800 on ads but gain 5K followers and 150K streams. The algorithm sees the increased engagement and pushes your music further. Your song stays on the playlist for 6 weeks. You turned lucky placement into sustained growth. Strategic investment in momentum worked.",
                    cash: -800, fame: 12, wellBeing: 10, careerProgress: 15, hype: 30,
                    lesson: {
                        title: "Momentum Capitalization",
                        explanation: "When unexpected opportunities or algorithmic luck happens, capitalizing with strategic investment amplifies results. Momentum is temporary - investing during high-growth moments compounds gains. Luck creates opportunities; strategy converts them to results.",
                        realWorldExample: "Artists who recognize momentum moments and invest in them see exponential growth. When songs go viral or get playlist placements, smart artists double down with ads, content, and engagement. Timing investment to momentum maximizes ROI.",
                        tipForFuture: "When you get unexpected boosts (playlist adds, viral moments, press coverage), invest immediately in amplifying them. Momentum is temporary. Strategic spending during growth periods compounds results more than random spending.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Let it grow organically - just enjoy the moment",
                outcome: {
                    text: "You watch the numbers climb without intervening. You gain 2K followers and 80K streams over three weeks. It's nice growth, but when you're removed from the playlist, momentum stops. You wonder if you could have turned this into something bigger with strategic investment. Organic is good, but strategic amplification might have been better.",
                    cash: 0, fame: 6, wellBeing: 12, careerProgress: 8, hype: 15,
                    lesson: {
                        title: "Organic Growth Limits",
                        explanation: "Organic growth is valuable and sustainable, but strategic investment during momentum spikes can amplify results significantly. Purely organic approach during high-growth moments is missed opportunity for acceleration. Balance organic with strategic amplification.",
                        realWorldExample: "Many artists let momentum moments pass without capitalizing. While organic growth is real, artists who strategically amplify during high-growth periods (with ads, content, engagement) typically achieve 2-3x the results of purely organic approaches.",
                        tipForFuture: "Organic growth is foundation, but don't be purely passive during momentum moments. Strategic amplification during spikes can turn temporary boosts into permanent gains. Invest when you have momentum.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Thank the curator and build relationship",
                outcome: {
                    text: "You find the curator's contact and send a heartfelt thank you, sharing your artist story. They respond - they love supporting emerging artists. They add another of your songs to a different playlist. Over the next year, they become an advocate, including you in three more playlists. Building the relationship turned one placement into ongoing support. Gratitude and relationship building paid compound interest.",
                    cash: 0, fame: 10, wellBeing: 15, careerProgress: 18, hype: 25,
                    lesson: {
                        title: "Curator Relationship Building",
                        explanation: "Playlist curators are people who appreciate genuine connection and gratitude. Building real relationships with curators who support you can turn one-time placements into ongoing advocacy. Relationships compound more than single placements.",
                        realWorldExample: "Artists who build genuine relationships with playlist curators often receive ongoing support across multiple playlists. Curators remember artists who are grateful, professional, and authentic. Relationships create sustained opportunities.",
                        tipForFuture: "When curators support you, build genuine relationships through thoughtful gratitude and occasional updates. Don't spam or beg, but maintain authentic connections. Long-term curator relationships are more valuable than single placements.",
                        conceptTaught: "relationship-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Unexpected Collaboration Request",
        description: "An artist you admire (similar fame level, great reputation) DMs you: 'I love your sound. Want to collaborate on a track?' This could be a great creative partnership and cross-pollinate your fanbases. But collaborations take time and require chemistry. Do you commit your time to this?",
        conditions: { minFame: 20, minCareerProgress: 16 },
        choices: [
            {
                text: "Enthusiastically agree - make time for it",
                outcome: {
                    text: "You collaborate. The chemistry is amazing - you create a song better than either could have made alone. Both fanbases embrace it. You each gain 3K followers from the other's audience. More importantly, you've made a genuine friend and creative partner. Future collaborations are planned. The time investment created a valuable long-term relationship and great music.",
                    cash: -500, fame: 8, wellBeing: 18, careerProgress: 12, hype: 20,
                    lesson: {
                        title: "Collaborative Chemistry Value",
                        explanation: "Good collaborations create music neither artist could make alone while introducing each fanbase to the other. Creative partnerships compound over time through multiple projects and mutual support. Chemistry-based collaborations are career assets.",
                        realWorldExample: "Many iconic musical partnerships began with organic collaboration requests - OutKast, Daft Punk, Black Star, African duos like P-Square. Great collaborations create legacies bigger than solo careers.",
                        tipForFuture: "When artists you respect reach out for collaboration, prioritize it. Good creative partnerships compound through multiple projects and mutual fanbase sharing. Collaborative relationships are career multipliers.",
                        conceptTaught: "collaboration-benefits"
                    }
                }
            },
            {
                text: "Politely decline - stay focused on solo work",
                outcome: {
                    text: "You decline, citing time constraints. They collaborate with someone else. That song becomes a hit and launches both artists to new levels. You're still grinding alone. You realize collaboration isn't distraction from your career - it is your career. Missing this opportunity cost you growth, relationship, and creative chemistry. You chose isolation over multiplication.",
                    cash: 0, fame: 1, wellBeing: -5, careerProgress: 2, hype: 0,
                    lesson: {
                        title: "Collaboration Opportunity Cost",
                        explanation: "Excessive focus on solo work can cause you to miss collaboration opportunities that accelerate growth. Music careers are built through relationships and partnerships, not pure isolation. Saying no to good collaborators is saying no to growth.",
                        realWorldExample: "Many successful artists attribute their growth to collaborations. Drake with 40, Rihanna with various producers, African artists' collaboration culture - partnerships accelerate careers. Pure solo focus often leads to slower growth.",
                        tipForFuture: "Don't be so focused on solo work that you miss collaboration opportunities with respected peers. Partnerships multiply reach, creativity, and growth. Collaboration is career strategy, not distraction.",
                        conceptTaught: "collaboration-benefits"
                    }
                }
            }
        ]
    },
    {
        title: "The Fan Art Appreciation Post",
        description: "A fan creates beautiful artwork inspired by your music and tags you. It's genuinely impressive - they clearly love your work. You could reshare it with credit (builds relationship), commission them for official artwork ($300), or just like it and move on. How do you respond to fan creativity?",
        conditions: { minFame: 16, minHype: 10 },
        choices: [
            {
                text: "Reshare with enthusiastic credit and praise",
                outcome: {
                    text: "You reshare their art with genuine praise: 'This is incredible! Thank you for this beautiful interpretation of my music.' The artist is thrilled. Your fans see you appreciate and amplify fan creativity. More fans create art, covers, and content inspired by your music. You've encouraged a creative community around your work. The culture of fan creativity grows organically. Free promotion through fan art.",
                    cash: 0, fame: 4, wellBeing: 10, careerProgress: 5, hype: 12,
                    lesson: {
                        title: "Fan Creativity Encouragement",
                        explanation: "Acknowledging and amplifying fan creativity encourages more fan engagement and content creation. Fans who feel appreciated become more loyal and active. User-generated content is authentic marketing that money can't buy. Appreciation costs nothing and multiplies engagement.",
                        realWorldExample: "Artists who regularly appreciate and reshare fan content build stronger communities. Taylor Swift, BTS, and many African artists amplify fan creativity, which creates ecosystems of free content and deeper engagement.",
                        tipForFuture: "Always acknowledge quality fan creativity with genuine appreciation and amplification. It costs nothing, makes fans feel valued, and encourages more fan-generated content. User creativity is free marketing.",
                        conceptTaught: "fan-engagement"
                    }
                }
            },
            {
                text: "Commission them for official artwork - pay $300",
                outcome: {
                    text: "You DM them: 'This is amazing. I'd love to commission you for my next single artwork. $300?' They're ecstatic - you've just validated their art financially and given them their first paid music work. The artwork they create is perfect. Other fans see you support fan artists. Your reputation for supporting community grows. $300 bought you art, goodwill, and stronger community relationships.",
                    cash: -300, fame: 5, wellBeing: 15, careerProgress: 6, hype: 15,
                    lesson: {
                        title: "Paying Fan Creators Value",
                        explanation: "Commissioning fan artists accomplishes multiple goals: you get authentic artwork, they get paid validation, and your community sees you support creators. Paying fans for quality work builds deep loyalty and attracts more creative fans. Community investment returns compound value.",
                        realWorldExample: "Many artists hire fans for official work - album art, merch design, video animation. This builds incredibly loyal community members who become advocates. Paying fans fairly creates ambassadors.",
                        tipForFuture: "When fans create quality work, consider commissioning them for official projects. It builds loyalty, supports your community, and often results in more authentic work than hiring disconnected professionals.",
                        conceptTaught: "fan-engagement"
                    }
                }
            },
            {
                text: "Just like it and move on",
                outcome: {
                    text: "You like the post but don't engage further. The fan is slightly disappointed - they hoped for more acknowledgment. They don't create more fan art. Other potential fan creators see minimal engagement and don't bother creating content. You missed opportunity to build creative community around your music. A simple reshare would have cost nothing and multiplied engagement.",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: 0,
                    lesson: {
                        title: "Missed Fan Engagement",
                        explanation: "Minimal engagement with quality fan creativity is missed opportunity. Fans want acknowledgment and connection. Small gestures like resharing and praising cost nothing but build loyalty and encourage more fan content. Passive engagement misses community-building opportunities.",
                        realWorldExample: "Artists who minimally engage with fan creativity often have less active communities. Fans want to feel seen and appreciated. Artists who actively engage with fan content build vibrant, creative communities that organically promote their music.",
                        tipForFuture: "Never just 'like and move on' when fans create quality content for you. Genuine acknowledgment and amplification cost nothing but create engaged communities. Small gestures have big impacts on fan loyalty.",
                        conceptTaught: "fan-engagement"
                    }
                }
            }
        ]
    },
    {
        title: "The Local Business Soundtrack Deal",
        description: "A popular local restaurant/café wants to license one of your songs for their in-store playlist. They'll pay $150 for a 1-year license. It's not huge money, but your music will play in their space daily, and they'll credit you on social media. Low-key exposure in your community. Worth licensing?",
        conditions: { minFame: 12, minCareerProgress: 8 },
        choices: [
            {
                text: "License the song for $150",
                outcome: {
                    text: "You license the song. For a year, hundreds of local people hear your music weekly while eating and drinking. Multiple customers Shazam your song and become fans. The restaurant tags you in posts, driving 500 new local followers. You book three shows from people who discovered you at that restaurant. The $150 paid for itself many times through local recognition and show bookings. Micro licensing works.",
                    cash: 150, fame: 3, wellBeing: 8, careerProgress: 6, hype: 8,
                    lesson: {
                        title: "Local Licensing Value",
                        explanation: "Small local licensing deals create consistent passive exposure in community spaces. People hear your music in relaxed settings, making positive associations. Local businesses become passive promoters. Small, consistent exposure compounds.",
                        realWorldExample: "Many independent artists earn consistent income and local recognition through small business licensing - cafes, gyms, shops. These micro-deals add up and create local presence that translates to show attendance and word-of-mouth growth.",
                        tipForFuture: "Don't overlook small licensing opportunities with local businesses. $150 might seem small, but consistent community exposure has value. Local presence translates to show attendance and organic growth.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Decline - hold out for bigger licensing deals",
                outcome: {
                    text: "You decline, thinking $150 is too small. A year passes with no other licensing offers. The restaurant uses another local artist's music, who gains local recognition and community support. You realize you were holding out for opportunities that don't exist yet at your level. Sometimes small opportunities lead to bigger ones. You chose waiting over doing.",
                    cash: 0, fame: 0, wellBeing: -3, careerProgress: 0, hype: 0,
                    lesson: {
                        title: "Small Deal Value Recognition",
                        explanation: "Holding out for 'bigger' deals while declining opportunities at your current level creates stagnation. Small deals appropriate for your level lead to bigger ones through momentum and relationship building. Growth comes from taking available opportunities.",
                        realWorldExample: "Most successful licensing careers started with small local deals. Holding out for major brand deals while unknown is unrealistic. Artists build licensing portfolios through small opportunities that demonstrate value.",
                        tipForFuture: "Take opportunities appropriate for your current level. Small licensing deals build portfolio, relationships, and momentum toward bigger deals. Waiting for opportunities you haven't earned yet creates stagnation.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Blog Feature Opportunity",
        description: "An independent music blog (15K monthly readers, respected in your genre) wants to feature you. They need a 1,000-word artist profile from you, high-res photos, and exclusive early access to your next single. It's work to prepare, but the feature could reach engaged music fans. Worth the effort?",
        conditions: { minFame: 14, minCareerProgress: 10 },
        choices: [
            {
                text: "Provide everything - do the feature properly",
                outcome: {
                    text: "You spend 3 hours preparing a thoughtful artist profile, professional photos, and early access to your single. The blog publishes an excellent feature. You gain 1,200 new followers who actually engage with your content - they comment, save songs, and share. Three playlist curators discover you through the blog. Your next show sells 40 more tickets than usual. The 3 hours you invested returned significant engaged audience growth.",
                    cash: 200, fame: 6, wellBeing: 8, careerProgress: 10, hype: 14,
                    lesson: {
                        title: "Quality Press Value",
                        explanation: "Independent music blogs reach engaged, genre-specific audiences who actively discover music. While reach is smaller than mainstream media, engagement and conversion rates are higher. Investing effort in quality features pays off through engaged audience growth.",
                        realWorldExample: "Many successful independent artists credit music blogs for early growth. Blogs like Pitchfork, The Fader, Okayplayer started as independent publications. Genre-specific blogs reach your actual audience more effectively than mainstream media.",
                        tipForFuture: "Invest effort in legitimate independent music blog features. Their audiences are engaged music fans who actually listen and support artists. Quality over quantity - engaged niche audiences beat large disengaged ones.",
                        conceptTaught: "press-strategy"
                    }
                }
            },
            {
                text: "Half-effort it - send minimal info",
                outcome: {
                    text: "You send a brief bio and mediocre photos. The blog publishes a weak feature with your minimal content. It gets little traction - 200 new followers who don't engage much. The blog editors remember you were difficult to work with and don't feature you again. Your laziness cost you a relationship with a respected platform. Half-effort got half-results.",
                    cash: 0, fame: 2, wellBeing: -3, careerProgress: 1, hype: 3,
                    lesson: {
                        title: "Effort Quality Correlation",
                        explanation: "The effort you put into press opportunities directly correlates with results. Half-effort produces weak content that doesn't engage audiences or build media relationships. Full effort creates quality features that drive real results and build media partnerships.",
                        realWorldExample: "Media outlets remember artists who are professional and provide quality materials versus those who are difficult and provide minimal content. Reputation spreads - your professionalism (or lack thereof) affects future opportunities.",
                        tipForFuture: "When you commit to press opportunities, do them properly. Half-effort wastes everyone's time and damages your media relationships. Quality engagement with media builds lasting relationships that create ongoing opportunities.",
                        conceptTaught: "press-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Studio Session Networking Chance",
        description: "You're at a studio. Another artist is recording next door. During a break, they introduce themselves - they're working on an EP and seem talented. You could hang out, exchange contacts, and potentially build a relationship, or just finish your session and leave. Studio networking or stay focused?",
        conditions: { minFame: 18, minCareerProgress: 14 },
        choices: [
            {
                text: "Network and build the relationship",
                outcome: {
                    text: "You hang out and exchange contacts. They're cool and talented. You discover you have compatible vibes and similar audiences. Over the next year, you collaborate on two songs, share each other's music, and become genuine friends. They introduce you to their manager, who books you three shows. That random studio encounter created lasting professional relationship and opportunities. Networking compounds.",
                    cash: 300, fame: 6, wellBeing: 12, careerProgress: 10, hype: 12,
                    lesson: {
                        title: "Organic Industry Networking",
                        explanation: "Many valuable music industry relationships start through random encounters in studios, shows, and music spaces. Being open to genuine connections creates opportunities that formal networking events rarely do. Organic relationships based on mutual respect compound over time.",
                        realWorldExample: "Countless musical partnerships and career opportunities started from random studio encounters. The music industry runs on relationships built organically through genuine mutual interest, not forced networking. Authentic connection creates opportunities.",
                        tipForFuture: "Be open to genuine connections in music spaces. Random encounters in studios, shows, and creative spaces often lead to valuable relationships and opportunities. Organic networking beats forced networking.",
                        conceptTaught: "relationship-building"
                    }
                }
            },
            {
                text: "Stay focused on your session",
                outcome: {
                    text: "You politely acknowledge them but stay focused on your session. You finish efficiently. Later, you see that artist blow up - they're now way bigger than you. They're collaborating with artists you wish you could work with. You realize that studio encounter was a missed networking opportunity. Excessive focus on immediate tasks made you miss relationship-building. Efficiency isn't always optimal.",
                    cash: 0, fame: 1, wellBeing: 0, careerProgress: 2, hype: 0,
                    lesson: {
                        title: "Relationship Building Priority",
                        explanation: "Being so focused on immediate tasks that you miss relationship-building opportunities costs long-term potential. Music careers are built on relationships as much as craft. Balancing task focus with openness to connection matters. Pure efficiency misses serendipity.",
                        realWorldExample: "Many artists regret being too focused on their own work to build relationships with peers who later became successful. The music industry rewards those who balance craft focus with genuine relationship building. Opportunities come through people.",
                        tipForFuture: "Don't be so focused on tasks that you miss genuine connection opportunities. Music careers are relationship-based. Balance efficiency with openness to authentic networking. Serendipitous encounters often create the best opportunities.",
                        conceptTaught: "relationship-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Home Studio Upgrade Decision",
        description: "Your current home setup is basic but functional. A friend is selling professional studio monitors, an audio interface, and acoustic treatment for $1,200 (worth $3,000 new). It would significantly improve your production quality. But $1,200 is a lot. Upgrade your tools or keep working with what you have?",
        conditions: { minFame: 20, minCareerProgress: 18, minCash: 2000 },
        choices: [
            {
                text: "Buy the upgrade - invest in better tools",
                outcome: {
                    text: "You buy the equipment. The difference is immediately noticeable - your mixes sound cleaner, more professional. Producers and artists you send music to take you more seriously. You book three paid production jobs ($2,400 total) because your sound quality improved. The equipment paid for itself and elevated your craft. Investment in tools was investment in career quality.",
                    cash: 1200, fame: 4, wellBeing: 10, careerProgress: 12, hype: 8,
                    lesson: {
                        title: "Tool Investment ROI",
                        explanation: "Quality tools improve output quality, which creates better opportunities. Investment in proper equipment often pays for itself through increased professional opportunities and respect. Better tools enable better work. Strategic equipment investment is career investment.",
                        realWorldExample: "Professional producers and artists invest in quality equipment because it improves output and attracts better opportunities. While you can start with basic tools, strategic upgrades at appropriate times accelerate career growth through quality improvement.",
                        tipForFuture: "When you can afford strategic equipment upgrades (especially good deals on professional gear), invest. Better tools improve your work quality, which improves opportunities. Equipment investment pays dividends through career quality improvement.",
                        conceptTaught: "career-investment"
                    }
                }
            },
            {
                text: "Keep your current setup - save the money",
                outcome: {
                    text: "You keep your basic setup. Your production quality stays the same. Producers and labels you send music to mention the mix quality could be better. You miss production job opportunities because your sound isn't quite professional enough. Six months later, you regret not buying the equipment - you've lost more than $1,200 in missed opportunities. Penny-wise, pound-foolish.",
                    cash: 0, fame: 1, wellBeing: -5, careerProgress: 3, hype: 2,
                    lesson: {
                        title: "Equipment Opportunity Cost",
                        explanation: "Not investing in quality tools when affordable and necessary creates opportunity cost through limited output quality. While you save money short-term, you lose opportunities long-term. Strategic equipment investment prevents lost opportunities through quality limitations.",
                        realWorldExample: "Many artists regret not upgrading equipment when they had good opportunities, losing production work and professional respect due to quality limitations. Strategic investment in tools at right times prevents more losses than the equipment costs.",
                        tipForFuture: "Evaluate equipment purchases based on opportunity cost, not just price. If better tools would create opportunities worth more than their cost, buy them. Calculate long-term value, not just short-term expense.",
                        conceptTaught: "career-investment"
                    }
                }
            }
        ]
    },

    // --- BATCH 6: MIXED SCENARIOS (10 scenarios - variety of situations) ---
    {
        title: "The Artist Name Trademark Issue",
        description: "You discover another artist in a different country is using the same name as you. They registered the trademark first. A lawyer says you could fight it ($5,000+) or just rebrand now while you're still growing. Changing your name loses recognition you've built, but fighting might be expensive and uncertain. What do you do?",
        conditions: { minFame: 24, minCareerProgress: 20, minFameByDifficulty: { beginner: 18, realistic: 24, hardcore: 30 } },
        choices: [
            {
                text: "Rebrand now - change your artist name",
                outcome: {
                    text: "You change your name and announce it across all platforms. It's disorienting - you lose 15% of your followers who don't realize you changed names. But you avoid legal issues and the new name is actually more unique and memorable. Six months later, you've regained lost followers and built stronger branding. Early rebranding was less painful than it would be later.",
                    cash: -800, fame: -6, wellBeing: -10, careerProgress: 8, hype: 5,
                    lesson: {
                        title: "Early Rebranding Advantage",
                        explanation: "Rebranding early in your career is less disruptive than rebranding after major success. While you lose some recognition, you avoid legal issues and can build stronger, legally protected branding. The earlier you fix naming issues, the less costly they are.",
                        realWorldExample: "Many artists have rebranded early to avoid trademark conflicts - Lady Gaga was Stefani Germanotta, Snoop Dogg has changed names multiple times, African artists often modify names for international markets. Early rebranding beats later legal battles.",
                        tipForFuture: "Research trademark availability before investing heavily in a name. If conflicts exist, rebrand while you're still growing. The cost of rebranding increases exponentially with your fame level.",
                        conceptTaught: "brand-protection"
                    }
                }
            },
            {
                text: "Fight for your name - hire lawyers",
                outcome: {
                    text: "You spend $6,000 fighting the trademark. After 10 months, you lose - they had prior registration. You're forced to rebrand anyway after spending $6,000 and a year of stress. Now you're bigger, so the rebrand is more painful and confusing. You lost money, time, and still had to change your name. Fighting cost you everything rebranding would have cost, plus $6,000 and momentum.",
                    cash: -6000, fame: -8, wellBeing: -25, careerProgress: -10, hype: -15,
                    lesson: {
                        title: "Legal Battle Risk Assessment",
                        explanation: "Fighting trademark battles you're likely to lose wastes money and delays inevitable rebranding. If someone has prior registration, you'll probably lose. Accepting reality early costs less than fighting battles you can't win.",
                        realWorldExample: "Many artists have wasted money fighting losing trademark battles. Prior registration usually wins. Artists who accept trademark realities early and rebrand strategically fare better than those who fight and lose.",
                        tipForFuture: "If someone has clear prior trademark registration, don't waste money fighting. Rebrand strategically and early. Legal battles you'll lose cost more than strategic rebranding.",
                        conceptTaught: "brand-protection"
                    }
                }
            },
            {
                text: "Ignore it - operate in different markets",
                outcome: {
                    text: "You continue using your name, betting you operate in different geographic markets. For two years, it works fine. Then you try to expand internationally and face trademark infringement lawsuits. You're blocked from major markets and platforms. You're forced into expensive settlements and rebranding at the worst time - when you're trying to go global. Ignoring the problem made it catastrophic.",
                    cash: -12000, fame: -20, wellBeing: -35, careerProgress: -25, hype: -30,
                    lesson: {
                        title: "Delayed Problems Compound",
                        explanation: "Ignoring trademark conflicts doesn't make them disappear - it makes them worse. When you try to expand, dormant conflicts become active lawsuits at the worst possible time. Addressing issues early prevents catastrophic timing.",
                        realWorldExample: "Artists who ignore trademark conflicts face lawsuits when they try to expand internationally or sign major deals. The problem surfaces at the worst time, causing maximum damage. Early resolution prevents catastrophic timing.",
                        tipForFuture: "Don't ignore trademark conflicts hoping they'll disappear. They surface when you try to grow, causing maximum damage. Address naming issues early before they become career-limiting crises.",
                        conceptTaught: "brand-protection"
                    }
                }
            }
        ]
    },
    {
        title: "The Opening Act Opportunity",
        description: "A major artist touring through your city needs an opening act. Their team offers you the slot - 20 minutes, 5,000-person venue, $500 payment. It's exposure to a large audience but you'd be performing for fans who came for someone else. Some artists get booed off as openers. Risk it or decline?",
        conditions: { minFame: 28, minCareerProgress: 24 },
        choices: [
            {
                text: "Accept the opening slot - take the exposure",
                outcome: {
                    text: "You perform as opener. The audience is polite but not your fans - mild applause, some phone scrolling. But 300 people Shazam your songs and become followers. Three playlist curators in attendance add your music. The headliner's team is impressed and offers you three more opening slots on their tour. Opening acts are about industry and future fans, not immediate crowd reaction. The long game worked.",
                    cash: 500, fame: 8, wellBeing: 5, careerProgress: 12, hype: 15,
                    lesson: {
                        title: "Opening Act Long-Term Value",
                        explanation: "Opening act success isn't measured by crowd reaction - it's measured by industry impressions, music discovery (Shazams), and future opportunities. Opening slots build toward headlining. Audiences won't love you immediately, but the right people notice.",
                        realWorldExample: "Many headliners built careers opening for bigger artists. Burna Boy opened for others before headlining. Opening acts expose you to industry professionals and serious music fans who discover new artists. It's career investment.",
                        tipForFuture: "Take legitimate opening slots for established artists. Don't expect crowd love - expect industry exposure and discovery opportunities. Opening acts are stepping stones to headlining.",
                        conceptTaught: "career-advancement"
                    }
                }
            },
            {
                text: "Decline - only headline your own shows",
                outcome: {
                    text: "You decline, wanting to only perform for your own fans. A year passes - you're still playing 200-person venues. The artist who took the opening slot is now on tour as a co-headliner with the artist they opened for. Opening was a pathway they took and you didn't. Your pride kept you small. Headline status comes from opening act patience.",
                    cash: 0, fame: 1, wellBeing: 0, careerProgress: 2, hype: 0,
                    lesson: {
                        title: "Career Progression Pathways",
                        explanation: "Refusing to open for bigger artists because of pride limits growth. Most headliners started as openers. The pathway from opener to co-headliner to headliner is standard. Skipping steps doesn't work - you stay at your current level.",
                        realWorldExample: "Almost every major touring artist opened for others first. Refusing opening slots out of pride is refusing the standard career progression. Artists who accept the opener pathway typically progress faster than those who don't.",
                        tipForFuture: "Opening for established artists is part of normal career progression, not beneath you. Accept legitimate opening slots - they're stepping stones. Pride-based refusal of standard pathways slows growth.",
                        conceptTaught: "career-advancement"
                    }
                }
            }
        ]
    },
    {
        title: "The Social Media Manager Hiring Decision",
        description: "Managing your social media takes 15 hours weekly - you're overwhelmed. A professional social media manager offers services: $800/month for daily posting, engagement, and growth strategy. Your current following is 35K. Could hiring them free you to focus on music, or is $800 too much at your level?",
        conditions: { minFame: 32, minCareerProgress: 28, minCash: 5000 },
        choices: [
            {
                text: "Hire the social media manager for $800/month",
                outcome: {
                    text: "You hire them. They take over daily posting and engagement. Your follower growth accelerates from their expertise - 35K to 55K in 3 months. More importantly, you reclaim 15 hours weekly for music creation. You finish your album 2 months faster. The $2,400 (3 months) paid for itself through growth and creative productivity. Delegating was strategic.",
                    cash: -2400, fame: 10, wellBeing: 20, careerProgress: 18, hype: 25,
                    lesson: {
                        title: "Strategic Task Delegation",
                        explanation: "Hiring professionals for time-consuming tasks frees you to focus on your core skills. If $800/month social media management returns more through growth and creative productivity, it's worth it. Time is your most valuable resource - spend it wisely.",
                        realWorldExample: "Successful artists delegate social media, admin, and management tasks to focus on creation and performance. Taylor Swift, Beyoncé, and major artists have teams because delegation scales careers. You can't do everything yourself and grow.",
                        tipForFuture: "Evaluate hiring based on ROI and time value. If delegation returns more value than it costs (through growth and reclaimed creative time), hire. Your time should be spent on what only you can do.",
                        conceptTaught: "team-building"
                    }
                }
            },
            {
                text: "Keep managing it yourself - save the money",
                outcome: {
                    text: "You keep managing social media yourself. The 15 hours weekly continues draining you. Your music output suffers - you finish half the songs you planned. Your follower growth stagnates at 35K because you're too burned out to post consistently. After 6 months, you're exhausted and haven't grown. Saving $4,800 cost you creative output and growth. Time was more valuable than money.",
                    cash: 0, fame: 2, wellBeing: -15, careerProgress: 4, hype: 3,
                    lesson: {
                        title: "Time Value Recognition",
                        explanation: "Sometimes saving money costs more through lost productivity and opportunity. If managing social media prevents you from creating music and growing, the 'saved' money costs you more than hiring would. Recognize when your time is worth more than the money you're saving.",
                        realWorldExample: "Many independent artists burn out trying to do everything themselves to save money. Those who strategically hire for time-consuming tasks often progress faster despite the expense. Time is often more valuable than the money saved.",
                        tipForFuture: "Calculate the opportunity cost of doing everything yourself. If a task takes 15 hours weekly and prevents higher-value work, hiring might cost less than doing it yourself. Your creative time has value.",
                        conceptTaught: "team-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Genre Pressure From Fans",
        description: "You started making Afrobeats/Hip-Hop but you're inspired to experiment with electronic/alternative sounds. You release an experimental single. Your core fans are confused and some criticize: 'This isn't what we followed you for!' Do you stay true to artistic evolution or give fans what they expect?",
        conditions: { minFame: 35, minCareerProgress: 30 },
        choices: [
            {
                text: "Double down on experimentation - evolve your sound",
                outcome: {
                    text: "You release more experimental music. You lose 20% of your original fanbase who wanted you to stay the same. But you gain new fans who love the evolution. Three years later, your experimental phase is considered your best work. Critics respect your artistic courage. The fans who stayed are more devoted because they grew with you. Evolution was risky but rewarding.",
                    cash: 0, fame: 8, wellBeing: 25, careerProgress: 22, hype: 18,
                    lesson: {
                        title: "Artistic Evolution Courage",
                        explanation: "Artists who evolve lose some fans but gain new ones and critical respect. Staying creatively stagnant to please existing fans often leads to artistic death. Evolution is risky but necessary for long-term relevance and personal fulfillment.",
                        realWorldExample: "Every major artist faced backlash for evolving - Kanye with 808s, Radiohead with Kid A, Burna Boy's sound evolution. Those who evolve thoughtfully become legends. Those who stay static become nostalgia acts.",
                        tipForFuture: "Don't let fan expectations trap you creatively. Evolution loses some fans but gains new ones and prevents artistic stagnation. Artists who follow their creative instincts build legendary careers.",
                        conceptTaught: "artistic-integrity"
                    }
                }
            },
            {
                text: "Return to your original sound - give fans what they want",
                outcome: {
                    text: "You abandon experimentation and return to your original sound. Fans are happy initially. But over time, you become bored and creatively unfulfilled. Your music feels repetitive. Critics call you one-dimensional. Five years later, you're making the same music while younger artists experiment and get attention. Playing it safe kept fans but killed your artistic growth.",
                    cash: 500, fame: 5, wellBeing: -20, careerProgress: 8, hype: 10,
                    lesson: {
                        title: "Creative Stagnation Risk",
                        explanation: "Letting fan expectations dictate your artistry leads to creative stagnation and long-term irrelevance. Short-term fan satisfaction isn't worth long-term artistic death. Artists who don't evolve become nostalgia acts, not legends.",
                        realWorldExample: "Many artists trapped themselves by giving fans exactly what they wanted, becoming one-trick ponies. Artists who courage to evolve stay relevant decades longer. AC/DC vs. Radiohead - both successful, but evolution creates longevity.",
                        tipForFuture: "Balance fan expectations with artistic growth. You can evolve gradually without abandoning your core, but never let fans trap you in creative stagnation. Your artistic fulfillment matters.",
                        conceptTaught: "artistic-integrity"
                    }
                }
            },
            {
                text: "Blend both - gradual evolution while honoring roots",
                outcome: {
                    text: "You find middle ground - incorporating electronic elements into Afrobeats/Hip-Hop foundation rather than abandoning it completely. Fans appreciate the evolution that still feels like 'you.' You keep 90% of your fanbase while attracting new listeners. Critics praise your ability to evolve without alienating supporters. Gradual evolution was the smartest path.",
                    cash: 300, fame: 12, wellBeing: 15, careerProgress: 18, hype: 22,
                    lesson: {
                        title: "Strategic Artistic Evolution",
                        explanation: "You can evolve without completely abandoning what made fans love you. Gradual evolution that incorporates new elements into your foundation keeps existing fans while attracting new ones. Evolution doesn't require revolution.",
                        realWorldExample: "Most successful artists evolve gradually - Drake incorporated dancehall, The Weeknd evolved from dark R&B to pop, Wizkid gradually internationalized. Gradual evolution brings fans along rather than alienating them.",
                        tipForFuture: "You don't have to choose between artistic evolution and fan loyalty. Gradual incorporation of new influences into your foundation keeps fans while allowing growth. Evolution can be incremental.",
                        conceptTaught: "artistic-integrity"
                    }
                }
            }
        ]
    },
    {
        title: "The Controversial Social Issue Statement",
        description: "A major social issue is dominating conversations in your country - police brutality, political corruption, economic inequality. Fans are asking where you stand. Speaking out could alienate some audiences and sponsors, but silence feels complicit. Do you use your platform or stay neutral?",
        conditions: { minFame: 45, minCareerProgress: 40, minFameByDifficulty: { beginner: 38, realistic: 45, hardcore: 52 } },
        choices: [
            {
                text: "Speak out strongly - use your platform for justice",
                outcome: {
                    text: "You post a strong statement supporting justice and human rights. You lose two brand sponsors ($15,000) who don't want controversy. Some fans criticize you for 'being political.' But you gain respect from socially conscious audiences. Your core fanbase strengthens - they see you have values beyond music. Five years later, history vindicates your stance. Integrity was worth the cost.",
                    cash: -15000, fame: 10, wellBeing: 20, careerProgress: 12, hype: 15,
                    lesson: {
                        title: "Platform Responsibility Values",
                        explanation: "Using your platform for social justice has costs but builds respect and strengthens relationships with values-aligned audiences. Short-term financial losses from brands that want silence are worth long-term respect and alignment with values.",
                        realWorldExample: "Artists like Fela Kuti, Kendrick Lamar, Beyoncé, Burna Boy use platforms for social justice despite commercial risks. Those remembered as legends had principles. Those who stayed silent for commercial safety are forgotten.",
                        tipForFuture: "Decide whether you want to be remembered for music only or for standing for something. Speaking out has costs but builds legacy and strengthens values-aligned relationships. Integrity matters.",
                        conceptTaught: "social-responsibility"
                    }
                }
            },
            {
                text: "Stay completely silent - avoid all controversy",
                outcome: {
                    text: "You say nothing. You keep your sponsors and avoid controversy. But fans see your silence as complicity. Your most passionate supporters feel betrayed - you have a platform and won't use it for justice. You're seen as caring more about money than values. Ten years later, your silence during important moments defines you negatively. Playing it safe damaged your legacy.",
                    cash: 5000, fame: 3, wellBeing: -25, careerProgress: 5, hype: 8,
                    lesson: {
                        title: "Silence as Statement",
                        explanation: "Silence during important social moments is interpreted as choice to protect commercial interests over values. Fans remember who spoke up and who stayed silent. Complete neutrality during injustice is seen as complicity, not wisdom.",
                        realWorldExample: "Artists who stayed silent during major social movements are remembered poorly. Muhammad Ali's courage vs. other athletes' silence. History judges those with platforms who stayed silent when speaking mattered.",
                        tipForFuture: "Realize that silence is a choice that communicates values. Complete neutrality during injustice is interpreted as siding with power. Consider whether commercial safety is worth legacy damage.",
                        conceptTaught: "social-responsibility"
                    }
                }
            },
            {
                text: "Thoughtful statement - advocate without alienating",
                outcome: {
                    text: "You post a measured statement advocating for justice and human rights without attacking any specific group. You lose one cautious sponsor but keep most. Your statement is shared widely as an example of thoughtful celebrity advocacy. You gain respect across political divides for taking a stand without being inflammatory. Thoughtful courage was the optimal path.",
                    cash: -3000, fame: 15, wellBeing: 18, careerProgress: 20, hype: 20,
                    lesson: {
                        title: "Thoughtful Advocacy Balance",
                        explanation: "You can advocate for justice in ways that minimize unnecessary alienation while still taking meaningful stands. Thoughtful advocacy for universal values (justice, human rights) resonates across divides better than inflammatory statements. Wisdom and courage can coexist.",
                        realWorldExample: "Artists like Common, John Legend, and African artists like 2Baba advocate thoughtfully for justice. They take stands without unnecessary inflammatory language. Thoughtful advocacy reaches more people and creates broader coalitions.",
                        tipForFuture: "You can advocate without being unnecessarily divisive. Focus on universal values (justice, rights, dignity) rather than inflammatory attacks. Thoughtful courage often accomplishes more than aggressive statements.",
                        conceptTaught: "social-responsibility"
                    }
                }
            }
        ]
    },
    {
        title: "The Merchandise Quality Dilemma",
        description: "You want to launch merch. Quality manufacturers cost $8,000 for 500 units (t-shirts, hoodies). Cheap manufacturers cost $2,500 for the same, but quality is questionable. You could sell good merch for $30 (profit $6,000) or cheap merch for $20 (profit $7,500). Quality vs profit margins?",
        conditions: { minFame: 30, minCareerProgress: 26, minCash: 9000 },
        choices: [
            {
                text: "Cheap manufacturer - maximize profit margins",
                outcome: {
                    text: "You choose cheap manufacturing. The merch sells well initially but quality complaints flood in - shirts shrink after one wash, prints crack, colors fade. Your reputation suffers. Fans feel ripped off and stop buying future merch. You made $7,500 once but destroyed your merch credibility. Cheap quality was expensive mistake.",
                    cash: 7500, fame: -8, wellBeing: -15, careerProgress: -5, hype: -10,
                    lesson: {
                        title: "Quality vs Short-Term Profit",
                        explanation: "Cheap merchandise damages your brand and prevents future merch sales. Quality products create satisfied customers who buy repeatedly. Short-term profit maximization through quality compromise destroys long-term revenue and reputation.",
                        realWorldExample: "Artists with cheap merch face backlash and lose merch revenue streams. Artists known for quality merch (Kanye, Tyler the Creator, African artists with premium merch) build loyal customers who buy repeatedly.",
                        tipForFuture: "Never compromise on merch quality for short-term profits. Your name is on the product - quality reflects on you. Build merch reputation through quality, not maximum margins. Repeat customers beat one-time sales.",
                        conceptTaught: "brand-protection"
                    }
                }
            },
            {
                text: "Quality manufacturer - build long-term reputation",
                outcome: {
                    text: "You invest in quality manufacturing. Fans rave about the merch quality - it holds up after washing, fits well, looks great. They buy more and recommend it. Your merch becomes part of your brand reputation. You make $6,000 initially but fans keep buying every new release. Year two merch revenue: $15,000. Quality was the long-term play.",
                    cash: 6000, fame: 10, wellBeing: 12, careerProgress: 15, hype: 18,
                    lesson: {
                        title: "Quality Creates Repeat Business",
                        explanation: "Quality merchandise creates satisfied customers who buy repeatedly and recommend to others. Lower margins per item but higher lifetime value through repeat purchases and word-of-mouth. Quality is long-term revenue strategy.",
                        realWorldExample: "Artists with quality merch build sustainable revenue streams. Fans trust the brand and buy new releases. Quality merch becomes collectible and enhances artist brand. Premium quality creates premium perception.",
                        tipForFuture: "Invest in quality merchandise. It costs more upfront but builds loyal customers who buy repeatedly. Quality merch enhances your brand and creates sustainable revenue. Margins matter less than lifetime value.",
                        conceptTaught: "brand-protection"
                    }
                }
            }
        ]
    },
    {
        title: "The Sync Licensing Opportunity",
        description: "A TV show wants to license your song for a scene. They're offering $3,500 for worldwide perpetual rights. Your music supervisor friend says that's low - you should negotiate for $7,000+ or get residuals. But the show is popular and could give you exposure. Take the offer or risk them moving to another artist?",
        conditions: { minFame: 26, minCareerProgress: 22 },
        choices: [
            {
                text: "Accept $3,500 - take the exposure opportunity",
                outcome: {
                    text: "You accept $3,500. The song appears in a key emotional scene. Viewers Shazam it massively - you gain 10K followers and 200K streams. Three more sync opportunities come from supervisors who heard it on the show. Total sync revenue over the next year: $15,000. The 'low' initial offer led to multiple better opportunities. Exposure compounded.",
                    cash: 3500, fame: 12, wellBeing: 8, careerProgress: 15, hype: 20,
                    lesson: {
                        title: "Sync Exposure Value",
                        explanation: "Early sync placements aren't just about the fee - they're about exposure to music supervisors and audiences. One placement often leads to more as supervisors discover you. Sometimes taking 'low' offers creates pathways to better ones.",
                        realWorldExample: "Many artists' sync careers started with lower-paying placements that led to better opportunities. Music supervisors network and share discoveries. One placement gets you into the sync ecosystem.",
                        tipForFuture: "For first sync placements, consider exposure value beyond the fee. Sync supervisors discovering you can lead to many more placements. Building sync relationships matters as much as individual fees.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Negotiate for $7,000 - know your value",
                outcome: {
                    text: "You counter at $7,000. They meet you at $5,500. You earn $2,000 more for standing your ground. The placement still happens and brings exposure. Plus, you established reputation for knowing your value. Future sync supervisors respect that you negotiate professionally. Standing firm paid off without losing the opportunity.",
                    cash: 5500, fame: 10, wellBeing: 12, careerProgress: 14, hype: 18,
                    lesson: {
                        title: "Professional Negotiation",
                        explanation: "Professional negotiation often results in better terms without losing opportunities. Most initial offers have room for negotiation. Respectful counter-offers establish you as someone who values their work appropriately. Negotiation is expected and respected.",
                        realWorldExample: "Professional artists negotiate sync fees. Initial offers are often negotiable. Music supervisors respect artists who know their value and negotiate professionally. It's expected business practice, not offensive.",
                        tipForFuture: "Always negotiate sync offers respectfully. Initial offers usually have room for improvement. Negotiating establishes you as professional and knowledgeable. Don't leave money on table by accepting first offers.",
                        conceptTaught: "negotiation-basics"
                    }
                }
            },
            {
                text: "Demand $7,000+ or walk away",
                outcome: {
                    text: "You refuse to budge from $7,000+. They use another artist's song instead. You never hear from them again. That show placement launches the other artist's sync career - they get 15 more placements. Your inflexibility cost you entry into the sync world. Demanding rather than negotiating lost everything. Rigidity beat potential.",
                    cash: 0, fame: 0, wellBeing: -10, careerProgress: -3, hype: 0,
                    lesson: {
                        title: "Negotiation Flexibility",
                        explanation: "Inflexible demands kill opportunities. Negotiation requires give-and-take. Being unwilling to compromise on first offers often means losing opportunities entirely. Flexibility in negotiation is strength, not weakness.",
                        realWorldExample: "Artists who make inflexible demands often get replaced. Music supervisors have hundreds of options. Those who negotiate professionally get opportunities; those who make ultimatums get passed over.",
                        tipForFuture: "Negotiate but stay flexible. Counter-offer professionally but be willing to meet in middle. Inflexible demands kill opportunities. Better to get something than nothing through unreasonable rigidity.",
                        conceptTaught: "negotiation-basics"
                    }
                }
            }
        ]
    },
    {
        title: "The Creative Block Struggle",
        description: "You haven't written anything good in 8 weeks. You're creatively blocked and frustrated. You have three options: Force yourself to keep creating (discipline approach), take a complete 4-week break to recharge (rest approach), or try creative exercises and collaboration to spark inspiration (exploration approach). How do you handle creative block?",
        conditions: { minFame: 20, minCareerProgress: 16, maxWellBeing: 50 },
        choices: [
            {
                text: "Force through it - discipline over inspiration",
                outcome: {
                    text: "You force yourself to create daily despite feeling uninspired. The work is mediocre and you know it. After 4 more weeks, you're burned out and the block is worse. You've created 15 bad songs that aren't usable. Forcing it made the problem worse. Your creative well needs refilling, not forcing dry. Discipline without wisdom is counterproductive.",
                    cash: 0, fame: 0, wellBeing: -20, careerProgress: -5, hype: 0,
                    lesson: {
                        title: "Creative Block Force Backfire",
                        explanation: "Forcing creativity when genuinely blocked often produces bad work and deepens the block. Creative energy needs replenishment, not extraction. Sometimes discipline means resting when forcing would make things worse.",
                        realWorldExample: "Many artists have deepened creative blocks by forcing output. Writer's block, producer's block - they worsen with force. Artists who rest or explore new inputs typically break blocks faster than those who force.",
                        tipForFuture: "When genuinely blocked, forcing often worsens it. Consider whether you need rest, new inputs, or exploration rather than discipline. Sometimes the disciplined choice is rest, not forcing.",
                        conceptTaught: "creative-health"
                    }
                }
            },
            {
                text: "Take 4-week complete break - rest and recharge",
                outcome: {
                    text: "You take 4 weeks completely off music. You read, watch films, spend time in nature, experience life. When you return, you're overflowing with ideas. You write 6 songs in 2 weeks - some of your best work. The break refilled your creative well. Sometimes the most productive thing is doing nothing productive. Rest was the answer.",
                    cash: 0, fame: 3, wellBeing: 30, careerProgress: 12, hype: 8,
                    lesson: {
                        title: "Creative Rest Necessity",
                        explanation: "Creative output requires input. Taking breaks to experience life, consume art, and rest refills creative wells. Constant output without input creates blocks. Strategic rest is productive investment in future creativity.",
                        realWorldExample: "Many artists take extended breaks and return with their best work. Kendrick Lamar's multi-year gaps produce masterpieces. Frank Ocean's absences lead to brilliant albums. Creative rest isn't laziness - it's necessity.",
                        tipForFuture: "When creatively blocked, consider taking real breaks. Experience life, consume art, rest your mind. Creative wells refill through new experiences and rest. Strategic breaks prevent burnout and restore inspiration.",
                        conceptTaught: "creative-health"
                    }
                }
            },
            {
                text: "Explore new creative approaches and collaborate",
                outcome: {
                    text: "You try new creative exercises - different instruments, different genres, collaborating with artists outside your usual circle. The exploration is fun and low-pressure. You don't create finished songs immediately, but you discover new techniques and perspectives. Two weeks later, these explorations spark three strong songs. Playful exploration unlocked what forcing couldn't.",
                    cash: -600, fame: 5, wellBeing: 15, careerProgress: 10, hype: 10,
                    lesson: {
                        title: "Creative Block Through Play",
                        explanation: "Creative blocks often break through playful exploration without pressure for finished output. Trying new approaches, collaborating differently, and experimenting can spark inspiration. Sometimes the path around the block is sideways, not through.",
                        realWorldExample: "Artists often break blocks by playing with new sounds, genres, or collaborators. David Bowie constantly reinvented through exploration. African artists blend genres playfully. Creative play without pressure generates breakthroughs.",
                        tipForFuture: "When blocked, try playful exploration without pressure for finished work. New instruments, genres, collaborators, or techniques can spark inspiration. Creative play is productive even without immediate output.",
                        conceptTaught: "creative-health"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Video Viral Moment",
        description: "Your music video is suddenly going viral on TikTok - 2M views in 48 hours. But it's going viral for the 'wrong' reasons - people are making memes of a funny/awkward moment, not appreciating the music. You're getting attention but being treated as a joke. Do you lean into the meme or try to redirect to the music?",
        conditions: { minFame: 22, minCareerProgress: 18 },
        choices: [
            {
                text: "Lean into the meme - embrace the humor",
                outcome: {
                    text: "You make TikToks embracing the meme, showing you can laugh at yourself. Your participation makes you likable and accessible. The meme attention converts to 20K followers and 300K song streams as people discover your actual music is good. Leaning into it turned joke attention into genuine fans. Humor and self-awareness won.",
                    cash: 800, fame: 15, wellBeing: 10, careerProgress: 18, hype: 30,
                    lesson: {
                        title: "Viral Moment Adaptability",
                        explanation: "Virality often happens for unexpected reasons. Artists who embrace unplanned viral moments with humor and self-awareness convert joke attention to genuine fans. Fighting viral moments makes them worse; embracing them makes them opportunities.",
                        realWorldExample: "Lil Nas X turned 'Old Town Road' meme attention into superstardom. Many artists have embraced unexpected viral moments and converted them to career momentum. Self-awareness and humor make you likable.",
                        tipForFuture: "If you go viral for unexpected reasons, embrace it with humor. Fighting viral moments is futile. Lean into them, show personality, and convert attention to genuine interest. Humor is humanizing.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Ignore the meme - focus on the music",
                outcome: {
                    text: "You post serious content trying to redirect attention to your music. The internet sees you as unable to take a joke. The meme dies quickly because you didn't feed it. You gain 3K followers from people who discovered your music, but you missed opportunity to convert millions of views to lasting attention. Ignoring it wasted the viral moment.",
                    cash: 100, fame: 4, wellBeing: -5, careerProgress: 5, hype: 8,
                    lesson: {
                        title: "Viral Opportunity Recognition",
                        explanation: "Viral moments are opportunities regardless of context. Ignoring them or fighting them wastes potential to convert attention to genuine interest. The path from viral to sustainable rarely matches plans. Adaptability matters.",
                        realWorldExample: "Many artists missed opportunities by ignoring or fighting unexpected viral moments. Those who adapt to viral moments, even weird ones, typically convert them to career growth better than those who resist.",
                        tipForFuture: "When unexpected virality happens, engage with it rather than ignoring or fighting it. Any attention can convert to genuine interest if you respond with personality. Adapt to opportunities even when unexpected.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Try to 'correct' the narrative - get defensive",
                outcome: {
                    text: "You post: 'This video wasn't meant to be a meme. Please appreciate the art and message.' The internet turns on you for being self-serious and unable to take a joke. Your defensiveness becomes the new meme. You go viral again - but now for being uptight. Defensive responses made everything worse. You lost control by trying to control it.",
                    cash: 0, fame: -5, wellBeing: -20, careerProgress: -8, hype: -15,
                    lesson: {
                        title: "Defensive Viral Response Backfire",
                        explanation: "Trying to control viral moments or getting defensive about how you're being perceived makes internet turn against you. Defensiveness amplifies mocking. You can't control viral moments - only respond to them with grace or humor.",
                        realWorldExample: "Artists who get defensive about memes or viral moments typically face amplified mocking. The internet punishes self-seriousness and rewards humor. Defensive responses to virality always backfire.",
                        tipForFuture: "Never get defensive about viral moments, even unflattering ones. The internet punishes defensiveness and rewards humor. You can't control virality - only respond gracefully. Humor beats defense every time.",
                        conceptTaught: "crisis-management"
                    }
                }
            }
        ]
    },
    {
        title: "The Industry Showcase Performance",
        description: "You're invited to perform at an industry showcase - record labels, managers, and media will attend. No payment, but networking opportunity. The catch: it's the same night as a paid show ($800) you've already booked. Cancel the paid show for industry exposure or honor your commitment and miss the showcase?",
        conditions: { minFame: 24, minCareerProgress: 20, minCash: 1500 },
        choices: [
            {
                text: "Cancel paid show - prioritize industry showcase",
                outcome: {
                    text: "You cancel the paid show (losing $800 and upsetting the venue). At the showcase, you perform well but no labels or managers approach you - they saw 20 artists that night. You traded a paid show and venue relationship for nothing concrete. The industry showcase didn't guarantee results. You burned a bridge for an uncertain opportunity.",
                    cash: -800, fame: 2, wellBeing: -15, careerProgress: 3, hype: 5,
                    lesson: {
                        title: "Certain vs Uncertain Trade-offs",
                        explanation: "Trading certain opportunities (paid shows, existing relationships) for uncertain ones (industry showcases with no guarantees) is risky. Industry events don't guarantee results. Breaking commitments for uncertain opportunities damages reputation.",
                        realWorldExample: "Many artists cancel shows for industry opportunities that lead nowhere. Venues and promoters remember unreliability. Birds in hand (paid shows, relationships) often beat birds in bush (uncertain industry interest).",
                        tipForFuture: "Don't break existing commitments for uncertain opportunities. Industry showcases don't guarantee anything. Honor commitments unless opportunities come with concrete offers. Reputation for reliability has value.",
                        conceptTaught: "professionalism"
                    }
                }
            },
            {
                text: "Honor the paid show - maintain professionalism",
                outcome: {
                    text: "You perform the paid show as committed. The venue appreciates your reliability and books you for three more dates. You miss the showcase but maintain your professional reputation. Two weeks later, one of the managers from the showcase reaches out - they heard about you and like your music. Professionalism attracted opportunity without breaking commitments.",
                    cash: 800, fame: 5, wellBeing: 10, careerProgress: 8, hype: 10,
                    lesson: {
                        title: "Professional Reputation Value",
                        explanation: "Honoring commitments builds reputation that creates opportunities. Industry professionals value reliability. Good artists are plentiful; reliable professional artists are rare. Your reputation opens doors that talent alone can't.",
                        realWorldExample: "Artists known for professionalism and reliability get consistent work. Those who break commitments for better opportunities develop reputations that limit long-term opportunities. Venues, promoters, and industry remember.",
                        tipForFuture: "Build reputation for reliability by honoring commitments. Don't chase every shiny opportunity if it means breaking existing commitments. Professional reputation is career asset that compounds.",
                        conceptTaught: "professionalism"
                    }
                }
            }
        ]
    },
    {
        title: "The Long-Distance Collaboration Challenge",
        description: "An artist you respect from another country (Kenya/South Africa/US) wants to collaborate remotely. Time zones make communication hard. Sending files back and forth is slow and impersonal. You could fly there for 3 days ($1,200) to work in person, collaborate remotely over 2 months, or decline due to logistical challenges. Worth the effort?",
        conditions: { minFame: 28, minCareerProgress: 24, minCash: 2500 },
        choices: [
            {
                text: "Fly there for in-person session - invest $1,200",
                outcome: {
                    text: "You fly there for 3 intensive days. The in-person chemistry is electric - you create 4 songs together. Two become hits in both your markets. The face-to-face time built genuine friendship and creative partnership. Total cost: $1,200. Total value: career-making collaboration and lasting relationship. In-person investment paid massive dividends.",
                    cash: -1200, fame: 18, wellBeing: 20, careerProgress: 25, hype: 35,
                    lesson: {
                        title: "In-Person Collaboration Value",
                        explanation: "Remote collaboration is possible but in-person sessions create chemistry, efficiency, and relationships that digital can't match. Strategic travel for important collaborations often pays for itself through better results and stronger relationships.",
                        realWorldExample: "Most legendary collaborations happened face-to-face. While technology enables remote work, in-person sessions create magic that Zoom can't. Artists who invest in face-time for important collaborations typically get better results.",
                        tipForFuture: "For important collaborations, invest in in-person time when possible. The chemistry, efficiency, and relationship building justify travel costs. Remote is possible; in-person is often better for creating chemistry.",
                        conceptTaught: "collaboration-strategy"
                    }
                }
            },
            {
                text: "Collaborate remotely - save money and time",
                outcome: {
                    text: "You collaborate remotely over 2 months. Communication is frustrating due to time zones. The songs are good but don't have the magic you hoped for - something feels disconnected. You finish one decent song but the collaboration fizzles. Remote was efficient but lacked creative spark. You saved $1,200 but missed opportunity for something special.",
                    cash: 0, fame: 5, wellBeing: -5, careerProgress: 6, hype: 8,
                    lesson: {
                        title: "Remote Collaboration Limitations",
                        explanation: "Remote collaboration works but often lacks creative spark of in-person sessions. Time zones, communication delays, and lack of face-time limit chemistry. Sometimes saving money costs creative quality and relationship building.",
                        realWorldExample: "Many remote collaborations produce functional but uninspired work. While technology enables connection, it doesn't fully replicate in-person creative energy. Artists report remote sessions are efficient but often lack magic.",
                        tipForFuture: "Remote collaboration works for efficiency but consider in-person for special partnerships. Technology enables connection but doesn't replace face-to-face creative chemistry. Balance convenience with quality.",
                        conceptTaught: "collaboration-strategy"
                    }
                }
            }
        ]
    },

    // --- BATCH 7: DIVERSE CAREER SITUATIONS (10 scenarios) ---
    {
        title: "The Radio Payola Proposition",
        description: "A major radio DJ approaches you: 'Pay me $2,000 and I'll play your song in rotation for 2 months. Everyone does it - it's how you get airplay.' Radio exposure could reach 500K listeners, but payola is illegal and ethically questionable. Pay for play, hustle legitimately, or report it?",
        conditions: { minFame: 30, minCareerProgress: 25, minCash: 3000, minFameByDifficulty: { beginner: 24, realistic: 30, hardcore: 38 } },
        choices: [
            {
                text: "Pay the $2,000 - get the airplay",
                outcome: {
                    text: "You pay. Your song gets heavy rotation for 2 months. You gain 8K followers and $3,000 from increased streams and bookings. But word spreads in the industry that you paid for airplay. Other DJs expect payment now. Legit opportunities decline - people assume your success is bought, not earned. The $2,000 payment created a $2,000+ expectation everywhere. Payola trapped you.",
                    cash: 1000, fame: 12, wellBeing: -15, careerProgress: 8, hype: 15,
                    lesson: {
                        title: "Payola Short-Term vs Long-Term",
                        explanation: "Paying for airplay might bring immediate exposure but creates expectations that you'll pay for everything. It undermines organic opportunities and creates industry reputation that your success is bought. Shortcuts create long-term complications.",
                        realWorldExample: "Payola has corrupted music industries globally. Artists who pay become trapped in pay-to-play cycles. Those who build organically might grow slower but build sustainable careers without constant payola expectations.",
                        tipForFuture: "Avoid payola even when 'everyone does it.' It creates pay-to-play expectations that undermine organic opportunities. Build through legitimate promotion - it's slower but sustainable and ethical.",
                        conceptTaught: "industry-ethics"
                    }
                }
            },
            {
                text: "Decline and hustle legitimately - organic promotion",
                outcome: {
                    text: "You decline and focus on legitimate promotion - playlists, blogs, social media, smaller radio stations. Growth is slower but feels earned. Six months later, a major station picks up your song organically based on streaming numbers. You get airplay without paying. The organic path took longer but built sustainable momentum without ethical compromise. Legitimate hustle won.",
                    cash: 0, fame: 8, wellBeing: 15, careerProgress: 14, hype: 12,
                    lesson: {
                        title: "Organic Growth Sustainability",
                        explanation: "Legitimate promotion grows slower but builds sustainable career without ethical compromise or pay-to-play expectations. Organic growth creates opportunities based on merit, not payment. Long-term sustainability beats short-term payola shortcuts.",
                        realWorldExample: "Artists who build organically often have longer careers than payola artists. Streaming and social media reduced payola's necessity. Artists like Chance the Rapper, Macklemore, and independent African artists proved organic paths work.",
                        tipForFuture: "Focus on legitimate promotion channels - streaming, social media, organic radio. It's slower but sustainable and ethical. Modern tools reduce payola's necessity. Build on merit, not payments.",
                        conceptTaught: "industry-ethics"
                    }
                }
            },
            {
                text: "Report the DJ to station management",
                outcome: {
                    text: "You report the payola request. The DJ is fired. The station thanks you and starts playing your music as appreciation for exposing corruption. You become known as someone with integrity. However, other corrupt DJs blacklist you informally. You gain airplay from ethical stations but lose access to corrupt ones. Reporting had costs and benefits. Integrity was mixed bag.",
                    cash: 0, fame: 5, wellBeing: 10, careerProgress: 6, hype: 8,
                    lesson: {
                        title: "Whistleblowing Consequences",
                        explanation: "Reporting corruption has consequences - you might be rewarded by ethical actors but punished by corrupt ones. Whistleblowing is courageous but comes with career costs. Sometimes doing the right thing isn't rewarded as much as we hope.",
                        realWorldExample: "Industry whistleblowers often face backlash even when they're right. Corrupt networks retaliate. Reporting corruption is ethical but rarely without cost. Consider whether you're prepared for potential retaliation before reporting.",
                        tipForFuture: "Reporting corruption is ethical but comes with risks. Corrupt networks often retaliate. Be prepared for consequences - both positive (rewards from ethical actors) and negative (retaliation from corrupt ones).",
                        conceptTaught: "industry-ethics"
                    }
                }
            }
        ]
    },
    {
        title: "The Festival Slot Dilemma",
        description: "You're offered two festival slots on the same day: a small Afrobeats festival (1,500 people, your core audience, $600) or a large mainstream festival (10,000 people, mostly unfamiliar with your genre, $400). One builds deeper connection with your base; the other offers broader exposure. Which do you choose?",
        conditions: { minFame: 26, minCareerProgress: 22 },
        choices: [
            {
                text: "Small Afrobeats festival - deepen core fanbase",
                outcome: {
                    text: "You perform at the small festival. The crowd knows every word. You sell $800 in merch and gain 600 highly engaged followers. These fans become evangelists who promote you to others. Six months later, organic word-of-mouth from this dedicated base brings more growth than the mainstream exposure would have. Deepening your core multiplied reach. Depth beat breadth.",
                    cash: 1400, fame: 6, wellBeing: 20, careerProgress: 12, hype: 15,
                    lesson: {
                        title: "Core Audience Deepening Value",
                        explanation: "Deepening connection with core fans who evangelize for you often creates more sustainable growth than broad exposure to indifferent audiences. Passionate core fans multiply your reach through organic promotion. Depth creates breadth over time.",
                        realWorldExample: "Many successful artists prioritized core audiences over mainstream exposure early on. Dedicated fans become promoters. Tyler the Creator, Burna Boy, and others built by serving core audiences deeply before expanding broadly.",
                        tipForFuture: "Don't always chase biggest audience numbers. Deepening relationships with core fans who'll promote you creates sustainable growth. Passionate small audiences often generate more value than indifferent large ones.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Large mainstream festival - broad exposure",
                outcome: {
                    text: "You perform at the mainstream festival. Most attendees don't connect with your music - polite applause, minimal engagement. You gain 400 followers (4% conversion from 10,000 people) and sell $200 in merch. The broad exposure didn't convert because the audience wasn't pre-disposed to your genre. Exposure to wrong audience wasted opportunity. Breadth without fit failed.",
                    cash: 600, fame: 4, wellBeing: -5, careerProgress: 5, hype: 8,
                    lesson: {
                        title: "Audience Fit Importance",
                        explanation: "Large audiences don't guarantee results if they're not pre-disposed to your music. Targeted exposure to smaller, aligned audiences often converts better than broad exposure to mismatched audiences. Audience fit matters more than audience size.",
                        realWorldExample: "Artists often chase big stages only to find indifferent audiences don't convert. Genre-specific festivals typically generate better results than generic large festivals where you're mismatched. Alignment beats size.",
                        tipForFuture: "Prioritize audience fit over audience size. Smaller crowds aligned with your genre typically convert better than larger indifferent crowds. Targeted exposure beats broad misalignment.",
                        conceptTaught: "audience-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Session Musician Side Income",
        description: "A producer offers you steady session work - singing background vocals, writing hooks for other artists. $500-$800/week, reliable income, but takes 20 hours weekly away from your own music. Financial stability vs. creative focus - accept the session work or stay focused on your own career?",
        conditions: { minFame: 18, minCareerProgress: 14, maxCash: 8000 },
        choices: [
            {
                text: "Accept session work - financial stability",
                outcome: {
                    text: "You take the session work. The steady income ($2,400/month) relieves financial stress. You're less desperate, which makes you a better negotiator for your own opportunities. The session work also builds production relationships and skills. A year later, one producer you worked with offers to produce your album for free. Financial stability created unexpected opportunities and skill growth.",
                    cash: 2400, fame: 3, wellBeing: 15, careerProgress: 8, hype: 5,
                    lesson: {
                        title: "Financial Stability Benefits",
                        explanation: "Financial stability reduces desperation and improves decision-making. Side income can build relationships and skills while providing breathing room. Financial security makes you better negotiator and opens doors through professional relationships.",
                        realWorldExample: "Many successful artists did session work before breaking through - Luther Vandross, Sheryl Crow, Anderson .Paak. Session work provides stability, skill development, and industry relationships that accelerate careers.",
                        tipForFuture: "Don't dismiss session work as distraction from 'real' career. It provides stability, skills, and relationships that can accelerate your primary career. Financial security improves decision-making.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Decline - focus 100% on your own music",
                outcome: {
                    text: "You decline to focus completely on your music. Financial stress increases. You take desperate deals for quick cash - underpriced shows, bad contracts. Your financial desperation leads to poor decisions that cost you more than the session work would have paid. You finish more music but stress and bad deals hurt more than helped. Full focus without financial stability backfired.",
                    cash: -1500, fame: 5, wellBeing: -20, careerProgress: 6, hype: 8,
                    lesson: {
                        title: "Financial Desperation Costs",
                        explanation: "Financial desperation leads to poor decisions - underpriced deals, bad contracts, compromised negotiations. Sometimes diversifying income through side work (session work, teaching) prevents desperation decisions that cost more than side work takes.",
                        realWorldExample: "Many artists make career-damaging decisions from financial desperation. Those with stable side income often make better long-term decisions. Financial security enables better career choices.",
                        tipForFuture: "Financial stability enables better career decisions. If side work prevents desperation deals, the opportunity cost might be worth it. Desperation leads to bad deals that cost more than time.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Blog Feature Payment Request",
        description: "A mid-size music blog (50K monthly readers) offers to feature you. Their rate: $350 for a full article and social media promotion. Your friend says it's pay-for-press and undermines credibility. But you need exposure. Pay for the feature, pitch them for organic coverage, or skip it?",
        conditions: { minFame: 22, minCareerProgress: 18, minCash: 1500 },
        choices: [
            {
                text: "Pay $350 for the feature",
                outcome: {
                    text: "You pay. The article gets published and shared to their 50K readers. You gain 800 new followers and 50K streams over the next month. The ROI is positive - $350 for measurable growth. Some purists criticize pay-for-press, but results matter. The article exposed you to audiences who became real fans. Strategic promotion spending worked.",
                    cash: -350, fame: 8, wellBeing: 5, careerProgress: 10, hype: 12,
                    lesson: {
                        title: "Strategic Promotion Investment",
                        explanation: "Paying for legitimate media features isn't inherently unethical if disclosed and the platform has real audience. It's promotion budget, like any advertising. The question is ROI and authenticity of the platform. Strategic spending on legitimate platforms can accelerate growth.",
                        realWorldExample: "Many artists pay for promotion through ads, playlist pitching services, and media features. The line between ethical promotion spending and pay-for-play depends on disclosure and platform legitimacy. Effective promotion often requires budget.",
                        tipForFuture: "Distinguish between ethical promotion spending (transparent, legitimate platforms) and unethical pay-for-play (fake credibility). Strategic promotion budget is normal business practice. Evaluate ROI and platform legitimacy.",
                        conceptTaught: "marketing-strategy"
                    }
                }
            },
            {
                text: "Pitch them for organic coverage - earn the feature",
                outcome: {
                    text: "You pitch your story professionally - press kit, streaming stats, unique angle. They're impressed and feature you organically. The earned coverage feels more credible and they become ongoing supporters. You didn't pay but got the same feature plus genuine editorial relationship. Pitching worked better than paying.",
                    cash: 0, fame: 10, wellBeing: 15, careerProgress: 14, hype: 15,
                    lesson: {
                        title: "Earned Media Value",
                        explanation: "Earned media (organic coverage from good pitching) is more credible than paid features and often builds ongoing relationships. Professional pitching with compelling stories can achieve paid-feature results without cost. Invest in pitching skills.",
                        realWorldExample: "Artists with strong pitching skills get organic press that paid features can't match. Music bloggers want compelling stories - give them interesting angles and professional materials. Earned media often performs better than paid.",
                        tipForFuture: "Before paying for features, try pitching professionally. Compelling stories, strong materials, and good angles often earn coverage. Earned media is more credible and builds relationships beyond single features.",
                        conceptTaught: "marketing-strategy"
                    }
                }
            },
            {
                text: "Skip it - focus on organic growth only",
                outcome: {
                    text: "You skip both paid and pitched features, focusing only on social media and organic word-of-mouth. Growth is very slow - you gain 200 followers over 3 months. Without any structured promotion (paid or organic pitching), you're invisible. Purely organic growth without promotion effort stagnates. Some promotion is necessary.",
                    cash: 0, fame: 2, wellBeing: -5, careerProgress: 3, hype: 4,
                    lesson: {
                        title: "Promotion Necessity",
                        explanation: "Completely avoiding promotion (both paid and organic outreach) limits growth severely. 'Build it and they will come' doesn't work. Some combination of organic pitching, paid promotion, and social media is necessary. Pure passivity stagnates careers.",
                        realWorldExample: "Artists who refuse all promotion (idealistic approach) typically struggle. Modern music markets require active promotion - whether paid, organic pitching, or both. Visibility requires effort.",
                        tipForFuture: "Don't be so purist about promotion that you do nothing. Combination of organic pitching and strategic paid promotion accelerates growth. Completely passive approaches rarely work in competitive markets.",
                        conceptTaught: "marketing-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Copyright Strike Accusation",
        description: "You receive a copyright strike on your song - another artist claims you stole their melody. You didn't intentionally copy anything, but there are some similarities. Fighting costs $3,000 in legal fees. Settling admits fault. Ignoring it means your music gets taken down. What do you do?",
        conditions: { minFame: 28, minCareerProgress: 24, minCash: 4000 },
        choices: [
            {
                text: "Fight it legally - hire lawyers for $3,000",
                outcome: {
                    text: "You hire lawyers. After reviewing both songs, they find the similarities are minimal and unintentional - common musical patterns used by many artists. Your lawyers counter-claim successfully. The false strike is removed and the accuser is warned. You spent $3,000 but protected your catalog and reputation. Fighting false claims was necessary.",
                    cash: -3000, fame: 5, wellBeing: -10, careerProgress: 8, hype: 6,
                    lesson: {
                        title: "Copyright Defense Necessity",
                        explanation: "Fighting false copyright claims protects your catalog and prevents emboldening false accusers. If you're confident you didn't infringe, legal defense (though expensive) protects your career and reputation. Capitulating to false claims sets bad precedent.",
                        realWorldExample: "Many artists face false copyright claims from opportunistic accusers. Those who fight false claims typically win if claims are baseless. Legal defense is expensive but necessary for protecting work and deterring future false claims.",
                        tipForFuture: "If copyright claims are false and you have evidence, fight them. Legal costs are painful but protect your catalog. Settling false claims encourages more false claims. Defend legitimate work.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Settle and pay them off - avoid legal battle",
                outcome: {
                    text: "You settle for $5,000 to make it go away. Word spreads that you settled, which many interpret as admission of guilt. Other opportunistic accusers target you, filing more copyright claims knowing you'll settle. The settlement opened floodgates. You pay $12,000 total over two years in settlements. Settling false claims created more false claims. Capitulation was expensive mistake.",
                    cash: -12000, fame: -8, wellBeing: -25, careerProgress: -15, hype: -12,
                    lesson: {
                        title: "False Claim Settlement Risks",
                        explanation: "Settling false copyright claims signals willingness to pay without fight, attracting more opportunistic claims. Each settlement encourages more accusers. Fighting false claims (though expensive initially) often costs less long-term than settling repeatedly.",
                        realWorldExample: "Artists who settle copyright claims without fight often face repeated claims from opportunists. Those who fight false claims deter future ones. Settlements can create more problems than they solve if claims are baseless.",
                        tipForFuture: "Don't settle obviously false copyright claims just to avoid legal costs. Settling attracts more opportunistic claims. Fight false claims to protect catalog and deter future claims. Short-term legal costs beat long-term settlement spiral.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            },
            {
                text: "Ignore it - let the song get taken down",
                outcome: {
                    text: "You ignore the claim. Your song is removed from all platforms. You lose $800/month in streaming revenue and promotional momentum. Fans can't find the song and assume you removed it. Six months later ($4,800 lost), you finally address it, but momentum is gone. Ignoring cost more than fighting would have. Passivity was most expensive option.",
                    cash: -4800, fame: -10, wellBeing: -15, careerProgress: -12, hype: -18,
                    lesson: {
                        title: "Copyright Dispute Urgency",
                        explanation: "Ignoring copyright disputes doesn't make them disappear - it forfeits your content and revenue. The opportunity cost of having music unavailable often exceeds legal defense costs. Address copyright issues immediately, even if expensive.",
                        realWorldExample: "Artists who ignore copyright disputes lose revenue and momentum while music is unavailable. The longer you wait, the more you lose. Copyright disputes require immediate attention - ignoring them is most expensive option.",
                        tipForFuture: "Never ignore copyright disputes. Address them immediately - either fight or settle, but don't let music stay unavailable while you do nothing. Lost revenue and momentum typically exceed legal costs.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            }
        ]
    },
    {
        title: "The Album vs Singles Strategy Debate",
        description: "You have 12 completed songs. You can release them as an album (one moment, builds narrative, traditional approach) or as 12 singles over 12 months (constant content, algorithm-friendly, modern approach). Which release strategy serves you better at your career stage?",
        conditions: { minFame: 32, minCareerProgress: 28 },
        choices: [
            {
                text: "Release as album - traditional full project",
                outcome: {
                    text: "You release all 12 songs as an album. Initial streaming is strong (50K first week) but then drops sharply. After one week, the algorithm moves on and you have no content for months. Your 12 months of work gave you one week of visibility. Album format worked against streaming algorithms. You got artistic satisfaction but limited sustained momentum. Wrong format for current stage.",
                    cash: 1500, fame: 8, wellBeing: 10, careerProgress: 10, hype: 12,
                    lesson: {
                        title: "Release Strategy Platform Fit",
                        explanation: "Album releases work for established artists with devoted fans but struggle in streaming algorithms that favor consistent single releases. At early career stages, singles over time often perform better than album dumps. Match release strategy to your career stage and platform realities.",
                        realWorldExample: "Many independent artists find singles-over-time strategy works better than albums for streaming growth. Established artists can release albums successfully; emerging artists often benefit from consistent single releases keeping them algorithm-visible.",
                        tipForFuture: "Consider your career stage when choosing release strategy. If you're building audience, consistent singles might serve better than albums. Save album format for when you have devoted fanbase eager for full projects.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Release as singles - 12 months of content",
                outcome: {
                    text: "You release one single monthly for 12 months. Each release triggers algorithm promotion and keeps you visible. By month 12, you've accumulated 400K total streams and 8K followers - 10x the album strategy. Consistent visibility compounded. Streaming algorithms rewarded your consistent release schedule. Strategic format choice maximized results.",
                    cash: 4000, fame: 18, wellBeing: 5, careerProgress: 22, hype: 28,
                    lesson: {
                        title: "Algorithm-Optimized Release Strategy",
                        explanation: "Streaming algorithms favor consistent releases over content dumps. Singles spread over time keep you algorithm-visible and create multiple promotional moments. For growing artists, release frequency often matters more than release format.",
                        realWorldExample: "Successful streaming artists often release singles consistently rather than albums. The algorithm rewards release frequency. Artists like Lil Nas X, viral TikTok artists, and streaming-focused musicians use consistent singles strategy effectively.",
                        tipForFuture: "Use singles-over-time strategy for streaming growth. Each release triggers new algorithm promotion. Consistent visibility beats one-time album dump for growing audiences. Save albums for established fanbases.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Hybrid - release 4-song EPs quarterly",
                outcome: {
                    text: "You release three 4-song EPs across the year. Each EP creates promotional moment and gives listeners substantive project without overwhelming. You get 3 promotional cycles, algorithm benefits from consistency, and artistic satisfaction of cohesive projects. Total: 250K streams, 6K followers. The middle path worked well - consistency without sacrificing artistic cohesion.",
                    cash: 3000, fame: 14, wellBeing: 12, careerProgress: 18, hype: 22,
                    lesson: {
                        title: "Hybrid Release Strategy Balance",
                        explanation: "EPs released consistently provide middle ground between album artistic cohesion and singles algorithm optimization. Multiple promotional moments, substantive projects, and consistency. Often optimal compromise for independent artists.",
                        realWorldExample: "Many artists use EP strategy successfully - The Weeknd's early mixtapes, Steve Lacy's EPs, African artists releasing EPs. Provides artistic cohesion of albums with consistency benefits of singles strategy.",
                        tipForFuture: "Consider EP strategy as compromise between albums and singles. Provides multiple promotional moments, algorithm-friendly consistency, and artistic project cohesion. Often best of both approaches.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Mental Health Breaking Point",
        description: "You're burning out - making music feels like obligation, not joy. Depression is setting in. Your therapist recommends taking 6 months off music entirely to recover. But momentum feels precious. Can you afford to stop? Do you prioritize mental health or push through for career momentum?",
        conditions: { minFame: 35, minCareerProgress: 30, maxWellBeing: 40 },
        choices: [
            {
                text: "Take 6 months off - prioritize mental health",
                outcome: {
                    text: "You take 6 months completely off. You do therapy, rest, rediscover why you loved music. When you return, you're creatively rejuvenated. You create your best work - 8 songs in 3 months. The break didn't kill your career; it saved it. Your music is better, your health is better. Momentum can be rebuilt; mental health can't be replaced. The break was career investment.",
                    cash: 0, fame: 2, wellBeing: 50, careerProgress: 8, hype: 5,
                    lesson: {
                        title: "Mental Health Career Investment",
                        explanation: "Mental health breaks aren't career abandonment - they're career investment. Burnout destroys creativity and quality. Time off to recover often leads to better work than forcing through exhaustion. Sustainable careers require mental health maintenance.",
                        realWorldExample: "Many artists take mental health breaks and return stronger - Frank Ocean, Kendrick Lamar between albums, Kid Cudi's openness about mental health. Those who push through burnout often crash harder later. Mental health enables sustainable careers.",
                        tipForFuture: "If you're genuinely burned out, take breaks. Forcing through severe burnout often produces poor work and health crises. Momentum can be rebuilt; mental health damage compounds. Prioritize sustainable health over unsustainable momentum.",
                        conceptTaught: "career-sustainability"
                    }
                }
            },
            {
                text: "Push through - maintain momentum at all costs",
                outcome: {
                    text: "You refuse to stop. You keep creating despite hating it. The work is lifeless - even you can tell. Your depression worsens. Eight months later, you have a complete breakdown and are forced to stop for a year. Pushing through burnout made everything worse. The momentum you protected collapsed anyway, but now with mental health crisis. Refusing rest cost more than resting would have.",
                    cash: -2000, fame: -5, wellBeing: -50, careerProgress: -20, hype: -15,
                    lesson: {
                        title: "Burnout Forcing Backfire",
                        explanation: "Forcing through severe burnout typically leads to worse crashes, poor work, and forced longer breaks. Ignoring mental health doesn't preserve momentum - it guarantees momentum loss through eventual crash. Early rest prevents catastrophic crashes.",
                        realWorldExample: "Many artists crashed from ignoring burnout - breakdowns, hospitalizations, career-ending crises. Those who take breaks early typically recover faster than those who push until catastrophic failure. Your body eventually forces rest.",
                        tipForFuture: "Don't force through severe burnout hoping to preserve momentum. Burnout crashes lose more momentum than planned breaks. Take breaks when needed - forced breaks from crashes are longer and more damaging than chosen breaks.",
                        conceptTaught: "career-sustainability"
                    }
                }
            },
            {
                text: "Scale back - reduce output but don't stop completely",
                outcome: {
                    text: "You reduce output to 20% - one song every 2 months, no touring. You do therapy weekly. The reduced pace allows recovery without complete stoppage. Your mental health improves gradually. The music you do create is higher quality. A year later, you're healthier and still relevant. Scaling back was the balanced solution. Moderation beat extremes.",
                    cash: 500, fame: 4, wellBeing: 25, careerProgress: 10, hype: 8,
                    lesson: {
                        title: "Sustainable Pace Adjustment",
                        explanation: "Sometimes the answer isn't all-or-nothing - reducing pace substantially can allow recovery while maintaining some momentum. Sustainable reduced output often beats unsustainable full output or complete stopping. Find pace that balances health and career.",
                        realWorldExample: "Many artists adjust pace sustainably rather than choosing extremes. Reducing touring, output, or commitments while addressing mental health. Sustainable pace enables long careers. Balance beats extremes.",
                        tipForFuture: "Consider pace reduction as middle path between pushing through and stopping completely. Sustainable reduced output can allow mental health recovery while maintaining career thread. Not all situations require all-or-nothing choices.",
                        conceptTaught: "career-sustainability"
                    }
                }
            }
        ]
    },
    {
        title: "The Ghost Producer Offer",
        description: "A producer offers ghost production: They'll create tracks under your name for $800 each. You'd release music consistently without having to create it yourself. But it's deceptive - passing off others' work as yours. The music would be good and consistent. Does the deception matter if fans enjoy it?",
        conditions: { minFame: 24, minCareerProgress: 20, minCash: 5000 },
        choices: [
            {
                text: "Accept - use ghost production for consistency",
                outcome: {
                    text: "You release ghost-produced tracks under your name. They're good and fans enjoy them. For two years it works. Then a dispute with the producer leads to exposure - they reveal they made your music. Your fanbase feels betrayed. Your credibility collapses. Venues and collaborators distance themselves. The deception destroyed everything you built. Authenticity mattered more than you thought.",
                    cash: -2400, fame: -25, wellBeing: -35, careerProgress: -40, hype: -45,
                    lesson: {
                        title: "Authenticity Career Foundation",
                        explanation: "Building career on deception creates vulnerability to exposure that can destroy everything. Fans value authenticity - when deception is revealed, trust collapses and careers end. Short-term convenience isn't worth long-term existential risk.",
                        realWorldExample: "Artists exposed for ghost production face career-ending scandals - Milli Vanilli is the most famous example. Fans forgive mistakes but rarely forgive systematic deception. Authenticity is career foundation that can't be faked.",
                        tipForFuture: "Never build career on systematic deception like undisclosed ghost production. If exposed (and deception often is), it destroys everything. If you use collaborators, credit them. Authenticity is too important to risk.",
                        conceptTaught: "artistic-integrity"
                    }
                }
            },
            {
                text: "Decline - create everything yourself, even if inconsistent",
                outcome: {
                    text: "You decline and create everything yourself. Output is inconsistent - some months you release nothing, sometimes three songs. But everything is authentic. Fans appreciate knowing it's genuinely your work. Your inconsistent but authentic catalog builds trust and credibility. When you do release, engagement is high because fans trust you. Authenticity created sustainable foundation.",
                    cash: 0, fame: 8, wellBeing: 15, careerProgress: 12, hype: 10,
                    lesson: {
                        title: "Authentic Inconsistency Value",
                        explanation: "Inconsistent but authentic output builds trust better than consistent but fraudulent output. Fans value authenticity and forgive inconsistency. Long-term credibility beats short-term consistency achieved through deception.",
                        realWorldExample: "Artists with inconsistent output but authentic work maintain credibility - Frank Ocean's long gaps, D'Angelo's delays. Fans prefer authentic artists who release when they have something real to say over fraudulent consistency.",
                        tipForFuture: "Prioritize authenticity over consistency. Inconsistent authentic output maintains credibility; consistent fraud risks career-ending exposure. Fans value realness over production schedules.",
                        conceptTaught: "artistic-integrity"
                    }
                }
            },
            {
                text: "Collaborate openly - credit producers and work with them",
                outcome: {
                    text: "You work with the producer as credited collaborator rather than ghost producer. You co-create and openly credit them. This is transparent and ethical. The music is still high quality and consistent, but now it's honest collaboration. Fans respect the transparency. The producer becomes long-term creative partner. Honest collaboration worked better than deception.",
                    cash: -800, fame: 12, wellBeing: 20, careerProgress: 18, hype: 15,
                    lesson: {
                        title: "Transparent Collaboration Model",
                        explanation: "Working with producers and collaborators transparently achieves consistency and quality without deception. Credited collaboration is ethical and sustainable. Many successful artists openly collaborate with producers and writers. Transparency is strength.",
                        realWorldExample: "Most successful artists collaborate openly with producers and writers - credited on every song. Beyoncé, Rihanna, Drake openly work with teams. Transparent collaboration is industry standard. It's ethical and effective.",
                        tipForFuture: "If you need production help, collaborate openly with credited partners rather than ghost producers. Transparent collaboration is ethical, sustainable, and industry-standard. There's no shame in working with others if you're honest.",
                        conceptTaught: "artistic-integrity"
                    }
                }
            }
        ]
    },
    {
        title: "The Streaming Manipulation Offer",
        description: "A service offers to boost your streaming numbers: '10,000 guaranteed streams for $200. No bots - real accounts managed by us.' It would push you into playlist algorithms and make you look more popular. But it's artificial inflation that violates platform terms. Risk it or grow organically?",
        conditions: { minFame: 20, minCareerProgress: 16, minCash: 1000 },
        choices: [
            {
                text: "Buy the streams - boost your numbers",
                outcome: {
                    text: "You buy 10,000 streams. Initially it works - the algorithm notices and adds you to playlists. Two months later, Spotify's fraud detection flags your account. All your music is removed from playlists and your account is shadow-banned. Your real organic streams decrease because algorithm now distrusts you. The $200 destroyed your organic growth trajectory. Fraud detection caught you.",
                    cash: -200, fame: -8, wellBeing: -20, careerProgress: -15, hype: -25,
                    lesson: {
                        title: "Streaming Fraud Detection Risk",
                        explanation: "Platforms have sophisticated fraud detection that catches artificial streaming inflation. Getting caught results in penalties (playlist removal, shadow-bans) that damage organic growth. The risk far exceeds potential benefit. Fraud detection is getting better continuously.",
                        realWorldExample: "Streaming platforms aggressively combat fraud. Artists caught with fake streams face penalties that damage legitimate growth. Platforms prioritize genuine engagement. Getting caught can derail careers. The risk isn't worth the temporary boost.",
                        tipForFuture: "Never buy fake streams. Fraud detection is sophisticated and penalties severe. Artificial inflation risks your entire streaming presence. Build organically - it's slower but safe and sustainable.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Grow organically - no shortcuts",
                outcome: {
                    text: "You focus on organic growth - social media, playlisting legitimate pitching, collaborations. Growth is slow but real. Every follower and stream is genuine. A year later, you have 50K organic streams and algorithm trust. Your genuine engagement rates are higher than artists who bought streams. Organic growth created sustainable foundation. Patience beat fraud.",
                    cash: 0, fame: 8, wellBeing: 10, careerProgress: 14, hype: 12,
                    lesson: {
                        title: "Organic Growth Sustainability",
                        explanation: "Organic growth is slower but builds sustainable career on genuine engagement. Real fans convert to concerts, merch sales, and long-term support. Fake numbers provide nothing beyond temporary appearance. Real growth creates real career.",
                        realWorldExample: "All lasting careers are built on organic growth. Artists with fake numbers are exposed eventually and have no real fanbase. Those who grow genuinely might grow slower but build sustainable careers with genuine supporters.",
                        tipForFuture: "Resist temptation to buy fake engagement. Organic growth creates real career foundation. Fake numbers are empty metrics that don't convert to real support. Patience and authenticity build sustainable careers.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The International Touring Opportunity",
        description: "You're offered a 3-week tour across 5 African countries (Ghana, Kenya, South Africa, Nigeria, Tanzania). The pay is $8,000 total but expenses will be $3,500. It's exposure to new markets but 3 weeks away from home and networking in your base. Build internationally or focus locally?",
        conditions: { minFame: 40, minCareerProgress: 35, minCash: 6000, minFameByDifficulty: { beginner: 32, realistic: 40, hardcore: 48 } },
        choices: [
            {
                text: "Take the tour - expand internationally",
                outcome: {
                    text: "You tour 5 countries over 3 weeks. Crowds are smaller than home but enthusiastic. You gain 5K followers across new markets and establish relationships with promoters in each country. A year later, those promoters book you again at higher rates. The tour was investment in international presence that compounds. Geographic diversification opened new revenue streams. International expansion paid off.",
                    cash: 4500, fame: 15, wellBeing: 0, careerProgress: 22, hype: 25,
                    lesson: {
                        title: "International Market Development",
                        explanation: "Early international touring builds relationships and presence in new markets that compound over time. Initial tours might break even or small profit, but they establish foundation for higher-paying return tours. Geographic diversification creates sustainability.",
                        realWorldExample: "Most internationally successful African artists toured regionally before global success. Burna Boy, Wizkid, Davido built pan-African presence before worldwide fame. Regional touring creates foundation for international careers.",
                        tipForFuture: "Don't be afraid to tour new markets even if initial profit is low. You're investing in relationships and presence that enable future higher-paying tours. Geographic diversification creates career resilience.",
                        conceptTaught: "career-expansion"
                    }
                }
            },
            {
                text: "Decline - focus on solidifying home market",
                outcome: {
                    text: "You focus on your home market. You do local shows and networking. Growth is solid locally but you remain geographically limited. Two years later, you're a solid local artist but haven't expanded beyond one market. The international opportunity you declined went to another artist who now tours globally. Geographic limitation capped your potential. Staying local was safe but limiting.",
                    cash: 1500, fame: 6, wellBeing: 10, careerProgress: 8, hype: 10,
                    lesson: {
                        title: "Geographic Limitation Risks",
                        explanation: "Focusing only on home market creates geographic vulnerability and limits growth potential. Artists who expand into multiple markets build resilience and higher ceilings. Safety of staying local often becomes career ceiling.",
                        realWorldExample: "Artists who never expand geographically often plateau. Those who tour broadly (regionally, internationally) typically have longer sustainable careers. Geographic diversification creates opportunities and reduces dependence on single markets.",
                        tipForFuture: "Don't let comfort in home market prevent geographic expansion. Touring new markets builds resilience and raises career ceiling. Geographic limitation often becomes career limitation. Expand when opportunities arise.",
                        conceptTaught: "career-expansion"
                    }
                }
            }
        ]
    },

    // --- BATCH 8: POSITIVE GROWTH FOCUS (10 scenarios - 9 positive/neutral, 1 risky) ---
    {
        title: "The College Campus Tour Offer",
        description: "A campus events coordinator wants to book you for a 5-university tour. $3,500 total, young audience, chance to sell merch and build student fanbase. College crowds are energetic and students become lifelong fans if they connect with you early. Good opportunity to grow?",
        conditions: { minFame: 22, minCareerProgress: 18 },
        choices: [
            {
                text: "Accept the college tour - build young fanbase",
                outcome: {
                    text: "You tour 5 campuses over 2 weeks. Students are incredibly engaged - they sing along, buy merch ($2,800 total), and post content everywhere. You gain 4K followers, mostly college-aged who become devoted fans. Three students start fan pages promoting you. College audiences became your evangelists. The young fanbase is growing your career organically through passionate support.",
                    cash: 6300, fame: 12, wellBeing: 15, careerProgress: 18, hype: 25,
                    lesson: {
                        title: "College Audience Investment Value",
                        explanation: "College students who discover you early often become lifelong fans. They're passionate, social media active, and create organic promotion. Building young devoted fanbase creates sustainable long-term career foundation. Student fans compound over time.",
                        realWorldExample: "Many artists built careers through college touring - John Legend, Macklemore, Common, campus tours. Students who connect early remain fans for decades. College audiences are career investment with long-term returns.",
                        tipForFuture: "Don't underestimate college touring. Students are passionate early adopters who become evangelists. Building young fanbase creates long-term sustainability. College shows are career investment, not just paychecks.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Negotiate for higher payment - $5,000 minimum",
                outcome: {
                    text: "You counter at $5,000. They have a fixed budget and book another artist instead. You miss the opportunity to build student fanbase. The artist who took it gains massive college following and becomes popular among young audiences. Your negotiation killed an opportunity that wasn't primarily about money - it was about audience building. You overvalued payment and undervalued exposure.",
                    cash: 0, fame: 0, wellBeing: -5, careerProgress: 0, hype: 0,
                    lesson: {
                        title: "Opportunity Cost Recognition",
                        explanation: "Some opportunities are more valuable for audience building than immediate payment. College tours build young fanbase worth more than higher fees elsewhere. Recognize when opportunity value exceeds payment amount. Strategic thinking beat short-term payment maximization.",
                        realWorldExample: "Artists who negotiate college shows purely on payment often miss audience-building opportunities. Those who recognize strategic value of young audiences typically prioritize exposure over maximum fees for college markets.",
                        tipForFuture: "Evaluate opportunities beyond immediate payment. College shows, festival slots, and audience-building opportunities might be more valuable than higher-paying alternatives. Strategic value sometimes exceeds monetary value.",
                        conceptTaught: "career-advancement"
                    }
                }
            }
        ]
    },
    {
        title: "The Local Business Sponsorship",
        description: "A local business owner who loves your music offers $500/month sponsorship - logo on your social media, mentions at shows, and wearing their branded merch at performances. It's authentic (you actually like their products) and $6,000/year helps a lot. Small local sponsorship - worth it?",
        conditions: { minFame: 20, minCareerProgress: 16, maxCash: 12000 },
        choices: [
            {
                text: "Accept the sponsorship - build local partnership",
                outcome: {
                    text: "You accept and promote them authentically. The owner becomes your biggest supporter - attends shows, promotes you to customers, introduces you to other business owners. You gain 3 more local sponsors through their network ($1,200/month total). Local business community becomes your support network. The authentic partnership created unexpected opportunities and financial stability. Local relationships multiplied.",
                    cash: 6000, fame: 8, wellBeing: 15, careerProgress: 14, hype: 12,
                    lesson: {
                        title: "Local Partnership Network Effects",
                        explanation: "Authentic local partnerships create network effects - one sponsor connects you to others. Local businesses who support you become promoters and connectors. Small sponsorships compound through relationship networks. Community support creates stability.",
                        realWorldExample: "Many independent artists build careers on local business sponsorships that create community support networks. Local partnerships provide stability and introduce you to other opportunities. Community investment in artists creates mutual benefit.",
                        tipForFuture: "Don't dismiss small local sponsorships. They create community support, financial stability, and network effects through business relationships. Local partnerships often lead to more opportunities through connections.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Decline - wait for bigger brand deals",
                outcome: {
                    text: "You decline, hoping for major brand sponsorships. A year passes - no major brands approach you. You could have earned $6,000 from the local business and built relationships. The small opportunity you declined could have provided stability while you grew. Waiting for perfect opportunities cost you real opportunities. Perfectionism was expensive.",
                    cash: 0, fame: 2, wellBeing: -5, careerProgress: 3, hype: 4,
                    lesson: {
                        title: "Perfect Opportunity Fallacy",
                        explanation: "Waiting for perfect opportunities often means missing good opportunities. Small legitimate opportunities provide value while you grow toward bigger ones. Perfectionism prevents progress. Taking good opportunities beats waiting indefinitely for perfect ones.",
                        realWorldExample: "Many artists wait for major brand deals while declining smaller opportunities. Those who accept appropriate-sized opportunities build stability and relationships. Perfect opportunities are rare; good opportunities are available.",
                        tipForFuture: "Don't let pursuit of perfect opportunities prevent accepting good ones. Small legitimate partnerships provide value and stability. Build with what's available rather than waiting indefinitely for ideal scenarios.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Teacher Side Hustle",
        description: "Local parents want you to teach music lessons - voice, instruments, music production. $40/hour, 10 hours/week potential = $1,600/month. Teaching takes time but builds community reputation and provides steady income. Plus you'd be investing in next generation. Worth your time?",
        conditions: { minFame: 18, minCareerProgress: 14, maxCash: 8000 },
        choices: [
            {
                text: "Start teaching - share knowledge and earn",
                outcome: {
                    text: "You start teaching 10 hours weekly. Students are eager and grateful. Parents become your biggest fans - they attend shows and promote you everywhere. Your teaching builds community reputation as generous artist who invests in youth. Plus the $1,600/month provides financial breathing room. One talented student becomes your protégé and collaborator. Teaching enriched your career in unexpected ways.",
                    cash: 4800, fame: 10, wellBeing: 20, careerProgress: 15, hype: 12,
                    lesson: {
                        title: "Teaching Multiple Benefits",
                        explanation: "Teaching provides income, community reputation, devoted fans (students and parents), and sometimes collaborators. It builds local support network while providing financial stability. Teaching is career investment, not distraction. Multiple benefits compound.",
                        realWorldExample: "Many successful artists teach - Herbie Hancock, Questlove, and countless musicians balance performing and teaching. Teaching builds community, provides income, and creates devoted supporters. It's respected career addition.",
                        tipForFuture: "Consider teaching for multiple benefits beyond income. It builds community support, creates devoted fans, provides stability, and sometimes produces collaborators. Teaching enhances career rather than detracting from it.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Focus only on your music - no teaching",
                outcome: {
                    text: "You decline to focus exclusively on music. Financial stress increases without the supplemental income. You take desperate low-paying gigs to pay bills. The community reputation you could have built through teaching goes to another artist who becomes locally beloved. Full focus without financial stability created more stress and worse decisions. Teaching could have enabled better music focus.",
                    cash: -1200, fame: 3, wellBeing: -10, careerProgress: 5, hype: 6,
                    lesson: {
                        title: "Financial Stability Enables Focus",
                        explanation: "Sometimes side work enables better music focus by reducing financial desperation. Financial stress undermines creativity and leads to poor decisions. Strategic side income can improve music career by providing stability that enables better choices.",
                        realWorldExample: "Many artists maintain side work for stability - session work, teaching, production for others. Financial security enables better career decisions. Artists with stability often make better creative choices than desperate artists.",
                        tipForFuture: "Don't assume side work undermines music career. Strategic supplemental income often enables better music focus by reducing financial desperation. Stability improves decision-making and creativity.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "The Community Music Festival Headliner",
        description: "Your hometown community festival wants you to headline. Payment is only $1,000 but it's your community - family, childhood friends, people who knew you before music. Opportunity to give back and celebrate with community that supported you. Meaningful beyond money?",
        conditions: { minFame: 30, minCareerProgress: 26 },
        choices: [
            {
                text: "Headline the community festival - give back",
                outcome: {
                    text: "You headline for your community. The show is emotional - people who knew you as a kid watching you perform on the big stage. Your community pride multiplies. Local media covers it heavily. Community members promote you to everyone they know. The goodwill and emotional fulfillment was worth more than money. Your community becomes your most devoted promotional army. Giving back created unexpected returns.",
                    cash: 1000, fame: 8, wellBeing: 30, careerProgress: 12, hype: 18,
                    lesson: {
                        title: "Community Investment Returns",
                        explanation: "Performing for your community at below-market rate creates goodwill and devoted support that money can't buy. Community members who see you give back become your most passionate promoters. Emotional fulfillment and relationship strengthening have career value.",
                        realWorldExample: "Most successful artists perform for their communities at reduced rates - homecoming shows, local festivals. Community support creates foundation. Artists who give back build loyal bases that support careers for decades.",
                        tipForFuture: "Don't price yourself out of community opportunities. Performing for people who supported you early creates goodwill worth more than maximum payment. Community investment is career investment.",
                        conceptTaught: "community-building"
                    }
                }
            },
            {
                text: "Decline - only do higher-paying shows now",
                outcome: {
                    text: "You decline, saying your rate is now $3,000 minimum. Community members feel you've forgotten where you came from. Family and childhood friends are disappointed. Local support for you cools significantly. Two years later, you wish you had that hometown support and goodwill. Pricing yourself out of community damaged relationships money can't repair. Maximizing payment cost you something more valuable.",
                    cash: 0, fame: 2, wellBeing: -15, careerProgress: 3, hype: 4,
                    lesson: {
                        title: "Community Relationship Value",
                        explanation: "Pricing yourself out of community opportunities damages relationships and support worth more than payment differences. Community goodwill is career asset that money can't buy. Some opportunities are about relationships, not payment maximization.",
                        realWorldExample: "Artists who abandon communities for higher payments often regret it. Community support is foundation many successful careers are built on. Those who maintain community connections have stronger, more sustainable support than those who price out.",
                        tipForFuture: "Make exceptions for genuine community opportunities. The goodwill, relationships, and support are worth more than payment differences. Don't let success make you forget community that supported you.",
                        conceptTaught: "community-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Podcast Interview Series Opportunity",
        description: "A podcaster wants to do a 4-episode series about your music journey. No payment, but it's long-form storytelling that builds deep connection with listeners. The podcast has 15K loyal listeners. Time investment for relationship building - worth it?",
        conditions: { minFame: 24, minCareerProgress: 20 },
        choices: [
            {
                text: "Do the podcast series - tell your story",
                outcome: {
                    text: "You do 4 episodes sharing your journey deeply. Listeners connect with your story and become devoted fans. You gain 2K highly engaged followers who feel like they know you personally. The podcast episodes become content you share for years. Deep storytelling created devoted fanbase that casual content couldn't. Long-form connection built stronger relationships than quick exposure.",
                    cash: 0, fame: 10, wellBeing: 15, careerProgress: 16, hype: 20,
                    lesson: {
                        title: "Long-Form Storytelling Value",
                        explanation: "Long-form content that tells your story deeply creates stronger fan connections than quick exposure. Podcasts, documentaries, and in-depth content build devoted fans who feel personal connection. Deep engagement beats broad shallow exposure.",
                        realWorldExample: "Artists who do podcast tours often build devoted fanbases - Joe Rogan Effect, Drink Champs, podcast appearances create deep engagement. Listeners who hear your full story become more devoted than those who hear one song.",
                        tipForFuture: "Invest in long-form storytelling opportunities even without payment. Podcasts, documentaries, and in-depth interviews build devoted fans through deep connection. Quality of engagement matters more than quantity.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Decline - focus only on paid media",
                outcome: {
                    text: "You decline, only doing paid press. You get some paid features but they're shallow and don't build deep connections. Your fanbase stays superficial - people who know your music but don't connect with your story. A year later, your engagement rates are low despite decent follower count. No deep connection means weak support. Surface-level fans don't become devoted supporters.",
                    cash: 500, fame: 4, wellBeing: 0, careerProgress: 5, hype: 6,
                    lesson: {
                        title: "Superficial vs Deep Engagement",
                        explanation: "Only pursuing paid press often results in superficial coverage that doesn't build deep fan connections. Free long-form storytelling can create more devoted fans than paid shallow features. Depth of engagement matters more than payment.",
                        realWorldExample: "Artists with devoted fanbases typically invested in long-form storytelling - podcasts, documentaries, in-depth interviews. Surface-level paid press creates awareness but not devotion. Deep storytelling builds real relationships.",
                        tipForFuture: "Don't only chase paid media. Unpaid long-form storytelling often builds deeper fan connections than paid shallow coverage. Invest in opportunities that let you share your story deeply.",
                        conceptTaught: "audience-building"
                    }
                }
            }
        ]
    },
    {
        title: "The YouTube Cover Artist Collaboration",
        description: "A YouTuber with 200K subscribers wants to cover your song on their channel. They'll link to your music and credit you fully. No payment either way, just cross-promotion. Their audience discovers new artists through covers. Good exposure opportunity?",
        conditions: { minFame: 20, minCareerProgress: 16 },
        choices: [
            {
                text: "Encourage the cover - welcome cross-promotion",
                outcome: {
                    text: "You enthusiastically support the cover. They make a great version that gets 80K views. Their description links to your original and praises your work. You gain 3K subscribers and 150K streams from people discovering you through the cover. You engage with their audience in comments, converting viewers to fans. Cross-promotion worked beautifully. Collaboration multiplied both your audiences.",
                    cash: 0, fame: 12, wellBeing: 10, careerProgress: 15, hype: 22,
                    lesson: {
                        title: "Cover Cross-Promotion Benefits",
                        explanation: "Encouraging covers creates cross-promotion opportunities that expose you to new audiences. YouTubers and content creators covering your music authentically bring their audiences to you. Supporting covers builds relationships and amplifies reach.",
                        realWorldExample: "Many songs became hits through covers - Lewis Capaldi, Billie Eilish, and others got massive exposure from cover artists. Supporting covers rather than blocking them creates collaborative growth. Covers amplify original artists.",
                        tipForFuture: "Encourage covers from legitimate content creators. Covers expose you to their audiences and create authentic cross-promotion. Collaboration beats protection for independent artists building audiences.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Request payment - charge them licensing fee",
                outcome: {
                    text: "You ask for $200 licensing fee. They can't afford it and cover a different artist instead. You miss exposure to 200K subscribers. The defensive approach to your rights cost you promotional opportunity. The artist they covered instead gains the exposure you could have had. Overprotecting rights prevented growth opportunity.",
                    cash: 0, fame: 0, wellBeing: -5, careerProgress: 0, hype: 0,
                    lesson: {
                        title: "Rights Protection vs Promotion Balance",
                        explanation: "At early career stages, encouraging organic covers often provides more value than protecting rights strictly. Exposure from legitimate covers can accelerate growth. Balance rights protection with promotional benefits. Strategic generosity often serves you better than strict protection.",
                        realWorldExample: "Independent artists who encourage covers often grow faster than those who strictly protect rights. Major artists can demand payment; emerging artists benefit from organic promotion. Stage-appropriate strategy matters.",
                        tipForFuture: "Consider career stage when deciding on cover permissions. When building audience, allowing covers often provides more value than licensing fees. Strategic generosity can accelerate growth.",
                        conceptTaught: "Rights and Royalties"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Production Workshop Teaching",
        description: "A youth center asks you to teach a weekend music production workshop to teens from underserved communities. Payment is $400 but it's about impact - teaching young people who can't afford professional lessons. Giving back to next generation through skills sharing?",
        conditions: { minFame: 26, minCareerProgress: 22 },
        choices: [
            {
                text: "Teach the workshop - invest in youth",
                outcome: {
                    text: "You teach 20 teenagers music production over a weekend. They're incredibly grateful and inspired. Three become serious producers and credit you as mentor. Parents and the community see you as artist who gives back. Local media covers it. The goodwill creates community support and opportunities. One teen you taught becomes your future collaborator. Teaching created unexpected relationships and fulfillment. Impact was worth more than maximum payment.",
                    cash: 400, fame: 8, wellBeing: 25, careerProgress: 12, hype: 10,
                    lesson: {
                        title: "Youth Investment Multiple Returns",
                        explanation: "Teaching underserved youth creates community goodwill, potential future collaborators, personal fulfillment, and sometimes unexpected career opportunities. Impact work builds reputation as artist who cares beyond self-interest. Multiple forms of return exceed direct payment.",
                        realWorldExample: "Many successful artists teach underserved youth - Pharrell, Chance the Rapper, and others invest in next generation. Teaching builds legacy, community support, and sometimes discovers talent. Impact work creates returns beyond payment.",
                        tipForFuture: "Take opportunities to teach and give back to underserved communities. The goodwill, relationships, fulfillment, and unexpected opportunities often exceed payment differences. Impact work is career and legacy investment.",
                        conceptTaught: "social-responsibility"
                    }
                }
            },
            {
                text: "Decline - not enough payment for your time",
                outcome: {
                    text: "You decline saying your rate is higher. Another artist teaches it and gains community reputation as generous and caring. You're seen as artist who only cares about money. The community support and goodwill you could have built goes to someone else. Maximizing payment cost you community perception and relationships. Your rate calculation missed intangible value.",
                    cash: 0, fame: 1, wellBeing: -5, careerProgress: 2, hype: 3,
                    lesson: {
                        title: "Impact Work Intangible Value",
                        explanation: "Some opportunities provide value beyond payment - community goodwill, personal fulfillment, reputation as caring artist. Declining impact work for payment reasons misses intangible returns. Public perception of generosity has career value.",
                        realWorldExample: "Artists known for giving back build stronger community support than those who maximize every payment. Community service creates perception of caring artist worth supporting. Intangible returns have real career value.",
                        tipForFuture: "Don't evaluate every opportunity purely on payment. Impact work with underserved communities builds reputation, goodwill, and relationships worth more than rate differences. Strategic generosity serves career.",
                        conceptTaught: "social-responsibility"
                    }
                }
            }
        ]
    },
    {
        title: "The Instagram Live Performance Series",
        description: "You decide to do a weekly Instagram Live performance series - 30 minutes every Friday, acoustic sets, fan interaction. No immediate payment, but builds engaged audience and provides consistent content. Commitment of time for community building - worth the investment?",
        conditions: { minFame: 22, minCareerProgress: 18 },
        choices: [
            {
                text: "Start the weekly series - build engaged community",
                outcome: {
                    text: "You commit to weekly Friday performances for 3 months. Fans start anticipating it - Friday becomes 'your night.' Your engaged viewership grows from 200 to 2,000 per stream. Fans in comments become community who know each other. The consistent presence builds devoted following. People send tips ($600 total), buy merch, and become your evangelists. Consistent community building created devoted fanbase.",
                    cash: 600, fame: 10, wellBeing: 15, careerProgress: 16, hype: 20,
                    lesson: {
                        title: "Consistent Content Community Building",
                        explanation: "Consistent scheduled content (weekly shows, regular releases) builds anticipation and community. Fans who show up regularly become devoted supporters. Consistency creates habits and relationships that sporadic content can't. Committed presence builds devoted audiences.",
                        realWorldExample: "Artists with consistent series build devoted fanbases - quarantine live streams, regular YouTube shows, weekly releases. Consistency creates anticipation and community. Fans become part of routine and develop deeper connections.",
                        tipForFuture: "Consider consistent content series for community building. Weekly shows, regular releases, or scheduled content creates anticipation and devoted following. Consistency builds stronger relationships than sporadic content.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Only do occasional performances - no regular schedule",
                outcome: {
                    text: "You perform occasionally when you feel like it. Viewership varies wildly - sometimes 50, sometimes 300. No community forms because there's no consistency to build habits around. Fans don't know when to expect you. Your sporadic presence doesn't build the devoted following that consistency would. Casual approach created casual results. No commitment meant no committed audience.",
                    cash: 100, fame: 3, wellBeing: 5, careerProgress: 5, hype: 6,
                    lesson: {
                        title: "Consistency vs Sporadic Engagement",
                        explanation: "Sporadic content doesn't build anticipation or community. Fans can't form habits around inconsistent presence. Consistency is what transforms casual viewers into devoted community. Commitment from artists generates commitment from audiences.",
                        realWorldExample: "Artists with sporadic presence struggle to build devoted communities. Those with consistent schedules build anticipation and habit-based engagement. Fans commit to artists who commit to consistency.",
                        tipForFuture: "If you want devoted community, provide consistent presence. Sporadic content gets sporadic engagement. Commitment to schedule builds audience commitment to you. Consistency is community-building foundation.",
                        conceptTaught: "audience-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Vinyl Record Small Batch Release",
        description: "A small local record store wants to press 100 vinyl records of your EP to sell in their store. You'd pay $800 for pressing, they'd sell them for $25 each ($2,500 total revenue, you get 70% = $1,750). Net profit: $950, but also physical product and collector item for devoted fans. Worth the investment?",
        conditions: { minFame: 28, minCareerProgress: 24, minCash: 2000 },
        choices: [
            {
                text: "Press the vinyl - create physical product",
                outcome: {
                    text: "You press 100 vinyl records. They sell out in 3 weeks. Fans love having physical collector item. The store promotes you heavily because you're local artist they stock. Other stores see the success and ask to carry your vinyl too. The physical product creates credibility and collector value digital doesn't provide. You make $950 profit plus expanded relationships with record stores. Tangible product created intangible benefits.",
                    cash: 950, fame: 10, wellBeing: 12, careerProgress: 14, hype: 18,
                    lesson: {
                        title: "Physical Product Value Proposition",
                        explanation: "Physical products create collector value, retail relationships, and credibility that digital-only presence doesn't provide. Vinyl, CDs, and physical merch build deeper fan connections through tangible ownership. Physical presence in stores creates legitimacy and discovery opportunities.",
                        realWorldExample: "Independent artists with physical products often build stronger devoted fanbases than digital-only artists. Record stores promote artists they stock. Physical products create collector culture and deeper fan investment.",
                        tipForFuture: "Consider small-batch physical products even in digital age. Vinyl, cassettes, physical merch create collector value and retail relationships. Physical products serve devoted fans and create store presence.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Stay digital-only - avoid upfront costs",
                outcome: {
                    text: "You decline and stay digital-only. It's lower risk but you miss opportunity to serve devoted fans who want physical products. Fans ask repeatedly where they can buy physical music - you have nothing to offer. Collectors who would have bought vinyl at $25 aren't interested in $1 streaming. You saved $800 upfront but missed $950 profit and fan satisfaction. Risk aversion cost you opportunity.",
                    cash: 0, fame: 2, wellBeing: 0, careerProgress: 3, hype: 4,
                    lesson: {
                        title: "Risk Aversion Opportunity Cost",
                        explanation: "Avoiding all upfront investment prevents opportunities with positive ROI. Some investments serve devoted fans who want to support you beyond streaming. Risk aversion sometimes costs more than calculated risks. Strategic investment enables revenue streams risk-avoidance prevents.",
                        realWorldExample: "Artists who avoid all upfront investment often miss opportunities to serve devoted fans. Physical products, merch, and fan experiences require investment but create revenue and satisfaction. Calculated risks enable growth.",
                        tipForFuture: "Don't let risk aversion prevent positive-ROI opportunities. Devoted fans want ways to support you beyond streaming. Strategic small investments create revenue streams and fan satisfaction. Calculate risks rather than avoiding them entirely.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Licensing for Indie Film",
        description: "An independent filmmaker wants to license your song for their film's emotional climax scene. Budget is tight - they offer $800 upfront plus screen credit. The film is going to festivals and could get your music heard by industry professionals. Exposure opportunity at indie rates?",
        conditions: { minFame: 24, minCareerProgress: 20 },
        choices: [
            {
                text: "License the song - support indie film and get exposure",
                outcome: {
                    text: "You license the song for $800. The film gets into 8 festivals and wins 3 awards. Your song in the emotional climax is praised by reviewers. Three music supervisors contact you about future placements because they saw the film. The $800 indie placement led to $12,000 in future sync deals. Supporting independent film paid off through relationships and future opportunities. Initial fee was just the beginning.",
                    cash: 800, fame: 10, wellBeing: 10, careerProgress: 16, hype: 15,
                    lesson: {
                        title: "Indie Film Sync Opportunities",
                        explanation: "Independent film placements provide festival exposure and music supervisor attention that often leads to better opportunities. Supporting indie projects at lower rates builds relationships and credibility in sync world. First placements open doors to more lucrative ones.",
                        realWorldExample: "Many successful sync careers started with indie films at low rates. Festival circuits expose music to supervisors and industry professionals. Supporting indie filmmakers often leads to long-term relationships and better opportunities.",
                        tipForFuture: "Don't dismiss indie film offers because budgets are low. Festival exposure and music supervisor attention create pathways to better sync deals. Supporting independent art builds relationships that benefit careers.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Negotiate for higher fee - minimum $3,000",
                outcome: {
                    text: "You counter at $3,000. The indie filmmaker can't afford it and uses another artist's song. That artist gets the festival exposure and music supervisor attention. The relationships and opportunities you could have built go to someone else. Pricing yourself out of indie film eliminated an entry point to the sync world. Maximum payment killed opportunity.",
                    cash: 0, fame: 0, wellBeing: -5, careerProgress: 0, hype: 0,
                    lesson: {
                        title: "Entry Point Opportunity Value",
                        explanation: "Some low-paying opportunities are valuable entry points to industries or relationships. Indie films, small placements, and relationship-building opportunities shouldn't always be evaluated purely on payment. Entry points create pathways to better opportunities.",
                        realWorldExample: "Sync professionals often start with indie films at low rates. Those placements lead to relationships that enable higher-paying opportunities. Pricing out of entry points prevents industry access entirely.",
                        tipForFuture: "Recognize entry point opportunities versus exploitation. Legitimate indie films at festival-bound projects are entry points worth accepting at lower rates. They create pathways and relationships that lead to better opportunities.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "The Career-Threatening Substance Addiction (RISK SCENARIO)",
        description: "Your success has brought parties, substance access, and enablers. What started as recreational use is becoming daily dependency. Your performances are suffering, health declining, and relationships damaged. Fans notice something's wrong. This is your wake-up call before it destroys everything. What do you do?",
        conditions: { minFame: 45, minCareerProgress: 40, maxWellBeing: 50, minFameByDifficulty: { beginner: 38, realistic: 45, hardcore: 55 } },
        choices: [
            {
                text: "Enter rehab - take 90 days to recover",
                outcome: {
                    text: "You check into rehab for 90 days. You cancel shows ($15,000 lost) and disappear from public. Fans worry but mostly support you. You get sober, work through trauma, and learn coping skills. When you return, you're healthier and create your most honest music. Fans respect your vulnerability and courage. Addressing addiction saved your career and life. Recovery was career investment disguised as career interruption.",
                    cash: -15000, fame: 5, wellBeing: 60, careerProgress: 15, hype: 10,
                    lesson: {
                        title: "Addiction Recovery Career Saving",
                        explanation: "Addressing addiction early saves careers and lives. Taking time for recovery is investment in sustainable future. Fans and industry respect artists who address problems honestly. Ignoring addiction guarantees career destruction; addressing it enables recovery and comeback.",
                        realWorldExample: "Many artists recovered from addiction and returned stronger - Robert Downey Jr., Eminem, Kendrick Lamar's honesty about it. Those who ignore addiction typically crash catastrophically. Recovery enables sustainable careers; denial ensures destruction.",
                        tipForFuture: "If you're struggling with addiction, get help immediately. Recovery interrupts career briefly; addiction destroys it permanently. Fans and industry respect honesty and recovery. Addressing problems early prevents catastrophic crashes.",
                        conceptTaught: "career-sustainability"
                    }
                }
            },
            {
                text: "Try to quit on your own - maintain appearances",
                outcome: {
                    text: "You try quitting without professional help while maintaining career appearances. It's incredibly hard. You relapse multiple times. Performance quality suffers. After 6 months, you're worse and everyone knows something's wrong. You finally enter rehab anyway but now with damaged reputation and worse addiction. DIY recovery attempt cost 6 months and made everything worse. Professional help earlier would have been better.",
                    cash: -8000, fame: -8, wellBeing: -15, careerProgress: -12, hype: -20,
                    lesson: {
                        title: "Professional Help Necessity",
                        explanation: "Addiction requires professional treatment. DIY recovery attempts usually fail and delay necessary treatment. Maintaining appearances while struggling makes everything worse. Early professional intervention works better than delayed treatment after failed attempts.",
                        realWorldExample: "Most successful recovery stories involve professional treatment. DIY attempts typically fail because addiction requires medical and psychological support. Those who get professional help early typically fare better than those who delay.",
                        tipForFuture: "Don't try recovering from serious addiction alone. Professional treatment works; DIY attempts usually fail and delay effective help. Appearances aren't worth health. Get proper treatment immediately.",
                        conceptTaught: "career-sustainability"
                    }
                }
            },
            {
                text: "Ignore it and keep using - it's not that bad yet",
                outcome: {
                    text: "You convince yourself it's not serious and keep using. Six months later, you're in crisis - overdose scare, public meltdown, hospitalization. Career in shambles, health destroyed, reputation damaged beyond repair. Record deals cancelled, shows blacklisted. You eventually get sober but the damage is permanent. Denial cost you almost everything. Early intervention could have prevented catastrophic destruction. Ignoring addiction was career suicide.",
                    cash: -50000, fame: -35, wellBeing: -70, careerProgress: -60, hype: -80,
                    lesson: {
                        title: "Addiction Denial Catastrophe",
                        explanation: "Ignoring addiction leads to catastrophic crashes that destroy careers, health, and lives. Problems don't resolve themselves - they escalate. Early intervention prevents career-ending disasters. Denial is most expensive choice possible.",
                        realWorldExample: "History is full of artists destroyed by ignored addiction - careers ended, lives lost. Those who addressed problems early typically survived; those in denial typically crashed catastrophically. Addiction requires immediate action.",
                        tipForFuture: "Never ignore serious substance problems. They always escalate. Early intervention prevents catastrophic crashes. If you recognize a problem, act immediately. Denial doesn't make problems disappear - it makes them fatal.",
                        conceptTaught: "career-sustainability"
                    }
                }
            }
        ]
    },

    // --- BATCH 9: POSITIVE OPPORTUNITIES (10 scenarios - 9 positive/neutral, 1 risky) ---
    {
        title: "The Music Festival Workshop Leader",
        description: "A music festival asks you to lead a 2-hour workshop on 'Building Music Career from Scratch' for aspiring artists. Payment is $600 plus full festival access. You'd be sharing your journey and knowledge with next generation. Teaching opportunity at a festival?",
        conditions: { minFame: 28, minCareerProgress: 24 },
        choices: [
            {
                text: "Lead the workshop - share your knowledge",
                outcome: {
                    text: "You lead the workshop. 40 aspiring artists attend, deeply grateful for your insights. Three become your interns/collaborators. Festival organizers are impressed and book you for three more festivals as workshop leader and performer. Your reputation as generous artist who invests in others grows. The $600 workshop created $5,000 in future bookings and meaningful relationships. Teaching multiplied opportunities.",
                    cash: 600, fame: 10, wellBeing: 20, careerProgress: 16, hype: 14,
                    lesson: {
                        title: "Teaching Reputation Building",
                        explanation: "Leading workshops builds reputation as generous expert willing to share knowledge. Festival organizers value artists who contribute beyond performing. Teaching creates relationships with aspiring artists who become collaborators and supporters. Generosity compounds into opportunities.",
                        realWorldExample: "Many successful artists teach workshops at festivals - Questlove, 9th Wonder, African producers. Workshop leaders are valued beyond performers because they contribute to community. Teaching builds lasting reputation and relationships.",
                        tipForFuture: "Accept workshop opportunities at industry events. Teaching builds reputation, creates relationships, and often leads to more bookings. Being valued for knowledge sharing, not just performing, creates diverse opportunities.",
                        conceptTaught: "career-advancement"
                    }
                }
            },
            {
                text: "Decline - focus only on performing",
                outcome: {
                    text: "You decline the workshop to focus on performing only. You attend the festival as spectator but don't build the relationships workshop would have created. The artist who leads the workshop gains reputation as generous teacher and gets booked for multiple festivals. Your performer-only approach limited your value proposition. Single-dimension focus limited opportunities.",
                    cash: 0, fame: 2, wellBeing: 0, careerProgress: 3, hype: 4,
                    lesson: {
                        title: "Multi-Dimensional Artist Value",
                        explanation: "Artists who offer multiple value propositions (performing, teaching, speaking) create more opportunities than one-dimensional performers. Diversifying what you offer increases bookings and reputation. Single-skill focus limits opportunities.",
                        realWorldExample: "Most sustainable careers involve multiple value propositions - performing, producing, teaching, speaking. Artists who only perform compete with thousands; those who teach, speak, and mentor create unique value.",
                        tipForFuture: "Develop multiple value propositions beyond performing. Teaching, speaking, and knowledge-sharing create opportunities performing alone doesn't. Multi-dimensional artists build more sustainable careers.",
                        conceptTaught: "career-advancement"
                    }
                }
            }
        ]
    },
    {
        title: "The Nonprofit Fundraiser Concert",
        description: "A nonprofit fighting youth homelessness asks you to headline their fundraiser concert. Payment is $800 (below your rate) but the cause is meaningful and media coverage will be substantial. 500 attendees including donors and community leaders. Mission-driven opportunity?",
        conditions: { minFame: 32, minCareerProgress: 28 },
        choices: [
            {
                text: "Headline the fundraiser - support the cause",
                outcome: {
                    text: "You perform for $800 (below your usual $1,500 rate). The audience is deeply moved. Media covers it extensively. Three wealthy donors become your supporters - one sponsors your next tour ($3,000). Community leaders see you as artist with values. The fundraiser raises $15,000 for homeless youth. Your below-rate performance created goodwill, media, and opportunities worth far more than the rate difference. Values-driven work attracted values-aligned support.",
                    cash: 800, fame: 12, wellBeing: 25, careerProgress: 18, hype: 16,
                    lesson: {
                        title: "Cause Alignment Opportunity Creation",
                        explanation: "Performing for meaningful causes at reduced rates creates goodwill, media coverage, and relationships with values-aligned supporters. Mission-driven work attracts mission-driven support. The intangible returns (reputation, relationships, media) often exceed payment differences.",
                        realWorldExample: "Artists who support causes authentically build devoted support from values-aligned audiences. Benefit concerts create media coverage and relationships with philanthropic communities. Cause alignment builds sustainable support networks.",
                        tipForFuture: "Support causes you authentically care about even at reduced rates. The goodwill, media, and relationships with values-aligned supporters create returns beyond payment. Authentic cause work builds meaningful support.",
                        conceptTaught: "social-responsibility"
                    }
                }
            },
            {
                text: "Decline - maintain your rate standards",
                outcome: {
                    text: "You decline because the $800 is below your $1,500 rate. Another artist performs and gains the media coverage and community goodwill. The donor relationships and values-aligned support you could have built go to someone else. Strict rate maintenance cost you intangible opportunities worth more than the $700 difference. Rate protection prevented mission-aligned growth.",
                    cash: 0, fame: 1, wellBeing: 0, careerProgress: 2, hype: 3,
                    lesson: {
                        title: "Rate Flexibility Strategic Value",
                        explanation: "Inflexible rate standards prevent mission-aligned opportunities that create intangible value. Strategic rate flexibility for authentic causes often creates returns (media, relationships, reputation) exceeding payment differences. Not every opportunity should be evaluated purely on rate.",
                        realWorldExample: "Successful artists make strategic exceptions for causes they care about. The relationships and reputation built through authentic cause work often create more value than strict rate maintenance. Strategic flexibility enables mission-aligned growth.",
                        tipForFuture: "Be strategically flexible with rates for authentic causes. Mission-aligned work creates intangible returns often worth more than rate differences. Don't let rate standards prevent values-aligned opportunities.",
                        conceptTaught: "social-responsibility"
                    }
                }
            }
        ]
    },
    {
        title: "The TikTok Trend Participation",
        description: "Your song is being used in a TikTok trend but hasn't fully gone viral yet. You could participate - make your own TikToks with the trend, engage with users, and amplify it. Or let it happen organically without your involvement. Active participation vs. organic growth?",
        conditions: { minFame: 26, minCareerProgress: 22 },
        choices: [
            {
                text: "Participate actively - amplify the trend",
                outcome: {
                    text: "You create TikToks participating in the trend. Your involvement excites users - 'The actual artist is doing it!' Your participation makes the trend explode - 2M videos created, 50M views total. You gain 15K followers and 500K streams. Active participation in the trend multiplied its impact. Your engagement with fans made you likable and accessible. Participation amplified organic momentum.",
                    cash: 1500, fame: 18, wellBeing: 15, careerProgress: 22, hype: 35,
                    lesson: {
                        title: "Trend Amplification Through Participation",
                        explanation: "Artists who actively participate in trends around their music amplify organic momentum. Engagement shows you're accessible and in tune with fans. Participating in your own trends multiplies their impact through your involvement. Active engagement beats passive observation.",
                        realWorldExample: "Lil Nas X amplified 'Old Town Road' by actively participating in memes. Artists who engage with trends around their music typically accelerate them. Participation shows you're fun and accessible, building stronger fan connections.",
                        tipForFuture: "When organic trends emerge around your music, participate actively. Your involvement excites fans and amplifies trends. Engagement and accessibility build stronger connections than distant observation.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Let it happen organically - don't interfere",
                outcome: {
                    text: "You stay hands-off, letting the trend develop organically. It grows modestly - 200K videos, 5M views. Fans wonder why you're not participating. The trend peters out after 2 weeks. You gain 3K followers. Your absence from the trend limited its potential. Fans wanted to engage with you but you weren't there. Passivity underutilized organic opportunity.",
                    cash: 300, fame: 6, wellBeing: 5, careerProgress: 8, hype: 10,
                    lesson: {
                        title: "Passive Trend Approach Limitations",
                        explanation: "Staying passive during organic trends limits their potential. Fans want artist engagement during trends around their music. Your presence amplifies and extends trends. Passivity leaves potential unrealized. Active engagement maximizes organic opportunities.",
                        realWorldExample: "Artists who stay passive during trends often watch them fizzle when participation could have amplified them. Active artists who engage with organic trends typically maximize their impact. Presence matters.",
                        tipForFuture: "Don't be passive when organic trends emerge. Fans want your participation. Active engagement amplifies trends and shows you're accessible. Maximize organic opportunities through involvement.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Streaming Playlist Curator Relationship",
        description: "You've built relationship with an independent playlist curator (150K followers). They offer to add you to 5 playlists in exchange for you promoting their playlists to your audience. Mutual promotion, no money exchanged. Collaborative relationship building?",
        conditions: { minFame: 24, minCareerProgress: 20 },
        choices: [
            {
                text: "Accept mutual promotion - build relationship",
                outcome: {
                    text: "You promote their playlists and they add you to 5 playlists. You gain 80K streams and 2K followers from playlist exposure. The curator becomes long-term supporter who continues adding your new releases. The mutual promotion relationship compounds over time. Collaboration created sustainable playlist support that keeps giving. Relationship-based approach worked better than transactional.",
                    cash: 0, fame: 10, wellBeing: 10, careerProgress: 15, hype: 18,
                    lesson: {
                        title: "Curator Relationship Building",
                        explanation: "Building relationships with playlist curators through mutual promotion creates ongoing support. Curators who like you personally continue supporting new releases. Relationship approach creates sustainable playlist presence transactional approaches can't match.",
                        realWorldExample: "Independent artists who build curator relationships get ongoing playlist support. Transactional approaches are one-time; relationship approaches compound. Curators support artists they have relationships with long-term.",
                        tipForFuture: "Build relationships with playlist curators through authentic engagement and mutual promotion. Relationship-based approach creates ongoing support. Invest in curator relationships, not just one-time placements.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Decline - only work with official Spotify playlists",
                outcome: {
                    text: "You decline, wanting only official Spotify playlist placements. You never get on official playlists because competition is fierce. Meanwhile, the curator relationship you declined could have given you consistent independent playlist presence. Perfectionism about playlist type prevented any playlist success. Waiting for ideal blocked good opportunities.",
                    cash: 0, fame: 2, wellBeing: -5, careerProgress: 3, hype: 4,
                    lesson: {
                        title: "Platform Perfectionism Limitation",
                        explanation: "Waiting for 'perfect' playlist placements (official Spotify) often means missing good placements (quality independent curators). Independent curators with engaged audiences provide real value. Perfectionism prevents progress. Good opportunities beat perfect unavailable ones.",
                        realWorldExample: "Most independent artists never get official Spotify playlists. Those who build independent curator networks get substantial streaming from quality curators. Independent playlists from engaged curators provide real growth.",
                        tipForFuture: "Don't dismiss independent curators waiting for official playlists. Quality independent curators provide real value and are more accessible. Build network of curator relationships rather than waiting for perfect placements.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Behind-The-Scenes Content Series",
        description: "You decide to create a behind-the-scenes content series - showing your creative process, studio sessions, songwriting, daily life. No immediate monetization, but builds deeper fan connection. Time investment in transparency for community building?",
        conditions: { minFame: 30, minCareerProgress: 26 },
        choices: [
            {
                text: "Create BTS series - build deeper connection",
                outcome: {
                    text: "You consistently share behind-the-scenes content for 6 months. Fans love seeing your creative process and human side. Your engagement rates double - followers feel like they know you personally. Devoted fanbase strengthens significantly. When you release new music, your deeply connected fans promote it passionately. BTS content created devoted evangelists who drive organic growth. Transparency built unshakeable fan relationships.",
                    cash: 0, fame: 12, wellBeing: 15, careerProgress: 18, hype: 22,
                    lesson: {
                        title: "Transparency Community Building",
                        explanation: "Behind-the-scenes content that shows your creative process and human side builds deep fan connections. Fans who feel like they know you personally become devoted evangelists. Transparency transforms casual followers into committed supporters. Authenticity builds unshakeable relationships.",
                        realWorldExample: "Artists with strong BTS content (Casey Neistat, MKBHD, music documentaries) build devoted fanbases. Fans who see creative process feel invested in artist's journey. Transparency creates psychological ownership and devotion.",
                        tipForFuture: "Invest in behind-the-scenes content even without immediate monetization. Showing creative process and authenticity builds devoted fans who become evangelists. Transparency is powerful community-building tool.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Keep creative process private - only share finished work",
                outcome: {
                    text: "You only share finished songs, never showing creative process. Fans appreciate the music but don't feel personal connection. Your relationship with fans stays surface-level. When challenges arise, fans aren't deeply invested enough to support you through them. Lack of transparency prevented deep relationships. Distance kept fans casual rather than devoted. Privacy cost you community depth.",
                    cash: 0, fame: 4, wellBeing: 5, careerProgress: 6, hype: 8,
                    lesson: {
                        title: "Privacy vs Connection Trade-off",
                        explanation: "Keeping creative process completely private prevents deep fan connections. Fans who only see finished products don't feel invested in your journey. Some vulnerability and transparency builds relationships privacy prevents. Balance privacy with community building.",
                        realWorldExample: "Artists who share nothing but finished work typically have weaker fan relationships than those who show process. Documentary content and BTS access create devoted fans. Complete privacy prevents devotion-level relationships.",
                        tipForFuture: "Share some creative process and behind-the-scenes even if uncomfortable. Transparency builds devoted fans who feel invested. Complete privacy prevents deep relationships that sustain long-term careers.",
                        conceptTaught: "audience-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Blog Guest Post Opportunity",
        description: "A respected music blog invites you to write guest post about your journey, challenges, and lessons learned. No payment but your byline, bio, and links to your music. Platform to share your story with their 80K readers. Writing opportunity for exposure?",
        conditions: { minFame: 22, minCareerProgress: 18 },
        choices: [
            {
                text: "Write the guest post - share your story",
                outcome: {
                    text: "You write thoughtful 1,500-word post about your independent artist journey. The blog's audience resonates deeply - 12K people read it. You gain 1,500 followers who feel like they know your story. Multiple media outlets see it and request interviews. The guest post positioned you as thoughtful artist with perspective beyond music. Written storytelling created opportunities and devoted fans. Your voice beyond music built credibility.",
                    cash: 0, fame: 10, wellBeing: 15, careerProgress: 14, hype: 16,
                    lesson: {
                        title: "Written Storytelling Platform",
                        explanation: "Guest posts and written content let you share story in depth text allows. Readers who engage with written content often become devoted fans because text creates deeper understanding. Writing positions you as thoughtful artist with perspective. Multiple content formats reach different audiences.",
                        realWorldExample: "Many artists write guest posts, essays, and articles that build audiences beyond music fans. Thoughtful writing positions artists as interesting people, not just musicians. Written platforms reach audiences music alone doesn't.",
                        tipForFuture: "Take opportunities to write guest posts and share perspectives in text. Written content reaches different audiences and builds perception as thoughtful artist. Use multiple content formats to reach diverse audiences.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Decline - focus only on music content",
                outcome: {
                    text: "You decline, preferring to only share music content. You miss opportunity to reach blog's 80K readers with your story. The artist who writes the guest post builds audience and credibility through thoughtful writing. Your music-only approach limited your reach to music platforms. Single-format focus prevented cross-platform growth. Limiting yourself to music content prevented diverse audience building.",
                    cash: 0, fame: 2, wellBeing: 0, careerProgress: 3, hype: 4,
                    lesson: {
                        title: "Multi-Format Content Value",
                        explanation: "Limiting yourself to music content prevents reaching audiences that engage through other formats (writing, speaking, video essays). Multi-format presence builds diverse audience. Single-format focus limits reach and positioning. Diversify content to maximize audience building.",
                        realWorldExample: "Successful artists use multiple content formats - music, writing, video, speaking. Each format reaches different audiences. Music-only artists compete with millions; multi-format artists create unique positioning.",
                        tipForFuture: "Don't limit yourself to music content alone. Writing, speaking, and other formats reach audiences music doesn't. Multi-format presence builds broader, more sustainable career foundation.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Local Radio Interview Series",
        description: "Local radio station wants you for recurring monthly segment - 20-minute interviews about music, life, and local scene. No payment but 20K weekly listeners and positioning as local scene voice. Regular radio presence building?",
        conditions: { minFame: 24, minCareerProgress: 20 },
        choices: [
            {
                text: "Accept monthly radio slot - build local presence",
                outcome: {
                    text: "You do monthly radio interviews for a year. You become familiar voice to 20K weekly listeners. Local recognition grows significantly - people recognize you at stores and events. The recurring presence positions you as local music scene ambassador. Local businesses and events book you consistently because radio presence made you household name locally. Regular presence created local celebrity status. Consistency built recognition.",
                    cash: 0, fame: 12, wellBeing: 12, careerProgress: 16, hype: 18,
                    lesson: {
                        title: "Recurring Media Presence Value",
                        explanation: "Recurring media appearances build familiarity and recognition one-time appearances can't match. Regular presence makes you familiar voice/face in community. Consistency creates household recognition that occasional appearances don't. Regular media builds local celebrity.",
                        realWorldExample: "Local artists with recurring radio/TV slots build strong local recognition. Consistency makes you familiar rather than occasional. Local celebrities typically have recurring media presence, not just one-time appearances.",
                        tipForFuture: "Value recurring media opportunities over one-time appearances. Regular presence builds familiarity and household recognition. Consistency creates local celebrity status that occasional appearances can't match.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Decline - only do paid media appearances",
                outcome: {
                    text: "You decline unpaid radio, only doing paid appearances. Paid media opportunities are rare. You never build the consistent local presence that makes you household name. The recurring exposure you declined could have made you local celebrity. Strict payment requirements prevented recognition-building. Payment focus cost you presence and familiarity.",
                    cash: 0, fame: 3, wellBeing: 0, careerProgress: 4, hype: 5,
                    lesson: {
                        title: "Recognition vs Payment Priority",
                        explanation: "At certain career stages, regular unpaid media presence builds more value (recognition, familiarity, bookings) than occasional paid appearances. Recognition often converts to income better than strict payment requirements. Strategic unpaid presence often pays more than direct payment.",
                        realWorldExample: "Most local celebrities built recognition through regular unpaid media before commanding payment. Recognition creates opportunities that strict payment requirements prevent. Strategic presence often serves artists better than payment demands.",
                        tipForFuture: "Don't let payment requirements prevent recognition-building opportunities. Regular unpaid presence often creates more income (through bookings and opportunities) than strict payment policies. Build recognition first.",
                        conceptTaught: "audience-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Collaborative Album Feature Opportunity",
        description: "An artist you respect is working on collaborative album and wants you for one track. No payment but split streaming revenue and cross-promotion to both audiences. Collaboration with 50K-follower artist. Mutual growth opportunity?",
        conditions: { minFame: 28, minCareerProgress: 24 },
        choices: [
            {
                text: "Collaborate - create together and cross-promote",
                outcome: {
                    text: "You create an amazing track together. When released, both your audiences discover each other. You gain 4K of their followers; they gain some of yours. The collaboration song gets 200K streams (you earn $700 from your share). More importantly, the relationship leads to three more collaborations and touring together. Collaboration created mutual growth and lasting partnership. Cross-promotion multiplied both audiences.",
                    cash: 700, fame: 12, wellBeing: 15, careerProgress: 18, hype: 22,
                    lesson: {
                        title: "Collaborative Growth Strategy",
                        explanation: "Collaborating with peer-level artists creates cross-promotion that exposes both artists to new audiences. Mutual growth through collaboration often exceeds individual promotion efforts. Partnerships multiply reach. Collaboration is audience-building strategy, not just creative choice.",
                        realWorldExample: "Successful artists collaborate strategically with peers - features, joint tours, collaborative projects. Each collaboration exposes artists to partner's audience. Wizkid, Burna Boy, and global artists built through strategic collaborations.",
                        tipForFuture: "Seek collaborations with peer-level artists for mutual audience growth. Cross-promotion multiplies both artists' reach. Strategic collaboration is powerful audience-building tool beyond creative benefits.",
                        conceptTaught: "collaboration-strategy"
                    }
                }
            },
            {
                text: "Decline - only do collaborations if paid upfront",
                outcome: {
                    text: "You decline because there's no upfront payment. The artist collaborates with someone else. That collaboration exposes the other artist to 50K new potential fans and creates lasting partnership. Your payment requirement prevented mutual growth opportunity. Transactional thinking cost you relationship and audience growth. Payment focus killed opportunity.",
                    cash: 0, fame: 1, wellBeing: -5, careerProgress: 2, hype: 3,
                    lesson: {
                        title: "Collaboration Transactional Mindset Limits",
                        explanation: "Requiring upfront payment for peer collaborations prevents mutual growth opportunities. Revenue-share collaborations with peers often create more long-term value than upfront payments. Transactional thinking limits relationship-building and audience growth.",
                        realWorldExample: "Most successful artist collaborations involve revenue sharing, not upfront payments. Peer collaborations are mutual investments, not transactions. Artists who require payment for peer collabs typically collaborate less and grow slower.",
                        tipForFuture: "Don't require upfront payment for peer-level collaborations. Revenue-share arrangements align incentives for mutual promotion. Collaboration is investment in mutual growth, not transaction to maximize immediate payment.",
                        conceptTaught: "collaboration-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Street Performance Experiment",
        description: "You decide to do street performance in busy downtown area - acoustic set, tip jar, genuine music. No booking, no stage, just raw connection with passersby. Some might see it as 'beneath' you but others see it as authentic connection. Return to roots?",
        conditions: { minFame: 30, minCareerProgress: 26 },
        choices: [
            {
                text: "Do street performance - connect authentically",
                outcome: {
                    text: "You perform on the street for 2 hours. People stop, listen, tip ($180 collected). Some ask for photos and social media. Video of your street performance goes semi-viral - 'Successful artist still connects with street-level audiences.' The authenticity builds respect. People see you as grounded artist who hasn't forgotten raw music connection. Street performance humanized you and created viral moment. Authenticity resonated.",
                    cash: 180, fame: 10, wellBeing: 20, careerProgress: 12, hype: 18,
                    lesson: {
                        title: "Authentic Connection Grounding",
                        explanation: "Successful artists who still do street-level performance show they haven't lost touch with raw music connection. Authenticity and groundedness build respect. Willingness to perform anywhere shows you value music over status. Authentic connection resonates more than status maintenance.",
                        realWorldExample: "Famous artists who do surprise street performances (Ed Sheeran, Alicia Keys, Justin Bieber) create viral moments and show groundedness. Audiences respect artists who haven't lost touch with raw music. Authenticity beats status.",
                        tipForFuture: "Don't let success make you too status-conscious to do raw street performance. Authenticity and willingness to perform anywhere builds respect. Show you value music connection over status maintenance.",
                        conceptTaught: "artistic-integrity"
                    }
                }
            },
            {
                text: "Decline - you're beyond street performance now",
                outcome: {
                    text: "You consider street performance beneath your current level. You only perform at proper venues. Fans notice some artists at your level still do street performances for authentic connection - you don't. Over time, you're seen as artist who values status over music connection. Your perceived groundedness decreases. Status consciousness created perception of disconnection from roots. Image consciousness cost authenticity.",
                    cash: 0, fame: 2, wellBeing: 0, careerProgress: 3, hype: 4,
                    lesson: {
                        title: "Status Consciousness Authenticity Trade-off",
                        explanation: "Being too status-conscious to do raw street-level performance signals you value image over music connection. Fans respect artists who'll perform anywhere out of love for music. Status maintenance can cost authenticity perception. Groundedness requires occasional return to roots.",
                        realWorldExample: "Artists who become too status-conscious lose authenticity perception. Those who still do street performances, small venues, and raw connection maintain groundedness. Fans notice and respect artists who haven't outgrown authentic connection.",
                        tipForFuture: "Maintain willingness to perform in raw, unpolished contexts even as you grow. Groundedness and authentic music connection matter more than status maintenance. Don't outgrow street-level authentic performance.",
                        conceptTaught: "artistic-integrity"
                    }
                }
            }
        ]
    },
    {
        title: "The Major Career Mistake - Public Meltdown (RISK SCENARIO)",
        description: "You're exhausted and burned out. At a show, technical difficulties frustrate you and you have public meltdown - you berate the sound engineer harshly in front of the audience, smash equipment, and storm off stage. Video goes viral. Your reputation is damaged. How do you handle the aftermath?",
        conditions: { minFame: 38, minCareerProgress: 34, maxWellBeing: 45, minFameByDifficulty: { beginner: 30, realistic: 38, hardcore: 46 } },
        choices: [
            {
                text: "Issue immediate genuine apology - take accountability",
                outcome: {
                    text: "Within 24 hours, you post genuine video apology. You take full accountability, apologize to the sound engineer publicly, and explain you were burned out (not an excuse, just context). You promise to seek help for burnout and do better. The engineer accepts your apology publicly. Fans appreciate your accountability. The quick, genuine response contains the damage. Most people forgive you. Immediate accountability saved your reputation. Genuine contrition worked.",
                    cash: -2000, fame: -5, wellBeing: -10, careerProgress: -5, hype: -8,
                    lesson: {
                        title: "Crisis Accountability Response",
                        explanation: "When you make public mistake, immediate genuine apology and accountability contain damage. Taking responsibility without excuses, showing genuine contrition, and committing to change enable forgiveness. Quick authentic response prevents crisis from destroying career. Accountability saves reputation.",
                        realWorldExample: "Public figures who quickly take genuine accountability for mistakes typically recover. Those who delay, make excuses, or blame others face worse consequences. Will Smith's Oscars apology, celebrity accountability moments - quick genuine contrition enables recovery.",
                        tipForFuture: "If you make public mistake, apologize immediately and genuinely. Take full accountability without excuses. Show genuine contrition and commitment to change. Quick authentic apology contains crises that delays and defensiveness amplify.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Stay silent - wait for it to blow over",
                outcome: {
                    text: "You stay silent hoping it blows over. The silence is interpreted as lack of remorse. Media coverage intensifies. Fans turn against you. Venues cancel bookings. Two weeks later, the damage is severe. You finally apologize but it feels forced and too late. Silent approach made everything worse. Delayed response looked like you only apologized when forced. Avoidance amplified the crisis exponentially.",
                    cash: -8000, fame: -18, wellBeing: -30, careerProgress: -25, hype: -35,
                    lesson: {
                        title: "Crisis Silence Amplification",
                        explanation: "Staying silent during public crisis is interpreted as lack of accountability or remorse. Silence allows negative narrative to dominate. Delayed apologies look forced rather than genuine. Quick response contains crises; silence amplifies them. Avoidance makes problems worse.",
                        realWorldExample: "Public figures who stay silent during crises typically face worse outcomes than those who respond quickly. Silence looks like arrogance or lack of remorse. Kevin Hart's Oscar hosting, celebrity silence during crises - delayed responses feel forced.",
                        tipForFuture: "Never stay silent during public crisis. Silence amplifies damage and makes eventual response look forced. Address problems immediately with genuine accountability. Quick response is crisis management foundation.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Blame others - defend your reaction as justified",
                outcome: {
                    text: "You post defending yourself, blaming technical issues and incompetent engineer. Public turns completely against you - you look entitled and abusive. The engineer shares their side, making you look worse. Bookings cancelled, sponsors drop you. Defending your behavior instead of taking accountability destroyed your career. Lack of accountability and blaming others was career-ending. Defensiveness catastrophically backfired.",
                    cash: -25000, fame: -40, wellBeing: -50, careerProgress: -50, hype: -60,
                    lesson: {
                        title: "Defensive Crisis Response Catastrophe",
                        explanation: "Defending indefensible behavior and blaming others during public crisis destroys reputation completely. Public wants accountability, not excuses. Defensiveness and blame look like entitlement and lack of character. Taking no accountability is career-ending response. Defensiveness amplifies crises catastrophically.",
                        realWorldExample: "Public figures who defend bad behavior and blame others typically face career-ending consequences. Accountability enables redemption; defensiveness prevents it. PR disasters multiply when subjects refuse accountability and blame others.",
                        tipForFuture: "Never defend indefensible behavior or blame others during crisis. Public wants accountability. Defensiveness destroys careers. When you're wrong, admit it immediately and genuinely. Accountability is only path to redemption.",
                        conceptTaught: "crisis-management"
                    }
                }
            }
        ]
    },

    // --- BATCH 10: FINAL SCENARIOS (10 scenarios - 9 positive/neutral, 1 risky) ---
    {
        title: "The Music Mentorship Program Launch",
        description: "You're invited to start a music mentorship program - work with 5 aspiring artists quarterly, providing guidance, feedback, and industry insights. $1,200 quarterly payment plus fulfillment of helping next generation. Teaching and legacy building?",
        conditions: { minFame: 35, minCareerProgress: 30 },
        choices: [
            {
                text: "Launch the mentorship program - invest in next generation",
                outcome: {
                    text: "You mentor 5 aspiring artists. The experience is fulfilling - watching them grow, sharing lessons, preventing mistakes you made. Three of your mentees become successful and credit you publicly. Your reputation as generous mentor builds industry respect. Mentorship creates legacy beyond your own music. The mentees become part of your network and collaborators. Teaching multiplied your impact and created lasting relationships.",
                    cash: 1200, fame: 12, wellBeing: 30, careerProgress: 18, hype: 14,
                    lesson: {
                        title: "Mentorship Legacy Building",
                        explanation: "Mentoring next generation creates legacy beyond your own work. Mentees who succeed credit you, building reputation as generous leader. Teaching prevents others from making your mistakes, multiplying your positive impact. Mentorship is legacy investment that compounds through others' success.",
                        realWorldExample: "Many legendary artists are remembered as much for mentorship as music - Quincy Jones, Dr. Dre, African producers mentoring next generation. Mentors build legacy through mentees' success. Teaching creates impact that outlasts individual careers.",
                        tipForFuture: "As you gain experience, invest in mentoring next generation. Your lessons prevent others' mistakes and multiply your positive impact. Mentorship builds legacy and creates network of grateful collaborators.",
                        conceptTaught: "career-sustainability"
                    }
                }
            },
            {
                text: "Decline - focus only on your own career",
                outcome: {
                    text: "You decline to focus exclusively on your music. You never build mentorship legacy. Years later, you wish you'd helped next generation. Other artists who mentored are remembered for both their music and their generosity. Your focus on self prevented legacy building through others. Individual focus limited your long-term impact and fulfillment.",
                    cash: 0, fame: 2, wellBeing: 0, careerProgress: 4, hype: 5,
                    lesson: {
                        title: "Self-Focus Legacy Limitation",
                        explanation: "Focusing only on individual career prevents legacy building through helping others. Artists remembered most fondly typically invested in next generation. Self-focus limits impact to your own work; mentorship multiplies impact through others. Legacy requires investing beyond self.",
                        realWorldExample: "Most legendary artists invested in next generation - they're remembered for mentorship as much as music. Those who only focused on themselves typically have narrower legacies. Generosity builds lasting reputation.",
                        tipForFuture: "Don't be so self-focused you never invest in others. Mentorship builds legacy that outlasts individual achievements. Help next generation - it multiplies your impact and creates meaningful fulfillment.",
                        conceptTaught: "career-sustainability"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Documentary Participation",
        description: "A filmmaker is creating documentary about independent music careers and wants to follow you for 6 months. No payment but significant exposure - festival circuit, streaming platforms. Your story becomes part of larger narrative about independent artistry. Documentary opportunity?",
        conditions: { minFame: 32, minCareerProgress: 28 },
        choices: [
            {
                text: "Participate in documentary - share your journey",
                outcome: {
                    text: "You allow filmmaker to document your journey for 6 months. The documentary premieres at film festivals and gets streaming distribution. Your segment resonates deeply - viewers connect with your authentic struggle and success. You gain 8K followers from people who saw the doc. Media requests increase. The documentary positioned you as face of independent music hustle. Long-form storytelling created devoted fans and credibility.",
                    cash: 0, fame: 15, wellBeing: 20, careerProgress: 22, hype: 25,
                    lesson: {
                        title: "Documentary Long-Form Impact",
                        explanation: "Documentaries create deep connection through long-form authentic storytelling. Viewers who watch your full journey become devoted fans. Documentary participation positions you as important voice in larger narrative. Long-form content builds credibility and devoted following.",
                        realWorldExample: "Artists featured in music documentaries typically gain devoted fans and credibility - 'Searching for Sugar Man', '20 Feet from Stardom', African music docs. Documentary subjects become authorities. Long-form storytelling creates impact short content can't.",
                        tipForFuture: "Participate in legitimate documentaries even without payment. Long-form storytelling builds devoted fans and positions you as important voice. Documentary participation is career investment through deep authentic storytelling.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Decline - too invasive and no payment",
                outcome: {
                    text: "You decline due to privacy concerns and no payment. The documentary features other artists who gain exposure and credibility. Your story could have reached festival audiences and streaming platforms but you declined. Privacy protection cost you positioning opportunity. The exposure you declined elevated artists who participated. Privacy cost visibility.",
                    cash: 0, fame: 1, wellBeing: 5, careerProgress: 2, hype: 3,
                    lesson: {
                        title: "Privacy vs Visibility Trade-off",
                        explanation: "Documentary participation requires vulnerability but creates deep connection and credibility. Complete privacy protection prevents opportunities for authentic storytelling and positioning. Balance privacy with strategic vulnerability that builds career. Some exposure requires openness.",
                        realWorldExample: "Artists who allow documentary access typically gain more than those who maintain complete privacy. Vulnerability creates connection. Those who never let cameras in miss storytelling opportunities that build careers through authentic narrative.",
                        tipForFuture: "Consider documentary opportunities despite privacy concerns. Strategic vulnerability builds connection and credibility. Complete privacy prevents authentic storytelling opportunities. Balance privacy with career-building openness.",
                        conceptTaught: "audience-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Fan Meet-and-Greet Series",
        description: "You decide to do monthly free meet-and-greets at local coffee shop - 2 hours, 30 fans, photos and conversation. No payment but deep fan connection. Time investment in community building and fan appreciation?",
        conditions: { minFame: 28, minCareerProgress: 24 },
        choices: [
            {
                text: "Host monthly meet-and-greets - build deep fan relationships",
                outcome: {
                    text: "You host monthly meet-and-greets for a year. The 360 fans who attend (30/month x 12) become your most devoted supporters. They promote you passionately, buy everything you release, and bring friends to shows. The direct personal connection transformed casual fans into evangelists. Meeting fans face-to-face built relationships streaming can't create. Personal connection created devoted army.",
                    cash: 0, fame: 10, wellBeing: 25, careerProgress: 18, hype: 20,
                    lesson: {
                        title: "Personal Fan Connection Power",
                        explanation: "Direct face-to-face interaction with fans creates devotion digital interaction can't match. Fans who meet you personally become evangelists who promote you passionately. Personal connection transforms casual supporters into devoted army. Time investment in fans creates returns through passionate advocacy.",
                        realWorldExample: "Artists who do meet-and-greets build devoted fanbases. Taylor Swift's secret sessions, K-pop fan meetings - personal connection creates unshakeable loyalty. Fans who've met artists personally become most devoted supporters.",
                        tipForFuture: "Invest time in personal fan interactions. Meet-and-greets, small gatherings, personal connection builds devotion streaming can't create. Fans who meet you become evangelists. Personal connection is powerful fan-building tool.",
                        conceptTaught: "audience-building"
                    }
                }
            },
            {
                text: "Only interact with fans digitally - protect your time",
                outcome: {
                    text: "You keep all fan interaction digital. Your relationship with fans stays distant - they follow you but don't feel personal connection. When challenges arise, fans aren't devoted enough to support you strongly. Distance prevented the devoted evangelical fanbase personal connection creates. Protecting time prevented depth. Efficiency cost connection.",
                    cash: 0, fame: 3, wellBeing: 5, careerProgress: 5, hype: 6,
                    lesson: {
                        title: "Digital Distance Limitation",
                        explanation: "Only digital fan interaction prevents deep connection that creates devoted supporters. Face-to-face connection builds loyalty digital can't match. Time efficiency through digital-only approach prevents devoted fanbase that sustains careers. Personal connection requires time investment.",
                        realWorldExample: "Artists with only digital fan interaction typically have weaker relationships than those who meet fans personally. Digital-only approach is efficient but prevents depth. Most devoted fanbases include personal connection component.",
                        tipForFuture: "Don't rely solely on digital fan interaction. Invest time in personal meet-and-greets and face-to-face connection. Personal interaction builds devotion digital can't create. Balance efficiency with connection depth.",
                        conceptTaught: "audience-building"
                    }
                }
            }
        ]
    },
    {
        title: "The Charity Single Collaboration",
        description: "Multiple artists are creating charity single for humanitarian cause (hunger relief, education, disaster relief). You're invited to contribute - no payment, all proceeds to charity. High-profile collaboration with 20 artists, media attention, cause alignment. Participate?",
        conditions: { minFame: 30, minCareerProgress: 26 },
        choices: [
            {
                text: "Join the charity single - contribute to the cause",
                outcome: {
                    text: "You contribute to the charity single. The song raises $100K for the cause and gets media coverage. You're associated with high-profile collaboration and humanitarian work. Your participation shows values beyond self-interest. Fans respect your involvement in meaningful cause. The collaboration introduces you to other artists and creates ongoing relationships. Charity work built reputation and valuable connections.",
                    cash: 0, fame: 12, wellBeing: 25, careerProgress: 16, hype: 18,
                    lesson: {
                        title: "Charity Collaboration Multiple Benefits",
                        explanation: "Charity collaborations provide impact (helping cause), visibility (media coverage), reputation (values-driven artist), and relationships (collaboration with other artists). Charitable work creates multiple forms of value beyond payment. Values-driven work attracts values-aligned supporters.",
                        realWorldExample: "Charity singles and collaborations build artist reputations - 'We Are the World', 'Do They Know It's Christmas', African humanitarian projects. Charity work shows values and creates media attention and artist relationships.",
                        tipForFuture: "Participate in legitimate charity collaborations. They provide impact, visibility, reputation, and relationships. Charitable work attracts values-aligned supporters and builds perception as artist who cares beyond self-interest.",
                        conceptTaught: "social-responsibility"
                    }
                }
            },
            {
                text: "Decline - only do paid work",
                outcome: {
                    text: "You decline because there's no payment. The charity single succeeds without you. Artists who participated are praised for humanitarian values. You're seen as artist who only works for payment, not causes. The relationship-building and reputation benefits go to participants. Payment focus cost you values-based positioning and collaborative relationships. Transactional thinking limited opportunities.",
                    cash: 0, fame: 1, wellBeing: -5, careerProgress: 2, hype: 3,
                    lesson: {
                        title: "Transactional Charity Approach Costs",
                        explanation: "Only doing paid work and declining charity causes positions you as purely transactional. Values-driven opportunities create reputation and relationships payment-only approach prevents. Charitable work attracts support transactional approach can't. Some opportunities' value exceeds payment.",
                        realWorldExample: "Artists who only work for payment develop reputations as purely commercial. Those who participate in charity work build perception as caring beyond self-interest. Values-driven work attracts passionate supporters transactional approach doesn't.",
                        tipForFuture: "Don't be purely transactional about work. Participate in legitimate charity causes even without payment. Values-driven work builds reputation and attracts supporters transactional approach can't access.",
                        conceptTaught: "social-responsibility"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Production Tutorial Content",
        description: "You decide to create YouTube tutorial series teaching music production skills you've learned. No immediate monetization but builds positioning as expert and serves community. Time investment in educational content creation?",
        conditions: { minFame: 26, minCareerProgress: 22 },
        choices: [
            {
                text: "Create tutorial series - teach and share knowledge",
                outcome: {
                    text: "You create 12 production tutorials over 6 months. The series gets 150K total views. You gain 3K subscribers who see you as expert and generous teacher. Students who learn from you become devoted supporters. Brands offer sponsorships for tutorial content ($2,000). Educational content positioned you as authority and created new revenue stream. Teaching built credibility and opportunities beyond music.",
                    cash: 2000, fame: 12, wellBeing: 20, careerProgress: 18, hype: 15,
                    lesson: {
                        title: "Educational Content Authority Building",
                        explanation: "Creating educational content positions you as expert and generous teacher. Tutorial content builds authority, attracts devoted learners as fans, and creates sponsorship opportunities. Teaching what you know multiplies your value proposition beyond music creation. Educational content is positioning strategy.",
                        realWorldExample: "Producer-artists who teach online build strong authority - Busy Works Beats, Simon Servida, production YouTubers. Educational content creates devoted audiences and positions creators as experts. Teaching builds careers beyond just creating.",
                        tipForFuture: "Create educational content teaching what you know. Tutorials position you as expert, serve community, and attract devoted supporters. Teaching builds authority and creates opportunities beyond music creation alone.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Keep knowledge private - only create music content",
                outcome: {
                    text: "You only share finished music, never teaching process or skills. You miss opportunity to build authority and serve learning community. Other artists who teach build expert positioning and devoted followings. Your music-only approach limited your positioning to artist-only. Single-content-type focus prevented authority building and teaching-based opportunities. Knowledge hoarding limited impact.",
                    cash: 0, fame: 3, wellBeing: 5, careerProgress: 5, hype: 6,
                    lesson: {
                        title: "Knowledge Sharing vs Hoarding",
                        explanation: "Hoarding knowledge prevents authority building and serving community. Sharing what you know positions you as expert and attracts devoted learners. Knowledge sharing multiplies impact - teaching one person helps many through them. Generosity with knowledge builds authority and opportunities.",
                        realWorldExample: "Artists who teach generously build stronger authority than those who hoard knowledge. YouTube educator-artists often have more sustainable careers than music-only creators. Knowledge sharing positions you as expert worth following.",
                        tipForFuture: "Share knowledge generously through tutorials and educational content. Teaching positions you as expert and serves community. Knowledge sharing builds authority and creates opportunities hoarding prevents.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Festival Volunteer Organizing",
        description: "Local music festival needs volunteer help with organizing - artist liaison, stage management support, community coordination. 15 hours over festival weekend, no payment but deep festival industry networking and behind-scenes experience. Volunteer to learn and network?",
        conditions: { minFame: 20, minCareerProgress: 16 },
        choices: [
            {
                text: "Volunteer - learn festival operations and network",
                outcome: {
                    text: "You volunteer 15 hours across the weekend. You learn festival operations, meet artists, managers, and organizers. The relationships you build lead to three festival bookings over the next year. Festival director remembers your help and becomes advocate. Volunteering provided industry education and valuable relationships. The unpaid work created paid opportunities and insider knowledge. Service created reciprocal support.",
                    cash: 0, fame: 6, wellBeing: 15, careerProgress: 14, hype: 10,
                    lesson: {
                        title: "Volunteer Industry Networking",
                        explanation: "Volunteering at industry events creates relationships and insider knowledge paid attendance can't provide. Service-oriented approach builds goodwill and reciprocal support. Working behind-scenes teaches operations and creates connections that lead to opportunities. Strategic volunteering is career investment.",
                        realWorldExample: "Many successful music industry professionals started volunteering at festivals and events. Behind-scenes work creates relationships and knowledge attendance doesn't provide. Service orientation builds reciprocal support from industry insiders.",
                        tipForFuture: "Volunteer at industry events to build relationships and learn operations. Behind-scenes service creates connections attendance can't match. Strategic volunteering is career investment through networking and education.",
                        conceptTaught: "career-advancement"
                    }
                }
            },
            {
                text: "Only attend as performer - no volunteering",
                outcome: {
                    text: "You only attend festivals when booked as performer. You never build behind-scenes relationships volunteer work creates. Your industry network grows slowly compared to artists who volunteer. The insider knowledge and goodwill volunteering builds never develops. Transactional approach prevented relationship-building and learning opportunities. Payment-only mindset limited network growth.",
                    cash: 0, fame: 2, wellBeing: 0, careerProgress: 4, hype: 5,
                    lesson: {
                        title: "Transactional Industry Approach Limits",
                        explanation: "Only participating in industry when paid prevents relationship-building and learning opportunities volunteering provides. Service orientation builds goodwill and insider knowledge transactional approach can't access. Some career-building activities don't involve immediate payment.",
                        realWorldExample: "Artists with strong industry networks typically invested unpaid time volunteering and serving. Those who only participate when paid develop slower networks. Service orientation builds reciprocal relationships transactional approaches prevent.",
                        tipForFuture: "Don't be purely transactional about industry participation. Volunteer time strategically to build relationships and learn. Service orientation creates goodwill and opportunities transactional mindset prevents.",
                        conceptTaught: "career-advancement"
                    }
                }
            }
        ]
    },
    {
        title: "The Livestream Concert Series Launch",
        description: "You decide to launch monthly livestream concert series - full 60-minute performances, free for fans, optional tips/donations. Building digital audience through consistent performances. Time investment in digital presence?",
        conditions: { minFame: 28, minCareerProgress: 24 },
        choices: [
            {
                text: "Launch monthly livestream series - build digital community",
                outcome: {
                    text: "You do monthly livestream concerts for a year. Each stream averages 800 viewers. Total tips collected: $3,600. More importantly, you build devoted digital community that attends consistently. International fans who can't attend physical shows become devoted supporters. Livestreams expanded your reach beyond geographic limitations. Digital community became sustainable support base. Consistent virtual presence built global audience.",
                    cash: 3600, fame: 14, wellBeing: 18, careerProgress: 20, hype: 22,
                    lesson: {
                        title: "Digital Community Geographic Expansion",
                        explanation: "Livestream performances build audiences beyond geographic limitations. Fans globally can attend virtually, creating international support base. Consistent livestreams create digital community that provides sustainable support. Virtual presence expands reach physical presence alone can't achieve.",
                        realWorldExample: "Artists who embraced livestreaming built global audiences - pandemic proved virtual performances work. Consistent livestreams create devoted digital communities. Geographic expansion through digital performance creates sustainability.",
                        tipForFuture: "Launch consistent livestream series to build digital community beyond geographic limits. Virtual performances expand reach and create devoted international support. Digital presence complements physical presence.",
                        conceptTaught: "platform-strategy"
                    }
                }
            },
            {
                text: "Only do in-person shows - no livestreaming",
                outcome: {
                    text: "You only perform in-person, never livestreaming. Your audience stays geographically limited to where you can physically reach. International fans who would support you virtually never get access. Your reach stays local/regional while artists who livestream build global audiences. Physical-only approach limited geographic expansion. Digital-averse strategy prevented global community building.",
                    cash: 0, fame: 3, wellBeing: 5, careerProgress: 5, hype: 6,
                    lesson: {
                        title: "Physical-Only Geographic Limitation",
                        explanation: "Only doing physical performances limits audience to geographic reach. Livestreaming expands potential audience globally. Physical-only approach prevents digital community building. Geographic limitation becomes career ceiling without virtual presence.",
                        realWorldExample: "Artists who only perform physically have geographically limited audiences. Those who embrace livestreaming build international communities. Physical-only approach is increasingly limiting in digital age. Geographic expansion requires digital presence.",
                        tipForFuture: "Don't limit yourself to physical performances. Livestreaming expands reach globally and builds digital community. Physical-only approach prevents geographic expansion virtual presence enables.",
                        conceptTaught: "platform-strategy"
                    }
                }
            }
        ]
    },
    {
        title: "The Fan-Funded Album Pre-Sale",
        description: "You want to record album but need $5,000 for studio time. You offer pre-sale: fans pay $15 now for album + exclusive content when released. Need 334 fans to pre-order. Community-funded creation or traditional approach?",
        conditions: { minFame: 30, minCareerProgress: 26, minCash: 2000 },
        choices: [
            {
                text: "Launch pre-sale campaign - community-funded creation",
                outcome: {
                    text: "You launch pre-sale campaign. 400 fans pre-order ($6,000 total). The campaign proves fan support and funds the album. Fans who pre-ordered feel invested in the project and promote it passionately. The album releases with built-in audience of 400 committed supporters. Community funding created both money and committed fanbase. Pre-buyers became evangelists because they invested first.",
                    cash: 6000, fame: 12, wellBeing: 20, careerProgress: 22, hype: 25,
                    lesson: {
                        title: "Community-Funded Creation Benefits",
                        explanation: "Pre-sales and crowdfunding prove demand and create invested fanbase. Fans who fund projects become evangelists who promote passionately. Community funding provides both money and committed audience. Investment creates psychological ownership and passionate support.",
                        realWorldExample: "Many successful independent albums were crowdfunded - fans feel ownership and promote passionately. Kickstarter, Patreon, pre-sales create invested communities. Amanda Palmer, Chance the Rapper models - community funding builds devoted support.",
                        tipForFuture: "Consider community funding through pre-sales or crowdfunding. It proves demand, provides funds, and creates invested fanbase who promote passionately. Fans who invest early become devoted evangelists.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "Save money slowly - self-fund when able",
                outcome: {
                    text: "You wait to save $5,000 yourself. It takes 10 months. By the time you record, momentum has cooled. You release without pre-built audience investment. The album does okay but doesn't have devoted pre-buyers promoting it. Self-funding took longer and missed community investment opportunity. Waiting cost momentum and community evangelism. Independence prevented community ownership.",
                    cash: -5000, fame: 6, wellBeing: 5, careerProgress: 10, hype: 12,
                    lesson: {
                        title: "Self-Funding vs Community Investment",
                        explanation: "Self-funding maintains independence but misses community investment and evangelism opportunities. Community funding creates committed supporters who promote passionately. Sometimes community investment provides more than money - it creates devoted fanbase. Balance independence with community involvement.",
                        realWorldExample: "Self-funded projects maintain control but miss community devotion crowdfunding creates. Artists who embrace community funding often build stronger supporter relationships. Independence has value but so does community investment.",
                        tipForFuture: "Consider community funding even if you could self-fund. Pre-sales and crowdfunding create invested supporters beyond just money. Community investment builds devotion self-funding doesn't create.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "The Music Industry Conference Speaking",
        description: "You're invited to speak on panel about independent music careers at industry conference. 500 attendees including artists, managers, labels. No payment but positioning as industry voice and networking. Speaking opportunity?",
        conditions: { minFame: 34, minCareerProgress: 30 },
        choices: [
            {
                text: "Accept speaking invitation - share insights",
                outcome: {
                    text: "You speak on the panel. Your insights resonate - audience sees you as thoughtful industry voice. Three managers approach you about representation. Media quotes you in articles about independent music. The speaking engagement positioned you as authority beyond just artist. Industry sees you as leader with valuable perspective. Speaking built credibility and opened management opportunities. Thought leadership created career opportunities.",
                    cash: 0, fame: 12, wellBeing: 18, careerProgress: 20, hype: 16,
                    lesson: {
                        title: "Thought Leadership Positioning",
                        explanation: "Speaking at industry events positions you as authority and thought leader beyond artist identity. Sharing insights builds credibility and attracts professional opportunities. Thought leadership creates perception as industry voice worth listening to. Speaking builds positioning music alone doesn't.",
                        realWorldExample: "Artists who speak at conferences build authority - they're seen as industry leaders, not just musicians. Speaking positions you as expert and attracts professional opportunities. Thought leadership differentiates you from artist-only positioning.",
                        tipForFuture: "Accept speaking opportunities at industry events. Sharing insights positions you as thought leader and authority. Speaking builds credibility and creates opportunities performing alone doesn't provide.",
                        conceptTaught: "career-advancement"
                    }
                }
            },
            {
                text: "Decline - uncomfortable with public speaking",
                outcome: {
                    text: "You decline due to public speaking discomfort. Another artist speaks and gains thought leader positioning. The credibility and management opportunities you could have built go to someone else. Comfort-zone protection prevented authority building and career advancement. Avoiding discomfort cost positioning opportunity. Fear limited growth.",
                    cash: 0, fame: 2, wellBeing: 0, careerProgress: 3, hype: 4,
                    lesson: {
                        title: "Comfort Zone Growth Limitation",
                        explanation: "Staying in comfort zone prevents growth opportunities. Public speaking discomfort is common but overcoming it builds career. Avoiding discomfort prevents authority building and thought leadership positioning. Growth requires discomfort. Comfort protection limits opportunities.",
                        realWorldExample: "Most successful people faced fears to grow - public speaking is common fear but necessary skill. Those who overcome speaking anxiety build authority; those who avoid it miss positioning opportunities. Growth requires discomfort tolerance.",
                        tipForFuture: "Don't let fear prevent growth opportunities. Public speaking anxiety is normal but overcomable. Accept speaking opportunities despite discomfort - they build authority and create career advancement. Push through comfort zones.",
                        conceptTaught: "career-advancement"
                    }
                }
            }
        ]
    },
    {
        title: "The Career Sabotage - Jealous Competitor (RISK SCENARIO)",
        description: "A jealous competitor is actively sabotaging you - spreading false rumors, sending fake cease-and-desist letters to your venues, creating fake social media accounts to damage your reputation. You have evidence. How do you handle malicious sabotage?",
        conditions: { minFame: 40, minCareerProgress: 36, minFameByDifficulty: { beginner: 32, realistic: 40, hardcore: 48 } },
        choices: [
            {
                text: "Address publicly with evidence - expose the sabotage",
                outcome: {
                    text: "You post calmly exposing the sabotage with receipts - screenshots, evidence. You don't attack, just show facts. The competitor is exposed and loses credibility entirely. Industry and fans rally around you. Your transparency and evidence-based approach builds respect. The saboteur's career suffers from exposure. Calm, factual public addressing with evidence protected your reputation and exposed malicious behavior. Truth-telling worked.",
                    cash: 0, fame: 8, wellBeing: -10, careerProgress: 10, hype: 12,
                    lesson: {
                        title: "Evidence-Based Exposure Defense",
                        explanation: "When maliciously sabotaged, calm public exposure with evidence protects reputation and exposes saboteur. Don't attack emotionally - present facts. Evidence-based defense builds credibility while exposing malicious behavior. Truth-telling with receipts is powerful defense.",
                        realWorldExample: "Public figures who calmly present evidence of sabotage typically win public support. Emotional attacks look bad; factual evidence works. James Charles, YouTuber drama - evidence-based defense protects reputation.",
                        tipForFuture: "If maliciously sabotaged, present evidence calmly and factually. Don't attack emotionally - show receipts. Evidence-based public defense exposes saboteurs and protects your reputation. Truth with proof is powerful defense.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Handle privately - legal action and industry reporting",
                outcome: {
                    text: "You handle privately through lawyers and industry reports. Legal action stops the sabotage. Industry organizations blacklist the saboteur. Your private handling prevents public drama. The problem is resolved without spectacle. Professional private handling protected you without creating public conflict. Mature approach worked without drama. Legal channels resolved it appropriately.",
                    cash: -3000, fame: 5, wellBeing: -5, careerProgress: 8, hype: 6,
                    lesson: {
                        title: "Professional Private Conflict Resolution",
                        explanation: "Some conflicts resolve better privately through legal and industry channels. Private handling prevents public drama while still protecting you. Professional approach through proper channels often works better than public exposure. Maturity sometimes means private resolution.",
                        realWorldExample: "Many industry conflicts resolve privately through lawyers and professional channels. Not everything needs public exposure. Professional private handling often resolves issues without creating spectacles. Maturity shows in conflict handling.",
                        tipForFuture: "Consider private professional resolution before public exposure. Legal and industry channels often resolve conflicts effectively without drama. Professional private handling can protect you while maintaining dignity.",
                        conceptTaught: "crisis-management"
                    }
                }
            },
            {
                text: "Ignore and rise above - don't acknowledge",
                outcome: {
                    text: "You try ignoring it and rising above. The sabotage continues unchecked. Venues believe fake cease-and-desists and cancel bookings. False rumors spread without counter-narrative. Your silence is interpreted as guilt or weakness. Six months later, significant damage is done. Ignoring malicious sabotage doesn't make it stop - it allows it to succeed. Rising above worked against you. Inaction enabled destruction.",
                    cash: -8000, fame: -15, wellBeing: -25, careerProgress: -20, hype: -25,
                    lesson: {
                        title: "Sabotage Inaction Consequence",
                        explanation: "Ignoring active sabotage doesn't make it stop - it allows it to succeed unchecked. Malicious actors don't stop when ignored - they escalate. Some situations require action, not inaction. Rising above works for criticism, not sabotage. Active threats require active defense.",
                        realWorldExample: "Public figures who ignore active sabotage typically suffer more damage than those who address it. Ignoring sabotage isn't strength - it's allowing destruction. Active malice requires active defense, not passive hoping.",
                        tipForFuture: "Don't ignore active sabotage. Address it through public evidence or private legal action. Inaction allows malicious behavior to succeed. Some situations require defense, not rising above. Protect yourself actively.",
                        conceptTaught: "crisis-management"
                    }
                }
            }
        ]
    }
];

export { fallbackScenario };