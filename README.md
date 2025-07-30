# Quiz Platform

A modern, clean quiz application built with Next.js 15, React 19, and TypeScript. This platform provides an interactive quiz experience with timed questions, real-time progress tracking, and comprehensive result reporting.

## Introduction

The Quiz Platform is a responsive web application that allows users to take timed quizzes with questions fetched from the Open Trivia Database API. The application features a clean, minimalist design with smooth animations and provides a seamless user experience from start to finish.

### Key Features

- 🎯 **Interactive Quiz Experience** - 15 questions with multiple choice answers
- ⏱️ **30-minute Timer** - Automatic submission when time runs out
- 📊 **Real-time Progress Tracking** - Visual progress indicators and question navigation
- 📈 **Detailed Results** - Comprehensive scoring and performance analytics
- 🔄 **API Fallback System** - Graceful fallback to sample questions when API is unavailable
- 📱 **Responsive Design** - Works seamlessly across desktop and mobile devices
- ✨ **Smooth Animations** - Modern UI with fade-in and scale animations

## How to Clone, Install and Run

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git

### Clone the Repository

```bash
git clone https://github.com/krish-srivastava-2305/casual-funnel-assignment.git
cd casual-funnel-assignment
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Other Available Commands

```bash
npm run lint    # Run ESLint for code quality checks
```

## Logic and Data Restructuring

The application implements a robust data flow with intelligent API fetching and fallback mechanisms.

### Data Flow Architecture

The quiz application follows a centralized state management pattern using React Context API:

```
User Input → Context State → API Fetch → Data Restructuring → Component Rendering
```

### API Fetching and Data Restructuring

#### Primary API Integration
The application fetches questions from the **Open Trivia Database API** (`https://opentdb.com/api.php?amount=15`):

**Original API Response Structure:**
```typescript
{
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}
```

**Restructured Internal Format:**
```typescript
{
  id: string;           // Auto-generated sequential ID
  question: string;     // HTML-decoded question text
  options: string[];    // Shuffled array of all answer options
  correctAnswer: string;
  userAnswer?: string;  // User's selected answer (optional)
}
```

#### Data Transformation Process

1. **ID Generation**: Sequential IDs are assigned to each question for tracking
2. **Option Shuffling**: Correct and incorrect answers are combined and randomly shuffled
3. **HTML Decoding**: Question text is properly decoded for display
4. **State Integration**: Transformed questions are stored in the global context

#### Fallback Logic Implementation

The application implements a sophisticated fallback system to ensure uninterrupted user experience:

```typescript
try {
  // Primary API call
  const response = await fetch("https://opentdb.com/api.php?amount=15");
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Too many requests. Using sample questions instead.");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  setFormattedQuestions(data.results);
} catch (err) {
  // Fallback to local sample questions
  if (err.message.includes("Too many requests")) {
    setFormattedQuestions(sampleQuestions);
  } else {
    setError(errorMessage);
  }
}
```

**Fallback Scenarios:**
- **Rate Limiting (429)**: Automatically switches to sample questions
- **Network Errors**: Displays error message with retry option
- **API Downtime**: Graceful degradation to local question set
- **Invalid Responses**: Error handling with user feedback

## Application Flow

### Home Page - Instructions and Email Collection

**File**: `src/app/page.tsx`

The landing page serves as the entry point with:

- **Clean Introduction**: Minimalist design with clear value proposition
- **Email Validation**: Real-time email format validation using regex
- **Input Handling**: Controlled input components with error states
- **Navigation Control**: Prevents progression without valid email
- **Background Animation**: Subtle dot pattern for visual appeal

**Key Features:**
- Email format validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Error state management
- Responsive typography and spacing
- Smooth animations and transitions

### Questions Page - API Fetch and Quiz Interface

**File**: `src/app/questions/page.tsx`

The core quiz interface handles:

**State Management:**
- Loading states during API calls
- Error handling and user feedback  
- Question navigation and progress tracking
- Timer management (30-minute countdown)
- Answer selection and persistence

