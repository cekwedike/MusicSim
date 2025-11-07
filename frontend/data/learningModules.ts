import type { LearningModule } from '../types';

export const learningModules: LearningModule[] = [
  {
    id: 'contracts-basics',
    title: 'Contract Basics: What Every Artist Must Know',
    category: 'contracts',
    icon: '',
    difficulty: 'beginner',
    estimatedMinutes: 6,
    unlockRequirement: {
      type: 'always',
      message: 'Always available'
    },
    content: {
      introduction: "Contracts are the foundation of your music career. They determine how much money you make, how much control you have, and how long you're committed. Many African artists lose millions because they don't understand what they're signing. Let's change that.",
      sections: [
        {
          heading: 'What is a Record Deal?',
          content: "A record deal is like a business partnership. The label gives you money upfront (an advance) and helps promote your music. In return, they get a percentage of your earnings and own your recordings. Think of it like borrowing money - you have to pay it back before you see profits.",
          examples: [
            "Davido's deal with Sony Music reportedly included a $1M advance",
            "Burna Boy's deal with Atlantic Records helped him reach global audiences",
            "Wizkid's deal with RCA Records boosted his international presence"
          ],
          tip: "An advance is NOT free money - it's a loan against your future earnings."
        },
        {
          heading: 'Key Terms You Must Understand',
          content: "Royalty Rate: Your percentage of sales (typically 10-20% for new artists). Recoupment: Paying back your advance from earnings. Contract Length: Usually 3-7 years or 3-5 albums. Territory: Where the deal covers (Nigeria only vs. worldwide).",
          examples: [
            "15% royalty rate on a ₦1,000 song = ₦150 to you",
            "₦5M advance at 15% = you need ₦33M in sales to break even",
            "Worldwide territory = more opportunity but label takes bigger cut"
          ],
          tip: "Never sign a contract longer than 5 years as a new artist."
        },
        {
          heading: 'Nigerian vs. International Contracts',
          content: "Nigerian labels often offer smaller advances but better royalty rates. International labels offer bigger advances and global reach but take larger percentages. Many successful Nigerian artists start local then move international.",
          examples: [
            "Local deal: ₦2M advance, 20% royalties, Nigeria only",
            "International deal: $100K advance, 12% royalties, worldwide",
            "Tems started with Nigerian features before her international breakthrough"
          ],
          tip: "Build your local fanbase first - it gives you leverage for better international deals."
        }
      ],
      keyTakeaways: [
        "Advances must be paid back from your royalties",
        "Royalty rates typically range from 10-20% for new artists",
        "Contract length should not exceed 5 years for new artists",
        "Territory affects your earning potential and creative control",
        "Local success often leads to better international deal terms"
      ],
      culturalContext: "In Nigeria, many artists prefer starting with local labels like Chocolate City, Mavin Records, or YBNL to build their brand before pursuing international deals. The Nigerian music industry values artist development and cultural authenticity.",
      commonPitfalls: [
        "Signing without reading the entire contract",
        "Not understanding recoupment terms",
        "Accepting 360 deals (label takes percentage of everything)",
        "Not negotiating territorial rights",
        "Signing contracts longer than 5 years"
      ]
    },
    quiz: [
      {
        question: "What is an advance in a record deal?",
        options: [
          "Free money the label gives you",
          "A loan against future earnings that must be paid back",
          "Your monthly salary from the label",
          "Money you pay the label upfront"
        ],
        correctIndex: 1,
        explanation: "An advance is essentially a loan. The label pays you upfront, but this money is recouped from your future royalty earnings before you see additional profits."
      },
      {
        question: "What's a reasonable royalty rate for a new artist?",
        options: [
          "5-8%",
          "10-20%",
          "25-30%",
          "35-40%"
        ],
        correctIndex: 1,
        explanation: "New artists typically receive 10-20% royalty rates. Established artists can negotiate 20%+ while superstars might get 25%+."
      },
      {
        question: "If you get a ₦10M advance with 15% royalties, how much must your music earn before you see additional money?",
        options: [
          "₦15M",
          "₦50M",
          "₦66.7M",
          "₦100M"
        ],
        correctIndex: 2,
        explanation: "₦10M ÷ 0.15 = ₦66.7M. Your music must generate ₦66.7M in revenue for you to earn back your ₦10M advance through your 15% royalty rate."
      },
      {
        question: "What's the advantage of starting with a Nigerian label?",
        options: [
          "They always pay more money",
          "Better understanding of local market and culture",
          "Guaranteed international success",
          "No contracts required"
        ],
        correctIndex: 1,
        explanation: "Nigerian labels understand the local market, cultural nuances, and can help build your domestic fanbase, which often leads to better international deal terms later."
      },
      {
        question: "What's the maximum contract length a new artist should consider?",
        options: [
          "2 years",
          "5 years",
          "10 years",
          "15 years"
        ],
        correctIndex: 1,
        explanation: "New artists should avoid contracts longer than 5 years. This allows you to renegotiate better terms as your career grows and prevents being locked into unfavorable terms."
      }
    ]
  },
  
  {
    id: 'revenue-streams',
    title: 'Understanding Revenue Streams',
    category: 'revenue',
    icon: '',
    difficulty: 'beginner',
    estimatedMinutes: 7,
    unlockRequirement: {
      type: 'careerProgress',
      value: 20,
      message: 'Reach 20% career progress to unlock'
    },
    content: {
      introduction: "There are many ways to make money from music beyond just selling songs. Smart artists diversify their income streams to build sustainable careers. In Africa's growing digital economy, new opportunities emerge daily.",
      sections: [
        {
          heading: 'Streaming Revenue',
          content: "Streaming platforms pay per play, but rates vary dramatically. Spotify pays about $0.003-0.005 per stream, while African platforms like Boomplay often pay less but have growing user bases. Focus on platforms where your audience actually listens.",
          examples: [
            "1 million Spotify streams ≈ $3,000-5,000",
            "1 million Boomplay streams ≈ $300-800", 
            "1 million YouTube Music streams ≈ $1,000-3,000",
            "Audiomack focuses on African music and emerging artists"
          ],
          tip: "Don't chase platform pay rates - chase where your fans are. 100K engaged local fans beats 1M disengaged global ones."
        },
        {
          heading: 'Live Performance Revenue',
          content: "Live shows are often an artist's biggest income source. In Nigeria, festival appearances can pay ₦5-50 million for top artists. Build your live performance skills early - it's where real money lives, especially in Africa where live music culture is strong.",
          examples: [
            "Club gigs: ₦100K-2M depending on your popularity",
            "Festival slots: ₦2M-50M for headliners",
            "Private events: Often pay 2-5x regular show rates",
            "International shows: $10K-500K+ for established artists"
          ],
          tip: "Start small and build your live reputation. Great live performers can charge premium rates even with moderate streaming numbers."
        },
        {
          heading: 'Merchandise and Brand Partnerships',
          content: "Your brand extends beyond music. Successful artists create lifestyle brands selling everything from clothing to tech products. Brand partnerships with Nigerian companies like Pepsi, MTN, or banks can be extremely lucrative.",
          examples: [
            "Davido's endorsement deals worth millions annually",
            "Burna Boy's partnerships with international brands",
            "Artist merchandise: T-shirts, hoodies, accessories",
            "Limited edition releases and fan experiences"
          ],
          tip: "Build your personal brand consistently. Companies want to partner with artists who represent their values."
        },
        {
          heading: 'Sync Licensing and Publishing',
          content: "Getting your music in movies, TV shows, ads, or video games can pay substantial fees. Nollywood's growth creates opportunities for Nigerian artists. Publishing royalties from radio play, streaming, and covers of your songs provide passive income.",
          examples: [
            "Nollywood film placement: ₦500K-5M",
            "International TV/film sync: $5K-100K+",
            "Commercial jingles: ₦1M-10M",
            "Radio royalties collected through COSON"
          ],
          tip: "Register with COSON (Copyright Society of Nigeria) to collect publishing royalties from radio play and public performances."
        }
      ],
      keyTakeaways: [
        "Diversify income - don't rely on just streaming or just live shows",
        "Focus on platforms where YOUR audience listens",
        "Live performance skills can be more valuable than streaming numbers",
        "Brand partnerships require consistent personal branding",
        "Publishing royalties provide long-term passive income"
      ],
      culturalContext: "African music markets prioritize live performance and mobile-first digital consumption. WhatsApp, Instagram, and TikTok are crucial for fan engagement. Local streaming platforms like Boomplay and Audiomack understand African user behavior better than global platforms.",
      commonPitfalls: [
        "Focusing only on Spotify while ignoring local platforms",
        "Underpricing live performances",
        "Not registering songs for publishing royalties",
        "Ignoring merchandise opportunities",
        "Taking brand deals that don't match your image"
      ]
    },
    quiz: [
      {
        question: "Which revenue stream typically pays artists the most?",
        options: [
          "Streaming platforms",
          "Live performances",
          "Social media",
          "Music videos"
        ],
        correctIndex: 1,
        explanation: "Live performances are typically the largest income source for most artists, especially in Africa where live music culture is strong and festival circuits are lucrative."
      },
      {
        question: "Why might Boomplay be better than Spotify for some African artists?",
        options: [
          "It pays higher rates per stream",
          "It has more users globally",
          "It better understands African audiences and consumption habits",
          "It requires no internet connection"
        ],
        correctIndex: 2,
        explanation: "While Boomplay pays less per stream, it understands African user behavior, has growing local audiences, and caters specifically to African music consumption patterns."
      },
      {
        question: "What is sync licensing?",
        options: [
          "Synchronizing your vocals with instruments",
          "Getting your music placed in movies, TV, or ads",
          "Matching your tempo to other songs",
          "Coordinating social media posts"
        ],
        correctIndex: 1,
        explanation: "Sync licensing involves placing your music in visual media like films, TV shows, commercials, or video games, often providing substantial one-time payments."
      },
      {
        question: "What organization should Nigerian artists join to collect publishing royalties?",
        options: [
          "ASCAP",
          "BMI", 
          "COSON",
          "SESAC"
        ],
        correctIndex: 2,
        explanation: "COSON (Copyright Society of Nigeria) is the main organization for collecting publishing royalties from radio play, public performances, and other uses of your music in Nigeria."
      },
      {
        question: "What's the best strategy for building sustainable music income?",
        options: [
          "Focus only on the highest-paying platform",
          "Diversify across multiple revenue streams",
          "Only do live performances",
          "Wait for one big break"
        ],
        correctIndex: 1,
        explanation: "Diversifying across streaming, live shows, merchandise, brand partnerships, and publishing creates multiple income sources and reduces risk if one area declines."
      }
    ]
  },

  {
    id: 'copyright-rights',
    title: 'Copyright and Your Rights',
    category: 'rights',
    icon: '',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    prerequisites: ['contracts-basics'],
    unlockRequirement: {
      type: 'fame',
      value: 30,
      message: 'Reach 30 fame to unlock'
    },
    content: {
      introduction: "Copyright is your most valuable asset as an artist. It determines who owns your music, who profits from it, and how long those rights last. Many artists give away millions by not understanding their rights.",
      sections: [
        {
          heading: 'What Copyright Protects',
          content: "Copyright automatically protects your original songs the moment you create them. This includes the melody, lyrics, and arrangement. However, you need to register with authorities like the Nigerian Copyright Commission for legal protection and enforcement.",
          examples: [
            "Your lyrics and melody are protected by copyright",
            "Your specific recording (master) is separate from the song copyright", 
            "Cover versions need permission from the original songwriter",
            "Sampling requires clearance from both song and recording owners"
          ],
          tip: "Copyright exists when you create, but registration makes it legally enforceable and easier to prove ownership."
        },
        {
          heading: 'Song vs. Master Rights',
          content: "There are two copyrights in every song: the composition (song itself) and the master recording. You might write a song (own composition) but the label owns the recording (master). This is why songwriters earn money when others cover their songs.",
          examples: [
            "You write a song = you own the composition copyright",
            "Label records your song = they often own the master copyright",
            "Someone covers your song = you earn money as the songwriter",
            "Your song plays on radio = both songwriter and master owner earn"
          ],
          tip: "Try to retain your master rights when possible. They're often more valuable than the publishing rights."
        },
        {
          heading: 'Publishing and Mechanical Rights',
          content: "Publishing rights control how your songs are used. Mechanical rights specifically cover reproductions (streaming, downloads, physical sales). Publishers help collect these royalties globally but typically take 10-50% of publishing income.",
          examples: [
            "Every Spotify stream generates a mechanical royalty",
            "Radio play generates performance royalties",
            "YouTube covers of your song generate mechanical royalties",
            "Publishers like Sony Music Publishing collect worldwide"
          ],
          tip: "You can self-publish through organizations like COSON or partner with established publishers for global collection."
        },
        {
          heading: 'Nigerian Copyright Law',
          content: "The Nigerian Copyright Commission (NCC) oversees copyright protection. Registration costs are minimal but provide strong legal protection. COSON helps collect performance royalties when your music plays publicly.",
          examples: [
            "NCC registration provides legal protection in Nigeria",
            "COSON collects from radio stations, clubs, and public venues",
            "Copyright lasts for 70 years after the creator's death",
            "Penalties for infringement can include fines and imprisonment"
          ],
          tip: "Register your major works with NCC and join COSON to ensure you're collecting all available royalties."
        }
      ],
      keyTakeaways: [
        "Copyright exists automatically but registration provides legal protection",
        "Song copyright and master recording copyright are separate",
        "Publishing royalties can provide lifetime passive income",
        "Retaining master rights is often more valuable than higher advances",
        "Registration with NCC and membership in COSON are essential for Nigerian artists"
      ],
      culturalContext: "Nigeria's copyright laws are based on British common law but adapted for local conditions. The rise of Afrobeats globally has made Nigerian copyright protection increasingly important internationally. Many successful artists maintain publishing companies in Nigeria while licensing internationally.",
      commonPitfalls: [
        "Not registering copyrights with the Nigerian Copyright Commission",
        "Giving away publishing rights for small advances",
        "Not understanding the difference between song and master rights",
        "Failing to join COSON for royalty collection",
        "Using uncleared samples in recordings"
      ]
    },
    quiz: [
      {
        question: "When does copyright protection begin for your original song?",
        options: [
          "When you register it officially",
          "When you perform it publicly",
          "The moment you create it",
          "When you release it commercially"
        ],
        correctIndex: 2,
        explanation: "Copyright automatically exists the moment you create an original work. However, registration with authorities like NCC makes it easier to prove ownership and enforce your rights legally."
      },
      {
        question: "What's the difference between song copyright and master copyright?",
        options: [
          "They're the same thing",
          "Song is the composition, master is the specific recording",
          "Song is for lyrics, master is for melody",
          "Song is local rights, master is international rights"
        ],
        correctIndex: 1,
        explanation: "Song copyright covers the composition (lyrics, melody, arrangement) while master copyright covers the specific recording. You can own the song but not the master, or vice versa."
      },
      {
        question: "What does COSON do for Nigerian artists?",
        options: [
          "Records their music",
          "Provides recording studios",
          "Collects performance royalties from public play",
          "Distributes music to streaming platforms"
        ],
        correctIndex: 2,
        explanation: "COSON (Copyright Society of Nigeria) collects performance royalties when your music is played publicly - on radio, in clubs, at events, etc. They distribute these royalties to registered members."
      },
      {
        question: "How long does copyright protection last in Nigeria?",
        options: [
          "10 years",
          "25 years",
          "50 years after creation",
          "70 years after the creator's death"
        ],
        correctIndex: 3,
        explanation: "In Nigeria, copyright lasts for 70 years after the death of the creator. This means your songs can generate income for your heirs long after you're gone."
      },
      {
        question: "Why might retaining master rights be more valuable than a higher advance?",
        options: [
          "Masters always pay more money",
          "Masters give you control over how your music is used long-term",
          "Masters are easier to manage",
          "Masters don't require any work"
        ],
        correctIndex: 1,
        explanation: "Master rights give you long-term control and income from your recordings. While a higher advance gives immediate money, master ownership can generate income for decades and gives you control over licensing, samples, and usage."
      }
    ]
  },

  {
    id: 'predatory-deals',
    title: 'Spotting Predatory Deals',
    category: 'legal',
    icon: '',
    difficulty: 'intermediate',
    estimatedMinutes: 6,
    prerequisites: ['contracts-basics', 'copyright-rights'],
    unlockRequirement: {
      type: 'contractViewed',
      value: 1,
      message: 'View at least 1 contract offer to unlock'
    },
    content: {
      introduction: "The music industry has sharks waiting to exploit new artists. Learn to recognize red flags that signal predatory deals designed to take advantage of your inexperience and eagerness for success.",
      sections: [
        {
          heading: '360 Deals: Proceed with Extreme Caution',
          content: "360 deals mean the label takes a percentage of EVERYTHING - music sales, live shows, merchandise, endorsements, even your side businesses. While some major artists benefit, they're usually terrible for new artists who need multiple income streams to survive.",
          examples: [
            "Label takes 15% of your music AND 15% of your show income",
            "They get a cut of your brand deals and merchandise",
            "Some even claim percentages of acting or business income",
            "Major artists like Jay-Z avoid 360 deals when possible"
          ],
          tip: "If you must sign a 360 deal, negotiate caps on percentages and exclude unrelated business activities."
        },
        {
          heading: 'Impossible Recoupment Terms',
          content: "Some deals are designed so you never recoup your advance. Watch for deals where marketing costs, video budgets, and even office rent are charged against your account. You end up owing money despite success.",
          examples: [
            "₦50M video budget charged to your account without approval",
            "Marketing costs of ₦100M added to your recoupment",
            "Office rent and staff salaries charged to artists",
            "Interest charges on unrecouped balances"
          ],
          tip: "Demand caps on recoupable expenses and approval rights for major expenditures charged to your account."
        },
        {
          heading: 'Perpetual Rights Grabs',
          content: "Avoid deals that claim your rights forever or automatically renew indefinitely. Some contracts claim ownership of songs you haven't even written yet or require you to give them your next 10 albums.",
          examples: [
            "Contracts that automatically renew every 5 years",
            "Claims to own any music you create during the contract period",
            "Rights that extend beyond the contract term",
            "Option clauses that bind you to multiple albums at old terms"
          ],
          tip: "Every contract should have a clear end date with no automatic renewals. Future options should improve your terms."
        },
        {
          heading: 'Red Flags in Nigerian Music Industry',
          content: "Be especially wary of deals requiring upfront payments from artists, promises of guaranteed success, or contracts written only in English when that's not your first language. Legitimate labels invest in you, not the other way around.",
          examples: [
            "Pay ₦5M and we guarantee you'll be famous",
            "Contracts only available in English with no translation",
            "Demands for money upfront for 'promotion packages'",
            "Promises of specific chart positions or award wins"
          ],
          tip: "Real record labels pay YOU, not the other way around. Never pay upfront fees for recording deals."
        }
      ],
      keyTakeaways: [
        "360 deals are usually bad for new artists who need diverse income",
        "Watch for unlimited recoupable expenses that make payback impossible",
        "Avoid contracts with automatic renewals or perpetual rights",
        "Legitimate labels invest in artists, they don't charge upfront fees",
        "Always get contracts reviewed by an entertainment lawyer"
      ],
      culturalContext: "The Nigerian music industry has seen rapid growth, attracting both legitimate and predatory players. Many artists have been exploited by fake labels or management companies. The lack of entertainment lawyers in Nigeria means many artists sign bad deals without proper legal review.",
      commonPitfalls: [
        "Signing 360 deals as a new artist",
        "Agreeing to unlimited recoupable expenses",
        "Not understanding automatic renewal clauses",
        "Paying upfront fees to labels or managers",
        "Signing contracts without legal review"
      ]
    },
    quiz: [
      {
        question: "What is a 360 deal?",
        options: [
          "A deal that lasts 360 days",
          "A deal where the label gets a percentage of all your income sources",
          "A deal that covers 360 degrees of marketing",
          "A deal that gives you 360% returns"
        ],
        correctIndex: 1,
        explanation: "A 360 deal means the label takes a percentage of all your income streams - music, live shows, merchandise, endorsements, and sometimes even unrelated business ventures."
      },
      {
        question: "What's a major red flag in contract terms?",
        options: [
          "5-year contract length",
          "15% royalty rate",
          "Unlimited recoupable expenses",
          "Worldwide territory"
        ],
        correctIndex: 2,
        explanation: "Unlimited recoupable expenses mean the label can charge any costs to your account, making it impossible to recoup your advance and see profits."
      },
      {
        question: "What should you do if a label asks for upfront payment?",
        options: [
          "Pay immediately to show commitment",
          "Negotiate a payment plan",
          "Walk away - it's likely a scam",
          "Ask for a discount"
        ],
        correctIndex: 2,
        explanation: "Legitimate record labels invest their money in artists. If someone asks YOU to pay THEM for a record deal, it's almost certainly a scam."
      },
      {
        question: "Why are automatic renewal clauses problematic?",
        options: [
          "They're too expensive",
          "They lock you into old terms even as your value increases",
          "They're illegal in Nigeria",
          "They only benefit the artist"
        ],
        correctIndex: 1,
        explanation: "Automatic renewals can trap you in unfavorable terms even after you become successful. As your career grows, you should be able to renegotiate better deals."
      },
      {
        question: "What's the best protection against predatory deals?",
        options: [
          "Only work with Nigerian companies",
          "Sign quickly before terms change",
          "Have an entertainment lawyer review all contracts",
          "Trust the label's reputation"
        ],
        correctIndex: 2,
        explanation: "An experienced entertainment lawyer can spot predatory terms and negotiate better deals. The cost of legal review is minimal compared to potential losses from bad contracts."
      }
    ]
  },

  {
    id: 'brand-building',
    title: 'Building Your Brand',
    category: 'marketing',
    icon: '',
    difficulty: 'beginner',
    estimatedMinutes: 7,
    unlockRequirement: {
      type: 'hype',
      value: 25,
      message: 'Reach 25 hype to unlock'
    },
    content: {
      introduction: "Your brand is everything beyond your music - how fans perceive you, what you represent, and why they choose you over thousands of other artists. In today's digital world, brand building happens 24/7 across multiple platforms.",
      sections: [
        {
          heading: 'Authenticity vs. Image',
          content: "The best brands feel authentic while being strategically crafted. You don't have to share everything, but what you share should feel genuine. African artists often succeed by embracing their cultural identity rather than copying Western trends.",
          examples: [
            "Burna Boy's 'African Giant' persona embraces his heritage",
            "Tems' natural style and confidence resonates globally", 
            "Davido's family background becomes part of his brand story",
            "Wizkid's evolution from Shitta boy to global superstar"
          ],
          tip: "Find the intersection between who you really are and what makes you interesting to others."
        },
        {
          heading: 'Social Media Strategy',
          content: "Different platforms serve different purposes. Instagram shows your lifestyle, Twitter/X shows your personality, TikTok shows your creativity, and YouTube builds deep engagement. Focus on 2-3 platforms you can maintain consistently rather than being everywhere poorly.",
          examples: [
            "Instagram: Behind-the-scenes content, fashion, lifestyle",
            "TikTok: Song snippets, dances, trends, viral moments",
            "Twitter: Opinions, interactions with fans, real-time updates",
            "YouTube: Music videos, vlogs, longer-form content"
          ],
          tip: "Consistency beats perfection. Post regularly on fewer platforms rather than sporadically everywhere."
        },
        {
          heading: 'Language and Cultural Identity',
          content: "Choosing whether to sing in English, local languages, or mix both affects your brand positioning. Many successful African artists blend languages to appeal to both local and international audiences. Your language choice tells a story about who you are.",
          examples: [
            "Burna Boy mixes English with Yoruba and Pidgin",
            "Angelique Kidjo sings in multiple African languages",
            "Diamond Platnumz uses Swahili to dominate East Africa",
            "Sarkodie raps in Twi and English for different audiences"
          ],
          tip: "Don't abandon your linguistic identity for commercial appeal. Many global hits feature local languages."
        },
        {
          heading: 'Visual Identity and Storytelling',
          content: "Your visual brand - photos, videos, artwork, fashion - should tell a consistent story. Successful artists develop recognizable aesthetics that fans can identify instantly. This includes everything from album covers to social media posts.",
          examples: [
            "Consistent color schemes across all visuals",
            "Signature fashion styles or accessories",
            "Recurring visual themes in music videos",
            "Professional photography that reflects your personality"
          ],
          tip: "Invest in good photography and design. Visual quality affects how seriously people take your music."
        }
      ],
      keyTakeaways: [
        "Authenticity attracts more loyal fans than manufactured personas",
        "Focus on 2-3 social media platforms you can maintain consistently",
        "Language choices should reflect your identity and target audience",
        "Visual consistency across all platforms strengthens brand recognition",
        "Cultural identity can be a competitive advantage, not a limitation"
      ],
      culturalContext: "African artists increasingly succeed by embracing rather than hiding their cultural identity. The global appetite for African music, fashion, and culture creates opportunities for authentic representation. Social media algorithms often favor content that feels genuine and culturally specific.",
      commonPitfalls: [
        "Trying to be everything to everyone",
        "Copying other artists' brands instead of developing your own",
        "Inconsistent posting across social media platforms",
        "Ignoring visual branding and professional photography",
        "Abandoning cultural identity for perceived commercial appeal"
      ]
    },
    quiz: [
      {
        question: "What's the most important element of successful branding?",
        options: [
          "Having the most followers",
          "Copying successful artists",
          "Authentic representation of your identity",
          "Posting multiple times daily"
        ],
        correctIndex: 2,
        explanation: "Authentic branding that genuinely reflects who you are creates deeper connections with fans and stands out in a crowded market more than copying others or chasing numbers."
      },
      {
        question: "How many social media platforms should new artists focus on?",
        options: [
          "All available platforms",
          "2-3 platforms they can maintain consistently",
          "Only Instagram",
          "Whichever has the most users"
        ],
        correctIndex: 1,
        explanation: "It's better to maintain a strong, consistent presence on 2-3 platforms than to spread yourself thin trying to be everywhere. Quality and consistency beat quantity."
      },
      {
        question: "How should African artists approach language choices in their music?",
        options: [
          "Only use English for global appeal",
          "Only use local languages",
          "Mix languages that reflect their identity and audience",
          "Copy whatever is trending"
        ],
        correctIndex: 2,
        explanation: "The most successful African artists often blend languages authentically, appealing to both local and international audiences while maintaining their cultural identity."
      },
      {
        question: "Why is visual consistency important for artists?",
        options: [
          "It makes you look more expensive",
          "It helps fans recognize your brand instantly",
          "It's required by record labels",
          "It's easier to manage"
        ],
        correctIndex: 1,
        explanation: "Consistent visual branding across photos, videos, and artwork helps fans instantly recognize your content and builds a stronger, more memorable brand identity."
      },
      {
        question: "What's the best approach to developing your artist brand?",
        options: [
          "Study successful artists and copy their strategies exactly",
          "Focus only on music and ignore everything else",
          "Find the intersection between who you are and what interests others",
          "Change your brand frequently to stay relevant"
        ],
        correctIndex: 2,
        explanation: "The strongest brands find the sweet spot between authentic self-expression and what resonates with audiences. This creates genuine connection while maintaining commercial appeal."
      }
    ]
  },

  {
    id: 'cultural-appropriation',
    title: 'Cultural Appropriation: Protecting Your Heritage',
    category: 'culture',
    icon: '',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    unlockRequirement: {
      type: 'fame',
      value: 35,
      message: 'Reach 35 fame to unlock'
    },
    content: {
      introduction: "Cultural appropriation occurs when Western artists or companies take African music, styles, or cultural elements without credit, compensation, or understanding. As African music gains global popularity, protecting your cultural heritage becomes crucial. Learn to recognize, prevent, and fight cultural theft.",
      sections: [
        {
          heading: 'What is Cultural Appropriation in Music?',
          content: "Cultural appropriation happens when dominant cultures (often Western) extract profitable elements from marginalized cultures (like African music) without proper credit, compensation, or respect for the source. It's different from cultural exchange, which involves mutual respect and benefit.",
          examples: [
            "European DJs sampling traditional African songs without credit or payment",
            "Western pop stars using African aesthetics in videos without acknowledging influence",
            "Companies trademarking traditional African musical instruments or patterns",
            "Artists copying Afrobeats sound while calling it 'tropical house' or generic 'world music'"
          ],
          tip: "Cultural exchange involves collaboration and credit. Appropriation involves extraction and erasure."
        },
        {
          heading: 'The Economic Impact',
          content: "When your cultural work is appropriated, you lose both money and recognition. Western artists make millions from African sounds while African creators get called 'the inspiration' with no compensation. This perpetuates economic inequality and cultural erasure.",
          examples: [
            "Lion King earned billions using African music with minimal African artist compensation",
            "European DJs making millions from songs that sampled African recordings without payment",
            "Fashion brands profiting from African prints while African designers struggle",
            "Streaming playlists labeling African music as 'world music' instead of naming specific genres"
          ],
          tip: "Always document your work publicly and register copyrights. Digital trails make appropriation harder to deny."
        },
        {
          heading: 'Legal Protection Strategies',
          content: "International copyright law often fails African artists. But you have tools: Register with Nigerian Copyright Commission, join COSON, document your work online, and use social media to create accountability. Public pressure often works better than lawsuits.",
          examples: [
            "Register all original compositions with NCC immediately",
            "Upload demos and works-in-progress to establish creation dates",
            "Use social media to publicly document your creative process",
            "Build international legal protections through proper registration"
          ],
          tip: "Create paper trails. Upload your creative process to YouTube, Instagram, or TikTok to establish creation dates."
        },
        {
          heading: 'When to Fight vs. When to Collaborate',
          content: "Not every use of African sounds is theft. Distinguish between exploitation and genuine collaboration. Real collaborators credit you, compensate you fairly, and treat your culture with respect. Exploiters take without asking, credit, or payment.",
          examples: [
            "GOOD: Beyoncé collaborating with Wizkid and giving full credit",
            "BAD: Sampling traditional songs without clearance or credit",
            "GOOD: Justin Bieber featuring Burna Boy with proper splits",
            "BAD: Calling Afrobeats 'tropical house' to avoid crediting African origins"
          ],
          tip: "If someone respects you enough to ask permission and offer credit/payment, consider collaboration over confrontation."
        },
        {
          heading: 'Building Cultural Awareness',
          content: "Educate your audience about African musical traditions. When people understand the cultural significance of your work, they're more likely to call out appropriation. Your platform gives you power to shape narratives about African music.",
          examples: [
            "Share the history behind your musical choices in interviews",
            "Explain traditional instruments and rhythms in your content",
            "Call out cultural erasure when you see it, even if not directly affecting you",
            "Amplify other African artists who are being appropriated"
          ],
          tip: "Use your platform to educate. The more people understand African music's origins, the harder appropriation becomes."
        },
        {
          heading: 'Social Media as Protection Tool',
          content: "Social media has given African artists powerful weapons against appropriation. Public call-outs can force acknowledgment and compensation when legal systems fail. But use this power strategically - gather evidence, be clear about what happened, and present facts.",
          examples: [
            "Video side-by-side comparisons showing original vs. appropriated work",
            "Threads explaining the cultural significance of what was taken",
            "Tagging influential music journalists and industry figures",
            "Building coalitions with other affected artists for collective action"
          ],
          tip: "Document everything before going public. Have clear evidence, dates, and specific demands ready before calling someone out."
        }
      ],
      keyTakeaways: [
        "Cultural appropriation is theft that costs African artists money and recognition",
        "Documentation and registration are your first line of defense",
        "Social media can be more effective than lawsuits for forcing accountability",
        "Distinguish between genuine collaboration and exploitation",
        "Your platform helps educate others and prevent future appropriation",
        "Build coalitions - collective action is more powerful than individual fights"
      ],
      culturalContext: "The global rise of Afrobeats has increased both opportunities and risks for African artists. As African music influences mainstream Western pop, rock, and electronic music, instances of unacknowledged sampling and stylistic appropriation have multiplied. The same colonial dynamics that historically extracted African resources now operate in cultural markets.",
      commonPitfalls: [
        "Not documenting your creative process publicly",
        "Failing to register copyrights with proper authorities",
        "Accepting 'exposure' instead of proper compensation",
        "Not calling out appropriation when you see it",
        "Fighting alone instead of building coalitions",
        "Expensive lawsuits without first trying public pressure"
      ]
    },
    quiz: [
      {
        question: "What's the main difference between cultural exchange and cultural appropriation?",
        options: [
          "Exchange happens in Africa, appropriation happens abroad",
          "Exchange involves mutual respect and credit, appropriation involves extraction without acknowledgment",
          "Exchange is free, appropriation costs money",
          "They're the same thing"
        ],
        correctIndex: 1,
        explanation: "Cultural exchange involves mutual respect, proper credit, and fair compensation. Appropriation takes cultural elements without permission, credit, or compensation while often misrepresenting or erasing the source culture."
      },
      {
        question: "Why is documenting your creative process online important?",
        options: [
          "To get more followers",
          "To establish creation dates and ownership if theft occurs",
          "Because labels require it",
          "To practice transparency"
        ],
        correctIndex: 1,
        explanation: "Public documentation creates time-stamped evidence of your creative process. If someone appropriates your work, you have clear proof of when you created it, making theft much harder to deny."
      },
      {
        question: "What's often more effective than lawsuits for fighting appropriation?",
        options: [
          "Ignoring it completely",
          "Public social media campaigns with evidence",
          "Sending private messages",
          "Complaining to friends"
        ],
        correctIndex: 1,
        explanation: "Social media call-outs with clear evidence can create public pressure that forces acknowledgment and compensation more quickly and cheaply than expensive international lawsuits that African artists often can't afford."
      },
      {
        question: "Which situation represents legitimate collaboration, not appropriation?",
        options: [
          "Sampling without permission or payment",
          "Justin Bieber featuring Burna Boy with proper credit and payment splits",
          "Calling Afrobeats 'tropical house' to avoid crediting African origins",
          "Using traditional melodies without acknowledging the culture"
        ],
        correctIndex: 1,
        explanation: "Legitimate collaboration involves asking permission, giving proper credit, providing fair compensation, and respecting the cultural source. When Justin Bieber featured Burna Boy with proper credits and splits, that's respectful collaboration."
      },
      {
        question: "What should be your first step when you discover someone has appropriated your work?",
        options: [
          "Immediately sue them",
          "Gather evidence and document the appropriation clearly",
          "Do nothing and hope they stop",
          "Copy their work back"
        ],
        correctIndex: 1,
        explanation: "Before taking any action, gather clear evidence: side-by-side comparisons, timestamps, screenshots, and documentation. This makes your case stronger whether you pursue legal action, public pressure, or private negotiation."
      },
      {
        question: "Why is collective action more powerful than fighting appropriation alone?",
        options: [
          "It's more fun",
          "Combined voices create more pressure and make systemic change more likely",
          "It's required by law",
          "It costs less money"
        ],
        correctIndex: 1,
        explanation: "When multiple artists come together to address appropriation, it becomes harder to ignore, creates larger public pressure, and can lead to industry-wide changes in how African music and artists are treated and compensated."
      }
    ]
  },

  {
    id: 'african-music-economics',
    title: 'African Music Industry: Economics & Reality',
    category: 'business',
    icon: '',
    difficulty: 'intermediate',
    estimatedMinutes: 9,
    unlockRequirement: {
      type: 'careerProgress',
      value: 30,
      message: 'Reach 30% career progress to unlock'
    },
    content: {
      introduction: "The African music industry operates differently from Western markets. Understanding these unique economic realities - from mobile-first consumption to diaspora markets to alternative revenue streams - is crucial for building sustainable careers as an African artist.",
      sections: [
        {
          heading: 'Mobile-First Music Consumption',
          content: "Africa is the most mobile-first continent in the world. Most fans access music through smartphones with limited data and storage. This affects everything from file formats to platform choices to how you release music.",
          examples: [
            "Boomplay and Audiomack dominate because they work well on low-end phones",
            "MP3 downloads still outpace streaming in many African countries",
            "WhatsApp and Telegram are major music distribution channels",
            "Data costs heavily influence streaming habits"
          ],
          tip: "Release music on platforms your African fans actually use, not just Western platforms. Boomplay, Audiomack, and even WhatsApp matter."
        },
        {
          heading: 'The Diaspora Market Advantage',
          content: "Africans living abroad are often your most profitable audience. They stream more (reliable internet), attend more shows (higher ticket prices), and spend more on merchandise. Building diaspora fanbases is crucial for financial sustainability.",
          examples: [
            "Afrobeats concerts in London often outgross Lagos shows",
            "Nigerian diaspora in US/UK stream more than local audiences",
            "Diaspora audiences pay 10-50x more for concert tickets",
            "Merchandise sales to diaspora can exceed local sales by 20x"
          ],
          tip: "Tour diaspora markets early and often. One UK tour can fund six months of career development back home."
        },
        {
          heading: 'Alternative Revenue Streams',
          content: "Because streaming pays poorly in Africa, successful artists diversify heavily. Endorsements, private events, and influencer partnerships often outpace music revenue. Your music is the marketing; other revenue streams are the business.",
          examples: [
            "Private birthday parties paying ₦5-20M for 30-minute performances",
            "Brand ambassadorships with telecoms, banks, and beverage companies",
            "Influencer marketing deals on Instagram and TikTok",
            "Corporate event performances at premium rates"
          ],
          tip: "Build your brand consistently. Companies pay for influence and image, not just musical talent."
        },
        {
          heading: 'Festival Economy',
          content: "African music festivals have exploded - from Afronation to Detty December to Nyege Nyege. Festival circuits provide crucial income, exposure, and networking opportunities. Festival performance quality directly affects booking rates.",
          examples: [
            "Afronation Portugal/Ghana featuring mostly African artists",
            "Detty December concerts in Lagos paying top-tier rates",
            "Nyege Nyege Festival in Uganda showcasing East African talent",
            "Festival performances leading to international booking opportunities"
          ],
          tip: "Invest in your live performance quality. Festival bookers watch other festivals to scout talent."
        },
        {
          heading: 'Communal Business Models',
          content: "Unlike Western individualism, African music business often involves collective labels (like Mavin Records' family approach) and shared success. This creates support networks but also financial obligations. Balance is crucial.",
          examples: [
            "Mavin Records' collective promotion lifting all artists",
            "YBNL Records' family model supporting emerging artists",
            "Shared production costs among label mates",
            "Collective touring reducing individual artist costs"
          ],
          tip: "Choose labels that genuinely invest in artist development, not just extraction of talent."
        },
        {
          heading: 'Direct Fan Monetization',
          content: "African artists increasingly monetize fans directly through social media, WhatsApp groups, and direct messaging. This cuts out middlemen and creates more sustainable income than waiting for streaming payouts.",
          examples: [
            "Premium WhatsApp groups offering exclusive content",
            "Direct song sales via mobile money (M-Pesa, bank transfers)",
            "Instagram Live performances with virtual tip jars",
            "Direct bookings through DMs for private events"
          ],
          tip: "Build direct relationships with super-fans. 1,000 true fans paying ₦10K/year = ₦10M annual income."
        }
      ],
      keyTakeaways: [
        "African music consumption is mobile-first - optimize for that reality",
        "Diaspora markets often provide more revenue than local markets",
        "Diversify beyond music sales - endorsements and events pay better",
        "Festival circuits are crucial for income and career development",
        "Communal label models can provide support but require boundaries",
        "Direct fan monetization reduces dependence on streaming platforms"
      ],
      culturalContext: "African music markets are characterized by low streaming payouts, high mobile phone penetration, strong live music culture, and growing diaspora engagement. The informal economy plays a huge role - many transactions happen via mobile money and cash rather than traditional banking. Understanding these realities makes the difference between sustainable careers and starvation despite popularity.",
      commonPitfalls: [
        "Focusing only on Spotify when African fans use Boomplay and Audiomack",
        "Ignoring diaspora markets until late in career",
        "Relying solely on streaming revenue",
        "Underpricing private events and corporate gigs",
        "Not building direct fan relationships",
        "Expecting Western music economics to apply to African markets"
      ]
    },
    quiz: [
      {
        question: "Why is Africa considered 'mobile-first' for music consumption?",
        options: [
          "Everyone prefers mobile phones to computers",
          "Most music access happens via smartphones due to infrastructure and costs",
          "Mobile phones are cheaper to buy",
          "Desktop computers are banned"
        ],
        correctIndex: 1,
        explanation: "Limited desktop/laptop access, strong mobile phone penetration, and mobile-optimized platforms make smartphones the primary music access point for most African consumers. This affects platform choices and consumption patterns."
      },
      {
        question: "Why are diaspora audiences often more profitable than local audiences?",
        options: [
          "They like the music more",
          "They have reliable internet, higher purchasing power, and pay premium ticket prices",
          "There are more of them",
          "They're easier to reach"
        ],
        correctIndex: 1,
        explanation: "Diaspora audiences in Western countries stream more consistently, pay 10-50x more for concert tickets, and have higher disposable income for merchandise and premium content compared to fans in African countries."
      },
      {
        question: "What's often more profitable for African artists than streaming revenue?",
        options: [
          "YouTube views",
          "Social media likes",
          "Private events, brand deals, and endorsements",
          "Radio play"
        ],
        correctIndex: 2,
        explanation: "Streaming pays poorly in African markets. Private events (₦5-20M for 30 minutes), brand ambassadorships, and corporate endorsements typically generate far more income than streaming royalties for most African artists."
      },
      {
        question: "What makes festival performances particularly valuable?",
        options: [
          "They're fun to perform",
          "They pay well AND provide exposure to bookers and international audiences",
          "They require no preparation",
          "They're easy to get"
        ],
        correctIndex: 1,
        explanation: "Festivals provide both immediate income and crucial exposure. International bookers and promoters attend festivals to scout talent, so strong festival performances lead to international tour opportunities and higher booking rates."
      },
      {
        question: "What's the '1,000 true fans' monetization strategy?",
        options: [
          "Getting 1,000 fans to attend each show",
          "Building direct relationships with fans who pay regularly for exclusive content",
          "Having exactly 1,000 social media followers",
          "Performing 1,000 concerts"
        ],
        correctIndex: 1,
        explanation: "The '1,000 true fans' concept means building direct relationships with dedicated fans willing to pay annually for exclusive content, early releases, and special access. This creates sustainable income independent of streaming platforms."
      },
      {
        question: "Why should African artists prioritize platforms like Boomplay and Audiomack?",
        options: [
          "They pay higher rates than Spotify",
          "They're required by law",
          "They're optimized for African mobile users and where African fans actually listen",
          "They're easier to upload to"
        ],
        correctIndex: 2,
        explanation: "Boomplay and Audiomack are designed for low-data environments, low-end phones, and African user behavior. While they may pay less per stream, they reach more African fans and provide better user experiences for the continent's mobile-first reality."
      }
    ]
  },

  {
    id: 'mental-health-wellbeing',
    title: 'Mental Health & Wellbeing for Artists',
    category: 'wellness',
    icon: '',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    unlockRequirement: {
      type: 'careerProgress',
      value: 25,
      message: 'Reach 25% career progress to unlock'
    },
    content: {
      introduction: "The music industry is glamorous on Instagram but brutal on mental health. Constant pressure, public scrutiny, financial stress, family expectations, and the hustle culture take heavy tolls. Understanding mental health isn't weakness - it's career survival.",
      sections: [
        {
          heading: 'The African Hustle Culture Trap',
          content: "African music culture glorifies relentless grinding. 'Sleep is for the weak.' 'Rest when you die.' This mindset destroys artists. Burnout is real, common, and can end careers. Sustainable success requires rest, boundaries, and self-care - concepts often dismissed as 'Western' but actually universal.",
          examples: [
            "Artists collapsing from exhaustion during tours",
            "Mental breakdowns during album rollouts",
            "Substance abuse to maintain grinding pace",
            "Damaged relationships with family and friends from overwork"
          ],
          tip: "Your mental health is your career foundation. You can't create, perform, or build when you're burnt out."
        },
        {
          heading: 'Family Pressure and Mental Load',
          content: "As an African artist, success means becoming everyone's ATM. Every achievement brings more family requests. The mental load of constant guilt, expectations, and financial demands is enormous. This isn't discussed but affects most successful African artists deeply.",
          examples: [
            "Anxiety from constant family financial requests",
            "Guilt when saying no to extended family needs",
            "Fear of being called selfish or 'too Western'",
            "Depression from feeling you can never do enough"
          ],
          tip: "Set clear boundaries early. You can support family sustainably without destroying yourself financially or mentally."
        },
        {
          heading: 'Public Scrutiny and Social Media Pressure',
          content: "Every post is judged. Every outfit criticized. Every relationship analyzed. African social media can be particularly brutal. Cyberbullying, constant comparisons to other artists, and the pressure to always appear successful creates massive mental strain.",
          examples: [
            "Constant negative comments affecting self-esteem",
            "Comparisons to other artists creating imposter syndrome",
            "Pressure to fake success when struggling",
            "Fear of showing vulnerability or asking for help"
          ],
          tip: "Curate your social media carefully. Unfollow toxicity. You don't need to read every comment or prove anything to strangers."
        },
        {
          heading: 'Warning Signs You're Heading for Burnout',
          content: "Recognize warning signs early: persistent exhaustion, loss of creativity, irritability, physical symptoms (headaches, stomach issues), avoiding music, isolation, substance use increasing. These aren't weakness - they're your body and mind demanding attention.",
          examples: [
            "Can't write or create despite having studio time",
            "Dreading performances you used to love",
            "Snapping at friends, family, or team members",
            "Using alcohol or drugs to cope with pressure",
            "Panic attacks before shows or interviews"
          ],
          tip: "If you recognize 3+ of these signs, you need to slow down immediately. These problems only get worse if ignored."
        },
        {
          heading: 'Practical Mental Health Strategies',
          content: "Therapy isn't common in African culture but it works. Find mental health professionals, even online. Build a trusted inner circle who understand the pressure. Schedule actual downtime - not 'grind on other projects' but real rest. Exercise, sleep, and relationships aren't luxuries - they're necessities.",
          examples: [
            "Online therapy services like BetterHelp work internationally",
            "Nigerian mental health platforms like MindBody and WellNewMe",
            "Scheduled digital detoxes (no phone weekends)",
            "Regular exercise - even walks help mental clarity",
            "Mandatory rest days with no music industry activities"
          ],
          tip: "Schedule rest like you schedule studio time. Put it in your calendar. Treat it as non-negotiable."
        },
        {
          heading: 'When to Take a Break',
          content: "Sometimes you need to stop completely. This terrifies artists - 'competitors will pass me.' But burnout breaks happen anyway, usually at worse times with public meltdowns. Strategic breaks, while scary, often save careers. Return stronger or don't return at all.",
          examples: [
            "Kendrick Lamar's multi-year breaks between albums",
            "Kid Cudi's public mental health leaves",
            "Billie Eilish taking time off despite being at her peak",
            "Local artists who quietly step back to recover"
          ],
          tip: "A planned 3-month break is better than an unplanned 3-year absence from a public breakdown."
        }
      ],
      keyTakeaways: [
        "Hustle culture is destroying African artists - rest is not weakness",
        "Family financial pressure creates massive mental load that's rarely discussed",
        "Social media scrutiny affects mental health more than most artists admit",
        "Recognize burnout warning signs early before crisis hits",
        "Therapy and mental health support work even if culturally uncommon",
        "Strategic breaks save careers more often than grinding through does"
      ],
      culturalContext: "African cultures often view mental health discussions as taboo or 'Western concepts.' The communal nature of African societies creates support but also pressure. Extended family expectations, public success standards, and hustling culture combine to create unique mental health challenges that Western music industry advice rarely addresses.",
      commonPitfalls: [
        "Dismissing mental health concerns as 'being weak'",
        "Pushing through burnout warning signs",
        "Not setting boundaries with family demands",
        "Comparing your behind-the-scenes to others' highlight reels",
        "Using substances to cope with pressure",
        "Believing rest will make you lose relevance"
      ]
    },
    quiz: [
      {
        question: "What's the main problem with African hustle culture in music?",
        options: [
          "It makes artists work hard",
          "It promotes unsustainable grinding that leads to burnout",
          "It's only a Western concept",
          "It helps artists succeed faster"
        ],
        correctIndex: 1,
        explanation: "While hard work is important, hustle culture that glorifies not sleeping, constant grinding, and no rest leads to burnout, mental health crises, and often ends careers. Sustainable success requires balance."
      },
      {
        question: "Why is family financial pressure particularly challenging for African artists?",
        options: [
          "African families are larger",
          "It combines financial stress with cultural guilt and emotional obligation",
          "Western artists don't have families",
          "It only affects new artists"
        ],
        correctIndex: 1,
        explanation: "African communal culture means individual success is seen as family success, creating constant requests combined with cultural guilt when saying no. This creates mental and financial pressure that Western-focused career advice rarely addresses."
      },
      {
        question: "What should you do if you notice 3+ burnout warning signs?",
        options: [
          "Push harder to overcome them",
          "Ignore them and keep grinding",
          "Slow down immediately and address them",
          "Wait until you collapse"
        ],
        correctIndex: 2,
        explanation: "Burnout warning signs are your mind and body demanding attention. Addressing them early prevents full crisis. Pushing through makes them worse and can lead to complete career-ending breakdowns."
      },
      {
        question: "What's the best approach to taking career breaks?",
        options: [
          "Never take breaks - competitors will pass you",
          "Only take breaks after you collapse",
          "Plan strategic breaks before crisis hits",
          "Take breaks randomly without planning"
        ],
        correctIndex: 2,
        explanation: "Strategic planned breaks let you recover and return stronger. Unplanned breaks happen anyway if you ignore warning signs, usually as public meltdowns at worse times. Planned breaks protect careers better than grinding until collapse."
      },
      {
        question: "Why is therapy valuable even though it's uncommon in African culture?",
        options: [
          "It's required by labels",
          "It provides professional help for mental health that cultural stigma shouldn't prevent",
          "It's only for Western artists",
          "It's just talking to anyone"
        ],
        correctIndex: 1,
        explanation: "Professional therapy provides tools and support for mental health challenges. Cultural stigma around mental health doesn't change the fact that therapy works. Many African artists privately use therapy despite public stigma."
      },
      {
        question: "What's the relationship between rest and career longevity?",
        options: [
          "Rest makes you lose relevance",
          "They're unrelated",
          "Strategic rest enables sustainable long-term careers",
          "Only unsuccessful artists rest"
        ],
        correctIndex: 2,
        explanation: "Artists with long sustainable careers typically incorporate rest and boundaries. Those who grind without rest often burn out quickly. Rest isn't laziness - it's career maintenance and creativity fuel."
      }
    ]
  },

  {
    id: 'international-collaborations',
    title: 'International Collaborations: Cross-Cultural Partnerships',
    category: 'collaboration',
    icon: '',
    difficulty: 'intermediate',
    estimatedMinutes: 9,
    prerequisites: ['brand-building'],
    unlockRequirement: {
      type: 'fame',
      value: 45,
      message: 'Reach 45 fame to unlock'
    },
    content: {
      introduction: "International collaborations can explode your career or expose cultural tensions. Success requires understanding cultural differences, fair deal structuring, linguistic considerations, and maintaining authenticity. Learn to build partnerships that respect all parties rather than exploit African artists.",
      sections: [
        {
          heading: 'Types of International Collaborations',
          content: "Not all collaborations are equal. Featured verses, co-productions, remix features, and full joint projects serve different purposes and require different approaches. Understanding what each collaboration type achieves helps you make strategic choices.",
          examples: [
            "Featured verse: Quick exposure, modest payment (e.g., Wizkid on Drake's 'One Dance')",
            "Co-production: Shared creative control and ownership (e.g., Burna Boy's Grammy album)",
            "Remix feature: Extending reach to new markets with existing song",
            "Joint album/EP: Deep collaboration requiring trust and alignment"
          ],
          tip: "Start with featured verses. Deeper collaborations require established trust and understanding."
        },
        {
          heading: 'Negotiating Fair Splits',
          content: "African artists often get exploited in international collaborations. 'Exposure' isn't payment. Fair splits account for: writing contribution, performance, production, promotion reach, and rights ownership. Don't accept minimal percentages just for 'the opportunity' - you bring unique value.",
          examples: [
            "Equal writing splits if both contribute meaningfully to composition",
            "Production credits should match actual production contribution",
            "Don't accept 5% because they're 'more famous' - your African sound is the value",
            "Negotiate separately for streaming, sync, and performance rights"
          ],
          tip: "If someone wants your African sound, you're bringing essential value. Never accept token percentages for core contributions."
        },
        {
          heading: 'Linguistic Authenticity',
          content: "Maintain linguistic identity in collaborations. Singing in languages you don't speak for market access often backfires. True multilingual collaborations celebrate each artist's linguistic identity rather than requiring assimilation into English or other dominant languages.",
          examples: [
            "Burna Boy mixing Yoruba with English in international features",
            "J Balvin and Bad Bunny keeping Spanish in English-market collabs",
            "Beyoncé embracing multilingualism in Lion King album",
            "Artists being mocked for phonetically singing languages they don't speak"
          ],
          tip: "Propose keeping your linguistic identity. Your language is part of your unique value - don't abandon it for 'accessibility.'"
        },
        {
          heading: 'Cultural Respect vs. Appropriation',
          content: "Great collaborations involve mutual learning and respect. Red flags: partners who don't credit African influence, use African aesthetics without understanding, or treat you as exotic accessory rather than equal creative. Demand respect for your cultural contribution.",
          examples: [
            "GOOD: Partners who learn about and publicly credit African musical traditions",
            "BAD: Using African dancers and aesthetics without acknowledging or compensating African input",
            "GOOD: Joint creative sessions where both cultures contribute equally",
            "BAD: 'Can you make it sound more African?' without respect for what that means"
          ],
          tip: "If partners don't respect your culture enough to learn about it, they don't respect you enough to collaborate fairly."
        },
        {
          heading: 'Managing Time Zones and Distance',
          content: "International collaboration means working across time zones, cultures, and working styles. Western artists often expect immediate responses; African artists might work on different schedules. Set clear communication expectations, use collaborative tools effectively, and respect different working cultures.",
          examples: [
            "Use platforms like Splice, WeTransfer, and WhatsApp for file sharing",
            "Schedule video calls respecting both time zones",
            "Be clear about response time expectations",
            "Understand different studios, equipment, and working styles"
          ],
          tip: "Over-communicate. Assume nothing about working styles, deadlines, or expectations. Make everything explicit."
        },
        {
          heading: 'Leveraging Collaborations for Career Growth',
          content: "Strategic collaborations open markets, increase credibility, and build relationships. But chase opportunities that genuinely fit your artistic direction and values. One authentic collaboration that feels right beats ten exploitative ones for 'exposure.'",
          examples: [
            "Wizkid's Drake collab opened massive markets",
            "Burna Boy's Stormzy collab built UK following",
            "Tems' Drake/Future features established international presence",
            "Strategic collabs with artists whose audiences align with yours"
          ],
          tip: "Quality over quantity. One major authentic collaboration can change your career. Ten exploitative ones won't."
        }
      ],
      keyTakeaways: [
        "Different collaboration types serve different strategic purposes",
        "Never accept token percentages - your cultural contribution has real value",
        "Maintain linguistic and cultural authenticity in international work",
        "Demand cultural respect and fair treatment as baseline",
        "Clear communication across time zones prevents misunderstandings",
        "Strategic authentic collaborations beat numerous exploitative ones"
      ],
      culturalContext: "Global appetite for African music creates collaboration opportunities and exploitation risks. Colonial dynamics persist - Western artists often approach African artists from positions of assumed superiority. Successful African artists navigate these dynamics by demanding respect, fair payment, and creative equality rather than accepting 'grateful for the opportunity' positioning.",
      commonPitfalls: [
        "Accepting minimal splits because the other artist is 'bigger'",
        "Abandoning linguistic identity for perceived commercial appeal",
        "Working with partners who don't respect African culture",
        "Not clarifying rights ownership before collaboration",
        "Chasing every collaboration opportunity instead of strategic ones",
        "Accepting 'exposure' instead of fair payment"
      ]
    },
    quiz: [
      {
        question: "What's the most important factor in negotiating collaboration splits?",
        options: [
          "Who is more famous",
          "Who has more money",
          "Actual creative and promotional contribution from each party",
          "Who initiated the collaboration"
        ],
        correctIndex: 2,
        explanation: "Fair splits should reflect actual contributions: writing, production, performance, and promotional reach. Fame doesn't determine fair splits - value contributed does. African artists bring unique cultural value that deserves fair compensation."
      },
      {
        question: "How should African artists approach language in international collaborations?",
        options: [
          "Always sing in English only for accessibility",
          "Learn to phonetically sing languages you don't speak",
          "Maintain your linguistic identity while collaborating multilingually",
          "Avoid collaborations with non-English speakers"
        ],
        correctIndex: 2,
        explanation: "The most successful international collaborations celebrate each artist's linguistic identity. Authentic multilingual collaboration respects everyone's language rather than requiring assimilation. Your native language is part of your unique value."
      },
      {
        question: "What's a major red flag in international collaboration offers?",
        options: [
          "They want to meet in person",
          "They offer exposure but minimal payment and credits",
          "They suggest video calls",
          "They ask about your influences"
        ],
        correctIndex: 1,
        explanation: "'Exposure' isn't payment. If partners value your contribution, they'll offer fair payment and credits. Offers heavy on 'opportunity' but light on compensation and credits often signal exploitation rather than partnership."
      },
      {
        question: "What distinguishes cultural respect from appropriation in collaborations?",
        options: [
          "Respect involves learning, crediting, and fair compensation; appropriation extracts without acknowledgment",
          "Respect is when Africans collaborate with Westerners",
          "They're the same thing",
          "Appropriation only happens without collaboration"
        ],
        correctIndex: 0,
        explanation: "Respectful collaboration involves partners who learn about, publicly credit, and fairly compensate African cultural contribution. Appropriation takes cultural elements without proper acknowledgment, understanding, or compensation."
      },
      {
        question: "Why is over-communication important in international collaborations?",
        options: [
          "It's annoying but necessary",
          "Different time zones, cultures, and working styles require explicit clarity",
          "To prove you're professional",
          "Labels require it"
        ],
        correctIndex: 1,
        explanation: "Working across time zones, cultures, and different working styles creates opportunities for misunderstanding. Making expectations, timelines, and processes explicit prevents conflicts and ensures smoother collaboration."
      },
      {
        question: "What's the best collaboration strategy for career growth?",
        options: [
          "Accept every collaboration offer for maximum exposure",
          "Only work with the most famous artists",
          "Choose strategic authentic collaborations aligned with your artistic direction",
          "Avoid all international collaborations"
        ],
        correctIndex: 2,
        explanation: "One authentic collaboration that genuinely fits your artistic direction and values creates more career value than numerous exploitative ones accepted for 'exposure.' Quality and strategic alignment matter more than quantity."
      }
    ]
  }
];

export default learningModules;