export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    databaseUrl: process.env.DATABASE_URL,
    env: process.env.VERCEL_ENV,
    nodeVersion: process.version,
    region: process.env.VERCEL_REGION,
  });
}
