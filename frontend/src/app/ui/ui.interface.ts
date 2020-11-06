export interface UiButton {
  title: string;
  url: string | null;
  function: CallableFunction | null;
}

export interface UiButtonGroup {
  buttons: UiButton[];
}

export interface UiBreadcrumb {
  title: string;
  routerLink: string;
}
