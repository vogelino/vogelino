const LINE = `--------------------------------`;
const DOTTED_LINE = LINE.split("")
  .map((char, idx) => (idx % 2 ? char : " "))
  .join("");

export const log = (text: string) => {
  console.log(text);
};

export const logLine = () => {
  log(LINE);
};

export const logDottedLine = () => {
  log(DOTTED_LINE);
};

export const logIndented = (text: string, depth = 0) => {
  const indentation = [...Array(depth)].map(() => `   `).join("");
  log(`${indentation}-> ${text}`);
};

export const logH1 = (text: string) => {
  logLine();
  log(text.toUpperCase());
};

export const logSummary = (title: string, list: string[]) => {
  logH1(title);
  list.forEach(logIndented);
};

export const logSecondary = (list: string[]) => {
  logDottedLine();
  list.forEach(log);
};

export const logEnd = () => {
  logLine();
  logH1("F I N I S H E D");
};
