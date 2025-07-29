'use client'
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import type { Question, APIResponseType, QuizResult, QuizContextType } from "@/types";

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const QuizProvider = ({ children }: { children: React.ReactNode }) => {
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [userEmail, setUserEmail] = useState<string>("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(30); // 30 minutes in seconds
    const [isTimerActive, setIsTimerActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<Date | null>(null);

    const autoSubmitQuiz = useCallback(() => {
        if (questions) {
            const correctCount = questions.filter(q => q.userAnswer === q.correctAnswer).length;
            const score = Math.round((correctCount / questions.length) * 100);
            const timeSpent = startTimeRef.current ?
                Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000) :
                30 * 60;

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
    }, [questions, userEmail]);

    useEffect(() => {
        if (isTimerActive && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsTimerActive(false);
                        // Auto-submit quiz when time runs out
                        autoSubmitQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isTimerActive, timeRemaining, autoSubmitQuiz]);

    const setFormattedQuestions = (questions: APIResponseType[]) => {
        let questionId = 1;
        const formattedQuestions = questions.map(q => ({
            id: String(questionId++),
            question: q.question,
            options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            correctAnswer: q.correct_answer
        }));
        setQuestions(formattedQuestions);
    };

    const setAnswers = (questionId: string, userAnswer: string) => {
        if (questions) {
            const updatedQuestions = questions.map(q =>
                q.id === questionId ? { ...q, userAnswer } : q
            );
            setQuestions(updatedQuestions);
        }
    };

    const clearAnswer = (questionId: string) => {
        if (questions) {
            const updatedQuestions = questions.map(q =>
                q.id === questionId ? { ...q, userAnswer: undefined } : q
            );
            setQuestions(updatedQuestions);
        }
    };

    const goToQuestion = (index: number) => {
        if (questions && index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index);
        }
    };

    const startTimer = () => {
        setIsTimerActive(true);
        startTimeRef.current = new Date();
    };

    const stopTimer = () => {
        setIsTimerActive(false);
    };

    const resetQuiz = () => {
        setQuestions(null);
        setCurrentQuestionIndex(0);
        setQuizResult(null);
        setTimeRemaining(30 * 60);
        setIsTimerActive(false);
        startTimeRef.current = null;
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const contextValue: QuizContextType = {
        questions,
        userEmail,
        currentQuestionIndex,
        quizResult,
        timeRemaining,
        setUserEmail,
        setFormattedQuestions,
        setAnswers,
        clearAnswer,
        goToQuestion,
        setCurrentQuestionIndex,
        setQuizResult,
        startTimer,
        stopTimer,
        resetQuiz
    };

    return (
        <QuizContext.Provider value={contextValue}>
            {children}
        </QuizContext.Provider>
    );
};

const useQuizContext = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error("useQuizContext must be used within a QuizProvider");
    }
    return context;
};

export { QuizProvider, useQuizContext };