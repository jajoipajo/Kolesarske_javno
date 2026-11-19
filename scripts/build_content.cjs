// P0: one configuration generates participant copy and static contact/phase UI.
const fs=require('fs');const path=require('path');const assert=require('assert');
const root=path.resolve(__dirname,'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8'));
assert.strictEqual(config.phase,'closed-pilot','Only the agreed closed-pilot process is currently specified.');
assert(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(config.contactEmail));
const experimentFile=path.resolve(root,config.experiment.path);
assert(experimentFile.startsWith(root+path.sep),'Experiment must belong to this site.');
const xml=fs.readFileSync(experimentFile,'utf8');
assert.strictEqual(xml.match(/<title>([^<]+)<\/title>/)?.[1],config.experiment.name,'Name must match the actual experiment.');
const exportNames=[...xml.matchAll(/<set\s+name="([^"]+)"/g)].map(m=>m[1]+'.csv');
assert.deepStrictEqual([...config.export.requiredCsvFiles].sort(),exportNames.sort());
assert.strictEqual(config.export.archiveFormat,'ZIP');
assert(config.export.filenameExample.toLowerCase().endsWith('.zip'));
assert(config.export.filenameExample.toLowerCase().includes(config.export.filenameKeyword.toLowerCase()));
const values={phaseLabel:config.phaseLabel,contactEmail:config.contactEmail,contactHref:'mailto:'+config.contactEmail,
 experimentName:config.experiment.name,experimentPath:config.experiment.path,archiveFormat:config.export.archiveFormat,
 filenameKeyword:config.export.filenameKeyword,filenameExample:config.export.filenameExample,
 requiredCsvFiles:config.export.requiredCsvFiles.map(x=>'`'+x+'`').join(', ')};
const template=fs.readFileSync(path.join(root,'content/participation.md'),'utf8');
const rendered=template.replace(/\{\{(\w+)\}\}/g,(_,key)=>{assert(Object.hasOwn(values,key),'Unknown placeholder: '+key);return values[key];});
assert(!rendered.includes('{{'),'Unresolved placeholder.');
const escapeHtml=x=>x.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const currentIndex=fs.readFileSync(path.join(root,'index.html'),'utf8');
const phase=`<p id="projectPhase" class="phase-notice"><strong>${escapeHtml(config.phaseLabel)}.</strong> Sodelovanje po predhodnem dogovoru: <a data-contact-link href="mailto:${escapeHtml(config.contactEmail)}">${escapeHtml(config.contactEmail)}</a>. Samodejni prejem in rok poročila še nista potrjena.</p>`;
let index=currentIndex.replace(/href="mailto:[^"]+"(?=[^>]*data-contact-link)/g,'href="mailto:'+config.contactEmail+'"')
 .replace(/(data-contact-link\s+href=")mailto:[^"]+"/g,'$1mailto:'+config.contactEmail+'"')
 .replace(/<!-- P0_PHASE_START -->[\s\S]*?<!-- P0_PHASE_END -->/,'<!-- P0_PHASE_START -->\n    '+phase+'\n    <!-- P0_PHASE_END -->');
assert(index.includes('id="projectPhase"'),'Static phase marker missing.');
const check=process.argv.includes('--check');
for(const [file,expected] of [['README.md',rendered],['index.html',index]]){
 const target=path.join(root,file);
 if(check) assert.strictEqual(fs.readFileSync(target,'utf8'),expected,file+' differs from the configured copy; run node scripts/build_content.cjs.');
 else fs.writeFileSync(target,expected);
}
console.log(check?'PASS: content, phase, contact, export files and experiment contract':'Generated participant copy and static phase/contact content.');
