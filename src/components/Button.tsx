import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` = the one main action on a screen · `secondary` = other actions · `link` = text-only navigation such as "← 목록". */
  variant?: 'primary' | 'secondary' | 'link';
  /** Renders an `<a href>` instead of a `<button>`, for external links such as "공식 사이트". */
  href?: string;
  /** Icon placed before the label (16px inline SVG using `currentColor`). */
  icon?: ReactNode;
}

/** Action button. Use one `primary` per screen; pair with `secondary` for the rest. */
export function Button({ variant = 'secondary', href, icon, className, children, type = 'button', ...rest }: ButtonProps) {
  const cls = `lc-button lc-button--${variant}${className ? ` ${className}` : ''}`;
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {icon}
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} {...rest}>
      {icon}
      {children}
    </button>
  );
}
