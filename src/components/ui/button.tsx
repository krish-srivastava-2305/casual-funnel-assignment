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
    const baseClasses = "font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

    const variants = {
        primary: "gradient-primary text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
        secondary: "gradient-secondary text-white shadow-lg hover:shadow-xl focus:ring-pink-500",
        success: "gradient-success text-white shadow-lg hover:shadow-xl focus:ring-cyan-500",
        outline: "bg-transparent border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white focus:ring-purple-500"
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