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
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border rounded-lg 
            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900/20
            ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-300 focus:border-gray-900 hover:border-gray-400'
                        }
            placeholder-gray-400 text-gray-900 shadow-sm hover:shadow-md focus:shadow-md
            animate-fadeIn text-sm sm:text-base`}
                    onChange={(e) => setUserEmail(e.target.value)}
                />
            </div>
            {error && (
                <p className="mt-2 text-xs sm:text-sm text-red-500 animate-fadeIn">{error}</p>
            )}
        </div>
    );
}