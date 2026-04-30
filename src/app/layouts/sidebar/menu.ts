import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 'text_menu',
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
    role: ['Admin', 'Consultant']
  },
  {
    id: 'link_dashboard',
    label: "MENUITEMS.DASHBOARDS.TEXT",
    icon: "uil-home-alt",
    // badge: {
    //   variant: "primary",
    //   text: "01", //'MENUITEMS.DASHBOARDS.BADGE',
    // },
    link: "/dashboard",
    role: ['Admin', 'Consultant'],
  },
  {
    id: 'link_orders',
    label: "MENUITEMS.ECOMMERCE.LIST.ORDERS",
    icon: "uil-shopping-bag",
    role: ['Admin', 'Accountant'],
    subItems: [
      {
        id: 'link_orders_list',
        label: "MENUITEMS.ECOMMERCE.LIST.ORDERS",
        link: "/ecommerce/orders",
        parentId: 'link_orders',
        role: ['Admin', 'Accountant'],
      },
      {
        id: 'link_orders_new',
        label: "MENUITEMS.ECOMMERCE.LIST.NEWORDER",
        link: "/ecommerce/orders/create-order",
        parentId: 'link_orders',
        role: ['Admin', 'Accountant'],
      },
      {
        id: 'link_orders_abandoned_cart',
        label: "Abandoned Cart",
        link: "/ecommerce/abandoned-cart",
        parentId: 'link_orders',
        role: ['Admin', 'Accountant'],
      },
      {
        id: 'link_orders_bult_enquiry',
        label: "Bulk Order Enquiry",
        link: "/ecommerce/orders/enquiries",
        parentId: 'link_orders',
        role: ['Admin', 'Accountant'],
      },,
      {
        id: 'link_orders_bult_enquiry',
        label: "International Enquiry",
        link: "/ecommerce/orders/international-enquiries",
        parentId: 'link_orders',
        role: ['Admin', 'Accountant'],
      },
      {
        id: 'link_orders_awaited',
        label: "Awaited Order",
        link: "/ecommerce/awaited-order",
        parentId: 'link_orders',
        role: ['Admin', 'Accountant'],
      },
    ],
  },
  {
    id: 'link_products',
    label: "MENUITEMS.ECOMMERCE.LIST.PRODUCTS",
    icon: "uil-coins",
    role: ['Admin', 'ProductManager'],
    subItems: [
      {
        id: 'link_products_list',
        label: "Products.productList",
        link: "/ecommerce/products",
        parentId: 'link_products',
        role: ['Admin', 'ProductManager'],
      },
      {
        id: 'link_products_new',
        label: "Products.addProduct",
        link: "/ecommerce/add-product",
        parentId: 'link_products',
        role: ['Admin', 'ProductManager'],
      },
      {
        id: 'link_products_attrs',
        label: "Products.attributes",
        parentId: 'link_products',
        link: "/ecommerce/attributes",
        role: ['Admin', 'ProductManager'],
      },
      {
        id: 'link_products_variations',
        label: "Products.variations",
        parentId: 'link_products',
        link: "/ecommerce/variations",
        role: ['Admin', 'ProductManager'],
      },
      {
        id: 'link_products_taxes',
        label: "Products.taxes",
        parentId: 'link_products',
        link: "/ecommerce/taxes",
        role: ['Admin', 'ProductManager'],
      },
      {
        id: 'link_products_reviews',
        label: "Reviews",
        link: "/ecommerce/products/reviews",
        parentId: 'link_products',
        role: ['Admin', 'ProductManager'],
      },
    ],
  },
  {
    id: 'link_cms_healthpackages',
    label: "MENUITEMS.ECOMMERCE.LIST.HEALTHPACKAGES.HEALTHPACKAGES",
    icon: "dripicons-medical",
    role: ['Admin', 'CMSManager', 'HealthpackageEditor'],
    subItems: [
      {
        id: 'link_cms_healthpackages_list',
        label: "MENUITEMS.ECOMMERCE.LIST.HEALTHPACKAGES.HEALTHPACKAGESLIST",
        link: "/health-packages",
        parentId: 'link_cms_healthpackages',
        role: ['Admin', 'HealthpackageEditor', 'CMSManager'],
      },
      {
        id: 'link_cms_healthpackages_new',
        label: "MENUITEMS.ECOMMERCE.LIST.HEALTHPACKAGES.ADDNEW",
        link: "/health-packages/add-health-package",
        parentId: 'link_cms_healthpackages',
        role: ['Admin', 'HealthpackageEditor', 'CMSManager'],
      },
      {
        id: 'link_consultant_hp',
        label: "MENUITEMS.CONSULTANT.SUBSCRIBED_HEALTHPACKAGES",
        icon: "mdi mdi-bell-ring-outline",
        link: "/subscribed-health-packages",
        role: ['Admin', 'HealthpackageEditor'],
      },
      {
        id: 'link_create_hp_subscription',
        label: "Create Subscription",
        icon: "mdi mdi-bell-ring-outline",
        link: "/subscribed-health-packages/create",
        role: ['Admin'],
      },
    ],
  },
  {
    id: 'link_notifications',
    label: "Notifications",
    icon: "mdi mdi-bell-outline",
    role: ['Admin', 'HealthpackageEditor'],
    subItems: [
      {
        id: 'link_notifications_list',
        label: "Notifications List",
        icon: "mdi mdi-bell-outline",
        link: "/notifications/list",
        parentId: 'link_notifications',
        role: ['Admin', 'HealthpackageEditor'],
      },
      // {
      //   id: 'link_notifications_push',
      //   label: "Send Notification",
      //   icon: "mdi mdi-bell-outline",
      //   link: "/notifications/push-notification",
      //   parentId: 'link_notifications',
      //   role: ['Admin','HealthpackageEditor'],
      // },
      {
        id: 'link_notifications_templates',
        label: "MENUITEMS.ECOMMERCE.LIST.HEALTHPACKAGES.NOTIFICATION_TEMPLATES",
        icon: "mdi mdi-bell-outline",
        link: "/notifications/templates",
        parentId: 'link_notifications',
        role: ['Admin', 'HealthpackageEditor'],
      }
    ]
  },
  {
    id: 'link_users',
    label: "MENUITEMS.CONTACTS.TEXT",
    icon: "uil-book-alt",
    role: ['Admin', 'Editor'],
    subItems: [
      {
        id: 'link_users_list',
        label: "MENUITEMS.CONTACTS.LIST.USERLIST",
        link: "/contacts/list",
        parentId: 'link_users',
        role: ['Admin', 'Editor'],
      },
    ],
  },
  {
    id: 'link_appts',
    label: "MENUITEMS.CONSULTATION.LIST.APPOINTMENTS.TEXT",
    icon: "uil-calendar-alt",
    role: ['Admin', 'Accountant', 'ConsultUsAdmin', 'ConsultationsManager'],
    subItems: [
      {
        id: 'link_appts_list',
        label: "MENUITEMS.CONSULTATION.LIST.APPOINTMENTS.LIST",
        link: "/consultation/appointment",
        parentId: 'link_appts',
        role: ['Admin', 'Consultant', 'Accountant', 'ConsultUsAdmin', 'ConsultationsManager'],
      },
      {
        id: 'link_appts_new',
        label: "MENUITEMS.CONSULTATION.LIST.APPOINTMENTS.ADDNEW",
        link: "/consultation/create-appointment",
        parentId: 'link_appts',
        role: ['Admin', 'Accountant', 'ConsultUsAdmin', 'ConsultationsManager'],
      },
      {
        id: 'link_appts_payouts',
        label: "MENUITEMS.PAYOUTS.LIST",
        link: "/consultation/payouts",
        parentId: 'link_appts',
        role: ['Admin', 'Accountant'],
      },
    ],
  },
  {
    id: 'link_doctors',
    label: "MENUITEMS.CONSULTATION.LIST.DOCTORS.TEXT",
    icon: "uil-heart-medical",
    role: ['Admin', 'ConsultantOnboarding', 'ConsultUsAdmin'],
    subItems: [
      {
        id: 'link_doctors_list',
        label: "MENUITEMS.CONSULTATION.LIST.DOCTORS.LIST",
        link: "/doctors",
        parentId: 'link_doctors',
        role: ['Admin', 'ConsultantOnboarding', 'ConsultUsAdmin'],
      },
      {
        id: 'link_doctors_new',
        label: "MENUITEMS.CONSULTATION.LIST.DOCTORS.PENDING",
        link: "/doctors/pending-doctor",
        parentId: 'link_doctors',
        role: ['Admin', 'ConsultUsAdmin'],
      },
      {
        id: 'link_doctors_new',
        label: "MENUITEMS.CONSULTATION.LIST.DOCTORS.ADDNEW",
        link: "/doctors/add-doctor",
        parentId: 'link_doctors',
        role: ['Admin', 'ConsultantOnboarding', 'ConsultUsAdmin'],
      },
      {
        id: 'link_doctors_earning-list',
        label: "MENUITEMS.CONSULTATION.LIST.DOCTORS.EARNINGLIST",
        link: "/doctors/earning-list",
        parentId: 'link_doctors',
        role: ['Admin', 'ConsultUsAdmin'],
      },
      {
        id: 'link_doctors_new',
        label: "MENUITEMS.CONSULTATION.LIST.DOCTORS.PAYOUTS",
        link: "/doctors/payouts",
        parentId: 'link_doctors',
        role: ['Admin', 'ConsultUsAdmin'],
      },
      {
        id: 'link_doctors_speciality_list',
        label: "MENUITEMS.CONSULTATION.LIST.DOCTORS.TYPE",
        link: "/speciality",
        parentId: 'link_doctors',
        role: ['Admin', 'ConsultantOnboarding', 'ConsultUsAdmin'],
      },
      {
        id: 'link_doctors_speciality_list',
        label: "MENUITEMS.CONSULTATION.LIST.DOCTORS.SPECIALIZATION",
        link: "/doctors/specialization",
        parentId: 'link_doctors',
        role: ['Admin', 'ConsultantOnboarding', 'ConsultUsAdmin'],
      }
    ],
  },

  {
    id: 'link_diagnostics',
    label: "Diagnostics",
    icon: "mdi mdi-test-tube",
    role: ['Admin', 'DiagnosticEditor'],
    subItems: [
      {
        id: 'link_diagnostic_booking_list',
        label: "Bookings List",
        link: "/diagnostics/bookings",
        parentId: 'link_diagnostics',
        role: ['Admin'],
      },
      // {
      //   id: 'link_diagnostic_cancellation_requests',
      //   label: "Cancellation-Requests",
      //   link: "/diagnostics/cancellation-requests",
      //   parentId: 'link_diagnostics',
      //   role: ['Admin'],
      // },
      {
        id: 'link_diagnostics_list',
        label: "Diagnostic List",
        link: "/diagnostics",
        parentId: 'link_diagnostics',
        role: ['Admin', 'DiagnosticEditor'],
      },
    ],
  },
  {
    id: 'link_assessments',
    label: "Assessments",
    icon: "uil-heart-medical",
    role: ['Admin'],
    subItems: [
      {
        id: 'link_assessments_list',
        label: "Assessment List",
        link: "/assessments",
        parentId: 'link_assessments',
        role: ['Admin'],
      },
      {
        id: 'link_assessments_create',
        label: "Create Assessment",
        link: "/assessments/create",
        parentId: 'link_assessments',
        role: ['Admin'],
      },
    ]
  },
  {
    id: 'link_promotion',
    label: "MENUITEMS.PROMOTION.TEXT",
    icon: "uil-folder-check",
    role: ['Admin'],
    subItems: [
      {
        id: 'link_promotion_coupons',
        label: "MENUITEMS.ECOMMERCE.LIST.COUPONS.COUPONS",
        parentId: 'link_promotion',
        role: ['Admin'],
        subItems: [
          {
            id: 'link_promotion_coupons_list',
            label: "MENUITEMS.ECOMMERCE.LIST.COUPONS.COUPONSLIST",
            link: "/ecommerce/coupons",
            parentId: 'link_promotion_coupons',
            role: ['Admin'],
          },
          {
            id: 'link_promotion_coupons_new',
            label: "MENUITEMS.ECOMMERCE.LIST.COUPONS.ADDNEW",
            link: "/ecommerce/add-coupon",
            parentId: 'link_promotion_coupons',
            role: ['Admin'],
          },
        ],
      },
    ],
  },
  {
    id: 'link_blogs',
    label: "MENUITEMS.LIFESTYLE.LIST.BLOGS.TEXT",
    icon: "uil-laptop-cloud",
    role: ['Admin', 'Writer', 'Author', 'Editor', 'Publisher'],
    subItems: [
      {
        id: 'link_blogs_all',
        label: "All Blogs",
        link: "/lifestyle/blogs/all",
        parentId: 'link_blogs',
        role: ['Admin', 'Publisher'],
      },
      {
        id: 'link_blog_pool',
        label: "Blog Pool",
        link: "/lifestyle/blog-pool",
        parentId: 'link_blogs',
        role: ['Editor', 'Publisher'],
      },
      {
        id: 'link_blogs_list',
        label: "Blog List",
        link: "/lifestyle/blogs",
        parentId: 'link_blogs',
        role: ['Writer', 'Author', 'Editor', 'Publisher'],
      },
      {
        id: 'link_blogs_new',
        label: "MENUITEMS.LIFESTYLE.LIST.BLOGS.ADDNEW",
        link: "/lifestyle/add-blog",
        parentId: 'link_blogs',
        role: ['Admin', 'Writer', 'Author', 'Editor', 'Publisher'],
      },
    ],
  },
  {
    id: 'link_cms',
    label: "CMS",
    icon: "uil-folder-open",
    role: ['Admin', 'CMSManager', 'ProductManager'],
    subItems: [
      {
        id: 'link_cms_promotional_banners',
        label: "Promotional Banners",
        parentId: 'link_cms',
        role: ['Admin', 'CMSManager'],
        subItems: [
          {
            id: 'link_cms_promotional_banners_list',
            label: "Promotional Banner List",
            link: "/ecommerce/promotional-banners",
            parentId: 'link_cms_promotional_banners',
            role: ['Admin', 'CMSManager'],
          },
          {
            id: 'link_cms_promotional_banners_new',
            label: "MENUITEMS.ECOMMERCE.LIST.BANNERS.ADDNEW",
            link: "/ecommerce/add-promotional-banner",
            parentId: 'link_cms_promotional_banners',
            role: ['Admin', 'CMSManager'],
          },
        ],
      }

      , {
        id: 'link_cms_banners',
        label: "MENUITEMS.ECOMMERCE.LIST.BANNERS.BANNERS",
        parentId: 'link_cms',
        role: ['Admin', 'CMSManager'],
        subItems: [
          {
            id: 'link_cms_banners_list',
            label: "MENUITEMS.ECOMMERCE.LIST.BANNERS.BANNERSLIST",
            link: "/ecommerce/banners",
            parentId: 'link_cms_banners',
            role: ['Admin', 'CMSManager'],
          },
          {
            id: 'link_cms_banners_new',
            label: "MENUITEMS.ECOMMERCE.LIST.BANNERS.ADDNEW",
            link: "/ecommerce/add-banner",
            parentId: 'link_cms_banners',
            role: ['Admin', 'CMSManager'],
          },
        ],
      },
      {
        id: 'link_cms_menu',
        label: "MENUITEMS.ECOMMERCE.LIST.MENU.TEXT",
        parentId: 'link_cms',
        role: ['Admin', 'CMSManager'],
        subItems: [
          {
            id: 'link_cms_menu_list',
            label: "Menu List",
            link: "/ecommerce/menu",
            parentId: 'link_cms_menu',
            role: ['Admin', 'CMSManager'],
          },
          {
            id: 'link_cms_menu_new',
            label: "Create Menu",
            link: "/ecommerce/menu/create",
            parentId: 'link_cms_menu',
            role: ['Admin', 'CMSManager'],
          },
        ],
      },
      {
        id: 'link_cms_seasons',
        label: "Seasons",
        parentId: 'link_cms',
        role: ['Admin', 'CMSManager'],
        subItems: [
          {
            id: 'link_cms_seasons_list',
            label: "Seasons List",
            link: "/ecommerce/seasons",
            parentId: 'link_cms_seasons',
            role: ['Admin', 'CMSManager'],
          },
          {
            id: 'link_cms_seasons_new',
            label: "Create Season",
            link: "/ecommerce/seasons/create",
            parentId: 'link_cms_seasons',
            role: ['Admin', 'CMSManager'],
          },
        ],
      },
      {
        id: 'link_cms_cats',
        label: "MENUITEMS.ECOMMERCE.LIST.CATEGORIES.CATEGORIES",
        parentId: 'link_cms',
        role: ['Admin', 'CMSManager'],
        subItems: [
          {
            id: 'link_cms_cats_list',
            label: "MENUITEMS.ECOMMERCE.LIST.CATEGORIES.CATEGORIESLIST",
            link: "/ecommerce/category",
            parentId: 'link_cms_cats',
            role: ['Admin', 'CMSManager'],
          },
          {
            id: 'link_cms_cats_new',
            label: "Categories.addCategory",
            link: "/ecommerce/add-category",
            parentId: 'link_cms_cats',
            role: ['Admin', 'CMSManager'],
          },
        ],
      },
      {
        id: 'link_cms_lifestyle_cats',
        label: "MENUITEMS.ECOMMERCE.LIST.LIFESTYLECATEGORIES.LIFESTYLECATEGORIES",
        parentId: 'link_cms',
        role: ['Admin', 'CMSManager'],
        subItems: [
          {
            id: 'link_cms_lifestyle_cats_list',
            label: "MENUITEMS.ECOMMERCE.LIST.LIFESTYLECATEGORIES.LIFESTYLECATEGORIESLIST",
            link: "/lifeStyleCategories",
            parentId: 'link_cms_lifestyle_cats',
            role: ['Admin', 'CMSManager'],
          },
          {
            id: 'link_cms_lifestyle_cats_new',
            label: "Categories.addLifeStyleCategory",
            link: "/lifeStyleCategories/add-lifeStyle-category",
            parentId: 'link_cms_lifestyle_cats',
            role: ['Admin', 'CMSManager'],
          },
        ],
      },
      {
        id: 'link_cms_brands',
        label: "MENUITEMS.ECOMMERCE.LIST.BRANDS.BRANDS",
        parentId: 'link_cms',
        role: ['Admin', 'CMSManager', 'ProductManager'],
        subItems: [
          {
            id: 'link_cms_brands_list',
            label: "MENUITEMS.ECOMMERCE.LIST.BRANDS.BRANDSLIST",
            link: "/ecommerce/brands",
            parentId: 'link_cms_brands',
            role: ['Admin', 'CMSManager', 'ProductManager'],
          },
          {
            id: 'link_cms_brands_new',
            label: "Brands.addBrands",
            link: "/ecommerce/add-brands",
            parentId: 'link_cms_brands',
            role: ['Admin', 'CMSManager', 'ProductManager'],
          },
        ],
      },
      {
        id: 'link_cms_healthconcerns',
        label: "MENUITEMS.ECOMMERCE.LIST.HEALTHCONCERNS.HEALTHCONCERNS",
        parentId: 'link_cms',
        role: ['Admin', 'CMSManager'],
        subItems: [
          {
            id: 'link_cms_healthconcerns_list',
            label: "MENUITEMS.ECOMMERCE.LIST.HEALTHCONCERNS.HEALTHCONCERNSLIST",
            link: "/ecommerce/health-concerns",
            parentId: 'link_cms_healthconcerns',
            role: ['Admin', 'CMSManager'],
          },
          {
            id: 'link_cms_healthconcerns_new',
            label: "HealthConcerns.addHealthConcern",
            link: "/ecommerce/add-health-concerns",
            parentId: 'link_cms_healthconcerns',
            role: ['Admin', 'CMSManager'],
          },
        ],
      },
      {
        id: 'link_cms_metas',
        label: "MENUITEMS.ECOMMERCE.LIST.METAS.METAS",
        parentId: 'link_cms',
        role: ['Admin', 'CMSManager'],
        subItems: [
          {
            id: 'link_cms_metas_list',
            label: "MENUITEMS.ECOMMERCE.LIST.METAS.METASLIST",
            link: "/metas",
            parentId: 'link_cms_metas',
            role: ['Admin', 'CMSManager'],
          },
          {
            id: 'link_cms_metas_new',
            label: "MENUITEMS.ECOMMERCE.LIST.METAS.ADDNEW",
            link: "/metas/add-metas",
            parentId: 'link_cms_metas',
            role: ['Admin', 'CMSManager'],
          }
        ],
      },
      {
        id: 'link_cms_settings',
        label: "MENUITEMS.ECOMMERCE.LIST.SETTINGS.SETTINGS",
        parentId: 'link_cms',
        role: ['Admin', 'CMSManager'],
        subItems: [
          {
            id: 'link_cms_settings_list',
            label: "MENUITEMS.ECOMMERCE.LIST.SETTINGS.SETTINGSLIST",
            link: "/settings",
            parentId: 'link_cms_settings',
            role: ['Admin', 'CMSManager'],
          },
          {
            id: 'link_cms_settings_new',
            label: "MENUITEMS.ECOMMERCE.LIST.SETTINGS.ADDNEW",
            link: "/settings/add-new",
            parentId: 'link_cms_settings',
            role: ['Admin', 'CMSManager'],
          }
        ],
      }
    ],
  },
  {
    id: 'link_corporate',
    label: "Corporate",
    icon: "uil-folder-open",
    role: ['Admin', 'CorporateManager'],
    subItems: [
      {
        id: 'link_companies',
        label: "Companies",
        parentId: 'link_corporate',
        role: ['Admin', 'CorporateManager'],
        subItems: [
          {
            id: 'link_companies_list',
            label: "Companies List",
            parentId: 'link_companies',
            link: "admin/corporate/companies",
            role: ['Admin', 'CorporateManager'],
          },
          {
            id: 'link_companies_add',
            label: "Create Company",
            parentId: 'link_companies',
            link: "admin/corporate/companies/create",
            role: ['Admin', 'CorporateManager'],
          }
        ]
      },
      {
        id: 'link_webinar_templates',
        label: "Webinar Templates",
        parentId: 'link_corporate',
        role: ['Admin', 'CorporateManager'],
        subItems: [
          {
            id: 'link_webinar_temp_list',
            label: "Template List",
            parentId: 'link_webinar_templates',
            link: "admin/corporate/webinar-templates",
            role: ['Admin', 'CorporateManager'],
          },
          {
            id: 'link_webinar_temp_add',
            label: "Create Template",
            parentId: 'link_webinar_templates',
            link: "admin/corporate/webinar-templates/create",
            role: ['Admin', 'CorporateManager'],
          }
        ]
      },
      // {
      //   id: 'link_webinars',
      //   label: "Webinars",
      //   parentId: 'link_corporate',
      //   role: ['Admin','CorporateManager'],
      //   subItems: [
      //     {
      //       id: 'link_webinar_list',
      //       label: "Webinars List",
      //       parentId: 'link_webinars',
      //       link: "admin/corporate/webinars",
      //       role: ['Admin','CorporateManager'],
      //     },
      //     {
      //       id: 'link_webinar_add',
      //       label: "Create Webinar",
      //       parentId: 'link_webinar_add',
      //       link: "admin/corporate/webinars/create",
      //       role: ['Admin','CorporateManager'],
      //     }
      //   ]
      // },
      {
        id: 'link_corporate_packages',
        label: "Packages",
        parentId: 'link_corporate',
        role: ['Admin', 'CorporateManager'],
        subItems: [
          {
            id: 'link_cp_list',
            label: "Packages List",
            parentId: 'link_corporate_packages',
            link: "admin/corporate/packages",
            role: ['Admin', 'CorporateManager'],
          },
          {
            id: 'link_cp_add',
            label: "Create Packages",
            parentId: 'link_corporate_packages',
            link: "admin/corporate/packages/create",
            role: ['Admin', 'CorporateManager'],
          }
        ]
      },
      // {
      //   id: 'link_c_lifestyle',
      //   label: "Lifestyle Tips",
      //   parentId: 'link_corporate',
      //   role: ['Admin','CorporateManager'],
      //   subItems: [
      //     {
      //       id: 'link_c_lifestyle_list',
      //       label: "Lifesyle Tips List",
      //       parentId: 'link_c_lifestyle',
      //       link: "admin/corporate/lifestyle-tips",
      //       role: ['Admin','CorporateManager'],
      //     },
      //     {
      //       id: 'link_c_lifestyle_add',
      //       label: "Add Lifesyle Tips",
      //       parentId: 'link_c_lifestyle',
      //       link: "admin/corporate/lifestyle-tips/create",
      //       role: ['Admin','CorporateManager'],
      //     }
      //   ]
      // },
      // {
      //   id: 'link_c_emails',
      //   label: "Emails",
      //   parentId: 'link_corporate',
      //   role: ['Admin','CorporateManager'],
      //   subItems: [
      //     {
      //       id: 'link_c_email_list',
      //       label: "Emails List",
      //       parentId: 'link_c_emails',
      //       link: "admin/corporate/emails",
      //       role: ['Admin','CorporateManager'],
      //     },
      //     {
      //       id: 'link_c_email_add',
      //       label: "Create Email",
      //       parentId: 'link_c_emails',
      //       link: "admin/corporate/emails/create",
      //       role: ['Admin','CorporateManager'],
      //     }
      //   ]
      // },
    ]
  },
  {
    id: 'link_consultant_appt',
    label: "MENUITEMS.CONSULTANT.APPTS",
    icon: "uil-calendar-alt",
    link: "/consultant/appointments",
    role: ['Consultant'],
  },
  {
    id: 'link_consultant_slots',
    label: "MENUITEMS.CONSULTANT.MANAGESLOTS",
    icon: "mdi mdi-calendar-edit",
    link: "/consultant/schedule-timings",
    role: ['Consultant'],
  },
  {
    id: 'link_consultant_availableTimings',
    label: "MENUITEMS.CONSULTANT.AVAILSLOTS",
    icon: "mdi mdi-clock-outline",
    link: "/consultant/available-timings",
    role: ['Consultant'],
  },
  {
    id: 'link_consultant_patients',
    label: "Patients",
    icon: "mdi mdi-account-supervisor",
    link: "/patients",
    role: ['Consultant'],
  },
  {
    id: 'link_consultant_hp',
    label: "Health Packages",
    icon: "dripicons-medical",
    link: "/consultant/health-packages",
    role: ['Consultant'],
  },
  {
    id: 'link_consultant_hp',
    label: "MENUITEMS.CONSULTANT.SUBSCRIBED_HEALTHPACKAGES",
    icon: "mdi mdi-bell-ring-outline",
    link: "/consultant/subscribed-health-packages",
    role: ['Consultant'],
  },
  {
    id: 'link_consultant_accounts',
    label: "MENUITEMS.CONSULTANT.ACCOUNTS",
    icon: "uil-dollar-sign",
    link: "/consultant/accounts",
    role: ['Consultant'],
  },
  {
    id: 'link_consultant_profile',
    label: "MENUITEMS.CONSULTANT.PROFILE",
    icon: "mdi mdi-account-edit-outline",
    link: "/consultant/profile-settings",
    role: ['Consultant'],
  },
  {
    id: 'link_consultant_accounts',
    label: "MENUITEMS.CONSULTANT.CHANGE_PWD",
    icon: "uil-lock",
    link: "/consultant/change-password",
    role: ['Consultant'],
  },
];

