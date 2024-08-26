import type { Page } from "astro";
import slugify from "slugify";
import { createMemo, createSignal, onMount } from "solid-js";
import type { CoolSiteType } from "../schemas/coolSites";
import classNames from "../utils/classNames";
import CoolSitesItem from "./CoolSiteItem";
import CoolSitespirationsSearch from "./CoolSitesSearch";
import Pagination from "./Pagination";
import RoundedButton from "./RoundedButton";
import StuffSidebar from "./StuffSidebar";
import Tag from "./Tag";

type CoolSiteTagType = {
  name: string;
  slug: string;
  count: number;
};

function CoolSitesGrid({
  page,
  disableGrid = false,
  referrerUrl,
  selectedId,
  allCoolSites,
}: {
  page: Page<CoolSiteType>;
  disableGrid?: boolean;
  allCoolSites: CoolSiteType[];
  referrerUrl: string;
  selectedId?: CoolSiteType["id"];
}) {
  const [tags, setTags] = createSignal<string[]>([]);

  onMount(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tags = searchParams.get("tags");
    setTags(tags?.split(",") || []);
  });

  const filteredPage = createMemo(() => {
    if (tags().length === 0) return page;
    return {
      ...page,
      data: allCoolSites
        .filter((link) => {
          return link.tags.some((tag) =>
            tags().find(
              (t) =>
                slugify(t, { lower: true, strict: true }) ===
                slugify(tag, { lower: true, strict: true })
            )
          );
        })
        .slice(0, 48),
    };
  });

  const allTags = createMemo(() => {
    const tagsCountMap = new Map<string, number>();

    for (const link of allCoolSites) {
      for (const tg of link.tags) {
        tagsCountMap.set(tg, (tagsCountMap.get(tg) || 0) + 1);
      }
    }

    return [...tagsCountMap.entries()]
      .map(([tag, count]) => ({
        name: tag,
        slug: slugify(tag, { lower: true, strict: true }),
        count,
      }))
      .filter(({ count }) => count > 1)
      .sort((a, b) => {
        if (a.count > b.count) return -1;
        if (a.count < b.count) return 1;
        return a.name.localeCompare(b.name);
      });
  });

  const isTag = (slug: string) => (t: string) => {
    return slugify(t, { lower: true, strict: true }) === slug;
  };

  return (
    <>
      <StuffSidebar style="grid-area: left-sidebar;" position="left">
        <CoolSitespirationsSearch
          searchItems={allCoolSites}
          disabled={disableGrid}
        />
        <div className="flex flex-wrap gap-1 mt-4">
          {allTags().map(({ name, slug, count }) => {
            const isTagFn = isTag(slug);
            const isActive = !!tags().find(isTagFn);
            const otherTags = tags().filter((t) => !isTagFn(t));
            const linkTags = isActive ? otherTags : [...otherTags, slug];
            const basePath = `/cool-sites${page.currentPage === 1 ? "" : `/${page.currentPage}`}`;
            return (
              <Tag
                link={`${basePath}${linkTags.length > 0 ? `?tags=${linkTags.join(",")}` : ""}`}
                name={name}
                slug={slug}
                count={count}
                isActive={isActive}
              />
            );
          })}
        </div>
      </StuffSidebar>
      <div class="flex flex-col w-full">
        {filteredPage().data.length > 0 && (
          <ul
            aria-hidden={disableGrid ? "true" : "false"}
            aria-label="List of cool sites I like"
            class={classNames(
              `grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`,
              `gap-8 px-8 pt-8 pb-16 container mx-auto`,
              `min-h-[calc(100vh-174px)]`,
              disableGrid && `pointer-events-none`
            )}
          >
            {filteredPage().data.map((link) => {
              if (!link.thumbnail) return null;
              return (
                <CoolSitesItem
                  link={link}
                  class={classNames(
                    disableGrid && link.id === selectedId && `opacity-0`
                  )}
                  disabled={disableGrid}
                  referrerUrl={referrerUrl}
                />
              );
            })}
          </ul>
        )}
        {filteredPage().data.length === 0 && (
          <div class="flex flex-col items-center justify-center gap-4 text-center min-h-[calc(100vh-174px)]">
            <div className="flex flex-col gap-2">
              <p class="text-xl">No cool sites found with the selected tags:</p>
              <ul class="flex gap-0.5 items-start">
                {tags().map((tag) => (
                  <li>
                    <a
                      href={`/cool-sites/${page.currentPage === 1 ? "" : page.currentPage}?tags=${tag}`}
                      class="text-sm text-grayDark hover:text-fg"
                    >
                      {tag}
                    </a>
                  </li>
                ))}
              </ul>
              <RoundedButton
                url={`/cool-sites/${page.currentPage === 1 ? "" : page.currentPage}`}
              >
                Reset Tags
              </RoundedButton>
            </div>
          </div>
        )}
        <div
          class="py-6 border-t border-grayLight"
          aria-hidden={disableGrid ? "true" : "false"}
        >
          <Pagination
            length={page.lastPage}
            currentUrl={page.url.current}
            currentPage={page.currentPage}
            firstUrl={`/cool-sites`}
            prevUrl={page.url.prev}
            nextUrl={page.url.next}
            lastUrl={`/cool-sites/${page.lastPage}`}
            disabled={disableGrid}
          />
        </div>
      </div>
    </>
  );
}

export default CoolSitesGrid;
