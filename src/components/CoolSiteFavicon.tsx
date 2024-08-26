import type { CoolSiteType } from "../schemas/coolSites";
import classNames from "../utils/classNames";
import { getFaviconUrl } from "../utils/getFaviconUrl";

function CoolSitesFavicon({
  link,
  class: className,
  size = 16,
}: {
  link: CoolSiteType;
  class?: string;
  size?: number;
}) {
  return (
    <span
      class={classNames(
        "inline-block relative mt-0.5 rounded overflow-hidden bg-zinc-100 bg-cover bg-center leading-4",
        className
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {link.favicon && (
        <img
          alt={`Favicon of "${link.title}"`}
          class="absolute inset-0 object-cover"
          src={link.favicon.src}
          width={link.favicon.width}
          height={link.favicon.height}
        />
      )}
      {!link.favicon && (
        <img
          alt={`Favicon of "${link.title}"`}
          class="absolute inset-0 object-cover"
          src={getFaviconUrl({ url: link.url })}
          width={size}
          height={size}
        />
      )}
    </span>
  );
}

export default CoolSitesFavicon;
