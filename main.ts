import Markdoc from 'https://esm.sh/@markdoc/markdoc'
import { serve } from "https://deno.land/std/http/server.ts";

async function handler(req: Request): Promise<Response> {

  const {pathname} = new URL(req.url)
  console.log(pathname)
  const container = await Deno.readTextFile('./index.html')
  
  let source; 

  try{
   source = await Deno.readTextFile(`./contents/${pathname.replace('/','')}.md`)
  }catch{
    source = await Deno.readTextFile('./contents/index.md')
  }
  
  const ast = Markdoc.parse(source);

  const content = Markdoc.transform(ast, /* config */);
  const html = Markdoc.renderers.html(content);

  return new Response(container.replace('{{ CONTENT }}', html), {
    headers:{
      "content-type": "text/html",
    }
  });
}

await serve(handler);



