import type { CoolSiteType } from "../schemas/coolSites";
import classNames from "../utils/classNames";

function CoolSiteThumbnail({ link }: { link: CoolSiteType }) {
  if (!link.thumbnail) return null;
  return (
    <span class="relative block aspect-[140/73] bg-grayUltraLight rounded overflow-hidden border border-grayLight">
      <img
        src={link.thumbnail.src}
        width={link.thumbnail.width}
        height={link.thumbnail.height}
        alt={`Cover thumbnail of "${link.title}"`}
        class={classNames(
          `w-full aspect-[140/73] rounded object-cover`,
          `transition-transform hover-hover:group-hover:scale-110`,
          `motion-reduce:transition-none`,
          `motion-reduce:hover-hover:group-hover:scale-100`
        )}
      />
      <span class="absolute inset-0 pointer-events-none bg-grayUltraLight dark:bg-zinc-100 mix-blend-multiply opacity-50 dark:opacity-0" />
    </span>
  );
}

export default CoolSiteThumbnail;
