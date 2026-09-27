// Per-icon deep imports. The package barrel re-exports roughly nine thousand
// icon modules; importing through it produced a 501 KB bundle. The package
// ships an export map for ./dist/csr/* so each icon resolves on its own.
//
// One family for the whole site (Phosphor), one stroke weight. (skill 3.C)
import { LinkedinLogo } from '@phosphor-icons/react/dist/csr/LinkedinLogo';
import { GithubLogo } from '@phosphor-icons/react/dist/csr/GithubLogo';
import { EnvelopeSimple } from '@phosphor-icons/react/dist/csr/EnvelopeSimple';
import { Phone } from '@phosphor-icons/react/dist/csr/Phone';
import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight';
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { ArrowDown } from '@phosphor-icons/react/dist/csr/ArrowDown';
import { CheckCircle } from '@phosphor-icons/react/dist/csr/CheckCircle';
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { Code } from '@phosphor-icons/react/dist/csr/Code';
import { Buildings } from '@phosphor-icons/react/dist/csr/Buildings';
import { SealCheck } from '@phosphor-icons/react/dist/csr/SealCheck';
import { TrendUp } from '@phosphor-icons/react/dist/csr/TrendUp';
import { List } from '@phosphor-icons/react/dist/csr/List';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { CircleNotch } from '@phosphor-icons/react/dist/csr/CircleNotch';
import { SignOut } from '@phosphor-icons/react/dist/csr/SignOut';
import { ArrowClockwise } from '@phosphor-icons/react/dist/csr/ArrowClockwise';
import { UserPlus } from '@phosphor-icons/react/dist/csr/UserPlus';
import { Drop } from '@phosphor-icons/react/dist/csr/Drop';
import { UsersThree } from '@phosphor-icons/react/dist/csr/UsersThree';
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin';
import { ChatCircleDots } from '@phosphor-icons/react/dist/csr/ChatCircleDots';
import { Storefront } from '@phosphor-icons/react/dist/csr/Storefront';
import { Path } from '@phosphor-icons/react/dist/csr/Path';
import { ChartLineUp } from '@phosphor-icons/react/dist/csr/ChartLineUp';

export const ICONS = {
  linkedinLogo: LinkedinLogo,
  githubLogo: GithubLogo,
  envelopeSimple: EnvelopeSimple,
  phone: Phone,
  arrowUpRight: ArrowUpRight,
  arrowRight: ArrowRight,
  arrowDown: ArrowDown,
  checkCircle: CheckCircle,
  graduationCap: GraduationCap,
  code: Code,
  buildings: Buildings,
  sealCheck: SealCheck,
  trendUp: TrendUp,
  list: List,
  x: X,
  circleNotch: CircleNotch,
  signOut: SignOut,
  arrowClockwise: ArrowClockwise,
  userPlus: UserPlus,
  drop: Drop,
  usersThree: UsersThree,
  mapPin: MapPin,
  chat: ChatCircleDots,
  storefront: Storefront,
  path: Path,
  chartLine: ChartLineUp,
};

// Re-exported so components can use an icon directly without going through
// the <Icon name> lookup, while still resolving to a single tree-shaken module.
export {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  CircleNotch,
  EnvelopeSimple,
  List,
  SealCheck,
  SignOut,
  ArrowClockwise,
  X,
};

export function Icon({ name, size = 20, className = '', weight = 'regular' }) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp size={size} weight={weight} className={className} aria-hidden="true" />;
}
