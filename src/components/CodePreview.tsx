import { For, type JSXElement, createMemo, createSignal } from "solid-js";
import classNames from "../utils/classNames";
import CodeBlock from "./CodeBlock";

type CodeTab = {
  name: string;
  id: string;
  codeHtmlString: string;
};

function CodePreview({
  children,
  codeTabs = [],
}: {
  children: JSXElement;
  codeTabs?: CodeTab[];
}) {
  const [activeTabId, setActiveTab] = createSignal("preview");
  const rawTabs = [
    {
      name: "Preview",
      id: "preview",
    },
    ...codeTabs,
  ];
  const tabs = createMemo(() =>
    rawTabs.map((tab) => ({ ...tab, isActive: activeTabId() === tab.id }))
  );
  return (
    <div class="py-6 overflow-clip rounded-xl">
      <div
        class={classNames(
          "grid grid-cols-1 grid-rows-[1fr,auto] w-full rounded-xl bg-grayUltraLight",
          "border border-grayLight min-h-[calc(100svh-18rem)]"
        )}
      >
        <div class="relative">
          <For each={tabs()}>
            {(tab) => {
              if (!tab.isActive) return null;
              if ("codeHtmlString" in tab)
                return <CodeBlock code={tab.codeHtmlString} />;
              return children;
            }}
          </For>
        </div>
        <nav>
          <ul
            class={classNames(
              "flex shadow-[inset_0_1px_0_0_var(--grayMed),inset_0rem_0.5rem_1.7rem_0_rgba(0,0,0,0.1)]",
              "dark:shadow-[inset_0_1px_0_0_var(--grayMed),inset_0rem_0.5rem_1.7rem_0_rgba(0,0,0,0.5)]",
              "rounded-b-xl overflow-y-clip overflow-x-auto"
            )}
          >
            <For each={tabs()}>
              {(tab) => {
                return (
                  <li class="-ml-px group">
                    <button
                      type="button"
                      class={classNames(
                        "px-4 py-2 border border-b-0 border-transparent transition-all text-grayDark",
                        !tab.isActive &&
                          classNames(
                            "hover-hover:hover:bg-grayLight hover-hover:hover:border-grayMed",
                            "border-r-grayLight group-last-of-type:border-r-transparent",
                            "group-last-of-type:hover-hover:hover:border-r-grayMed"
                          ),
                        tab.isActive &&
                          "bg-grayUltraLight border-grayMed group-first-of-type:border-l-transparent cursor-default border-t-grayUltraLight"
                      )}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.name}
                    </button>
                  </li>
                );
              }}
            </For>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default CodePreview;
