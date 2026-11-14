import { ArrowRight } from "lucide-react";
import type { ElementType } from "react";

interface SectionHeadingProps {
  title: string;
  linkHref?: string;
  linkLabel?: string;
  id?: string;
  as?: "h2" | "h3";
  className?: string;
}

export default function SectionHeading({
  title,
  linkHref,
  linkLabel = "Zobacz wszystkie",
  id,
  as = "h2",
  className,
}: SectionHeadingProps) {
  const Tag: ElementType = as;

  const heading = (
    <Tag id={id} className="font-heading text-2xl font-semibold text-navy-800 md:text-3xl">
      {title}
    </Tag>
  );

  if (!linkHref) {
    return <div className={`text-center ${className ?? ""}`}>{heading}</div>;
  }

  return (
    <div className={`flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left ${className ?? ""}`}>
      {heading}
      <a
        href={linkHref}
        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-500 hover:text-gold-600"
      >
        {linkLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
