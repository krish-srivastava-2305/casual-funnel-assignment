'use client';
import { useQuizContext } from "@/context/QuixContext";
import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { sampleQuestions } from "@/sample/sample";
import { Question, QuizResult } from "@/types";

export default function QuestionsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        questions,
        userEmail,
        currentQuestionIndex,
        quizResult,
        timeRemaining,
        setFormattedQuestions,
        setAnswers,
        clearAnswer,
        goToQuestion,
        setCurrentQuestionIndex,
        setQuizResult,
        startTimer,
        stopTimer
    } = useQuizContext();

    const router = useRouter();

    useEffect(() => {
        if (!userEmail) {
            router.push('/');
            return;
        }

        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setError(null);
                // const response = await fetch("https://opentdb.com/api.php?amount=15");
                // const data = await response.json();
                // setFormattedQuestions(data.results);

                setFormattedQuestions(sampleQuestions);
                startTimer(); // Start the timer when questions are loaded
            } catch {
                setError("Failed to fetch questions. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchQuestions();
    }, []);

    // Redirect to results when quiz result is available
    useEffect(() => {
        if (quizResult) {
            stopTimer();
            router.push('/results');
        }
    }, [quizResult, router, stopTimer]);

    const currentQuestion = questions?.[currentQuestionIndex];
    const totalQuestions = questions?.length || 0;
    const answeredQuestions = questions?.filter((q: Question) => q.userAnswer).length || 0;

    const handleAnswerSelect = (answer: string) => {
        if (currentQuestion) {
            setAnswers(currentQuestion.id, answer);
        }
    };

    const handleClearAnswer = () => {
        if (currentQuestion) {
            clearAnswer(currentQuestion.id);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = () => {
        if (questions) {
            const correctCount = questions.filter((q: Question) => q.userAnswer === q.correctAnswer).length;
            const score = Math.round((correctCount / questions.length) * 100);
            const timeSpent = 30 * 60 - timeRemaining; // Calculate time spent

            const result: QuizResult = {
                userEmail,
                questions: [...questions],
                score,
                totalQuestions: questions.length,
                correctAnswers: correctCount,
                timeSpent,
                completedAt: new Date()
            };
            setQuizResult(result);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (timeRemaining <= 300) return 'text-red-500'; // Last 5 minutes
        if (timeRemaining <= 600) return 'text-orange-500'; // Last 10 minutes
        return 'text-green-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
                <div className="text-center animate-fadeIn">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading your quiz questions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
                <div className="text-center animate-fadeIn">
                    <div className="text-6xl mb-4">😞</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button text="Try Again" navigator={() => window.location.reload()} variant="primary" />
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
                <div className="text-center animate-fadeIn">
                    <div className="text-6xl mb-4">📝</div>
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">No questions available</h2>
                    <Button text="Go Home" navigator={() => router.push('/')} variant="primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Header with Final Submit Button */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4 animate-slideIn">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Quiz in Progress</h1>
                        <p className="text-gray-600">Welcome back, {userEmail}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Timer */}
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2">
                            <span className="text-2xl">⏰</span>
                            <div className="text-right">
                                <div className={`text-xl font-bold ${getTimerColor()}`}>
                                    {formatTime(timeRemaining)}
                                </div>
                                <div className="text-xs text-gray-500">Time Remaining</div>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600">
                            Progress: {answeredQuestions}/{totalQuestions} answered
                        </div>
                        <Button
                            text="📋 Final Submit"
                            navigator={handleSubmitQuiz}
                            variant="success"
                            disabled={answeredQuestions < totalQuestions}
                        />
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-80 bg-white/60 backdrop-blur-sm border-r border-white/20 min-h-screen p-6 animate-slideIn">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Question Navigation</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((question: Question, index: number) => (
                                <button
                                    key={question.id}
                                    onClick={() => goToQuestion(index)}
                                    className={`
                                        w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-110
                                        ${index === currentQuestionIndex
                                            ? 'bg-purple-500 text-white shadow-lg'
                                            : question.userAnswer
                                                ? 'bg-green-400 text-white'
                                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }
                                    `}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="bg-white/80 rounded-2xl p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">📊 Progress Stats</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Current:</span>
                                    <span className="font-semibold">{currentQuestionIndex + 1}/{totalQuestions}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Answered:</span>
                                    <span className="font-semibold text-green-600">{answeredQuestions}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Remaining:</span>
                                    <span className="font-semibold text-orange-600">{totalQuestions - answeredQuestions}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 rounded-2xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">💡 Tips</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Click numbers to jump to questions</li>
                            <li>• Green = answered, Purple = current</li>
                            <li>• You can change answers anytime</li>
                            <li>• Submit when all questions answered</li>
                        </ul>
                    </div>
                </div>

                {/* Main Question Area */}
                <div className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="glass rounded-3xl p-8 animate-fadeIn">
                            {/* Question Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                                        Question {currentQuestionIndex + 1} of {totalQuestions}
                                    </span>
                                    {currentQuestion?.userAnswer && (
                                        <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                            ✅ Answered
                                        </span>
                                    )}
                                </div>
                                <h2
                                    className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: currentQuestion?.question || '' }}
                                />
                            </div>

                            {/* Answer Options */}
                            <div className="space-y-4 mb-8">
                                {currentQuestion?.options.map((option: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(option)}
                                        className={`
                                            w-full p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                                            ${currentQuestion.userAnswer === option
                                                ? 'bg-purple-500 text-white shadow-lg'
                                                : 'bg-white/80 text-gray-800 hover:bg-white/90 border-2 border-transparent hover:border-purple-200'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center">
                                            <div className={`
                                                w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center text-sm font-bold
                                                ${currentQuestion.userAnswer === option
                                                    ? 'border-white bg-white text-purple-500'
                                                    : 'border-gray-300'
                                                }
                                            `}>
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <span dangerouslySetInnerHTML={{ __html: option }} />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 justify-between items-center">
                                <div className="flex gap-3">
                                    <Button
                                        text="← Previous"
                                        navigator={handlePrevious}
                                        variant="outline"
                                        disabled={currentQuestionIndex === 0}
                                    />
                                    <Button
                                        text="Next →"
                                        navigator={handleNext}
                                        variant="primary"
                                        disabled={currentQuestionIndex === totalQuestions - 1}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    {currentQuestion?.userAnswer && (
                                        <Button
                                            text="🗑️ Clear Answer"
                                            navigator={handleClearAnswer}
                                            variant="outline"
                                        />
                                    )}
                                    <Button
                                        text="✅ Submit Answer"
                                        navigator={handleNext}
                                        variant="success"
                                        disabled={!currentQuestion?.userAnswer}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}