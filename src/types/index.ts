interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
}

interface APIResponseType {
    type: string;
    difficulty: string;
    question: string;
    category: string;
    correct_answer: string;
    incorrect_answers: string[];
}

interface QuizResult {
    userEmail: string;
    questions: Question[];
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    completedAt: Date;
}

interface QuizContextType {
    questions: Question[] | null;
    userEmail: string;
    currentQuestionIndex: number;
    quizResult: QuizResult | null;
    timeRemaining: number;

    setUserEmail: (email: string) => void;
    setFormattedQuestions: (questions: APIResponseType[]) => void;
    setAnswers: (questionId: string, userAnswer: string) => void;
    clearAnswer: (questionId: string) => void;
    goToQuestion: (index: number) => void;
    setCurrentQuestionIndex: (index: number) => void;
    setQuizResult: (result: QuizResult) => void;
    startTimer: () => void;
    stopTimer: () => void;
    resetQuiz: () => void;
}

export type { Question, APIResponseType, QuizResult, QuizContextType };