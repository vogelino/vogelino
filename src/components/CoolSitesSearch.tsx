import type { CoolSiteType } from '../schemas/coolSites'
import Search from './Search'

function CoolSitespirationsSearch({
	searchItems,
	disabled = false,
	onSearch,
}: {
	searchItems: CoolSiteType[]
	disabled?: boolean
	onSearch?: (results: CoolSiteType[] | null) => void
}) {
	return (
		<Search
			label="Search sites"
			searchItems={searchItems}
			disabled={disabled}
			searchOptions={{
				keys: ['title', 'tags', 'url'],
				includeMatches: true,
				minMatchCharLength: 2,
				threshold: 0.5,
			}}
			onSearch={(results) => {
				if (!onSearch) return
				if (!results) return onSearch(null)
				onSearch(results.map(({ item }) => item))
			}}
		/>
	)
}

export default CoolSitespirationsSearch
