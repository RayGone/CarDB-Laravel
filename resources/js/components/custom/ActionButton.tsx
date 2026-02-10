import type { ButtonHTMLAttributes } from "react";

export default function ActionButton({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `hover:bg-blue-50 dark:hover:bg-blue-900 py-3 px-3 rounded-full active:bg-blue-100 dark:active:bg-blue-950 transition ease-in-out duration-150 font-bold
                ${disabled && 'opacity-25'} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
