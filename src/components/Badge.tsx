import type { HTMLAttributes } from 'react';
import type { Tone } from '../lib/eol';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** `success` green · `warning` amber · `danger` red · `info` blue · `neutral` grey (categories) · `accent` solid blue tag for "권장". */
  tone?: Tone | 'accent';
}

/** Small status pill for short labels such as "확인됨", "검토 필요", "런타임". */
export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return <span className={`lc-badge lc-badge--${tone}${className ? ` ${className}` : ''}`} {...rest} />;
}
