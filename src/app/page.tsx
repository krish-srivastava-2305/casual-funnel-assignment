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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-custom"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-custom" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-custom" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-scaleIn">
            🧠 Quiz Master
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Challenge your mind with our interactive quiz experience. Test your knowledge across various topics and track your progress!
          </p>
        </div>

        {/* Instructions Section */}
        <div className="max-w-4xl mx-auto mb-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="glass rounded-3xl p-8 hover-lift">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              📋 How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 hover-lift">
                <div className="text-4xl mb-4">✉️</div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Enter Your Email</h3>
                <p className="text-gray-600">Provide your email to save your progress and receive results</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 hover-lift" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Answer Questions</h3>
                <p className="text-gray-600">Navigate through 15 carefully curated questions at your own pace</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 hover-lift" style={{ animationDelay: '0.4s' }}>
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Get Results</h3>
                <p className="text-gray-600">Review your answers and see your final score with detailed feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="max-w-md mx-auto animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="glass rounded-3xl p-8 hover-lift">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Begin?</h3>
              <p className="text-gray-600">Enter your email address to start the quiz</p>
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
                text="🚀 Start Quiz"
                navigator={navigator}
                variant="primary"
                size="lg"
                className="w-full animate-scaleIn"
              />
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>💡 Tips: Take your time, read carefully, and trust your instincts!</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-16 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "⚡", title: "Quick & Easy", desc: "Streamlined interface for smooth experience" },
              { icon: "📊", title: "Progress Tracking", desc: "See your advancement in real-time" },
              { icon: "🎨", title: "Beautiful Design", desc: "Modern UI with smooth animations" },
              { icon: "📱", title: "Mobile Friendly", desc: "Perfect on any device, anywhere" }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/20 hover-lift">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
