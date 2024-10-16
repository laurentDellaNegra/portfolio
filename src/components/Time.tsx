export default function Time({ date = new Date() }: { date: Date }) {
  const formatedDate = new Intl.DateTimeFormat("en-UK", {
    dateStyle: "medium",
  }).format(date);

  const dateTime = (date ?? new Date()).toLocaleString();

  return (
    <header className="relative z-50 -ml-[32px] mb-10 flex w-36 flex-row items-center gap-3 xl:-ml-[208px] xl:mb-0 xl:justify-end">
      <time
        dateTime={dateTime}
        className="hidden font-mono xl:pointer-events-auto xl:block xl:text-xs/4 xl:font-medium xl:text-white/50"
      >
        {formatedDate}
      </time>
      <div className="h-[0.0625rem] w-3.5 bg-gray-400 xl:mr-0 xl:bg-gray-300"></div>
      <time
        dateTime={dateTime}
        className="font-mono text-xs/4 font-medium text-white/50 xl:pointer-events-auto xl:hidden"
      >
        {formatedDate}
      </time>
    </header>
  );
}
