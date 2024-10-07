import clsx from "clsx"
import { useId } from "react"

export function StarField({ className }: { className?: string }) {
    let blurId = useId()

    return (
        <svg
            viewBox="0 0 881 211"
            fill="white"
            aria-hidden="true"
            className={clsx(
                'pointer-events-none absolute w-[55.0625rem] origin-top-right rotate-[30deg] overflow-visible opacity-70',
                className,
            )}
        >
            <defs>
                <filter id={blurId}>
                    <feGaussianBlur in="SourceGraphic" stdDeviation=".5" />
                </filter>
            </defs>

        </svg>
    )
}