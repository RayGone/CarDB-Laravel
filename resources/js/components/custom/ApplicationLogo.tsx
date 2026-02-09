import { SVGAttributes } from 'react';

export default function ApplicationLogo({className}: {className?: string}) {
    return (
        <img src={'/thumbnail.png'} className={'rounded-full w-32 fill-current' + className} />
    );
}
