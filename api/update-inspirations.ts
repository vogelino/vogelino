import type { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";
import zod from "zod";

const requestBodySchema = zod.object({
  webhookUrl: zod.string().url(),
});
type RequestBodySchemaType = zod.infer<typeof requestBodySchema>;

export async function POST(req: VercelRequest, res: VercelResponse) {
  let reqBody: RequestBodySchemaType | undefined;
  try {
    reqBody = requestBodySchema.parse(req.body);
  } catch (err) {
    const { error, status } = getError(err, 400);
    return res.status(status).json({
      error: `Invalid request body: ${error.message}`,
    });
  }
  const authBearerToken = req.headers.authorization;
  if (!authBearerToken) return res.status(401).json({ error: "Unauthorized" });
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
    return res.status(200).json(result);
  } catch (err) {
    const { status, error } = getError(err, 500);
    return res.status(status).json({ error: error.message });
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
