import type { ElementType, ReactNode } from "react";

const defaultContainerClassName = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8";

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export default function Container({ as, className, children }: ContainerProps) {
  const Tag = as ?? "div";

  return <Tag className={[defaultContainerClassName, className].filter(Boolean).join(" ")}>{children}</Tag>;
}
