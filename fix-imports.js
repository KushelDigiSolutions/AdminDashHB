const fs = require('fs');
const files = [
  'src/app/pages/lifestyle/add-blog/add-blog.component.ts',
  'src/app/pages/ecommerce/health-concern/health-concern.component.ts',
  'src/app/pages/ecommerce/products/attributes/attributes.component.ts',
  'src/app/pages/ecommerce/promotional-banner/promotional-banner.component.ts',
  'src/app/pages/ecommerce/products/attributes/attribute-listing/attribute-listing.component.ts',
  'src/app/pages/ecommerce/products/products-reviews/products-reviews.component.ts',
  'src/app/pages/ecommerce/promotional-banner/add-promotional-banner/add-promotional-banner.component.ts',
  'src/app/pages/ecommerce/banners/banners.component.ts',
  'src/app/pages/ecommerce/banners/add-banner/add-banner.component.ts',
  'src/app/pages/ecommerce/category/category.component.ts',
  'src/app/pages/ecommerce/brand/brand.component.ts',
  'src/app/pages/form/advancedform/advancedform.component.ts',
  'src/app/pages/ecommerce/brand/add-brand/add-brand.component.ts',
  'src/app/pages/ecommerce/addproduct/related-blogs/related-blogs.component.ts',
  'src/app/pages/cms/health-packages/health-packages.component.ts',
  'src/app/pages/cms/life-style-categories/life-style-category-list/life-style-category-list.component.ts',
  'src/app/pages/assessments/assessments.component.ts'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('standalone: true')) {
      if (!content.includes('HbSwitchComponent')) {
        content = `import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';\n${content}`;
        content = content.replace(/imports:\s*\[([^\]]*)\]/, (match, p1) => {
          return `imports: [${p1}${p1.trim() ? ', ' : ''}HbSwitchComponent]`;
        });
        fs.writeFileSync(f, content);
        console.log(`Updated ${f}`);
      }
    }
  }
});

const modules = [
  'src/app/pages/cms/health-packages/health-packages.module.ts',
  'src/app/pages/cms/life-style-categories/life-style-categories.module.ts',
  'src/app/pages/assessments/assessments.module.ts',
  'src/app/layouts/layouts.module.ts',
  'src/app/components/subscribed-health-packages/subscribed-health-packages.module.ts'
];

modules.forEach(m => {
  if (fs.existsSync(m)) {
    let content = fs.readFileSync(m, 'utf8');
    if (content.includes('UiSwitchModule')) {
      content = content.replace(/UiSwitchModule/g, 'HbSwitchComponent');
      content = content.replace(/import\s*{\s*UiSwitchModule\s*}\s*from\s*'ngx-ui-switch';?/g, `import { HbSwitchComponent } from 'src/app/shared/ui/hb-switch/hb-switch.component';`);
      fs.writeFileSync(m, content);
      console.log(`Updated module ${m}`);
    }
  }
});
