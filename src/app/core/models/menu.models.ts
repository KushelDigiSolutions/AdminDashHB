export interface MenuItem {
    active: boolean
    bannerImage: string
    bannerTag: string
    children: MenuItem[]
    filterType: string
    image: string
    imageTag: string
    metaDescription: string
    metaTags: any[]
    metaTitle: string
    name: string
    parent?: string
    path: string
    slug: string
    target: string
    type: string
    url: string
    _id: string
}
export interface MenuList {
    success: boolean,
    data: {
        menus: Array<MenuItem>
    }
}