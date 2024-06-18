import Fuse from 'fuse.js'
import { For, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import type { InspirationType } from '../schemas/inspirations'
import classNames, { cn } from '../utils/classNames'

type SearchOptionsType = ConstructorParameters<typeof Fuse<InspirationType>>[1]
const options: SearchOptionsType = {
	keys: ['title', 'tags'],
	includeMatches: true,
	minMatchCharLength: 2,
	threshold: 0.5,
}

function InspirationsSearch({
	searchItems,
	disabled = false,
}: {
	searchItems: InspirationType[]
	disabled?: boolean
}) {
	const [fuse] = createSignal(new Fuse(searchItems, options))
	const [query, setQuery] = createSignal('')
	const [isOpened, setIsOpened] = createSignal(false)
	// biome-ignore lint/style/useConst: <explanation>
	let parentRef: HTMLDivElement | undefined = undefined
	// biome-ignore lint/style/useConst: <explanation>
	let inputRef: HTMLInputElement | undefined = undefined

	function handleOnSearch({
		target = { value: '' },
	}: {
		target: { value: string }
	}) {
		const { value } = target
		setQuery(value)
		setIsOpened(!!value)
	}

	const posts = createMemo(() => {
		return fuse().search(query()).slice(0, 6) || []
	})

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape' && typeof document !== 'undefined') {
			if (query() === '') return
			focusSearch()
			setIsOpened(false)
		}
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault()
			focusSearch()
		}
	}

	function onKeyUp() {
		if (document.activeElement && document.activeElement !== document.body) {
			if (!parentRef?.contains(document.activeElement)) {
				setIsOpened(false)
			}
		}
	}

	function focusSearch() {
		inputRef?.focus()
	}

	onMount(() => {
		if (typeof document === 'undefined' || disabled) return
		document.addEventListener('keydown', onKeyDown)
		document.addEventListener('keyup', onKeyUp)
		focusSearch()
	})
	onCleanup(() => {
		if (typeof document === 'undefined' || disabled) return
		document.removeEventListener('keydown', onKeyDown)
		document.removeEventListener('keyup', onKeyUp)
	})

	return (
		<div class="flex gap-x-4 flex-col gap-y-1 h-full justify-end" ref={parentRef}>
			<label>Search sites</label>
			<div class="relative">
				<input
					ref={inputRef}
					type="text"
					value={query()}
					autofocus={!disabled}
					tabIndex={disabled ? '-1' : '0'}
					onInput={disabled ? undefined : handleOnSearch}
					onFocus={!disabled && posts().length > 0 ? () => setIsOpened(true) : undefined}
					placeholder="Type to search..."
					class={cn(
						'rounded-md border border-grayMed bg-bg pt-3 px-3 pb-2',
						'text-base text-fg focusable w-full dark:bg-grayUltraLight',
						`md:pr-24`
					)}
				/>
				<span
					class={classNames(
						'absolute top-2.5 right-2.5 hidden md:inline-flex items-center gap-0.5',
						'border border-grayLight rounded px-2 pt-0.5 -translate-y-[1px]',
						`text-grayDark pointer-events-none`
					)}
				>
					<kbd class="text-2xl leading-4">⌘</kbd>
					<kbd class="text-base font-bold">K</kbd>
				</span>
				{!disabled && query() && isOpened() && (
					<div
						class={classNames(
							'absolute top-full left-0 border-grayMed',
							'z-10 p-4 bg-bg border w-full rounded-md',
							'@container -translate-y-px shadow-lg',
							`dark:shadow-black/80`
						)}
					>
						{posts().length === 0 && (
							<p class="text-grayDark text-lg py-2">
								No results for <strong class="font-bold">{query()}</strong>
							</p>
						)}
						{posts().length > 0 && (
							<ul class={classNames(`grid @[280px]:grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4`)}>
								<For each={posts()}>
									{({ item, matches }) => {
										const filteredTagMatches = matches?.filter((match) => match.key === 'tags')
										return (
											<li>
												<a
													href={`/inspirations/${item.id}`}
													class={cn(`flex flex-col gap-1 focusable p-2 rounded`)}
												>
													<img
														src={item.thumbnail?.src}
														alt={item.title}
														class="w-full aspect-140/73 bg-grayUltraLight border border-grayLight rounded"
													/>
													<div class="flex gap-3 items-center mt-1">
														<span
															class={classNames(
																'inline-block relative rounded overflow-clip bg-grayUltraLight bg-cover bg-center',
																'shrink-0 grow-0 h-4 w-4 flex justify-center items-center'
															)}
														>
															<img
																src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=${item.url}`}
																alt={`Favicon of "${item.title}"`}
																width={16}
																height={16}
															/>
														</span>
														<div>{item.title}</div>
													</div>
													{filteredTagMatches?.length && (
														<ul class="flex flex-wrap gap-x-1.5 gap-y-1 -mt-1 mb-2 pl-7 -ml-1">
															<For each={filteredTagMatches}>
																{(match) => (
																	<li
																		class={classNames(
																			'inline-block px-1 pb-0 pt-0.5 bg-grayUltraLight',
																			'text-xs text-grayDark'
																		)}
																	>
																		{match.value}
																	</li>
																)}
															</For>
														</ul>
													)}
												</a>
											</li>
										)
									}}
								</For>
							</ul>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default InspirationsSearch
