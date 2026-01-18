import type { AnchorHTMLAttributes, ReactNode } from "react";

import "./ExternalLink.css";

/**
 * ExternalLink component for rendering links with automatic variant handling.
 *
 * A reusable anchor atom component following atomic design principles.
 * Supports two variants: default (standard external link) and email (adds mailto: prefix).
 * Includes proper styling, accessibility features, and security attributes for external links.
 *
 * Security: Automatically includes rel="noopener noreferrer" for external links
 * to prevent potential security issues with target="_blank".
 *
 * @param props - ExternalLink configuration
 * @param props.variant - Link type: "default" for standard links, "email" for email links (defaults to "default")
 * @param props.href - Link destination (for email variant, omit "mailto:" as it's added automatically)
 * @param props.children - Link content (text, icons, etc.)
 * @param props.className - Additional CSS classes
 * @param props.target - Where to open the link (defaults to "_blank" for external links)
 * @param props.rel - Relationship between current document and linked document
 */
export interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "default" | "email";
  href: string;
  children: ReactNode;
}

export function ExternalLink({
  variant = "default",
  href,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
  ...rest
}: ExternalLinkProps) {
  const linkClassName = `external-link ${className}`.trim();

  const finalHref = variant === "email" ? `mailto:${href}` : href;

  return (
    <a href={finalHref} className={linkClassName} target={target} rel={rel} {...rest}>
      {children}
    </a>
  );
}
