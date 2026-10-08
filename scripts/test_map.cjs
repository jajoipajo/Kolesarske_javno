const assert=require('assert');const fs=require('fs');const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'../main.js'),'utf8');
const body=src.slice(src.indexOf('function numericIndex('),src.indexOf('function jenksBreaks('));
const {numericIndex,getValues}=new Function(body+'\nreturn {numericIndex,getValues};')();
assert.deepStrictEqual(getValues([null,0,1,undefined,'',false].map(x=>({properties:{v:x}})),'v'),[0,1]);
assert.strictEqual(numericIndex('NaN'),null);
for(const name of ['avg_hex','avg_snap']){
 const j=JSON.parse(fs.readFileSync(path.join(__dirname,'../data',name+'.geojson'),'utf8'));
 assert.strictEqual(j.metadata.study_group,'volunteer');
 assert(!j.features.some(f=>Object.keys(f.properties).some(k=>['ride_id','participant_id','time_center_s'].includes(k))));
}
console.log('PASS: missing values, valid zero, public cohorts and private attribute exclusion');
