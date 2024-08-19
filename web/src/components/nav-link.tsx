import React, { ComponentProps } from "react";
interface NavLinkProps extends ComponentProps<"a"> {
  children: string;
  href: string;
}
export function NavLink({ children, href, ...rest }: NavLinkProps) {
  return (
    <a {...rest} href={href} className="font-medium text-sm">
      {children}
    </a>
  );
}
