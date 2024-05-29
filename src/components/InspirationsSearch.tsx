import Fuse from 'fuse.js'
import { For, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import type { InspirationType } from '../schemas/inspirations'
import classNames, { cn } from '../utils/classNames'

const options = {
	keys: ['title'],
	includeMatches: true,
	minMatchCharLength: 2,
	threshold: 0.5,
}

function InspirationsSearch({
	searchItems,
}: {
	searchItems: InspirationType[]
}) {
	const [fuse] = createSignal(new Fuse(searchItems, options))
	const [query, setQuery] = createSignal('')
	const [isOpened, setIsOpened] = createSignal(false)

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
		return (
			fuse()
				.search(query())
				.map((result) => result.item)
				.slice(0, 5) || []
		)
	})

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape' && typeof document !== 'undefined') {
			const input = document.getElementById('inspirations-search-input') as HTMLInputElement
			if (query() === '') return
			input?.focus()
			setIsOpened(false)
		}
		// if statement when meta + f or meta + k or ctrl + f or ctrl + k is pressed
		if ((event.metaKey || event.ctrlKey) && (event.key === 'f' || event.key === 'k')) {
			event.preventDefault()
			const input = document.getElementById('inspirations-search-input') as HTMLInputElement
			input?.focus()
		}
	}

	function onKeyUp(event: KeyboardEvent) {
		if (document.activeElement && document.activeElement !== document.body) {
			const parent = document.getElementById('inspirations-search')
			if (!parent?.contains(document.activeElement)) {
				setIsOpened(false)
			}
		}
	}

	onMount(() => {
		if (typeof document === 'undefined') return
		document.addEventListener('keydown', onKeyDown)
		document.addEventListener('keyup', onKeyUp)
	})
	onCleanup(() => {
		if (typeof document === 'undefined') return
		document.removeEventListener('keydown', onKeyDown)
		document.removeEventListener('keyup', onKeyUp)
	})

	return (
		<div class="flex gap-x-4 flex-col gap-y-1 h-full justify-end" id="inspirations-search">
			<label>Search sites</label>
			<div class="relative">
				<input
					id="inspirations-search-input"
					type="text"
					value={query()}
					onInput={handleOnSearch}
					onFocus={posts().length > 0 ? () => setIsOpened(true) : undefined}
					placeholder="Type to search..."
					class={cn(
						'rounded-md border border-grayMed bg-bg pt-3 px-3 pb-2',
						'text-base text-fg focusable w-full dark:bg-grayUltraLight'
					)}
				/>
				{query() && isOpened() && (
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
									{(post, index) => (
										<li>
											<a
												href={`/inspirations/${post.id}`}
												class={cn(`flex flex-col gap-1 focusable p-2 rounded`)}
											>
												<img
													src={post.thumbnail?.src}
													alt={post.title}
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
															src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=${post.url}`}
															alt={`Favicon of "${post.title}"`}
															width={16}
															height={16}
														/>
													</span>
													<span>{post.title}</span>
												</div>
											</a>
										</li>
									)}
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
