import React, { useState } from 'react';
import type { LearningModule } from '../types';

interface ModuleViewerProps {
  module: LearningModule;
  onComplete: (moduleId: string, score: number, conceptsMastered: string[]) => void;
  onClose: () => void;
}

const ModuleViewer: React.FC<ModuleViewerProps> = ({ module, onComplete, onClose }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [sectionDirection, setSectionDirection] = useState<'forward' | 'backward'>('forward');

  const totalSections = module.content.sections.length;
  const isLastSection = currentSection === totalSections - 1;

  const handleNextSection = () => {
    if (isLastSection) {
      setShowQuiz(true);
    } else {
      setSectionDirection('forward');
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setSectionDirection('backward');
      setCurrentSection(currentSection - 1);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    module.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correctIndex) {
        correct++;
      }
    });

    const score = Math.round((correct / module.quiz.length) * 100);
    setQuizScore(score);
    setShowQuizResults(true);
  };

  const handleCompleteModule = () => {
    const conceptsMastered = [
      ...module.content.keyTakeaways,
      ...module.content.sections.map(section => section.heading)
    ];

    onComplete(module.id, quizScore, conceptsMastered);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-rose-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent! You have a strong understanding of these concepts.';
    if (score >= 60) return 'Good job! Consider reviewing the material to strengthen your knowledge.';
    return 'You might want to review the material and try again. Understanding these concepts is crucial for your music career.';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return (
      <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    );
    if (score >= 60) return (
      <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    );
    return (
      <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 backdrop-blur-sm flex items-center justify-center z-[70] p-2 sm:p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-lg sm:rounded-2xl w-full max-w-5xl max-h-[98vh] sm:max-h-[95vh] overflow-hidden border border-red-500/30 shadow-2xl shadow-red-500/20 flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-4 sm:p-6 flex-shrink-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2 sm:mb-4">
              <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
                <span className="text-2xl sm:text-4xl md:text-5xl filter drop-shadow-lg flex-shrink-0">{module.icon}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 leading-tight">{module.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 text-red-200 text-sm">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{module.estimatedMinutes} minutes</span>
                    </div>
                    <span>•</span>
                    <span className="capitalize">{module.difficulty}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-red-200 hover:text-white transition-all duration-200 hover:rotate-90 text-3xl min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-full flex-shrink-0"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Progress Bar */}
            {!showQuiz && !showQuizResults && (
              <div>
                <div className="flex justify-between text-red-200 text-sm mb-2">
                  <span>Section {currentSection + 1} of {totalSections}</span>
                  <span>{Math.round(((currentSection + 1) / totalSections) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-red-900/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-yellow-500/50"
                    style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {!showQuiz && !showQuizResults && (
            <div className={`animate-${sectionDirection === 'forward' ? 'slideInRight' : 'slideInLeft'}`} key={currentSection}>
              {/* Introduction (only show on first section) */}
              {currentSection === 0 && (
                <div className="mb-6 p-5 bg-gradient-to-r from-red-900/40 to-red-800/40 rounded-xl border-l-4 border-red-500 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Introduction
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{module.content.introduction}</p>
                </div>
              )}

              {/* Current Section */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-sm">
                    {currentSection + 1}
                  </span>
                  {module.content.sections[currentSection].heading}
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg mb-6">
                    {module.content.sections[currentSection].content}
                  </p>

                  {/* Examples */}
                  {module.content.sections[currentSection].examples && (
                    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-xl p-5 mb-6">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Real-World Examples
                      </h4>
                      <ul className="space-y-2">
                        {module.content.sections[currentSection].examples!.map((example, index) => (
                          <li key={index} className="text-blue-100 text-sm flex items-start gap-2">
                            <span className="text-blue-400 font-bold flex-shrink-0">{index + 1}.</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tip */}
                  {module.content.sections[currentSection].tip && (
                    <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-xl p-5 mb-6">
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Pro Tip
                      </h4>
                      <p className="text-yellow-100 leading-relaxed">
                        {module.content.sections[currentSection].tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Takeaways (only show on last section) */}
              {isLastSection && (
                <div className="mb-6 p-5 bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-xl shadow-lg">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2 text-lg">
                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Key Takeaways
                  </h4>
                  <ul className="space-y-3">
                    {module.content.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="text-green-100 flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cultural Context */}
              {isLastSection && module.content.culturalContext && (
                <div className="mb-6 p-5 bg-gradient-to-br from-red-900/40 to-red-800/40 border border-red-500/30 rounded-xl shadow-lg">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                    </svg>
                    African Music Industry Context
                  </h4>
                  <p className="text-red-200 leading-relaxed">{module.content.culturalContext}</p>
                </div>
              )}

              {/* Common Pitfalls */}
              {isLastSection && (
                <div className="mb-6 p-5 bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/30 rounded-xl shadow-lg">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Common Pitfalls to Avoid
                  </h4>
                  <ul className="space-y-2">
                    {module.content.commonPitfalls.map((pitfall, index) => (
                      <li key={index} className="text-red-100 flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Quiz */}
          {showQuiz && !showQuizResults && (
            <div className="animate-fadeIn">
              <div className="mb-8 text-center">
                <div className="inline-block p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-4">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Knowledge Check</h3>
                <p className="text-gray-300">Test your understanding of the material</p>
              </div>

              {module.quiz.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-6 p-5 bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 rounded-xl shadow-lg">
                  <h4 className="text-white font-semibold mb-4 flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-sm">
                      {questionIndex + 1}
                    </span>
                    <span className="flex-1">{question.question}</span>
                  </h4>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleQuizAnswer(questionIndex, optionIndex)}
                        className={`
                          w-full text-left p-4 rounded-lg transition-all duration-200 flex items-start gap-3
                          ${quizAnswers[questionIndex] === optionIndex
                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105'
                            : 'bg-gray-600/50 text-gray-200 hover:bg-gray-600'
                          }
                        `}
                      >
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                          quizAnswers[questionIndex] === optionIndex ? 'border-white bg-white text-red-600' : 'border-gray-400'
                        }`}>
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quiz Results */}
          {showQuizResults && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getScoreColor(quizScore)} mb-6 shadow-2xl`}>
                  {getScoreIcon(quizScore)}
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Quiz Complete!</h3>
                <div className={`text-6xl font-bold mb-3 bg-gradient-to-r ${getScoreColor(quizScore)} bg-clip-text text-transparent`}>
                  {quizScore}%
                </div>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">{getScoreMessage(quizScore)}</p>
              </div>

              {/* Quiz Review */}
              <div className="space-y-4 mb-6">
                {module.quiz.map((question, index) => {
                  const userAnswer = quizAnswers[index];
                  const isCorrect = userAnswer === question.correctIndex;

                  return (
                    <div key={index} className="p-5 bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 rounded-xl">
                      <div className="flex items-start gap-3 mb-3">
                        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                          isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {index + 1}
                        </span>
                        <h4 className="text-white font-semibold flex-1">{question.question}</h4>
                        {isCorrect ? (
                          <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-10 space-y-2">
                        <div>
                          <span className="text-sm text-gray-400">Your answer: </span>
                          <span className={`font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {question.options[userAnswer]}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div>
                            <span className="text-sm text-gray-400">Correct answer: </span>
                            <span className="text-green-400 font-medium">
                              {question.options[question.correctIndex]}
                            </span>
                          </div>
                        )}
                        <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                          <p className="text-gray-300 text-sm leading-relaxed">
                            <strong className="text-red-400">Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-t border-red-500/30 px-6 py-4 flex justify-between items-center">
          {!showQuiz && !showQuizResults && (
            <>
              <button
                onClick={handlePrevSection}
                disabled={currentSection === 0}
                className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold flex items-center gap-2 min-w-[120px]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <button
                onClick={handleNextSection}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 min-w-[120px]"
              >
                {isLastSection ? 'Take Quiz' : 'Next'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {showQuiz && !showQuizResults && (
            <>
              <button
                onClick={() => setShowQuiz(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold flex items-center gap-2 min-w-[120px]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={quizAnswers.length !== module.quiz.length}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 min-w-[140px]"
              >
                Submit Quiz
              </button>
            </>
          )}

          {showQuizResults && (
            <>
              <button
                onClick={() => {
                  setShowQuizResults(false);
                  setShowQuiz(true);
                  setQuizAnswers([]);
                }}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold min-w-[140px]"
              >
                Retake Quiz
              </button>
              <button
                onClick={handleCompleteModule}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 min-w-[180px]"
              >
                Complete Module
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.4s ease-out;
        }

        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ModuleViewer;
