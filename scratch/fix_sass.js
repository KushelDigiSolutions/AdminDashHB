const fs = require('fs');
const path = 'src/assets/scss/_variables.scss';
let content = fs.readFileSync(path, 'utf8');

// Add @use at the top if not present
if (!content.includes('@use "sass:math";')) {
    content = '@use "sass:math";\n@use "sass:map";\n' + content;
}

// Fixed-pattern replacements for division
content = content.replace(/\$spacer \/ 4/g, 'math.div($spacer, 4)');
content = content.replace(/\$spacer \/ 2/g, 'math.div($spacer, 2)');
content = content.replace(/\$grid-gutter-width \/ 2/g, 'math.div($grid-gutter-width, 2)');
content = content.replace(/\$input-padding-y \/ 2/g, 'math.div($input-padding-y, 2)');

// Map merge replacement
content = content.replace(/map-merge\(/g, 'map.merge(');

fs.writeFileSync(path, content, 'utf8');
console.log('SASS variables updated.');
