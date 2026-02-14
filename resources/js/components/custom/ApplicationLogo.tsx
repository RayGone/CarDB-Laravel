import { SVGAttributes } from 'react';

export default function ApplicationLogo({ className }: { className?: string }) {
    return (
        <img
            src={'/thumbnail.png'}
            className={'w-32 rounded-full fill-current' + className}
        />
    );
}
