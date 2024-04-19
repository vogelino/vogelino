import fetch from "node-fetch";
import zod from "zod";

const requestBodySchema = zod.object({
  webhook_url: zod.string().url(),
});
type RequestBodySchemaType = zod.infer<typeof requestBodySchema>;

export const config = {
  runtime: "edge",
};

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const webhook_url = searchParams.get("webhook_url");
  try {
    zod.string().url().parse(webhook_url);
  } catch (err) {
    const { error, status } = getError(err, 400);
    const errorMessage = `Error parsing webhook_url: ${error.message}`;
    return new Response(errorMessage, { status });
  }
  const authBearerToken = req.headers.get("Authorization");
  if (!authBearerToken) {
    return new Response("Unauthorized", { status: 401 });
  }
  console.log("webhook_url", webhook_url);
  console.log("authorization", authBearerToken);
  const response = await fetch(webhook_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authBearerToken,
    },
    body: JSON.stringify({
      env: { BUILD_TYPE: "webhook" },
      event_type: "update-inspirations",
    }),
  });

  if (!response.ok) return response;

  try {
    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    const { status, error } = getError(err, 500);
    return new Response(`Error: ${error.message}`, { status });
  }
}

function getError(err: unknown, fallbackStatus: number) {
  const error = err instanceof Error ? err : new Error();
  const status =
    "status" in error && typeof error.status === "number"
      ? error.status
      : fallbackStatus;
  return { error, status };
}
