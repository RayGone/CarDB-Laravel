import type { ButtonHTMLAttributes } from 'react';

export default function ActionButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `rounded-full px-3 py-3 font-bold transition duration-150 ease-in-out hover:bg-blue-50 active:bg-blue-100 dark:hover:bg-blue-900 dark:active:bg-blue-950 ${disabled && 'opacity-25'} ` +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