// export const MENU: MenuItem[] = [
//     {
//         id: 1,
//         label: 'MENUITEMS.MENU.TEXT',
//         isTitle: true
//     },
//     {
//         id: 2,
//         label: 'MENUITEMS.DASHBOARDS.TEXT',
//         icon: 'uil-home-alt',
//         badge: {
//             variant: 'primary',
//             text: '01', //'MENUITEMS.DASHBOARDS.BADGE',
//         },
//         link: '/dashboard',
//     },
//     {
//         id: 3,
//         isLayout: true
//     },
//     {
//         id: 4,
//         label: 'MENUITEMS.APPS.TEXT',
//         isTitle: true
//     },
//     {
//         id: 5,
//         label: 'MENUITEMS.CALENDAR.TEXT',
//         icon: 'uil-calender',
//         link: '/calendar',
//     },
//     {
//         id: 6,
//         label: 'MENUITEMS.CHAT.TEXT',
//         icon: 'uil-comments-alt',
//         link: '/chat',
//         badge: {
//             variant: 'warning',
//             text: 'MENUITEMS.CHAT.BADGE',
//         },
//     },
//     {
//         id: 7,
//         label: 'MENUITEMS.ECOMMERCE.TEXT',
//         icon: 'uil-store',
//         subItems: [
//             {
//                 id: 8,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTS',
//                 parentId: 7,
//                 subItems: [
//                     {
//                         id: 801,
//                         label: 'Products.productList',
//                         link: '/ecommerce/products',
//                         parentId: 7,
//                     },
//                     {
//                         id: 802,
//                         label: 'Products.addProduct',
//                         link: '/ecommerce/add-product',
//                         parentId: 7,
//                     },
//                     {
//                         id: 803,
//                         label: 'Products.attributes',
//                         parentId: 7,
//                         link: '/ecommerce/attributes'
//                     },
//                     {
//                         id: 804,
//                         label: 'Products.variations',
//                         parentId: 7,
//                         link: '/ecommerce/variations'
//                     },
//                     {
//                         id: 805,
//                         label: 'Products.taxes',
//                         parentId: 7,
//                         link: '/ecommerce/taxes'
//                     },
//                 ]

