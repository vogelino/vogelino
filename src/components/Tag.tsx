import classNames from "../utils/classNames";

function Tag(tag: {
  name: string;
  slug: string;
  count: number;
  link: string;
  isActive: boolean;
}) {
  return (
    <a
      href={tag.link}
      title={`Tag: ${tag.name}`}
      class={classNames(
        `px-2.5 pt-[0.2rem] leading-tight bg-grayUltraLight text-grayDark`,
        `text-sm rounded-full focusable hover-hover:hover:bg-fg hover-hover:hover:text-alt`,
        `transition w-fit`,
        tag.isActive && `bg-alt text-fg`
      )}
    >
      {tag.name}
      <span class="text-xs ml-2 opacity-50">{tag.count}</span>
    </a>
  );
}

export default Tag;
