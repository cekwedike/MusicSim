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
    // --- INTRO / PROJECT STARTERS ---
    {
        title: "The First Spark",
        description: "You're full of ideas and ambition. The first step on this long road is to create something, a single song to define your sound and announce your arrival.",
        conditions: { maxFame: 10, noProjectRequired: true },
        once: true,
        choices: [
            {
                text: "Let's do it. Time to write a single.",
                outcome: {
                    text: "You sit down with your instrument, the empty page, and a head full of dreams. The journey begins now.",
                    cash: 0, fame: 0, wellBeing: 5, careerProgress: 0, hype: 5,
                    startProject: "SINGLE_1",
                }
            }
        ]
    },
     {
        title: "Time for an EP",
        description: "Your first single made a small splash, but to be taken seriously, you need a collection of songs. An EP seems like the perfect next step.",
        conditions: { requiredAchievementId: 'PROJECT_SINGLE_1', noProjectRequired: true },
        once: true,
        choices: [
            {
                text: "Begin pre-production for the EP.",
                outcome: {
                    text: "You start outlining tracks and themes for your debut EP. It feels like a monumental task, but you're ready for it.",
                    cash: -200, fame: 2, wellBeing: 0, careerProgress: 0, hype: 10,
                    startProject: "EP_1",
                }
            }
        ]
    },
    {
        title: "The Debut Album",
        description: "You've built a following, honed your craft, and now it's time for the ultimate statement: a full-length album. This will define your career.",
        conditions: { requiredAchievementId: 'PROJECT_EP_1', noProjectRequired: true, minFame: 30 },
        once: true,
        choices: [
            {
                text: "It's time. Let's make an album.",
                outcome: {
                    text: "The ambition is terrifying and exhilarating. You book studio time and start laying down the foundations of your magnum opus.",
                    cash: -2500, fame: 5, wellBeing: -5, careerProgress: 0, hype: 20,
                    startProject: "ALBUM_1",
                }
            }
        ]
    },
     {
        title: "The Sophomore Slump?",
        description: "Your debut was a success, but now the pressure is on. The second album is where legends are made... or where they fade away. No pressure.",
        conditions: { requiredAchievementId: 'PROJECT_ALBUM_1', noProjectRequired: true, minFame: 50 },
        once: true,
        choices: [
            {
                text: "Time to evolve my sound.",
                outcome: {
                    text: "You decide to push your boundaries, exploring new genres and themes for your second album.",
                    cash: -5000, fame: 0, wellBeing: -10, careerProgress: 0, hype: 10,
                    startProject: "ALBUM_2",
                }
            }
        ]
    },

    // --- STAFF HIRING ---
    {
        title: "Overwhelmed",
        description: "Emails, booking requests, scheduling... it's all becoming too much to handle on your own. You're an artist, not an administrator. Maybe it's time to get some help.",
        conditions: { minFame: 15, missingStaff: ['Manager'] },
        once: true,
        choices: [
            {
                text: "Find a professional manager.",
                outcome: {
                    text: "You put out feelers and a respected local manager agrees to take you on. Their services aren't cheap, but the relief is immediate.",
                    cash: 0, fame: 0, wellBeing: 10, careerProgress: 0, hype: 0,
                    hireStaff: 'Manager',
                    lesson: {
                        title: "The Value of Professional Management",
                        explanation: "A good manager handles business so you can focus on creativity. They take 10-20% of your income but often increase your earnings by far more through better deals and opportunities.",
                        realWorldExample: "Davido's manager helped negotiate his Sony Music deal and international collaborations. The 15% management fee paid for itself through better contract terms and global opportunities.",
                        tipForFuture: "Look for managers with industry connections and a track record of growing artists' careers. Their network and experience are worth the commission.",
                        conceptTaught: "Contract Basics"
                    }
                }
            },
            {
                text: "I can handle it myself for now.",
                outcome: {
                    text: "You decide to tough it out, saving the money. Your well-being suffers as you spend another night answering emails instead of writing music.",
                    cash: 0, fame: 0, wellBeing: -10, careerProgress: 0, hype: 0,
                    lesson: {
                        title: "The Hidden Costs of DIY Management",
                        explanation: "While saving money on management fees seems smart, the time and stress of handling business yourself can hurt your creativity and limit opportunities you might miss.",
                        realWorldExample: "Many independent artists burn out trying to do everything themselves. Burna Boy initially managed himself but hired professional management as his career grew, allowing him to focus on music.",
                        tipForFuture: "Calculate the true cost: if you spend 20 hours a week on admin instead of music, what opportunities are you missing? Sometimes paying for help creates more value than it costs.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "Empty Stages",
        description: "You have the music, but your calendar is empty. Getting gigs is a hustle, and one you're not particularly good at. A booker could solve this problem.",
        conditions: { minFame: 20, missingStaff: ['Booker'] },
        once: true,
        choices: [
            {
                text: "Hire a dedicated booker.",
                outcome: {
                    text: "You connect with a local booker who has connections to all the best venues. Gigs start rolling in almost immediately.",
                    cash: 0, fame: 0, wellBeing: 5, careerProgress: 0, hype: 0,
                    hireStaff: 'Booker',
                    lesson: {
                        title: "The Power of Industry Connections",
                        explanation: "Bookers have relationships that take years to build. Their network and reputation can open doors that would remain closed to new artists trying to book directly.",
                        realWorldExample: "Successful booking agents in Lagos and Johannesburg often represent multiple artists, giving them leverage when negotiating with venues and festivals.",
                        tipForFuture: "Invest in people who have the relationships you need. Their connections are often worth more than their fees.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            },
            {
                text: "I'll book my own shows.",
                outcome: {
                    text: "You spend hours calling venues and promoters with little success. It's a frustrating and demoralizing process.",
                    cash: 0, fame: 0, wellBeing: -10, careerProgress: -2, hype: -5,
                    lesson: {
                        title: "The Hidden Costs of DIY Booking",
                        explanation: "Booking shows requires relationships, negotiation skills, and time. When you do it yourself, you're trading potential creative time for business development.",
                        realWorldExample: "Many independent artists spend 50% of their time on booking and admin instead of music. This can slow artistic development and limit the quality of new material.",
                        tipForFuture: "Calculate the true cost: if booking takes 20 hours but only saves you $200, you're working for $10/hour instead of making music.",
                        conceptTaught: "Revenue Streams"
                    }
                }
            }
        ]
    },
    {
        title: "Lost in the Noise",
        description: "You're making great music, but it feels like nobody's listening. You need someone to build a narrative, to create a buzz, to generate hype. You need a promoter.",
        conditions: { minFame: 25, minHype: 10, missingStaff: ['Promoter'] },
        once: true,
        choices: [
            {
                text: "Hire a publicist/promoter.",
                outcome: {
                    text: "You bring on a savvy promoter who immediately starts getting your name out there. Blog posts and radio interviews follow.",
                    cash: 0, fame: 0, wellBeing: 5, careerProgress: 0, hype: 0,
                    hireStaff: 'Promoter',
                    lesson: {
                        title: "Professional Promotion vs DIY Marketing",
                        explanation: "Promoters have relationships with playlist curators, radio DJs, and influencers that take years to develop. Their credibility can get your music heard by the right people.",
                        realWorldExample: "Many Afrobeats artists gained international recognition through promoters who had connections with global playlist curators and international radio stations.",
                        tipForFuture: "Good promotion is an investment, not an expense. The right promoter can multiply your reach far beyond what you could achieve alone.",
                        conceptTaught: "Branding and Image"
                    }
                }
            },
            {
                text: "My music should speak for itself.",
                outcome: {
                    text: "You believe that good music will always find an audience. While noble, your hype stagnates as other, better-marketed artists pass you by.",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: -5,
                    lesson: {
                        title: "The Reality of Music Discovery",
                        explanation: "Great music alone isn't enough in today's oversaturated market. Millions of songs are uploaded daily - even excellent music needs promotion to be discovered.",
                        realWorldExample: "Many talented artists remain unknown because they rely only on their music's quality. Meanwhile, artists with professional promotion teams gain massive audiences even with average songs.",
                        tipForFuture: "Talent needs visibility to succeed. The best music in the world won't help your career if no one hears it.",
                        conceptTaught: "Branding and Image"
                    }
                }
            }
        ]
    },

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
        description: "A small but respected indie record label, 'Vinyl Heart Records', wants to sign you. They offer a small advance but promise full creative control.",
        conditions: { minFame: 20, maxFame: 60, requiredAchievementId: 'PROJECT_EP_1' },
        once: true,
        choices: [
            {
                text: "Sign the deal. Creative freedom is everything.",
                outcome: {
                    text: "You sign with Vinyl Heart! The advance helps, and their network gets your music on several popular playlists.",
                    cash: 5000, fame: 10, wellBeing: 5, careerProgress: 10, hype: 15,
                    signLabel: 'INDIE',
                    lesson: {
                        title: "Indie Labels vs Major Labels",
                        explanation: "Indie labels typically offer smaller advances but better royalty rates and creative control. They're more nimble and can give new artists more personal attention.",
                        realWorldExample: "Chocolate City is a prominent indie label in Nigeria that maintained artists' creative freedom while providing industry connections. Artists like M.I Abaga thrived under their more flexible approach.",
                        tipForFuture: "Indie deals often have better terms for digital revenue and shorter contract periods. Consider if creative control and higher royalty percentages outweigh smaller advances.",
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
        description: "Your success has attracted the big sharks. Two major labels are courting you. 'Global Records' offers a massive advance, while 'Visionary Music' offers better long-term royalties.",
        conditions: { minFame: 60, minCareerProgress: 50, requiredAchievementId: 'PROJECT_ALBUM_1' },
        once: true,
        choices: [
            {
                text: "Take the big advance from 'Global Records'.",
                outcome: {
                    text: "You sign with Global Records! The massive advance changes your life, but they immediately pressure you to work with pop producers.",
                    cash: 250000, fame: 10, wellBeing: -10, careerProgress: 5, hype: 20,
                    signLabel: 'MAJOR_ADVANCE',
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
                text: "Sign with 'Visionary Music' for the better deal.",
                outcome: {
                    text: "You sign with Visionary Music! The advance is smaller, but your higher royalty rate will pay off if you're successful. You have full control, but also more pressure.",
                    cash: 50000, fame: 5, wellBeing: 10, careerProgress: 10, hype: 15,
                    signLabel: 'MAJOR_ROYALTIES',
                    lesson: {
                        title: "Long-term Value vs Short-term Money",
                        explanation: "Higher royalty rates mean you earn more from each sale/stream over time. If your music has staying power, this can be far more valuable than a large advance.",
                        realWorldExample: "Taylor Swift's conflicts with her label over master ownership show the importance of long-term rights. Artists with better royalty deals often earn more over their careers than those who took bigger advances.",
                        tipForFuture: "Consider your confidence in your music's longevity. If you believe your music will sell/stream well long-term, higher royalties often outperform large advances.",
                        conceptTaught: "Rights and Royalties"
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
    // ... (include more diverse scenarios here)
];

export { fallbackScenario };