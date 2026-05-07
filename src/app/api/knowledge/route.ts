import masterList from "../../../../master-list.md";
import instructions from "../../../../conan-agent-instructions.md";

const files: Record<string, string> = {
  "master-list.md": masterList,
  "conan-agent-instructions.md": instructions,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (!file || !files[file]) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return new Response(files[file], {
    headers: { "Content-Type": "text/markdown", "Access-Control-Allow-Origin": "*" },
  });
}
