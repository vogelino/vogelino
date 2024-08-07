import type { ZodError } from "zod";

export function logZodErrorToTerminal(
  error: ZodError,
  item: Record<string, unknown>
) {
  const name =
    typeof item === "object" &&
    item !== null &&
    ("title" in item || "id" in item)
      ? item.title || item.id
      : "Unknown Item";
  console.log("\n\n––––––––––––––––––––––––––");
  console.log(`Parsing Error for "${name}":`);
  for (const issue of error.issues) {
    const formattedIssueMessage = ` - ${issue.path.join(".")}: ${issue.message}`;
    console.log(formattedIssueMessage);
  }
  console.log("––––––––––––––––––––––––––\n\n");
}
