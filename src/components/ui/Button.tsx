import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "gold" | "outline-light" | "ghost";
type ButtonSize = "sm" | "md";

const variantClasses: Record<ButtonVariant, string> = {
  gold: "bg-gold-500 text-white uppercase hover:bg-gold-600 focus-visible:outline-gold-500",
  "outline-light":
    "border border-white/70 bg-transparent text-white uppercase hover:bg-white/10 focus-visible:outline-white",
  ghost: "bg-transparent text-navy-800 uppercase hover:bg-navy-800/5 focus-visible:outline-navy-800",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[11px]",
  md: "px-6 py-3 text-xs",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded font-sans font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

interface ButtonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export type ButtonProps = ButtonLinkProps | ButtonButtonProps;

function isExternal(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/.test(href);
}

export default function Button({ variant = "gold", size = "md", className, children, ...rest }: ButtonProps) {
  const classes = [baseClasses, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as ButtonLinkProps;

    if (isExternal(href)) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
