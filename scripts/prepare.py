from pathlib import Path
from PIL import Image
import json, pymupdf as pdf, concurrent.futures, urllib.request, io
root=Path(__file__).resolve().parents[1]; pub=root/'public'; art=pub/'diagrams'; (pub/'parts').mkdir(exist_ok=True)
s=Path('/tmp/dc608.html').read_text(); j=json.JSONDecoder().raw_decode(s[s.index('{"hotspots"'):])[0]
Image.open('/tmp/mm-logo.png').crop((11,21,112,124)).save(pub/'gear.png')
rows=[]
for f,rs in j['parts'].items():
 r=rs[0]; name=r['name'].removeprefix(r['sku']).strip().replace(' - ',' – ').replace('Dewalt','DeWALT');rows.append(dict(figure=int(f),sku=r['sku'],name=name,price=r['price'],stock=r['status']=='ok',photo=r['img'] if r['photo'] else '',url=r['url'],description='Replacement '+name.split(' – ')[0].lower()+' for the DC608 Type 1 model catalog.'))
rows=[r for r in rows if r['figure'] not in (91,867)]
for r in rows:
 if r['figure']==53:r.update(figure=4,name='Screw (M4 x 12)',description='Demonstration figure mapping. Verify the manufacturer parts list before ordering.')
for n in range(2):rows.append(dict(figure=13,sku='DEMO-BRG-'+str(n+1),name='Ball Bearing – '+['Open','Shielded'][n],price=[8.45,11.25][n],stock=True,photo='',url='',description='Demonstration match only. Confirm the required bearing specification; these are not asserted to be interchangeable.'))
rows.sort(key=lambda r:r['figure']); r=next(r for r in rows if r['figure']==38);rows.remove(r);rows.insert(20,r)
def cache(r):
 if not r['photo']:return
 try:
  p=pub/'parts'/(r['sku']+'.jpg'); data=urllib.request.urlopen(r['photo'],timeout=8).read();img=Image.open(io.BytesIO(data)).convert('RGB');img.thumbnail((130,130));img.save(p,quality=84);r['photo']='/parts/'+p.name
 except Exception:r['photo']=''
with concurrent.futures.ThreadPoolExecutor(12) as pool:list(pool.map(cache,rows))
(root/'lib/catalog.json').write_text(json.dumps(rows,indent=2));points=[]
for h in j['hotspots']:
 f=int(h['f']);x=h['x'];y=h['y'];
 if f==4 and y>60:f=40
 if f==6 and x>70:f=90
 if f==8 and y<31:f=81 if x>50 else 85
 ids=[r['sku'] for r in rows if r['figure']==f]
 if ids:points.append(dict(page=1,figure=f,x=x/100,y=y/100,productIds=ids))
if not any(p['figure']==13 for p in points):points.append(dict(page=1,figure=13,x=236/700,y=413/778,productIds=['DEMO-BRG-1','DEMO-BRG-2']))
(root/'lib/hotspots.json').write_text(json.dumps(points,indent=2));d=pdf.open(art/'manufacturer.pdf');clip=pdf.Rect(d[0].get_image_info()[0]['bbox']);single=pdf.open();p=single.new_page(width=700,height=778);p.show_pdf_page(p.rect,d,0,clip=clip);single.save(art/'diagram.pdf',garbage=4,deflate=True);demo=pdf.open();meta=[]
for i,(w,h) in enumerate([(1100,778),(700,980),(800,800)]):
 p=demo.new_page(width=w,height=h);scale=min(w/700,h/778);dw,dh=700*scale,778*scale;x=(w-dw)/2;y=(h-dh)/2;rect=pdf.Rect(x,y,x+dw,y+dh);p.show_pdf_page(rect,single,0);meta.append(dict(width=w,height=h,x=x/w,y=y/h,w=dw/w,h=dh/h));p.get_pixmap(matrix=pdf.Matrix(.22,.22)).save(art/f'thumb-{i+1}.png')
demo.save(art/'demo.pdf',garbage=4,deflate=True);(root/'lib/pages.json').write_text(json.dumps(meta));print('Cached',len(rows),'products and',len(points),'figure targets')
