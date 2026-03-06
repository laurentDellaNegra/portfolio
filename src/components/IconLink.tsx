import clsx from 'clsx'

export default function IconLink({
    children,
    className,
    compact = false,
    icon: Icon,
    ...props
}: React.ComponentPropsWithoutRef<'a'> & {
    compact?: boolean
    icon?: React.ComponentType<{ className?: string }>
}) {
    return (
        <a
            {...props}
            className={clsx(
                className,
                'group relative isolate flex items-center rounded-lg px-2 py-0.5 text-[0.8125rem]/6 font-medium text-gray-400 transition-colors hover:text-neon-cyan',
                compact ? 'gap-x-2' : 'gap-x-3',
            )}
        >
            <span className="absolute inset-0 -z-10 scale-75 rounded-lg border border-neon-cyan/0 bg-neon-cyan/0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:border-neon-cyan/20 group-hover:bg-neon-cyan/5 group-hover:opacity-100 group-hover:shadow-neon-cyan" />
            {Icon && <Icon className="h-4 w-4 flex-none" />}
            <span className="self-baseline text-white">{children}</span>
        </a>
    )
}
