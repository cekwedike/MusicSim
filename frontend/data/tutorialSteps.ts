import { TutorialStep } from '../types';

export const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to MusicSim!',
    message: 'Welcome to MusicSim, where you\'ll learn real music business skills while building your virtual career. This tutorial will guide you through the game and teach you about the music industry.',
    position: 'center',
    action: 'block',
    nextTrigger: 'click',
    musicBusinessLesson: 'The music industry is complex and requires both creative talent and business knowledge to succeed. This simulation will teach you both!'
  },
  {
    id: 'cash-stat',
    title: 'Cash - Your Financial Health',
    message: 'Cash represents your available money. You need it for everything - recording, marketing, living expenses. Running out of cash for too long leads to bankruptcy and game over.',
    target: '.player-stats > div:nth-child(1)',
    position: 'bottom',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'Financial stability is the foundation of any music career. Even talented artists fail without proper money management. Track your income and expenses carefully.'
  },
  {
    id: 'fame-stat',
    title: 'Fame - Your Public Recognition',
    message: 'Fame measures how well-known you are. Higher fame opens bigger opportunities, attracts better deals, and increases your earning potential.',
    target: '.player-stats > div:nth-child(2)',
    position: 'bottom',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'Fame is built through consistent quality work, smart marketing, and public engagement. It takes time to build but can be lost quickly through scandals or poor decisions.'
  },
  {
    id: 'wellbeing-stat',
    title: 'Well-Being - Your Mental Health',
    message: 'Well-being represents your mental and physical health. Overworking, stress, and poor lifestyle choices damage it. Let it drop too low for too long, and you\'ll burn out.',
    target: '.player-stats > div:nth-child(3)',
    position: 'bottom',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'The music industry is notorious for burnout. Many successful careers ended because artists didn\'t prioritize their health. Balance work with rest and self-care.'
  },
  {
    id: 'hype-stat',
    title: 'Hype - Your Current Buzz',
    message: 'Hype is your current momentum and buzz in the industry. It fluctuates based on your recent activities, releases, and media presence. Strike while the iron is hot!',
    target: '.player-stats > div:nth-child(4)',
    position: 'bottom',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'Hype is temporary but powerful. Smart artists capitalize on high hype moments with strategic releases and appearances, then use that momentum to build lasting fame.'
  },
  {
    id: 'date-display',
    title: 'Career Timeline',
    message: 'This shows your current career date. Your career progresses week by week, and decisions have both immediate and long-term consequences.',
    target: '.date-display',
    position: 'bottom',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'Music careers are marathons, not sprints. Building lasting success takes time, and timing your releases and decisions is crucial.'
  },
  {
    id: 'scenario-system',
    title: 'Decision-Based Scenarios',
    message: 'Each scenario presents a real music industry situation. Read carefully and choose wisely - every decision impacts your career trajectory and teaches you about the business.',
    target: '.scenario-card',
    position: 'top',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'Music industry professionals face complex decisions daily. Learning to evaluate options, understand consequences, and make strategic choices is essential for success.'
  },
  {
    id: 'choice-selection',
    title: 'Making Choices',
    message: 'These are your decision options. Each choice has different outcomes affecting your stats. Some provide immediate benefits but long-term costs, others are investments in your future. Think strategically!',
    target: '.scenario-card .choice-buttons',
    position: 'top',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'In the music business, short-term gains often come with long-term consequences. Successful artists learn to balance immediate needs with future goals.'
  },
  {
    id: 'educational-outcomes',
    title: 'Learning from Outcomes',
    message: 'After each choice, you\'ll see the results and learn WHY it happened. Pay attention to these lessons - they contain real industry insights and examples.',
    target: '.outcome-modal',
    position: 'center',
    action: 'highlight',
    nextTrigger: 'click',
    delay: 1000,
    musicBusinessLesson: 'Every experience in the music industry is a learning opportunity. Successful artists analyze their successes and failures to make better future decisions.'
  },
  {
    id: 'career-log',
    title: 'Career History',
    message: 'Your career log tracks all major events and decisions. Review it regularly to understand patterns and learn from your journey.',
    target: '.game-history',
    position: 'left',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'Keeping detailed records of your career decisions, contacts, and outcomes helps you identify what works and avoid repeating mistakes.'
  },
  {
    id: 'achievements-system',
    title: 'Achievements & Milestones',
    message: 'Achievements celebrate your progress and teach you about industry milestones. They represent real career accomplishments that matter in the music business.',
    target: '.achievements-button',
    position: 'left',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'The music industry measures success through various milestones: chart positions, sales figures, tour attendance, industry recognition, and career longevity.'
  },
  {
    id: 'learning-hub',
    title: 'Learning Hub',
    message: 'Access detailed lessons about music business concepts here. Each lesson explains industry fundamentals with real examples and practical advice.',
    target: '.learning-button',
    position: 'left',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'Continuous learning is essential in the evolving music industry. Understanding concepts like royalties, publishing, marketing, and contracts gives you competitive advantages.'
  },
  // Projects feature is not currently visible in the UI - skip this step
  // {
  //   id: 'projects-system',
  //   title: 'Projects & Releases',
  //   message: 'Projects represent your creative work - albums, singles, tours. Managing projects well balances artistic vision with commercial viability and timing.',
  //   target: '.current-project',
  //   position: 'bottom',
  //   action: 'highlight',
  //   nextTrigger: 'click',
  //   musicBusinessLesson: 'Successful artists treat each release as a business project with budgets, timelines, marketing strategies, and measurable goals, not just creative expression.'
  // },
  {
    id: 'record-labels',
    title: 'Record Label Contracts',
    message: 'You\'ll encounter record label offers throughout your career. Each contract has different terms, benefits, and trade-offs. Learn to evaluate them carefully.',
    target: '.management-button',
    position: 'left',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'Record deals can accelerate careers but involve giving up control and revenue. Understanding contract terms, advances, royalties, and recoupment is crucial for fair negotiations.'
  },
  {
    id: 'contract-analysis',
    title: 'Contract Education',
    message: 'When viewing contracts, look for red flags (negative terms) and green flags (positive terms). This teaches you real contract evaluation skills.',
    target: '.contract-viewer',
    position: 'center',
    action: 'highlight',
    nextTrigger: 'click',
    delay: 500,
    musicBusinessLesson: 'Contract literacy separates successful artists from those who get exploited. Learn to identify predatory terms, fair deals, and negotiation opportunities.'
  },
  {
    id: 'statistics-tracking',
    title: 'Career Analytics',
    message: 'Track your progress across multiple careers with detailed statistics. Analyze patterns in your decision-making and identify areas for improvement.',
    target: '.stats-button',
    position: 'left',
    action: 'highlight',
    nextTrigger: 'click',
    musicBusinessLesson: 'Data-driven decision making is increasingly important in music. Understanding metrics like streaming numbers, audience demographics, and revenue sources helps optimize strategies.'
  },
  {
    id: 'survival-focus',
    title: 'Career Longevity',
    message: 'This game has no "win condition" - it\'s about building sustainable, long-term careers. Focus on balance, smart decisions, and continuous learning.',
    position: 'center',
    action: 'block',
    nextTrigger: 'click',
    musicBusinessLesson: 'The most successful music careers span decades, not months. Building sustainable practices, maintaining relationships, and adapting to industry changes matters more than quick fame.'
  },
  {
    id: 'tutorial-complete',
    title: 'Ready to Begin!',
    message: 'You\'re now ready to start your music career simulation! Remember: every choice teaches you something about the real music business. Good luck, and have fun learning!',
    position: 'center',
    action: 'block',
    nextTrigger: 'click',
    musicBusinessLesson: 'The music industry rewards those who combine passion with business knowledge. Use this simulation to develop both your instincts and your understanding of how the industry really works.'
  }
];

export const getTutorialStep = (stepId: string): TutorialStep | undefined => {
  return tutorialSteps.find(step => step.id === stepId);
};

export const getTutorialStepByIndex = (index: number): TutorialStep | undefined => {
  return tutorialSteps[index];
};

export const getTutorialLength = (): number => {
  return tutorialSteps.length;
};