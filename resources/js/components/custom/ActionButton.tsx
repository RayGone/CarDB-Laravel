import { ButtonHTMLAttributes } from 'react';

export default function ActionButton({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `hover:bg-blue-50 py-3 px-3 rounded-full active:bg-transparent transition ease-in-out duration-150
                ${disabled && 'opacity-25'} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
