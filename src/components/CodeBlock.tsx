function CodeBlock({ code }: { code: string }) {
  return <div innerHTML={code} class="p-6 w-full min-h-full" />;
}

export default CodeBlock;
