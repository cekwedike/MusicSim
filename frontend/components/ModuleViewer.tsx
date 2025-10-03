import React, { useState } from 'react';
import type { LearningModule, QuizQuestion } from '../types';

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

  const totalSections = module.content.sections.length;
  const isLastSection = currentSection === totalSections - 1;

  const handleNextSection = () => {
    if (isLastSection) {
      setShowQuiz(true);
    } else {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
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
    // Extract concepts mastered from the module
    const conceptsMastered = [
      ...module.content.keyTakeaways,
      ...module.content.sections.map(section => section.heading)
    ];
    
    onComplete(module.id, quizScore, conceptsMastered);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent! You have a strong understanding of these concepts.';
    if (score >= 60) return 'Good job! Consider reviewing the material to strengthen your knowledge.';
    return 'You might want to review the material and try again. Understanding these concepts is crucial for your music career.';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4 md:p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl md:text-3xl">{module.icon}</span>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">{module.title}</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-violet-200">
                    <span className="text-sm">⏱️ {module.estimatedMinutes} minutes</span>
                    <span className="text-sm">📊 {module.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-violet-200 hover:text-white text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          {!showQuiz && !showQuizResults && (
            <div className="mt-4">
              <div className="flex justify-between text-violet-200 text-sm mb-2">
                <span>Section {currentSection + 1} of {totalSections}</span>
                <span>{Math.round(((currentSection + 1) / totalSections) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-violet-800 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {!showQuiz && !showQuizResults && (
            <>
              {/* Introduction (only show on first section) */}
              {currentSection === 0 && (
                <div className="mb-6 p-4 bg-gray-700 rounded-lg border-l-4 border-violet-500">
                  <h3 className="text-lg font-semibold text-white mb-2">Introduction</h3>
                  <p className="text-gray-300">{module.content.introduction}</p>
                </div>
              )}

              {/* Current Section */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  {module.content.sections[currentSection].heading}
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {module.content.sections[currentSection].content}
                  </p>

                  {/* Examples */}
                  {module.content.sections[currentSection].examples && (
                    <div className="bg-gray-700 rounded-lg p-4 mb-4">
                      <h4 className="text-white font-semibold mb-2">📋 Examples:</h4>
                      <ul className="space-y-1">
                        {module.content.sections[currentSection].examples!.map((example, index) => (
                          <li key={index} className="text-gray-300 text-sm">• {example}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tip */}
                  {module.content.sections[currentSection].tip && (
                    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 mb-4">
                      <h4 className="text-white font-semibold mb-2">💡 Pro Tip:</h4>
                      <p className="text-yellow-100 text-sm">
                        {module.content.sections[currentSection].tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Takeaways (only show on last section) */}
              {isLastSection && (
                <div className="mb-6 p-4 bg-green-900 rounded-lg border border-green-700">
                  <h4 className="text-white font-semibold mb-3">🎯 Key Takeaways</h4>
                  <ul className="space-y-2">
                    {module.content.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="text-green-200 text-sm flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cultural Context */}
              {isLastSection && module.content.culturalContext && (
                <div className="mb-6 p-4 bg-purple-900 rounded-lg border border-purple-700">
                  <h4 className="text-white font-semibold mb-2">🌍 African Music Industry Context</h4>
                  <p className="text-purple-200 text-sm">{module.content.culturalContext}</p>
                </div>
              )}

              {/* Common Pitfalls */}
              {isLastSection && (
                <div className="mb-6 p-4 bg-red-900 rounded-lg border border-red-700">
                  <h4 className="text-white font-semibold mb-3">⚠️ Common Pitfalls to Avoid</h4>
                  <ul className="space-y-2">
                    {module.content.commonPitfalls.map((pitfall, index) => (
                      <li key={index} className="text-red-200 text-sm flex items-start gap-2">
                        <span className="text-red-400 mt-1">⚠️</span>
                        <span>{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Quiz */}
          {showQuiz && !showQuizResults && (
            <div>
              <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">📝 Knowledge Check</h3>
                <p className="text-gray-300">Test your understanding of the material</p>
              </div>

              {module.quiz.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-white font-semibold mb-3">
                    Question {questionIndex + 1}: {question.question}
                  </h4>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleQuizAnswer(questionIndex, optionIndex)}
                        className={`
                          w-full text-left p-3 rounded transition-colors
                          ${quizAnswers[questionIndex] === optionIndex
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }
                        `}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quiz Results */}
          {showQuizResults && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">🎉 Quiz Complete!</h3>
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(quizScore)}`}>
                  {quizScore}%
                </div>
                <p className="text-gray-300 mb-4">{getScoreMessage(quizScore)}</p>
              </div>

              {/* Quiz Review */}
              <div className="space-y-4 mb-6">
                {module.quiz.map((question, index) => {
                  const userAnswer = quizAnswers[index];
                  const isCorrect = userAnswer === question.correctIndex;
                  
                  return (
                    <div key={index} className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">
                        Question {index + 1}: {question.question}
                      </h4>
                      <div className="mb-2">
                        <span className="text-sm text-gray-400">Your answer: </span>
                        <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                          {question.options[userAnswer]} {isCorrect ? '✓' : '✗'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="mb-2">
                          <span className="text-sm text-gray-400">Correct answer: </span>
                          <span className="text-green-400">
                            {question.options[question.correctIndex]}
                          </span>
                        </div>
                      )}
                      <p className="text-gray-300 text-sm bg-gray-600 p-2 rounded">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-gray-700 px-6 py-4 flex justify-between items-center">
          {!showQuiz && !showQuizResults && (
            <>
              <button
                onClick={handlePrevSection}
                disabled={currentSection === 0}
                className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2 rounded transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={handleNextSection}
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded transition-colors"
              >
                {isLastSection ? 'Take Quiz →' : 'Next →'}
              </button>
            </>
          )}

          {showQuiz && !showQuizResults && (
            <>
              <button
                onClick={() => setShowQuiz(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
              >
                ← Back to Content
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={quizAnswers.length !== module.quiz.length}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
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
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
              >
                Retake Quiz
              </button>
              <button
                onClick={handleCompleteModule}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors"
              >
                Complete Module ✓
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleViewer;