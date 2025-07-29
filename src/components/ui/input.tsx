interface InputProps {
    placeholder?: string;
    type?: string;
    setUserEmail: (email: string) => void;
    label?: string;
    error?: string;
    className?: string;
}

export default function Input({
    placeholder = "hamilton@f1.com",
    type = "email",
    setUserEmail,
    label,
    error,
    className = ""
}: InputProps) {
    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2 animate-fadeIn">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    className={`w-full px-6 py-4 bg-white/90 backdrop-blur-sm border-2 rounded-xl 
            transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/25
            ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-purple-500 hover:border-purple-300'
                        }
            placeholder-gray-400 text-gray-800 shadow-sm hover:shadow-md focus:shadow-lg
            animate-fadeIn`}
                    onChange={(e) => setUserEmail(e.target.value)}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 pointer-events-none hover:opacity-100"></div>
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-500 animate-fadeIn">{error}</p>
            )}
        </div>
    );
}