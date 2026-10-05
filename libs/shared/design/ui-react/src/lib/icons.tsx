import type { ReactNode, SVGProps } from 'react';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  size?: number;
};

function createIcon(
  children: ReactNode,
  { filled = false, strokeWidth = 2.4 } = {},
) {
  return function Icon({ size = 20, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {children}
      </svg>
    );
  };
}

export const ChevronLeftIcon = createIcon(<path d="M15 18l-6-6 6-6" />);
export const ChevronRightIcon = createIcon(<path d="M9 6l6 6-6 6" />);
export const ArrowRightIcon = createIcon(<path d="M5 12h14M13 6l6 6-6 6" />);
export const PlusIcon = createIcon(<path d="M12 5v14M5 12h14" />, {
  strokeWidth: 2.8,
});
export const CloseIcon = createIcon(<path d="M6 6l12 12M18 6 6 18" />, {
  strokeWidth: 2.6,
});
export const CheckIcon = createIcon(<path d="M5 12l5 5 9-10" />, {
  strokeWidth: 3.2,
});
export const LockIcon = createIcon(
  <>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>,
);
export const GlobeIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
  </>,
);
export const CopyIcon = createIcon(
  <>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </>,
);
export const InfoIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </>,
  { strokeWidth: 2.2 },
);
export const WarningIcon = createIcon(
  <>
    <path d="M12 3 2 21h20z" />
    <path d="M12 10v5" />
    <path d="M12 18h.01" />
  </>,
  { strokeWidth: 2.2 },
);
export const SearchIcon = createIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </>,
);
export const RefreshIcon = createIcon(
  <>
    <path d="M20 11a8 8 0 1 0-2.3 5.7" />
    <path d="M20 5v6h-6" />
  </>,
);
export const LogOutIcon = createIcon(
  <>
    <path d="M15 4h4v16h-4" />
    <path d="M10 8l-4 4 4 4" />
    <path d="M6 12h10" />
  </>,
  { strokeWidth: 2.2 },
);
export const SettingsIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </>,
  { strokeWidth: 2.2 },
);
export const GripIcon = createIcon(
  <>
    <circle cx="9" cy="6" r="1.7" />
    <circle cx="15" cy="6" r="1.7" />
    <circle cx="9" cy="12" r="1.7" />
    <circle cx="15" cy="12" r="1.7" />
    <circle cx="9" cy="18" r="1.7" />
    <circle cx="15" cy="18" r="1.7" />
  </>,
  { filled: true },
);
export const HomeIcon = createIcon(<path d="M3 11l9-8 9 8v10H15v-6H9v6H3z" />, {
  strokeWidth: 2.2,
});
export const UsersIcon = createIcon(
  <>
    <circle cx="9" cy="8" r="4" />
    <path d="M2 21c0-4 3-6 7-6s7 2 7 6" />
    <path d="M16 4a4 4 0 0 1 0 8" />
    <path d="M22 21c0-3-2-5-5-5.5" />
  </>,
  { strokeWidth: 2.2 },
);
export const TrophyIcon = createIcon(
  <>
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M17 5h3v2a3 3 0 0 1-3 3" />
    <path d="M7 5H4v2a3 3 0 0 0 3 3" />
  </>,
  { strokeWidth: 2.2 },
);
export const UserIcon = createIcon(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </>,
  { strokeWidth: 2.2 },
);
