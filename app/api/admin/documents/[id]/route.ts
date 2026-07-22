import { env } from "cloudflare:workers";
import { isStaticAdmin } from "../../../../static-admin-auth";
import { ensureDatabaseSchema } from "../../../../../db/runtime-schema";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
  if(!(await isStaticAdmin()))return Response.json({error:"Unauthorized"},{status:401});
  const db=(env as unknown as {DB?:D1Database}).DB,bucket=(env as unknown as {DOCUMENTS?:R2Bucket}).DOCUMENTS;
  if(!db||!bucket)return Response.json({error:"Document storage is unavailable."},{status:503});
  await ensureDatabaseSchema(db);
  const id=Number((await params).id);if(!Number.isInteger(id)||id<1)return Response.json({error:"Invalid document."},{status:400});
  const record=await db.prepare("SELECT storage_key,filename FROM documents WHERE id=?").bind(id).first<{storage_key:string;filename:string}>();
  if(!record)return Response.json({error:"Document not found."},{status:404});
  const object=await bucket.get(record.storage_key);if(!object)return Response.json({error:"Stored file not found."},{status:404});
  const headers=new Headers();object.writeHttpMetadata(headers);headers.set("content-disposition",`inline; filename*=UTF-8''${encodeURIComponent(record.filename)}`);headers.set("cache-control","private, no-store");return new Response(object.body,{headers});
}
