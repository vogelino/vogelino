import type { CoolSiteType } from "../schemas/coolSites";
import classNames from "../utils/classNames";
import CoolSiteFavicon from "./CoolSiteFavicon";
import CoolSiteThumbnail from "./CoolSiteThumbnail";
import ExternalLink from "./icons/ExternalLink";

function CoolSitesItem({
  link,
  class: className,
  disabled = false,
  referrerUrl,
}: {
  link: CoolSiteType;
  class?: string;
  disabled?: boolean;
  referrerUrl?: string;
}) {
  const linkUrl = new URL(link.url);
  referrerUrl && linkUrl.searchParams.set("ref", referrerUrl);
  const linkWithRef = linkUrl.toString();
  return (
    <li
      data-hk={`cool-site-${link.id}`}
      aria-label={`Cool site permalink: "${link.title}" (${link.url})`}
      class={classNames("relative group @container", className)}
      style={{
        "view-transition-name": `cool-site-${link.id}`,
      }}
    >
      <a
        href={`/cool-sites/${link.id}`}
        title={`Cool site permalink: "${link.title}" (${link.url})`}
        tabindex={disabled ? "-1" : "0"}
        class={classNames(
          `flex flex-col gap-4 group h-fit`,
          `focus-visible:ring-2 focus-visible:ring-fg outline-none`,
          `focus-visible:overflow-hidden focus-visible:rounded-lg`,
          `focus-visible:ring-offset-8 focus-visible:ring-offset-bg`
        )}
      >
        <CoolSiteThumbnail link={link} />
        <div class="grid grid-cols-[1rem,1fr] gap-3">
          <CoolSiteFavicon link={link} />
          <h3 class="inline-block leading-tight pr-8 truncate">
            <span
              class={classNames(
                `px-3 -ml-2 py-2 rounded-full`,
                `hover-hover:group-hover:bg-alt`,
                `transition-colors motion-reduce:transition-none`
              )}
            >
              {link.title}
            </span>
          </h3>
        </div>
      </a>
      <a
        href={linkWithRef}
        title={`Direct external link to the cool site: "${link.title} (${link.url})"`}
        target="_blank"
        rel="noopener nofollow noreferrer"
        tabindex={disabled ? "-1" : "0"}
        class={classNames(
          // the top value represents the width of the container
          `top-[55cqw] right-0`,
          `absolute`,
          `hover-hover:opacity-0`,
          `hover-hover:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity`,
          `focusable p-2 rounded-full`
        )}
      >
        <ExternalLink className="w-5 h-5" />
      </a>
    </li>
  );
}

export default CoolSitesItem;
