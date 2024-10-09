export default function Time({ date }: { date?: Date }) {
  const formatedDate = date
    ? new Intl.DateTimeFormat("en-UK", {
        dateStyle: "medium",
      }).format(date)
    : "Now";

  const dateTime = (date ?? new Date()).toLocaleString();

  return (
    <header className="relative z-50 -ml-[45px] mb-10 flex w-36 flex-row items-center justify-end gap-3 xl:-ml-[196px] xl:mb-0">
      <a
        className="inline-flex no-underline"
        href="#commit-message-suggestions"
      >
        <time
          dateTime={dateTime}
          className="hidden font-mono xl:pointer-events-auto xl:block xl:text-xs/4 xl:font-medium xl:text-white/50"
        >
          {formatedDate}
        </time>
      </a>
      <div className="h-[0.0625rem] w-3.5 bg-gray-400 xl:mr-0 xl:bg-gray-300"></div>
      <a
        className="inline-flex no-underline"
        href="#commit-message-suggestions"
      >
        <time
          dateTime={dateTime}
          className="font-mono text-xs/4 font-medium text-white/50 xl:pointer-events-auto xl:hidden"
        >
          {formatedDate}
        </time>
      </a>
    </header>
  );
}
