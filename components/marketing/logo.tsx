import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 via-brand-400 to-brand-300 shadow-md shadow-brand-500/30">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M4 7H10V11H4V7Z"
            fill="white"
            fillOpacity="0.95"
          />
          <path
            d="M14 7H20V11H14V7Z"
            fill="white"
            fillOpacity="0.95"
          />
          <path
            d="M9 13H15V17H9V13Z"
            fill="white"
            fillOpacity="0.95"
          />
          <path
            d="M7 11V13M17 11V13M12 11V13"
            stroke="white"
            strokeOpacity="0.7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="font-display text-base font-bold tracking-tight">
        SysDesign<span className="text-brand-500">.</span>Gym
      </span>
    </div>
  )
}
