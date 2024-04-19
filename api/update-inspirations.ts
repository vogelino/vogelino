import fetch from "node-fetch";
import zod from "zod";

const requestBodySchema = zod.object({
  webhookUrl: zod.string().url(),
});
type RequestBodySchemaType = zod.infer<typeof requestBodySchema>;

export async function POST(req: Request, res: Response) {
  let reqBody: RequestBodySchemaType | undefined;
  try {
    reqBody = await req.json();
    reqBody = requestBodySchema.parse(reqBody);
  } catch (err) {
    const { error, status } = getError(err, 400);
    const resBody = {
      status,
      statusText: `Invalid request body: ${error.message}`,
    };
    return new Response(JSON.stringify(resBody), resBody);
  }
  const authBearerToken = req.headers.get("Authorization");
  if (!authBearerToken) {
    const resBody = { status: 401, statusText: "Unauthorized" };
    return new Response(JSON.stringify(resBody), resBody);
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
    const resBody = { status, statusText: error.message };
    return new Response(JSON.stringify(resBody), resBody);
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
