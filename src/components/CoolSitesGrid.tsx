import slugify from 'slugify'
import { For, Show, createEffect, createMemo, createSignal } from 'solid-js'
import type { CoolSiteType } from '../schemas/coolSites'
import classNames from '../utils/classNames'
import CoolSitesItem from './CoolSiteItem'
import CoolSitespirationsSearch from './CoolSitesSearch'
import Pagination from './Pagination'
import RoundedButton from './RoundedButton'
import StuffSidebar from './StuffSidebar'
import Tag from './Tag'

function CoolSitesGrid({
	disableGrid = false,
	referrerUrl: initialReferrerUrl,
	selectedId,
	allCoolSites,
	initialPage = 1,
	initialLeftSidebarOpen = true,
	initialTags = [],
}: {
	disableGrid?: boolean
	allCoolSites: CoolSiteType[]
	referrerUrl: string
	selectedId?: CoolSiteType['id']
	initialPage?: number
	initialLeftSidebarOpen?: boolean
	initialTags?: string[]
}) {
	const [tags, setTags] = createSignal<string[]>(initialTags)
	const [tagOperator, setTagOperator] = createSignal<'AND' | 'OR'>('OR')
	const [page, setPage] = createSignal<number>(initialPage)
	const [searchResults, setSearchResults] = createSignal<CoolSiteType[] | null>(null)
	const [referrerUrl, setReferrerUrl] = createSignal(initialReferrerUrl)
	const itemsPerPage = 48

	const sitesByTags = createMemo(() => {
		if (tags().length === 0) return allCoolSites
		return filterByTags(allCoolSites, tags(), tagOperator())
	})

	const dataToRender = createMemo(() =>
		searchResults() ? filterByTags(searchResults()!, tags(), tagOperator()) : sitesByTags()
	)

	const totalItems = createMemo(() => dataToRender().length)

	const lastPage = createMemo(() => Math.ceil(totalItems() / itemsPerPage))

	const currentPageData = createMemo(() => {
		return dataToRender().slice(
			(page() - 1 >= 0 ? page() - 1 : 0) * itemsPerPage,
			page() * itemsPerPage
		)
	})

	const allTags = createMemo(() => {
		const tagsCountMap = new Map<string, number>()

		for (const link of allCoolSites) {
			for (const tg of link.tags) {
				tagsCountMap.set(tg, (tagsCountMap.get(tg) || 0) + 1)
			}
		}

		return [...tagsCountMap.entries()]
			.map(([name, count]) => {
				const slug = slugify(name, { lower: true, strict: true })
				return {
					name,
					slug,
					count,
					isActive: !!tags().find((t) => slugify(t, { lower: true, strict: true }) === slug),
				}
			})
			.filter(({ count }) => count >= 5)
			.sort((a, b) => {
				if (a.count > b.count) return -1
				if (a.count < b.count) return 1
				return a.name.localeCompare(b.name)
			})
	})

	createEffect(() => {
		const url = new URL(window.location.toString())
		url.searchParams.set('tags', tags().join(','))
		url.searchParams.set('page', `${Math.max(1, page())}`)
		// Shallow update of the url without reloading
		window.history.pushState(null, '', `/cool-sites?${url.searchParams.toString()}`)
		setReferrerUrl(url.toString())
	})

	createEffect(() => {
		if (page() > lastPage()) setPage(Math.max(1, lastPage()))
	})

	return (
		<>
			<StuffSidebar
				style="grid-area: left-sidebar;"
				position="left"
				defaultOpen={initialLeftSidebarOpen}
			>
				<CoolSitespirationsSearch
					searchItems={allCoolSites}
					disabled={disableGrid}
					onSearch={(results) => {
						setPage(1)
						setSearchResults(results)
					}}
				/>
				<div class="flex flex-col gap-2 mt-6 pt-4 border-t border-grayLight">
					<nav class="flex gap-4 flex-wrap justify-between items-center">
						<div class="flex gap-2 items-center pt-1.5">
							<button
								type="button"
								onClick={() => {
									const allAlreadySelected = tags().length === allTags().length
									setTags(allAlreadySelected ? [] : allTags().map(({ slug }) => slug))
								}}
							>
								All/None
							</button>
						</div>
						<div class="flex item-center bg-grayUltraLight rounded-full">
							<button
								type="button"
								onClick={() => setTagOperator('OR')}
								class={classNames(
									'px-3 pt-1.5 pb-0.5 rounded-full bg-grayUltraLight transition',
									tagOperator() === 'OR' && 'font-bold bg-alt text-fg'
								)}
							>
								OR
							</button>
							<button
								type="button"
								onClick={() => setTagOperator('AND')}
								class={classNames(
									'px-2 pt-1 pb-0.5 rounded-full bg-grayUltraLight transition',
									tagOperator() === 'AND' && 'font-bold bg-alt text-fg'
								)}
							>
								AND
							</button>
						</div>
					</nav>
					<div class="flex flex-wrap gap-1 mt-2">
						{allTags().map((item) => {
							const otherTags = tags()
								.filter((t) => slugify(t, { lower: true, strict: true }) !== item.slug)
								.map((t) => t.trim())
								.filter(Boolean)
							return (
								<Tag
									name={item.name}
									slug={item.slug}
									count={item.count}
									isActive={item.isActive}
									onClick={() => {
										setTags(item.isActive ? otherTags : [...otherTags, item.slug])
										setPage(1)
									}}
								/>
							)
						})}
					</div>
				</div>
			</StuffSidebar>
			<div class="flex flex-col w-full">
				<Show when={currentPageData().length > 0}>
					<div class="flex flex-col min-h-screen">
						<ul
							aria-hidden={disableGrid ? 'true' : 'false'}
							aria-label="List of cool sites I like"
							class={classNames(
								`grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`,
								`gap-8 px-8 pt-8 pb-16 container mx-auto`,
								disableGrid && `pointer-events-none`
							)}
						>
							{currentPageData().map((link) => {
								if (!link.thumbnail) return null
								return (
									<CoolSitesItem
										link={link}
										class={classNames(disableGrid && link.id === selectedId && `opacity-0`)}
										disabled={disableGrid}
										referrerUrl={referrerUrl()}
									/>
								)
							})}
						</ul>
					</div>
				</Show>

				<Show when={currentPageData().length === 0}>
					<div class="flex flex-col items-center justify-center gap-4 text-center min-h-[calc(100vh-174px)]">
						<div class="flex flex-col gap-2">
							<p class="text-xl">
								No cool sites found with{' '}
								<Show when={searchResults()}>the current search query</Show>
								<Show when={tags().length > 0}>
									<Show when={searchResults()}>{' and '}</Show>
									<Show when={tagOperator() === 'AND'} fallback="any">
										all
									</Show>{' '}
									of the following tags:
								</Show>
							</p>
							<ul class="flex gap-0.5 items-start max-w-md flex-wrap">
								<For each={tags()}>{(tag) => <Tag name={tag} slug={toSlug(tag)} />}</For>
							</ul>
							<RoundedButton onClick={() => setTags([])}>{() => 'Reset Tags'}</RoundedButton>
						</div>
					</div>
				</Show>
				<Show when={dataToRender().length > itemsPerPage}>
					<div class="py-6 border-t border-grayLight" aria-hidden={disableGrid ? 'true' : 'false'}>
						<Pagination
							totalItems={totalItems}
							itemsPerPage={itemsPerPage}
							currentPage={page}
							disabled={disableGrid}
							onPageChange={setPage}
						/>
					</div>
				</Show>
			</div>
		</>
	)
}

export default CoolSitesGrid

function filterByTags(coolSites: CoolSiteType[], tags: string[], operator: 'AND' | 'OR') {
	const cleanedUpTags = tags.map(toSlug).filter(Boolean)
	if (cleanedUpTags.length === 0) return coolSites
	const filtered = coolSites.filter((link) => {
		if (operator === 'AND') return cleanedUpTags.every((tag) => link.tags.map(toSlug).includes(tag))
		return link.tags.some((tag) => cleanedUpTags.includes(toSlug(tag)))
	})
	return filtered
}

const toSlug = (str: string) => slugify(str, { lower: true, strict: true })
