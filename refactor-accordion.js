const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace <ngb-accordion ...> to <div ngbAccordion ...>
    content = content.replace(/<ngb-accordion(.*?)>/g, (match, attrs) => {
        // remove #acc="ngbAccordion"
        attrs = attrs.replace(/\#\w+="ngbAccordion"/g, '');
        return `<div ngbAccordion${attrs}>`;
    });
    content = content.replace(/<\/ngb-accordion>/g, '</div>');

    // Replace <ngb-panel ... id="ID" ...> to <div ngbAccordionItem="ID" ...>
    content = content.replace(/<ngb-panel(.*?)id="([^"]+)"(.*?)>/g, (match, before, id, after) => {
        return `<div ngbAccordionItem="${id}"${before}${after}>`;
    });
    content = content.replace(/<ngb-panel(.*?)>/g, (match, attrs) => {
        return `<div ngbAccordionItem${attrs}>`;
    });
    content = content.replace(/<\/ngb-panel>/g, '</div>');

    // Replace <ng-template ngbPanelTitle>
    content = content.replace(/<ng-template\s+ngbPanelTitle>/g, '<h2 ngbAccordionHeader><button ngbAccordionButton>');
    
    // Replace <ng-template ngbPanelContent>
    content = content.replace(/<ng-template\s+ngbPanelContent>/g, '<div ngbAccordionCollapse><div ngbAccordionBody><ng-template>');
    
    // We have an issue handling closing tags of ng-template because we can't distinguish which ng-template it closes.
    // However, in ngb-panel sequences, they are usually:
    // <ng-template ngbPanelTitle> ... </ng-template>
    // <ng-template ngbPanelContent> ... </ng-template>
    
    // A quick hack is to split the content by ngb-panel/ngbAccordionItem markers if possible, 
    // or just regex replace <ng-template ngbPanelTitle> ... </ng-template> globally if we can balance it.
    // For simplicity, we can do multi-line regex for title and content, assuming well-formed non-nested templates inside.

    content = content.replace(/<h2 ngbAccordionHeader><button ngbAccordionButton>([\s\S]*?)<\/ng-template>/g, '<h2 ngbAccordionHeader><button ngbAccordionButton>$1</button></h2>');
    
    content = content.replace(/<div ngbAccordionCollapse><div ngbAccordionBody><ng-template>([\s\S]*?)<\/ng-template>/g, '<div ngbAccordionCollapse><div ngbAccordionBody><ng-template>$1</ng-template></div></div>');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Refactored: ' + filePath);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
        else if (fullPath.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

walk('./src/app');
