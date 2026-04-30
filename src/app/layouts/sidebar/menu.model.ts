export interface MenuItem {
    id?: string;
    label?: string;
    icon?: string;
    link?: string;
    params?: { [key: string]: any },
    subItems?: MenuItem[];
    isTitle?: boolean;
    badge?: any;
    parentId?: string;
    isLayout?: boolean;
    role: string[];
    staging?: boolean;
}
