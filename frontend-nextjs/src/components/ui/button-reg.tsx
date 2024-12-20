// Button-Reg.tsx
import React from "react";

interface ButtonProps {
    onClick: () => void;
    text: string;
    className?: string;
}

const ButtonHeader: React.FC<ButtonProps> = ({ onClick, text, className }) => {
    return (
        <span
            className={`px-4 py-2 rounded-lg text-center transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-purple-600 ${className}`}
            onClick={onClick}
        >
                {text}
            </span>
    );
};

export default ButtonHeader;