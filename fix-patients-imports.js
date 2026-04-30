const fs=require('fs'); 
const path=require('path'); 
function walk(dir) { 
  let results=[]; 
  const list=fs.readdirSync(dir); 
  list.forEach(f => { 
    f=path.join(dir,f); 
    const stat=fs.statSync(f); 
    if(stat && stat.isDirectory()) 
      results=results.concat(walk(f)); 
    else if(f.endsWith('.ts')) 
      results.push(f); 
  }); 
  return results; 
} 
const files=walk('./src/app/pages/patients'); 
files.forEach(f => { 
  let s=fs.readFileSync(f,'utf8'); 
  if(s.includes('from') && s.includes('consultant-api.service')) { 
    let before=s; 
    s=s.replace(/from\s+['"].*?consultation\/consultant-api\.service['"]/g, (match) => { 
      return match.replace('consultation','role/consultant'); 
    }); 
    if(before!==s) { 
      fs.writeFileSync(f,s); 
      console.log('Fixed path in ' + f); 
    } 
  } 
});
