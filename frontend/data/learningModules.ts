import type { LearningModule } from '../types';

export const learningModules: LearningModule[] = [
  {
    id: 'contracts-basics',
    title: 'Contract Basics: What Every Artist Must Know',
    category: 'contracts',
  icon: '',
    difficulty: 'beginner',
    estimatedMinutes: 6,
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
  }
];

export default learningModules;