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
                }
            },
            {
                text: "I'll book my own shows.",
                outcome: {
                    text: "You spend hours calling venues and promoters with little success. It's a frustrating and demoralizing process.",
                    cash: 0, fame: 0, wellBeing: -10, careerProgress: -2, hype: -5,
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
                }
            },
            {
                text: "My music should speak for itself.",
                outcome: {
                    text: "You believe that good music will always find an audience. While noble, your hype stagnates as other, better-marketed artists pass you by.",
                    cash: 0, fame: 0, wellBeing: 0, careerProgress: 0, hype: -5,
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
                }
            },
            {
                text: "It's too much, too soon. I have to pass.",
                outcome: {
                    text: "You decline the offer. Your manager is disappointed, arguing that you have to take risks to succeed. A massive opportunity is missed.",
                    cash: 0, fame: 0, wellBeing: 5, careerProgress: -2, hype: -10,
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
                    renewStaff: 'Manager'
                }
            },
            {
                text: "Let them go. I'll find someone cheaper.",
                outcome: {
                    text: "You part ways with your manager. The administrative tasks immediately pile up, causing stress and costing you opportunities.",
                    cash: 0, fame: -5, wellBeing: -15, careerProgress: -5, hype: -10,
                    fireStaff: 'Manager'
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
                }
            },
            {
                text: "Hold out for a major label.",
                outcome: {
                    text: "You pass, believing you're destined for bigger things. The indie label signs another artist who then blows up. You wonder if you made a mistake.",
                    cash: 0, fame: 0, wellBeing: -5, careerProgress: -2, hype: 0,
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
                }
            },
            {
                text: "Sign with 'Visionary Music' for the better deal.",
                outcome: {
                    text: "You sign with Visionary Music! The advance is smaller, but your higher royalty rate will pay off if you're successful. You have full control, but also more pressure.",
                    cash: 50000, fame: 5, wellBeing: 10, careerProgress: 10, hype: 15,
                    signLabel: 'MAJOR_ROYALTIES',
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
                }
            },
            {
                text: "Try out some new, experimental material.",
                outcome: {
                    text: "The new song is a bit rough. Some people look confused, but one person, a local music blogger, is intrigued by your creativity.",
                    cash: 20, fame: 3, wellBeing: -5, careerProgress: 1, hype: 8,
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
                }
            },
            {
                text: "Issue a formal, serious apology.",
                outcome: {
                    text: "The apology is seen as stiff and disingenuous by some, but sponsors and corporate partners appreciate the professional handling of the situation.",
                    cash: 0, fame: 0, wellBeing: -15, careerProgress: 2, hype: -10,
                }
            },
            {
                text: "Ignore it and hope it blows over.",
                outcome: {
                    text: "Your silence is interpreted as arrogance, and you lose fans and a potential sponsorship deal.",
                    cash: -500, fame: -10, wellBeing: -20, careerProgress: -5, hype: -20,
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
                }
            },
            {
                text: "Turn it down. My art isn't for sale.",
                outcome: {
                    text: "You reject the offer. The story gets leaked and your core fanbase rallies around you, praising your integrity. Your credibility and hype soar.",
                    cash: 0, fame: -5, wellBeing: 15, careerProgress: 5, hype: 25,
                }
            }
        ]
    },
    // ... (include more diverse scenarios here)
];

export { fallbackScenario };