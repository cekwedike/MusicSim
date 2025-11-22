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
     {
        title: "Contract Renewal",
        description: "Your manager's contract is up. They've done a good job, but are asking for a higher percentage. What do you do?",
        conditions: { requiresStaff: ['Manager'] }, // Simplified condition, real logic in reducer
        once: true, // This should be triggered by game logic, but flagged here
        choices: [
            {
                text: "Renew the contract. They're worth it.",
                outcome: {
                    text: "You agree to the new terms. Your manager is happy and immediately gets to work on your next big move.",
                    cash: 0, fame: 0, wellBeing: 5, careerProgress: 0, hype: 0,
                    renewStaff: 'Manager',
                    lesson: {
                        title: "Valuing Good Team Members",
                        explanation: "Good managers are rare and valuable. If they've proven their worth, paying them fairly often costs less than finding and training replacements while losing momentum.",
                        realWorldExample: "Many successful artists maintain long-term relationships with their managers, even paying higher rates, because the consistency and trust are worth more than saving money.",
                        tipForFuture: "Calculate the full cost of change: lost time, relationship rebuilding, and potential missed opportunities often exceed higher fees.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "Let them go. I'll find someone cheaper.",
                outcome: {
                    text: "You part ways with your manager. The administrative tasks immediately pile up, causing stress and costing you opportunities.",
                    cash: 0, fame: -5, wellBeing: -15, careerProgress: -5, hype: -10,
                    fireStaff: 'Manager',
                    lesson: {
                        title: "The Hidden Costs of Cheap Labor",
                        explanation: "Cutting costs on key team members often backfires. Cheaper replacements may lack experience, relationships, or commitment, leading to missed opportunities that cost more than the savings.",
                        realWorldExample: "Artists who frequently change managers to save money often struggle with consistency. Each new manager needs time to learn your career goals and rebuild industry relationships.",
                        tipForFuture: "Invest in people who deliver results. The cheapest option is rarely the most cost-effective long-term.",
                        conceptTaught: "Contract Basics"
                    }
                }
            }
        ]
    },

    // --- LABEL SIGNING ---
    {
        title: "The Indie Label Offer",
        description: "A small but respected indie record label, 'Vinyl Heart Records', wants to sign you. They've sent over a contract for you to review. Should you examine their terms or hold out for something bigger?",
        conditions: {
            requiresContractEligibility: true, // Requires sustained 60/75/90 fame for 3-4 weeks
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
                    text: "You sit down to review Vinyl Heart Records' contract offer. Time to see what they're really offering.",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: 0,
                    viewContract: 'Vinyl Heart Records',
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
        conditions: { minFame: 60, minCareerProgress: 50, requiredAchievementId: 'PROJECT_ALBUM_1' },
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
        once: true,
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
        once: true,
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
        conditions: { minFame: 10, maxFame: 40, projectRequired: true },
        once: true,
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
        conditions: { minFame: 30, projectRequired: true },
        once: true,
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
        conditions: { minFame: 8, maxCash: 2000, projectRequired: true },
        once: true,
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
        once: true,
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
        once: true,
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
        conditions: { minFame: 25, maxFame: 70 },
        once: true,
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
        once: true,
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
        conditions: { minFame: 15, maxFame: 50, projectRequired: true },
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
        conditions: { minFame: 30, requiredAchievementId: 'PROJECT_ALBUM_1' },
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
        conditions: { minFame: 25, projectRequired: true },
        once: true,
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
        once: true,
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
        conditions: { minFame: 30, projectRequired: true },
        once: true,
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
        conditions: { minFame: 20, minHype: 30, requiredAchievementId: 'PROJECT_SINGLE_1' },
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
        conditions: { minFame: 40, maxFame: 80 },
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
        conditions: { minFame: 25, projectRequired: true },
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
        conditions: { minFame: 30, maxFame: 70 },
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
        conditions: { minFame: 40, maxFame: 85 },
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
        conditions: { minFame: 30, projectRequired: true },
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
        description: "You've been working non-stop - three albums in two years, constant touring, endless promotion. You're exhausted, anxious, and having panic attacks before shows. Your therapist says you need to take three months off completely. But you're at the peak of your career momentum. Your manager says: 'Three months off now could kill everything we've built. Your competitors won't rest.' Your family says 'push through it.' But you can barely get out of bed some mornings.",
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
        conditions: { minFame: 40, maxFame: 80 },
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
        once: true,
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
    }
];

export { fallbackScenario };