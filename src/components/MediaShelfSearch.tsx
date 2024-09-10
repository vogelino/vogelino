import { For } from 'solid-js'
import type { MediaShelfType } from '../schemas/mediaShelf'
import classNames, { cn } from '../utils/classNames'
import Search from './Search'

function MediaShelfSearch({
	searchItems,
	disabled = () => false,
}: {
	searchItems: MediaShelfType[]
	disabled?: () => boolean
}) {
	return (
		<Search
			label="Search media"
			searchItems={searchItems}
			disabled={disabled}
			searchOptions={{
				keys: ['title', 'tags'],
				includeMatches: true,
				minMatchCharLength: 2,
				threshold: 0.5,
			}}
			renderResult={(item, matches) => {
				const filteredTagMatches = matches?.filter((match) => match.key === 'tags')
				return (
					<li>
						<a
							href={`/cool-sites/${item.id}`}
							class={cn(`flex flex-col gap-1 focusable p-2 rounded`)}
						>
							<img
								src={item.thumbnail?.src}
								alt={item.title}
								class="w-full aspect-140/73 bg-grayUltraLight border border-grayLight rounded"
							/>
							<div class="flex gap-3 items-center mt-1">
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
		/>
	)
}

export default MediaShelfSearch
