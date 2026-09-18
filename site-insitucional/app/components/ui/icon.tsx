import {
  Award,
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  Info,
  Library,
  ListChecks,
  Lock,
  Mail,
  Megaphone,
  Mic,
  Microscope,
  Monitor,
  Phone,
  School,
  Shield,
  Star,
  Target,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Nomes de ícones usados em content/site.ts */
const icons = {
  award: Award,
  book: BookOpen,
  chart: BarChart3,
  clipboard: ClipboardList,
  file: FileText,
  graduation: GraduationCap,
  info: Info,
  library: Library,
  list: ListChecks,
  lock: Lock,
  mail: Mail,
  megaphone: Megaphone,
  mic: Mic,
  microscope: Microscope,
  monitor: Monitor,
  phone: Phone,
  school: School,
  shield: Shield,
  star: Star,
  target: Target,
  user: User,
  users: Users,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  className,
}: {
  name: IconName | string;
  className?: string;
}) {
  const Cmp = icons[name as IconName] ?? Shield;
  return <Cmp className={className} aria-hidden="true" strokeWidth={1.75} />;
}
