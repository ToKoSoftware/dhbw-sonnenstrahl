import {SidebarPageGroup} from '../ui/sidebar/sidebar.component';

export const profilePages: SidebarPageGroup[] = [
  {
    title: 'Verwaltung',
    pages: [
      {
        title: 'Bestellungen verwalten',
        matchFull: true,
        icon: 'shopping-cart',
        url: '/profile/',
      },
      {
        title: 'Kundendaten',
        icon: 'user',
        url: '/profile/customers',
        matchFull: true
      },
    ]
  },
  {
    title: 'Weitere Funktionen',
    pages: [
      {
        title: 'Zugangsdaten bearbeiten',
        icon: 'key',
        url: '/profile/credentials',
        matchFull: true
      },
    ]
  }
];
