import Markdoc from 'https://esm.sh/@markdoc/markdoc'
import { serve } from "https://deno.land/std/http/server.ts";
import { serveFile } from "https://deno.land/std/http/file_server.ts";

async function handler(req: Request): Promise<Response> {

  const {pathname} = new URL(req.url)
  console.log(pathname)

  if(pathname.includes('/public/')){
      
    console.log('serve file')
    return await serveFile(req, `.${pathname}`);
  }

  const container = await Deno.readTextFile('./index.html')
  
  let source; 

  try{
   source = await Deno.readTextFile(`./contents/${pathname.replace('/','')}.md`)
  }catch{
    source = await Deno.readTextFile('./contents/index.md')
  }
  
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast, /* config */);
  const meta = {}

  content.children.slice(0,3).forEach(element => {
      
    if(element.name === "p" && element.children[0]?.name === 'img'){
      const img_node = element.children[0]
      meta[img_node?.name] = img_node.attributes.src
    }else{
      meta[element.name] = element.children[0]
    }
  

  })

  console.log(meta)
  const html = Markdoc.renderers.html(content);

  return new Response(container
    .replace('{{ CONTENT }}', html)
    .replaceAll('{{TITLE}}',meta['h1'])
    .replaceAll('{{DESC}}',meta['p'])
    .replaceAll('{{IMG}}',meta['img']), {
    headers:{
      "content-type": "text/html",
    }
  });
}

await serve(handler);



