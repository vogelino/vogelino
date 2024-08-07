import Fuse, { type FuseResultMatch } from "fuse.js";
import {
  For,
  type JSX,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import classNames, { cn } from "../utils/classNames";

function Search<ItemType extends Record<string, unknown>>({
  label = "Search",
  searchItems,
  searchOptions,
  disabled = false,
  renderResult,
}: {
  label?: string;
  searchItems: ItemType[];
  searchOptions: ConstructorParameters<typeof Fuse<ItemType>>[1];
  disabled?: boolean;
  renderResult: (
    item: ItemType,
    matches: readonly FuseResultMatch[] | undefined
  ) => JSX.Element;
}) {
  const [fuse] = createSignal(new Fuse(searchItems, searchOptions));
  const [query, setQuery] = createSignal("");
  const [isOpened, setIsOpened] = createSignal(false);
  // biome-ignore lint/style/useConst: <explanation>
  let parentRef: HTMLDivElement | undefined = undefined;
  // biome-ignore lint/style/useConst: <explanation>
  let inputRef: HTMLInputElement | undefined = undefined;

  function handleOnSearch({
    target = { value: "" },
  }: {
    target: { value: string };
  }) {
    const { value } = target;
    setQuery(value);
    setIsOpened(!!value);
  }

  const posts = createMemo(() => {
    return fuse().search(query()).slice(0, 6) || [];
  });

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && typeof document !== "undefined") {
      if (query() === "") return;
      focusSearch();
      setIsOpened(false);
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      focusSearch();
    }
  }

  function onKeyUp() {
    if (document.activeElement && document.activeElement !== document.body) {
      if (!parentRef?.contains(document.activeElement)) {
        setIsOpened(false);
      }
    }
  }

  function focusSearch() {
    inputRef?.focus();
  }

  onMount(() => {
    if (typeof document === "undefined" || disabled) return;
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    focusSearch();
  });
  onCleanup(() => {
    if (typeof document === "undefined" || disabled) return;
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
  });

  return (
    <div class="flex gap-x-4 flex-col gap-y-1" ref={parentRef}>
      <label>{label}</label>
      <div class="relative">
        <input
          ref={inputRef}
          type="text"
          value={query()}
          autofocus={!disabled}
          tabIndex={disabled ? "-1" : "0"}
          onInput={disabled ? undefined : handleOnSearch}
          onFocus={
            !disabled && posts().length > 0
              ? () => setIsOpened(true)
              : undefined
          }
          placeholder="Type to search..."
          class={cn(
            "rounded-md border border-grayMed bg-bg pt-3 px-3 pb-2",
            "text-base text-fg focusable w-full dark:bg-grayUltraLight",
            `md:pr-24`
          )}
        />
        <span
          class={classNames(
            "absolute top-2.5 right-2.5 hidden md:inline-flex items-center gap-0.5",
            "border border-grayLight rounded px-2 pt-0.5 -translate-y-[1px]",
            `text-grayDark pointer-events-none`
          )}
        >
          <kbd class="text-2xl leading-4">⌘</kbd>
          <kbd class="text-base font-bold">K</kbd>
        </span>
        {!disabled && query() && isOpened() && (
          <div
            class={classNames(
              "absolute top-full left-0 border-grayMed",
              "z-10 p-4 bg-bg border w-full rounded-md",
              "@container -translate-y-px shadow-lg",
              `dark:shadow-black/80`
            )}
          >
            {posts().length === 0 && (
              <p class="text-grayDark text-lg py-2">
                No results for <strong class="font-bold">{query()}</strong>
              </p>
            )}
            {posts().length > 0 && (
              <ul
                class={classNames(
                  `grid @[280px]:grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4`
                )}
              >
                <For each={posts()}>
                  {({ item, matches }) => renderResult(item, matches)}
                </For>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