//             },
//             {
//                 id: 20,
//                 label: 'Seasons',
//                 parentId: 8,
//                 subItems: [
//                     {
//                         id: 801,
//                         label: 'Seasons List',
//                         link: '/ecommerce/seasons',
//                         parentId: 8,
//                     },
//                     {
//                         id: 802,
//                         label: 'Create Season',
//                         link: '/ecommerce/seasons/create',
//                         parentId: 8,
//                     },
//                 ]

//             },
//             {
//                 id: 21,
//                 label: 'Menu',
//                 parentId: 8,
//                 subItems: [
//                     {
//                         id: 801,
//                         label: 'Menu List',
//                         link: '/ecommerce/menu',
//                         parentId: 8,
//                     },
//                     {
//                         id: 802,
//                         label: 'Create Menu',
//                         link: '/ecommerce/menu/create',
//                         parentId: 8,
//                     },
//                 ]

//             },
//             {
//                 id: 9,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.PRODUCTDETAIL',
//                 link: '/ecommerce/product-detail/1',
//                 parentId: 7
//             },
//             {
//                 id: 10,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.ORDERS',
//                 parentId: 7,
//                 subItems: [
//                     {
//                         id: 1001,
//                         label: 'MENUITEMS.ECOMMERCE.LIST.ORDERS',
//                         link: '/ecommerce/orders',
//                         parentId: 10
//                     },
//                 ]
//             },
//             {
//                 id: 11,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.CUSTOMERS',
//                 link: '/ecommerce/customers',
//                 parentId: 7
//             },
//             {
//                 id: 12,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.CART',
//                 link: '/ecommerce/cart',
//                 parentId: 7
//             },
//             {
//                 id: 13,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.CHECKOUT',
//                 link: '/ecommerce/checkout',
//                 parentId: 7
//             },
//             {
//                 id: 14,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.SHOPS',
//                 link: '/ecommerce/shops',
//                 parentId: 7
//             },
//             {
//                 id: 2001,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.CATEGORIES.CATEGORIES',
//                 parentId: 7,
//                 subItems: [
//                     {
//                         id: 200101,
//                         label: 'MENUITEMS.ECOMMERCE.LIST.CATEGORIES.CATEGORIESLIST',
//                         link: '/ecommerce/category',
//                         parentId: 2001
//                     },
//                     {
//                         id: 200102,
//                         label: 'Categories.addCategory',
//                         link: '/ecommerce/add-category',
//                         parentId: 2002
//                     },
//                 ]
//             },
//             {
//                 id: 3001,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.BRANDS.BRANDS',
//                 parentId: 7,
//                 subItems: [
//                     {
//                         id: 300101,
//                         label: 'MENUITEMS.ECOMMERCE.LIST.BRANDS.BRANDSLIST',
//                         link: '/ecommerce/brands',
//                         parentId: 3001
//                     },
//                     {
//                         id: 300102,
//                         label: 'Brands.addBrands',
//                         link: '/ecommerce/add-brands',
//                         parentId: 3002
//                     },
//                 ]
//             },
//             {
//                 id: 4001,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.HEALTHCONCERNS.HEALTHCONCERNS',
//                 parentId: 7,
//                 subItems: [
//                     {
//                         id: 400101,
//                         label: 'MENUITEMS.ECOMMERCE.LIST.HEALTHCONCERNS.HEALTHCONCERNSLIST',
//                         link: '/ecommerce/health-concerns',
//                         parentId: 4001
//                     },
//                     {
//                         id: 400102,
//                         label: 'HealthConcerns.addHealthConcern',
//                         link: '/ecommerce/add-health-concerns',
//                         parentId: 4002
//                     },
//                 ]
//             },
//             {
//                 id: 5001,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.BANNERS.BANNERS',
//                 parentId: 7,
//                 subItems: [
//                     {
//                         id: 500101,
//                         label: 'MENUITEMS.ECOMMERCE.LIST.BANNERS.BANNERSLIST',
//                         link: '/ecommerce/banners',
//                         parentId: 5001
//                     },
//                     {
//                         id: 500102,
//                         label: 'MENUITEMS.ECOMMERCE.LIST.BANNERS.ADDNEW',
//                         link: '/ecommerce/add-banner',
//                         parentId: 5002
//                     },
//                 ]
//             },
//             {
//                 id: 6001,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.COUPONS.COUPONS',
//                 parentId: 7,
//                 subItems: [
//                     {
//                         id: 600101,
//                         label: 'MENUITEMS.ECOMMERCE.LIST.COUPONS.COUPONSLIST',
//                         link: '/ecommerce/coupons',
//                         parentId: 6001
//                     },
//                     {
//                         id: 600102,
//                         label: 'MENUITEMS.ECOMMERCE.LIST.COUPONS.ADDNEW',
//                         link: '/ecommerce/add-coupon',
//                         parentId: 6002
//                     },
//                 ]
//             },
//             {
//                 id: 7001,
//                 label: 'MENUITEMS.ECOMMERCE.LIST.TYPES.TYPES',
//                 parentId: 7,
//                 subItems: [
//                     {
//                         id: 700101,
//                         label: 'MENUITEMS.ECOMMERCE.LIST.TYPES.TYPES',
//                         link: '/ecommerce/types',
//                         parentId: 7001
//                     },
//                     {
//                         id: 700102,
//                         label: 'MENUITEMS.ECOMMERCE.LIST.TYPES.ADDNEW',
//                         link: '/ecommerce/add-coupon',
//                         parentId: 7002
//                     },
//                 ]
//             },
//         ]
//     },
//     {
//         id: 16,
//         label: 'MENUITEMS.CONSULTATION.TEXT',
//         icon: 'uil-comment-edit',
//         subItems: [
//             {
//                 id: 17,
//                 label: 'MENUITEMS.CONSULTATION.LIST.APPOINTMENTS.TEXT',
//                 parentId: 16,
//                 subItems: [
//                     {
//                         id: 700101,
//                         label: 'MENUITEMS.CONSULTATION.LIST.APPOINTMENTS.LIST',
//                         link: '/consultation/appointment',
//                         parentId: 7001
//                     }
//                 ]
//             },
//         ]
//     },
//     {
//         id: 160,
//         label: 'MENUITEMS.LIFESTYLE.TEXT',
//         icon: 'uil-laptop-cloud',
//         subItems: [
//             {
//                 id: 161,
//                 label: 'MENUITEMS.LIFESTYLE.LIST.BLOGS.TEXT',
//                 parentId: 160,
//                 subItems: [
//                     {
//                         id: 800101,
//                         label: 'MENUITEMS.LIFESTYLE.LIST.BLOGS.LIST',
//                         link: '/lifestyle/blogs',
//                         parentId: 161
//                     },
//                     {
//                         id: 800102,
//                         label: 'MENUITEMS.LIFESTYLE.LIST.BLOGS.ADDNEW',
//                         link: '/lifestyle/add-blog',
//                         parentId: 161
//                     }
//                 ]
//             },
//         ]
//     },
//     {
//         id: 16,
//         label: 'MENUITEMS.EMAIL.TEXT',
//         icon: 'uil-envelope',
//         subItems: [
//             {
//                 id: 17,
//                 label: 'MENUITEMS.EMAIL.LIST.INBOX',
//                 link: '/email/inbox',
//                 parentId: 16
//             },
//             {
//                 id: 18,
//                 label: 'MENUITEMS.EMAIL.LIST.READEMAIL',
//                 link: '/email/read/1',
//                 parentId: 16
//             }
//         ]
//     },
//     {
//         id: 19,
//         label: 'MENUITEMS.INVOICES.TEXT',
//         icon: 'uil-invoice',
//         subItems: [
//             {
//                 id: 20,
//                 label: 'MENUITEMS.INVOICES.LIST.INVOICELIST',
//                 link: '/invoices/list',
//                 parentId: 19
//             },
//             {
//                 id: 21,
//                 label: 'MENUITEMS.INVOICES.LIST.INVOICEDETAIL',
//                 link: '/invoices/detail',
//                 parentId: 19
//             },
//         ]
//     },
//     {
//         id: 22,
//         label: 'MENUITEMS.CONTACTS.TEXT',
//         icon: 'uil-book-alt',
//         subItems: [
//             {
//                 id: 23,
//                 label: 'MENUITEMS.CONTACTS.LIST.USERGRID',
//                 link: '/contacts/grid',
//                 parentId: 22
//             },
//             {
//                 id: 24,
//                 label: 'MENUITEMS.CONTACTS.LIST.USERLIST',
//                 link: '/contacts/list',
//                 parentId: 22
//             },
//             {
//                 id: 25,
//                 label: 'MENUITEMS.CONTACTS.LIST.PROFILE',
//                 link: '/contacts/profile',
//                 parentId: 22
//             }
//         ]
//     },
//     {
//         id: 26,
//         label: 'MENUITEMS.PAGES.TEXT',
//         isTitle: true
//     },
//     {
//         id: 27,
//         label: 'MENUITEMS.AUTHENTICATION.TEXT',
//         icon: 'uil-user-circle',
//         subItems: [
//             {
//                 id: 28,
//                 label: 'MENUITEMS.AUTHENTICATION.LIST.LOGIN',
//                 link: '/pages/login-1',
//                 parentId: 27
//             },
//             {
//                 id: 29,
//                 label: 'MENUITEMS.AUTHENTICATION.LIST.REGISTER',
//                 link: '/pages/register-1',
//                 parentId: 27
//             },
//             {
//                 id: 30,
//                 label: 'MENUITEMS.AUTHENTICATION.LIST.RECOVERPWD',
//                 link: '/pages/recoverpwd-1',
//                 parentId: 27
//             },
//             {
//                 id: 31,
//                 label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
//                 link: '/pages/lock-screen-1',
//                 parentId: 27
//             }
//         ]
//     },
//     {
//         id: 32,
//         label: 'MENUITEMS.UTILITY.TEXT',
//         icon: 'uil-file-alt',
//         subItems: [
//             {
//                 id: 34,
//                 label:'MENUITEMS.UTILITY.LIST.STARTER',
//                 link: '/pages/starter',
//                 parentId: 32
//             },
//             {
//                 id: 35,
//                 label: 'MENUITEMS.UTILITY.LIST.MAINTENANCE',
//                 link: '/pages/maintenance',
//                 parentId: 32
//             },
//             {
//                 id: 36,
//                 label: 'MENUITEMS.UTILITY.LIST.COMINGSOON',
//                 link: '/pages/comingsoon',
//                 parentId: 32
//             },
//             {
//                 id: 37,
//                 label: 'MENUITEMS.UTILITY.LIST.TIMELINE',
//                 link: '/pages/timeline',
//                 parentId: 32
//             },
//             {
//                 id: 38,
//                 label: 'MENUITEMS.UTILITY.LIST.FAQS',
//                 link: '/pages/faqs',
//                 parentId: 32
//             },
//             {
//                 id: 39,
//                 label: 'MENUITEMS.UTILITY.LIST.PRICING',
//                 link: '/pages/pricing',
//                 parentId: 32
//             },
//             {
//                 id: 40,
//                 label: 'MENUITEMS.UTILITY.LIST.ERROR404',
//                 link: '/pages/404',
//                 parentId: 32
//             },
//             {
//                 id: 41,
//                 label: 'MENUITEMS.UTILITY.LIST.ERROR500',
//                 link: '/pages/500',
//                 parentId: 32
//             },
//         ]
//     },
//     {
//         id: 42,
//         label: 'MENUITEMS.COMPONENTS.TEXT',
//         isTitle: true
//     },
//     {
//         id: 43,
//         label: 'MENUITEMS.UIELEMENTS.TEXT',
//         icon: 'uil-flask',
//         subItems: [
//             {
//                 id: 44,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.ALERTS',
//                 link: '/ui/alerts',
//                 parentId: 43
//             },
//             {
//                 id: 45,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.BUTTONS',
//                 link: '/ui/buttons',
//                 parentId: 43
//             },
//             {
//                 id: 46,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.CARDS',
//                 link: '/ui/cards',
//                 parentId: 43
//             },
//             {
//                 id: 47,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.CAROUSEL',
//                 link: '/ui/carousel',
//                 parentId: 43
//             },
//             {
//                 id: 48,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.DROPDOWNS',
//                 link: '/ui/dropdowns',
//                 parentId: 43
//             },
//             {
//                 id: 49,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.GRID',
//                 link: '/ui/grid',
//                 parentId: 43
//             },
//             {
//                 id: 50,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.IMAGES',
//                 link: '/ui/images',
//                 parentId: 43
//             },
//             {
//                 id: 52,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.MODALS',
//                 link: '/ui/modals',
//                 parentId: 43
//             },
//             {
//                 id: 53,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.RANGESLIDER',
//                 link: '/ui/rangeslider',
//                 parentId: 43
//             },
//             {
//                 id: 55,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.PROGRESSBAR',
//                 link: '/ui/progressbar',
//                 parentId: 43
//             },
//             {
//                 id: 56,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.SWEETALERT',
//                 link: '/ui/sweet-alert',
//                 parentId: 43
//             },
//             {
//                 id: 57,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.TABS',
//                 link: '/ui/tabs-accordions',
//                 parentId: 43
//             },
//             {
//                 id: 58,
//                 label:'MENUITEMS.UIELEMENTS.LIST.TYPOGRAPHY',
//                 link: '/ui/typography',
//                 parentId: 43
//             },
//             {
//                 id: 59,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.VIDEO',
//                 link: '/ui/video',
//                 parentId: 43
//             },
//             {
//                 id: 60,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.GENERAL',
//                 link: '/ui/general',
//                 parentId: 43
//             },
//             {
//                 id: 61,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.COLORS',
//                 link: '/ui/colors',
//                 parentId: 43
//             },
//             {
//                 id: 62,
//                 label: 'MENUITEMS.UIELEMENTS.LIST.RATING',
//                 link: '/ui/rating',
//                 parentId: 43
//             }
//         ]
//     },
//     {
//         id: 64,
//         label: 'MENUITEMS.FORMS.TEXT',
//         icon: 'uil-shutter-alt',
//         badge: {
//             variant: 'primary',
//             text: '6', //'MENUITEMS.FORMS.BADGE',
//         },
//         subItems: [
//             {
//                 id: 65,
//                 label: 'MENUITEMS.FORMS.LIST.ELEMENTS',
//                 link: '/form/elements',
//                 parentId: 64
//             },
//             {
//                 id: 66,
//                 label: 'MENUITEMS.FORMS.LIST.VALIDATION',
//                 link: '/form/validation',
//                 parentId: 64
//             },
//             {
//                 id: 67,
//                 label: 'MENUITEMS.FORMS.LIST.ADVANCED',
//                 link: '/form/advanced',
//                 parentId: 64
//             },
//             {
//                 id: 68,
//                 label: 'MENUITEMS.FORMS.LIST.EDITOR',
//                 link: '/form/editor',
//                 parentId: 64
//             },
//             {
//                 id: 69,
//                 label: 'MENUITEMS.FORMS.LIST.FILEUPLOAD',
//                 link: '/form/uploads',
//                 parentId: 64
//             },
//             {
//                 id: 71,
//                 label: 'MENUITEMS.FORMS.LIST.REPEATER',
//                 link: '/form/repeater',
//                 parentId: 64
//             },
//             {
//                 id: 72,
//                 label: 'MENUITEMS.FORMS.LIST.WIZARD',
//                 link: '/form/wizard',
//                 parentId: 64
//             },
//             {
//                 id: 73,
//                 label: 'MENUITEMS.FORMS.LIST.MASK',
//                 link: '/form/mask',
//                 parentId: 64
//             }
//         ]
//     },
//     {
//         id: 74,
//         icon: 'uil-list-ul',
//         label: 'MENUITEMS.TABLES.TEXT',
//         subItems: [
//             {
//                 id: 75,
//                 label: 'MENUITEMS.TABLES.LIST.BASIC',
//                 link: '/tables/basic',
//                 parentId: 74
//             },
//             {
//                 id: 76,
//                 label: 'MENUITEMS.TABLES.LIST.ADVANCED',
//                 link: '/tables/datatable',
//                 parentId: 74
//             }
//         ]
//     },
//     {
//         id: 79,
//         label: 'MENUITEMS.CHARTS.TEXT',
//         icon: 'uil-chart',
//         subItems: [
//             {
//                 id: 80,
//                 label: 'MENUITEMS.CHARTS.LIST.APEX',
//                 link: '/charts/apex',
//                 parentId: 79
//             },
//             {
//                 id: 81,
//                 label: 'MENUITEMS.CHARTS.LIST.CHARTJS',
//                 link: '/charts/chartjs',
//                 parentId: 79
//             },
//             {
//                 id: 82,
//                 label: 'MENUITEMS.CHARTS.LIST.CHARTIST',
//                 link: '/charts/chartist',
//                 parentId: 79
//             },
//             {
//                 id: 83,
//                 label: 'MENUITEMS.CHARTS.LIST.ECHART',
//                 link: '/charts/echart',
//                 parentId: 79
//             },
//         ]
//     },
//     {
//         id: 85,
//         label: 'MENUITEMS.ICONS.TEXT',
//         icon: 'uil-streering',
//         subItems: [
//             {
//                 id: 86,
//                 label: 'MENUITEMS.ICONS.LIST.UNICONS',
//                 link: '/icons/unicons',
//                 parentId: 85
//             },
//             {
//                 id: 87,
//                 label: 'MENUITEMS.ICONS.LIST.BOXICONS',
//                 link: '/icons/boxicons',
//                 parentId: 85
//             },
//             {
//                 id: 88,
//                 label: 'MENUITEMS.ICONS.LIST.MATERIALDESIGN',
//                 link: '/icons/materialdesign',
//                 parentId: 85
//             },
//             {
//                 id: 89,
//                 label: 'MENUITEMS.ICONS.LIST.DRIPICONS',
//                 link: '/icons/dripicons',
//                 parentId: 85
//             },
//             {
//                 id: 90,
//                 label: 'MENUITEMS.ICONS.LIST.FONTAWESOME',
//                 link: '/icons/fontawesome',
//                 parentId: 85
//             },
//         ]
//     },
//     {
//         id: 100,
//         label: 'MENUITEMS.MAPS.TEXT',
//         icon: 'uil-location-point',
//         subItems: [
//             {
//                 id: 101,
//                 label: 'MENUITEMS.MAPS.LIST.GOOGLEMAP',
//                 link: '/maps/google',
//                 parentId: 100
//             }
//         ]
//     },
//     {
//         id: 104,
//         label: 'MENUITEMS.MULTILEVEL.TEXT',
//         icon: 'uil-share-alt',
//         subItems: [
//             {
//                 id: 105,
//                 label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.1',
//                 parentId: 104
//             },
//             {
//                 id: 106,
//                 label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.2',
//                 parentId: 104,
//                 subItems: [
//                     {
//                         id: 107,
//                         label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.1',
//                         parentId: 106,
//                     },
//                     {
//                         id: 108,
//                         label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.2',
//                         parentId: 106,
//                     }
//                 ]
//             },
//         ]
//     }
// ];