**Quiz Logic:**
- **Fetch Prevention**: Uses `useRef` to prevent duplicate API calls
- **Question Navigation**: Allows jumping to any question
- **Answer Persistence**: Saves answers in context state
- **Auto-submission**: Submits quiz when timer expires
- **Progress Calculation**: Real-time answered/total question tracking

**Timer Implementation:**
```typescript
useEffect(() => {
  if (isTimerActive && timeRemaining > 0) {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          autoSubmitQuiz(); // Auto-submit when timer ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
}, [isTimerActive, timeRemaining]);
```

### Results Page - Performance Analytics and Sharing

**File**: `src/app/results/[userEmail]/page.tsx`

The results page provides comprehensive quiz analytics:

**Performance Metrics:**
- Overall score percentage with color coding
- Correct vs incorrect answer breakdown
- Time spent analysis
- Individual question review
- Performance indicators (emojis based on score ranges)

**Score Categorization:**
- 🏆 90%+ (Excellent)
- ⭐ 80-89% (Great)  
- ✓ 70-79% (Good)
- → 60-69% (Average)
- ↑ <60% (Needs Improvement)

**Features:**
- Detailed question-by-question breakdown
- Answer comparison (user vs correct)
- Retake quiz functionality
- Social sharing capabilities
- Performance visualization

## UI Design

### Design Philosophy

The application follows a **clean, minimalist design** approach with emphasis on:

- **Typography**: Light font weights with generous spacing
- **Color Palette**: Neutral grays with accent colors for states
- **Animations**: Subtle fade-in and scale effects
- **Responsiveness**: Mobile-first approach with breakpoint optimization

### Design System

**Colors:**
- Primary: `#f9fafb` (Gray-50) for backgrounds
- Text: `#111827` (Gray-900) for primary text
- Secondary: `#6b7280` (Gray-600) for secondary text
- Success: `#059669` (Green-600)
- Warning: `#d97706` (Yellow-600)
- Error: `#dc2626` (Red-600)

**Components:**
- **Custom Button Component**: Consistent styling with hover states
- **Custom Input Component**: Clean design with focus states
- **Progress Indicators**: Visual feedback for quiz progress
- **Loading States**: Spinning animations for async operations

**Layout:**
- **Container**: Centered content with responsive padding
- **Grid System**: CSS Grid for question layouts
- **Flexbox**: For component alignment and spacing
- **Responsive Breakpoints**: Mobile, tablet, and desktop optimizations

### Animation Framework

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

**Animation Usage:**
- Page transitions with staggered delays
- Button hover effects
- Loading state animations
- Progress bar transitions

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **HTTP Client**: Axios for API calls
- **Linting**: ESLint with Next.js configuration
- **Build Tool**: Next.js built-in bundler

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (email collection)
│   ├── questions/         # Quiz interface
│   └── results/           # Results and analytics
├── components/
│   └── ui/                # Reusable UI components
├── context/
│   └── QuizContext.tsx    # Global state management
├── types/
│   └── index.ts           # TypeScript interfaces
└── sample/
    └── sample.ts          # Fallback question data
```

## Conclusion

The Quiz Platform demonstrates modern React development practices with a focus on user experience, performance, and maintainability. The application successfully combines:

- **Robust Architecture**: Clean separation of concerns with TypeScript
- **Intelligent Error Handling**: Graceful fallbacks and user feedback
- **Modern UI/UX**: Responsive design with smooth animations
- **Performance Optimization**: Efficient state management and API handling
- **Accessibility**: Semantic HTML and keyboard navigation support

The platform showcases how to build a production-ready quiz application that handles real-world scenarios like API failures, rate limiting, and various device sizes while maintaining a premium user experience.

### Future Enhancements

Potential improvements could include:
- User authentication and progress persistence
- Question difficulty selection
- Category-based quiz filtering
- Social sharing with custom results images
- Progressive Web App (PWA) capabilities
- Offline mode with cached questions
- Analytics dashboard for quiz administrators

---

**Live Demo**: [Quiz Platform](https://casual-funnel-assignment.vercel.app)
**Repository**: [GitHub](https://github.com/krish-srivastava-2305/casual-funnel-assignment)
