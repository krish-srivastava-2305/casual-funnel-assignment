interface ButtonProps {
    text?: string;
    navigator?: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
}

export default function Button({
    text = "Click Me",
    navigator,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = ''
}: ButtonProps) {
    const baseClasses = "font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

    const variants = {
        primary: "bg-gray-900 text-white shadow-sm hover:shadow-md focus:ring-gray-500",
        secondary: "bg-gray-600 text-white shadow-sm hover:shadow-md focus:ring-gray-400",
        success: "bg-gray-800 text-white shadow-sm hover:shadow-md focus:ring-gray-500",
        outline: "bg-transparent border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white focus:ring-gray-500"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={navigator}
            disabled={disabled}
        >
            <span className="relative z-10">{text}</span>
        </button>
    )
}