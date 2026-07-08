import {
  BookOpen,
  Hand,
  Image,
  Layers,
  ListTree,
  PlayCircle,
  Rocket,
  SlidersHorizontal,
  Type,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { GroupId } from './exports'

export const GROUP_ICONS: Record<GroupId, LucideIcon> = {
  start:     Rocket,
  book:      BookOpen,
  turning:   Hand,
  content:   Type,
  textures:  Image,
  binding:   Layers,
  demokit:   SlidersHorizontal,
  reference: Wrench,
  play:      PlayCircle,
}

/** Use this for sidebar nav items + group eyebrows. */
export function GroupIcon({ group, size = 12 }: { group: GroupId; size?: number }) {
  const Icon = GROUP_ICONS[group] ?? ListTree
  return <Icon size={size} strokeWidth={1.75} />
}
