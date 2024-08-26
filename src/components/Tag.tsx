import classNames from "../utils/classNames";

function Tag(tag: {
  name: string;
  slug: string;
  count: number;
  link: string;
  isActive: boolean;
  onClick: (evt: MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      class={classNames(
        `px-2.5 pt-[0.2rem] leading-tight bg-grayUltraLight text-grayDark`,
        `text-sm rounded-full focusable hover-hover:hover:bg-fg hover-hover:hover:text-alt`,
        `transition w-fit`,
        tag.isActive && `bg-alt text-fg`
      )}
      onClick={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        tag.onClick(evt);
      }}
    >
      {tag.name}
      <span class="text-xs ml-2 opacity-50">{tag.count}</span>
    </button>
  );
}

export default Tag;
