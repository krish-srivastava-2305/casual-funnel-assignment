'use client'
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useQuizContext } from "@/context/QuixContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { userEmail, setUserEmail } = useQuizContext();
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const navigator = () => {
    if (!userEmail.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!validateEmail(userEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    router.push("/questions");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Minimal background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-6 animate-scaleIn">
            Quiz Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeIn font-light" style={{ animationDelay: '0.2s' }}>
            A clean and focused quiz experience. Test your knowledge with carefully curated questions.
          </p>
        </div>

        {/* Instructions Section */}
        <div className="max-w-4xl mx-auto mb-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-3xl font-light text-gray-900 mb-6 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg border border-gray-100">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl font-semibold mx-auto mb-4">1</div>
                <h3 className="font-medium text-lg mb-2 text-gray-900">Enter Email</h3>
                <p className="text-gray-600 font-light">Provide your email to save progress and receive results</p>
              </div>
              <div className="text-center p-6 rounded-lg border border-gray-100">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl font-semibold mx-auto mb-4">2</div>
                <h3 className="font-medium text-lg mb-2 text-gray-900">Answer Questions</h3>
                <p className="text-gray-600 font-light">Navigate through 15 questions at your own pace</p>
              </div>
              <div className="text-center p-6 rounded-lg border border-gray-100">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl font-semibold mx-auto mb-4">3</div>
                <h3 className="font-medium text-lg mb-2 text-gray-900">Get Results</h3>
                <p className="text-gray-600 font-light">Review your answers and see your final score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="max-w-md mx-auto animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-light text-gray-900 mb-2">Ready to Begin?</h3>
              <p className="text-gray-600 font-light">Enter your email address to start the quiz</p>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="your.email@example.com"
                type="email"
                setUserEmail={setUserEmail}
                label="Email Address"
                error={error}
                className="animate-scaleIn"
              />

              <Button
                text="Start Quiz"
                navigator={navigator}
                variant="primary"
                size="lg"
                className="w-full animate-scaleIn"
              />
            </div>

            <div className="mt-6 text-center text-sm text-gray-500 font-light">
              <p>Take your time and trust your instincts</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-16 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Quick & Easy", desc: "Streamlined interface for smooth experience" },
              { title: "Progress Tracking", desc: "See your advancement in real-time" },
              { title: "Clean Design", desc: "Modern UI with smooth animations" },
              { title: "Mobile Friendly", desc: "Perfect on any device, anywhere" }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-white border border-gray-100">
                <div className="w-8 h-8 bg-gray-900 rounded-full mx-auto mb-3"></div>
                <h4 className="font-medium text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
