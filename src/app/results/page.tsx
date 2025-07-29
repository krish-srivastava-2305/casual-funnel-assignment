'use client';
import { useQuizContext } from "@/context/QuixContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/ui/button";
import { Question } from "@/types";

export default function ResultsPage() {
    const { quizResult, resetQuiz } = useQuizContext();
    const router = useRouter();

    useEffect(() => {
        if (!quizResult) {
            router.push('/');
        }
    }, [quizResult, router]);

    if (!quizResult) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
                <div className="text-center animate-fadeIn">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading results...</p>
                </div>
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreEmoji = (score: number) => {
        if (score >= 90) return '🏆';
        if (score >= 80) return '🎉';
        if (score >= 70) return '👏';
        if (score >= 60) return '👍';
        return '💪';
    };

    const handleRetakeQuiz = () => {
        resetQuiz();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-6 animate-slideIn">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Quiz Results
                        </h1>
                        <p className="text-gray-600">Detailed analysis of your performance</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                {/* Score Summary */}
                <div className="glass rounded-3xl p-8 mb-8 text-center animate-scaleIn">
                    <div className="text-6xl mb-4">{getScoreEmoji(quizResult.score)}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Congratulations, {quizResult.userEmail}!
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/50 rounded-2xl p-6">
                            <div className={`text-4xl font-bold mb-2 ${getScoreColor(quizResult.score)}`}>
                                {quizResult.score}%
                            </div>
                            <p className="text-gray-600">Final Score</p>
                        </div>
                        <div className="bg-white/50 rounded-2xl p-6">
                            <div className="text-4xl font-bold text-green-600 mb-2">
                                {quizResult.correctAnswers}
                            </div>
                            <p className="text-gray-600">Correct Answers</p>
                        </div>
                        <div className="bg-white/50 rounded-2xl p-6">
                            <div className="text-4xl font-bold text-red-600 mb-2">
                                {quizResult.totalQuestions - quizResult.correctAnswers}
                            </div>
                            <p className="text-gray-600">Incorrect Answers</p>
                        </div>
                        <div className="bg-white/50 rounded-2xl p-6">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {formatTime(quizResult.timeSpent)}
                            </div>
                            <p className="text-gray-600">Time Taken</p>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Button
                            text="📊 View Detailed Analysis"
                            navigator={() => {
                                const element = document.getElementById('detailed-results');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            variant="outline"
                        />
                        <Button
                            text="🔄 Retake Quiz"
                            navigator={handleRetakeQuiz}
                            variant="primary"
                        />
                    </div>
                </div>

                {/* Detailed Question Analysis */}
                <div id="detailed-results" className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        📋 Detailed Question Analysis
                    </h3>

                    <div className="space-y-6">
                        {quizResult.questions.map((question: Question, index: number) => {
                            const isCorrect = question.userAnswer === question.correctAnswer;
                            const wasAnswered = question.userAnswer !== undefined;

                            return (
                                <div key={question.id} className="glass rounded-2xl p-6 hover-lift">
                                    {/* Question Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                                            Question {index + 1}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {isCorrect ? (
                                                <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                                    ✅ Correct
                                                </span>
                                            ) : wasAnswered ? (
                                                <span className="text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full">
                                                    ❌ Incorrect
                                                </span>
                                            ) : (
                                                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                    ⏭️ Skipped
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Question Text */}
                                    <h4
                                        className="text-lg font-semibold text-gray-800 mb-4 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: question.question }}
                                    />

                                    {/* Answer Options */}
                                    <div className="space-y-3">
                                        {question.options.map((option: string, optionIndex: number) => {
                                            const isCorrectAnswer = option === question.correctAnswer;
                                            const isUserAnswer = option === question.userAnswer;

                                            let optionClass = "p-4 rounded-xl border-2 transition-all duration-300";
                                            let iconClass = "w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center text-sm font-bold";
                                            let icon = String.fromCharCode(65 + optionIndex);

                                            if (isCorrectAnswer) {
                                                optionClass += " bg-green-50 border-green-300 text-green-800";
                                                iconClass += " border-green-500 bg-green-500 text-white";
                                                icon = "✓";
                                            } else if (isUserAnswer && !isCorrectAnswer) {
                                                optionClass += " bg-red-50 border-red-300 text-red-800";
                                                iconClass += " border-red-500 bg-red-500 text-white";
                                                icon = "✗";
                                            } else {
                                                optionClass += " bg-gray-50 border-gray-200 text-gray-700";
                                                iconClass += " border-gray-300 text-gray-600";
                                            }

                                            return (
                                                <div key={optionIndex} className={optionClass}>
                                                    <div className="flex items-center">
                                                        <div className={iconClass}>
                                                            {icon}
                                                        </div>
                                                        <span dangerouslySetInnerHTML={{ __html: option }} />
                                                        {isCorrectAnswer && (
                                                            <span className="ml-auto text-green-600 font-semibold">
                                                                Correct Answer
                                                            </span>
                                                        )}
                                                        {isUserAnswer && !isCorrectAnswer && (
                                                            <span className="ml-auto text-red-600 font-semibold">
                                                                Your Answer
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Answer Status */}
                                    {!wasAnswered && (
                                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-yellow-800 text-sm">
                                                ⚠️ This question was not answered
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Performance Insights */}
                <div className="mt-12 glass rounded-3xl p-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        📈 Performance Insights
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/50 rounded-2xl p-6">
                            <h4 className="font-semibold text-gray-800 mb-4">📊 Score Analysis</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Accuracy Rate:</span>
                                    <span className={`font-semibold ${getScoreColor(quizResult.score)}`}>
                                        {quizResult.score}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Questions Attempted:</span>
                                    <span className="font-semibold">
                                        {quizResult.questions.filter((q: Question) => q.userAnswer).length}/{quizResult.totalQuestions}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time per Question:</span>
                                    <span className="font-semibold">
                                        {formatTime(Math.floor(quizResult.timeSpent / quizResult.totalQuestions))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/50 rounded-2xl p-6">
                            <h4 className="font-semibold text-gray-800 mb-4">💡 Recommendations</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                {quizResult.score >= 90 ? (
                                    <>
                                        <p>🌟 Excellent performance! You have mastered this topic.</p>
                                        <p>🎯 Consider taking more advanced quizzes to challenge yourself.</p>
                                    </>
                                ) : quizResult.score >= 70 ? (
                                    <>
                                        <p>👍 Good job! You have a solid understanding of the material.</p>
                                        <p>📚 Review the questions you missed to improve further.</p>
                                    </>
                                ) : (
                                    <>
                                        <p>💪 Keep practicing! There&apos;s room for improvement.</p>
                                        <p>📖 Consider studying the topics covered in this quiz.</p>
                                        <p>🔄 Retake the quiz after reviewing the material.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 text-center">
                    <div className="flex gap-4 justify-center">
                        <Button
                            text="🏠 Go Home"
                            navigator={() => router.push('/')}
                            variant="outline"
                        />
                        <Button
                            text="🔄 Take Another Quiz"
                            navigator={handleRetakeQuiz}
                            variant="primary"
                        />
                        <Button
                            text="📤 Share Results"
                            navigator={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Quiz Results',
                                        text: `I scored ${quizResult.score}% on the quiz!`,
                                        url: window.location.href
                                    });
                                } else {
                                    navigator.clipboard.writeText(`I scored ${quizResult.score}% on the quiz! ${window.location.href}`);
                                    alert('Results copied to clipboard!');
                                }
                            }}
                            variant="secondary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
