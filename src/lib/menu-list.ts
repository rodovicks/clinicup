import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  TableProperties,
  CalendarCheck,
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/home',
          label: 'Dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Principal',
      menus: [
        {
          href: '/appoiments',
          label: 'Agendamentos',
          icon: CalendarCheck,
        },
        {
          href: '/exams',
          label: 'Tipos de Exames',
          icon: TableProperties,
        },
      ],
    },
    {
      groupLabel: 'Configurações',
      menus: [
        {
          href: '/users',
          label: 'Usuários',
          icon: Users,
        },
        {
          href: '/settings',
          label: 'Configurações',
          icon: Settings,
        },
      ],
    },
  ];
}
