export interface MenuLink {
  title: string;
  caption?: string;
  icon: string;
  link: string;
  type?: string;
  items?: Array<MenuLink> | null;
}
