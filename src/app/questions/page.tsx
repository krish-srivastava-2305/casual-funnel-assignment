'use client';
import { useQuizContext } from "@/context/QuixContext";
import { useEffect, useState, useRef } from "react";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { sampleQuestions } from "@/sample/sample";
import { Question, QuizResult } from "@/types";

export default function QuestionsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const hasFetchedRef = useRef(false);

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

        // Prevent fetching if questions already exist or if we've already fetched
        if ((questions && questions.length > 0) || hasFetchedRef.current) {
            setLoading(false);
            return;
        }

        const fetchQuestions = async () => {
            try {
                hasFetchedRef.current = true; // Mark as fetched before the API call
                setLoading(true);
                setError(null);
                const response = await fetch("https://opentdb.com/api.php?amount=15");

                if (!response.ok) {
                    if (response.status === 429) {
                        throw new Error("Too many requests. Using sample questions instead.");
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setFormattedQuestions(data.results);

                // setFormattedQuestions(sampleQuestions);
                startTimer(); // Start the timer when questions are loaded
            } catch (err) {
                hasFetchedRef.current = false; // Reset flag on error so it can retry
                const errorMessage = err instanceof Error ? err.message : "Failed to fetch questions. Please try again later.";

                // Fallback to sample questions if API fails
                if (err instanceof Error && err.message.includes("Too many requests")) {
                    console.warn("API rate limited, using sample questions:", err);
                    setFormattedQuestions(sampleQuestions);
                    startTimer();
                    hasFetchedRef.current = true; // Mark as successful
                } else {
                    setError(errorMessage);
                    console.error("Failed to fetch questions:", err);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchQuestions();
    }, [userEmail, questions, router, setFormattedQuestions, startTimer]);
    useEffect(() => {
        if (quizResult) {
            stopTimer();
            router.push(`/results/${userEmail}`);
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
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setIsTransitioning(false);
            }, 150);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setIsTransitioning(false);
            }, 150);
        }
    };

    const handleGoToQuestion = (index: number) => {
        if (index !== currentQuestionIndex) {
            setIsTransitioning(true);
            setTimeout(() => {
                goToQuestion(index);
                setIsTransitioning(false);
            }, 150);
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center animate-fadeIn">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600 font-light">Loading your quiz questions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center animate-fadeIn">
                    <div className="text-6xl mb-4">⚠</div>
                    <h2 className="text-2xl font-medium text-red-600 mb-4">Something went wrong</h2>
                    <p className="text-gray-600 mb-6 font-light">{error}</p>
                    <Button text="Try Again" navigator={() => {
                        hasFetchedRef.current = false;
                        setError(null);
                        window.location.reload();
                    }} variant="primary" />
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center animate-fadeIn">
                    <div className="text-6xl mb-4">📝</div>
                    <h2 className="text-2xl font-medium text-gray-600 mb-4">No questions available</h2>
                    <Button text="Go Home" navigator={() => router.push('/')} variant="primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Final Submit Button */}
            <div className="bg-white border-b border-gray-200 p-4 animate-slideIn">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-light text-gray-900">Quiz in Progress</h1>
                        <p className="text-gray-600 font-light">Welcome back, {userEmail}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Timer */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                            <span className="text-lg">⏰</span>
                            <div className="text-right">
                                <div className={`text-lg font-medium ${getTimerColor()}`}>
                                    {formatTime(timeRemaining)}
                                </div>
                                <div className="text-xs text-gray-500">Time Remaining</div>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 font-light">
                            Progress: {answeredQuestions}/{totalQuestions} answered
                        </div>
                        <Button
                            text="Submit Quiz"
                            navigator={handleSubmitQuiz}
                            variant="success"
                            disabled={answeredQuestions < totalQuestions}
                        />
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6 animate-slideIn">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Question Navigation</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((question: Question, index: number) => (
                                <button
                                    key={question.id}
                                    onClick={() => handleGoToQuestion(index)}
                                    className={`
                                        w-10 h-10 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-110
                                        ${index === currentQuestionIndex
                                            ? 'bg-gray-900 text-white shadow-sm'
                                            : question.userAnswer
                                                ? 'bg-gray-300 text-gray-900'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Progress Stats</h4>
                            <div className="space-y-2 text-sm font-light">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Current:</span>
                                    <span className="font-medium">{currentQuestionIndex + 1}/{totalQuestions}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Answered:</span>
                                    <span className="font-medium text-green-600">{answeredQuestions}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Remaining:</span>
                                    <span className="font-medium text-orange-600">{totalQuestions - answeredQuestions}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Tips</h4>
                        <ul className="text-sm text-gray-600 space-y-1 font-light">
                            <li>• Click numbers to jump to questions</li>
                            <li>• Gray = answered, Black = current</li>
                            <li>• You can change answers anytime</li>
                            <li>• Submit when all questions answered</li>
                        </ul>
                    </div>
                </div>

                {/* Main Question Area */}
                <div className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className={`bg-white rounded-xl p-8 shadow-sm border border-gray-200 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                            {/* Question Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                        Question {currentQuestionIndex + 1} of {totalQuestions}
                                    </span>
                                    {currentQuestion?.userAnswer && (
                                        <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                            ✓ Answered
                                        </span>
                                    )}
                                </div>
                                <h2
                                    className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed"
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
                                            w-full p-6 rounded-lg text-left transition-all duration-300 transform hover:scale-[1.01] hover:shadow-sm
                                            ${currentQuestion.userAnswer === option
                                                ? 'bg-gray-900 text-white shadow-sm'
                                                : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center">
                                            <div className={`
                                                w-6 h-6 rounded-full border mr-4 flex items-center justify-center text-sm font-medium
                                                ${currentQuestion.userAnswer === option
                                                    ? 'border-white bg-white text-gray-900'
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
                                            text="Clear Answer"
                                            navigator={handleClearAnswer}
                                            variant="outline"
                                        />
                                    )}
                                    <Button
                                        text="Submit Answer"
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