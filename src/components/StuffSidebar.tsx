import { SidebarCloseIcon, SidebarOpenIcon } from "lucide-solid";
import { createEffect, createMemo, createSignal } from "solid-js";
import classNames from "../utils/classNames";

function updateSidebarWidth() {}

function StuffSidebar({
  defaultOpen = false,
  position = "left",
  class: className,
  style,
  children,
}: {
  defaultOpen?: boolean;
  position?: "left" | "right";
  class?: string;
  style?: string;
  children?: Element;
}) {
  const [isOpened, setIsOpened] = createSignal(defaultOpen);

  const showSidebarLeftOpenIcon = createMemo(() => {
    const isOpenedAndLeft = isOpened() && position === "left";
    const isClosedAndRight = isOpened() === false && position === "right";
    return isOpenedAndLeft || isClosedAndRight;
  });

  const showSidebarRightOpenIcon = createMemo(() => {
    const isOpenedAndRight = isOpened() && position === "right";
    const isClosedAndLeft = isOpened() === false && position === "left";
    return isOpenedAndRight || isClosedAndLeft;
  });

  createEffect(() => {
    const mainContainer = document.getElementById("main-container");
    if (!mainContainer) return;
    mainContainer.style.setProperty(
      `--${position}-sidebar-width`,
      `${isOpened() ? "min(20rem,100vw)" : "4rem"}`
    );
  });
  return (
    <aside
      class={classNames(
        "relative h-full",
        isOpened() ? "w-[min(20rem,100vw)]" : "w-16",
        "transition-all ease-in-out-extreme duration-500 flex flex-col gap-6",
        position === "left" && "shadow-[inset_-1px_0_0_0_var(--grayMed)]",
        position === "right" && "shadow-[inset_1px_0_0_0_var(--grayMed)]"
      )}
    >
      <div
        class={classNames(
          "w-[min(20rem,100vw)]  overflow-x-clip overflow-y-auto",
          "transition-all ease-in-out-extreme duration-500 h-full",
          "flex flex-col gap-6 py-4 px-3",
          isOpened() && "px-6",
          className
        )}
        style={classNames(style)}
      >
        <button
          type="button"
          class={classNames(
            "inline-flex items-center rounded-full px-2 py-1.5 bg-bg text-grayDark",
            "hover-hover:hover:bg-grayLight hover-hover:hover:text-fg w-fit",
            "items-center justify-center transition duration-500 ease-in-out-extreme",
            isOpened() && "-translate-x-2"
          )}
          onClick={() => setIsOpened(!isOpened())}
        >
          {showSidebarLeftOpenIcon() && <SidebarCloseIcon />}
          {showSidebarRightOpenIcon() && <SidebarOpenIcon />}
          <span
            class={classNames(
              "inline-block whitespace-nowrap pt-1 overflow-clip",
              "transition-all ease-in-out-extreme duration-500",
              "text-left",
              isOpened() ? "w-40 pl-2" : "w-0 opacity-0"
            )}
          >
            Collapse sidebar
          </span>
        </button>
        {children && (
          <div
            class={classNames(
              "h-full transition-opacity ease-in-out-extreme duration-500",
              isOpened() ? "opacity-100" : "opacity-0"
            )}
          >
            {children}
          </div>
        )}
      </div>
      {position === "left" && (
        <span
          aria-hidden="true"
          class={classNames(
            "absolute left-0 top-0 w-[3px] h-40 pointer-events-none",
            "bg-gradient-to-b from-bg to-transparent z-20",
            "-translate-x-[2px] transition-all ease-in-out-extreme duration-500",
            isOpened()
              ? "translate-x-[calc(min(20rem,100vw)-1px)] opacity-0"
              : "translate-x-[calc(4rem-1px)] opacity-100"
          )}
        />
      )}
    </aside>
  );
}

export default StuffSidebar;
