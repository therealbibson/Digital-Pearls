import type { ReactNode } from "react";

const p = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      {children}
    </svg>
  );
}

export const Icons = {
  blueprint: (
    <Svg>
      <rect x="3" y="3" width="18" height="18" rx="2" {...p} />
      <path d="M3 9h18M9 3v18" {...p} />
      <circle cx="15" cy="15" r="2.2" {...p} />
    </Svg>
  ),
  layers: (
    <Svg>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" {...p} />
      <path d="m3 13 9 5 9-5M3 16l9 5 9-5" {...p} />
    </Svg>
  ),
  compass: (
    <Svg>
      <circle cx="12" cy="12" r="9" {...p} />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" {...p} />
    </Svg>
  ),
  shield: (
    <Svg>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" {...p} />
      <path d="m9 12 2 2 4-4" {...p} />
    </Svg>
  ),
  gauge: (
    <Svg>
      <path d="M4 15a8 8 0 1 1 16 0" {...p} />
      <path d="m12 15 4-4" {...p} />
      <circle cx="12" cy="15" r="1.4" {...p} />
    </Svg>
  ),
  nodes: (
    <Svg>
      <circle cx="6" cy="6" r="2.4" {...p} />
      <circle cx="18" cy="6" r="2.4" {...p} />
      <circle cx="12" cy="18" r="2.4" {...p} />
      <path d="M8 7.4 10.5 16M16 7.4 13.5 16M8 6h8" {...p} />
    </Svg>
  ),
  search: (
    <Svg>
      <circle cx="11" cy="11" r="7" {...p} />
      <path d="m16 16 5 5" {...p} />
    </Svg>
  ),
  route: (
    <Svg>
      <circle cx="6" cy="18" r="2.4" {...p} />
      <circle cx="18" cy="6" r="2.4" {...p} />
      <path d="M8 16.5 16 7.5M9 6H7a3 3 0 0 0 0 6h10a3 3 0 0 1 0 6h-2" {...p} />
    </Svg>
  ),
  cloud: (
    <Svg>
      <path
        d="M7 18a4 4 0 0 1-.5-7.97A5 5 0 0 1 16 9a3.5 3.5 0 0 1 1 6.9"
        {...p}
      />
      <path d="M12 12v6m0 0-2-2m2 2 2-2" {...p} />
    </Svg>
  ),
  handshake: (
    <Svg>
      <path d="m3 12 3-3 4 3 2-2 3 3M21 12l-3-3-4 3" {...p} />
      <path d="m8 12 3 3 2-2 3 3-2 2-4-3" {...p} />
    </Svg>
  ),
  chart: (
    <Svg>
      <path d="M4 4v16h16" {...p} />
      <path d="m8 14 3-4 3 3 4-6" {...p} />
    </Svg>
  ),
  lock: (
    <Svg>
      <rect x="5" y="10" width="14" height="10" rx="2" {...p} />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" {...p} />
    </Svg>
  ),
};

export type IconName = keyof typeof Icons;
