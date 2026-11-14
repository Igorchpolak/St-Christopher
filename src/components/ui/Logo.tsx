interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export default function Logo({ variant = "dark", className }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-navy-800";

  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      {/* Złoty krzyż łaciński */}
      <svg
        viewBox="0 0 32 44"
        className="size-8 shrink-0 text-gold-500 md:size-9"
        role="img"
        aria-label="Logo St. Christopher – krzyż"
      >
        <path
          d="M13 2 h6 v10 h10 v6 h-10 v24 h-6 v-24 h-10 v-6 h10 z"
          fill="currentColor"
        />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className={`font-heading text-lg font-semibold md:text-xl ${textColor}`}>
          St. Christopher
        </span>
        <span className="text-[11px] tracking-wide text-gold-500 md:text-xs">
          Pilgrimages and Travel
        </span>
      </span>
    </span>
  );
}
