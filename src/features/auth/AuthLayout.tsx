import type { ReactNode } from 'react'
import { Dumbbell } from 'lucide-react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="from-primary/10 via-background to-background flex flex-1 items-center justify-center bg-gradient-to-b p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-2xl">
            <Dumbbell className="size-6" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Open Gym</span>
        </div>
        {children}
      </div>
    </div>
  )
}
