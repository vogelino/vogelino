const fetch = require("node-fetch");

module.exports = async (_req, res) => {
  if (!VERCEL_DEPLOY_HOOK_URL) return res.status(200).json({ success: true });
  const response = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
    },
    body: JSON.stringify({
      env: {
        BUILD_TYPE: "webhook",
      },
    }),
  });

  const result = await response.json();
  res.status(200).json({ success: true, result });
};
