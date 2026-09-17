import { Link } from 'react-router-dom'
import { Dumbbell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/AuthContext'
import { ModeToggle } from './ModeToggle'

function initials(name: string | null | undefined) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function TopBar() {
  const { profile, signOut } = useAuth()
  const rolePrefix = profile?.role === 'coach' ? '/coach' : '/app'
  const settingsPath = `${rolePrefix}/settings`
  const profilePath = `${rolePrefix}/profile/${profile?.id}`
  const isAthlete = profile?.role !== 'coach'

  return (
    <header className="border-border bg-background sticky top-0 z-10 border-b">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link
          to={profile?.role === 'coach' ? '/coach/dashboard' : '/app/dashboard'}
          className="flex items-center gap-2 font-semibold"
        >
          <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg">
            <Dumbbell className="size-4" />
          </span>
          Open Gym
          <Badge variant="secondary" className="text-[10px] font-medium tracking-wide uppercase">
            Alpha
          </Badge>
        </Link>
        <div className="flex items-center gap-1">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="size-8">
                  {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
                  <AvatarFallback>{initials(profile?.display_name ?? profile?.username)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={profilePath}>My Profile</Link>
              </DropdownMenuItem>
              {isAthlete && (
                <DropdownMenuItem asChild>
                  <Link to="/app/exercises">Exercises</Link>
                </DropdownMenuItem>
              )}
              {isAthlete && (
                <DropdownMenuItem asChild>
                  <Link to="/app/coach">Find a coach</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to={settingsPath}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void signOut()}>
                <LogOut className="mr-2 size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
