import { readFileSync } from "fs";
import { join } from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  const allowed = ["master-list.md", "conan-agent-instructions.md"];
  if (!file || !allowed.includes(file)) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const content = readFileSync(join(process.cwd(), file), "utf-8");
  return new Response(content, {
    headers: { "Content-Type": "text/markdown", "Access-Control-Allow-Origin": "*" },
  });
}
