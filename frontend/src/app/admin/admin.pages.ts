import {SidebarPageGroup} from '../ui/sidebar/sidebar.component';

export const adminPages: SidebarPageGroup[] = [
  {
    title: 'Systemverwaltung',
    pages: [
      {
        title: 'Statistiken',
        icon: 'bar-chart-2',
        url: '/admin/',
        matchFull: true
      },
      {
        title: 'Benutzer und Kunden',
        icon: 'users',
        url: '/admin/users',
      },
      {
        title: 'Tarife',
        icon: 'map',
        url: '/admin/plans',
      },
      {
        title: 'Bestellungen',
        icon: 'shopping-cart',
        url: '/admin/orders',
      }
    ]
  },
  {
    title: 'Weitere Funktionen',
    pages: [
      {
        title: 'Profil bearbeiten',
        icon: 'user',
        url: '/profile/',
        matchFull: true
      },
    ]
  }
];
