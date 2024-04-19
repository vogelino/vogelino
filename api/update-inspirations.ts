import type { VercelRequest } from "@vercel/node";
import fetch from "node-fetch";
import zod from "zod";

const requestBodySchema = zod.object({
  webhookUrl: zod.string().url(),
});
type RequestBodySchemaType = zod.infer<typeof requestBodySchema>;

export async function POST(req: VercelRequest) {
  let reqBody: RequestBodySchemaType | undefined;
  try {
    reqBody = requestBodySchema.parse(req.body);
  } catch (err) {
    const { error, status } = getError(err, 400);
    const errorMessage = `Error parsing request body: ${error.message}`;
    return new Response(errorMessage, { status });
  }
  const authBearerToken = req.headers.authorization;
  if (!authBearerToken) {
    return new Response("Unauthorized", { status: 401 });
  }
  const response = await fetch(reqBody.webhookUrl, {
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
