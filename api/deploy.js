const fetch = require("node-fetch");
const zod = require("zod");

const requestBodySchema = zod.object({
  webhookUrl: zod.string().url(),
});

module.exports = async (req, res) => {
  let reqBody;
  try {
    reqBody = await req.json();
  } catch (error) {
    const statusCode = error.status || 400;
    return res.status(statusCode).json({
      success: false,
      error: `Invalid request body: ${error.message}`,
    });
  }
  try {
    reqBody = requestBodySchema.parse(reqBody);
  } catch (error) {
    const statusCode = error.status || 400;
    return res.status(statusCode).json({
      success: false,
      error: `Invalid request body: ${error.message}`,
    });
  }
  const authBearerToken = req.headers.authorization;
  if (!authBearerToken) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }
  const response = await fetch(reqBody.webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authBearerToken}`,
    },
    body: JSON.stringify({ env: { BUILD_TYPE: "webhook" } }),
  });

  if (!response.ok) {
    return res.status(response.statusCode).json({
      success: false,
      error: `Failed to deploy: ${response.statusText}`,
    });
  }

  try {
    const result = await response.json();
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
