import IconLink from "./IconLink";

function XIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
        <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" {...props}>
            <path d="M9.51762 6.77491L15.3459 0H13.9648L8.90409 5.88256L4.86212 0H0.200195L6.31244 8.89547L0.200195 16H1.58139L6.92562 9.78782L11.1942 16H15.8562L9.51728 6.77491H9.51762ZM7.62588 8.97384L7.00658 8.08805L2.07905 1.03974H4.20049L8.17706 6.72795L8.79636 7.61374L13.9654 15.0075H11.844L7.62588 8.97418V8.97384Z" />
        </svg>
    )
}

export default function IntroFooter() {
    return (
        <p className="flex items-baseline gap-x-2 text-[0.8125rem]/6 text-gray-500">
            Brought to you by{' '}
            <IconLink href="#" icon={XIcon} compact>
                Joe Davola
            </IconLink>
        </p>
    )
}