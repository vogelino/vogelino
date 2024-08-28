import type { Accessor } from 'solid-js'
import classNames from '../utils/classNames'

function Pagination({
	currentPage,
	totalItems,
	itemsPerPage,
	disabled = false,
	onPageChange,
}: {
	currentPage: Accessor<number>
	totalItems: () => number
	itemsPerPage: number
	disabled?: boolean
	onPageChange: (page: number) => void
}) {
	const pagesCount = Math.ceil(totalItems() / itemsPerPage)
	return (
		<nav
			class="flex flex-row flex-nowrap items-center justify-between md:justify-center sm:gap-2"
			aria-label="Pagination"
			style={{ 'view-transition-name': 'pagination' }}
		>
			{currentPage() > 1 && (
				<button
					type="button"
					class={classNames(
						`mr-1 flex h-10 w-10 items-center justify-center rounded-full`,
						`bg-bg hover-hover:hover:bg-alt`,
						`outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:ring-fg`,
						`transition-colors motion-reduce:transition-none`
					)}
					tabindex={disabled ? '-1' : '0'}
					title="Previous Page"
					onClick={(e) => {
						e.preventDefault()
						window.scrollTo({ top: 0, behavior: 'smooth' })
						onPageChange(Math.max(1, currentPage() - 1))
					}}
				>
					<span class="sr-only">Previous Page</span>
					<svg
						class="block h-4 w-4 fill-current"
						viewBox="0 0 256 512"
						aria-hidden="true"
						role="presentation"
					>
						<path d="M238.475 475.535l7.071-7.07c4.686-4.686 4.686-12.284 0-16.971L50.053 256 245.546 60.506c4.686-4.686 4.686-12.284 0-16.971l-7.071-7.07c-4.686-4.686-12.284-4.686-16.97 0L10.454 247.515c-4.686 4.686-4.686 12.284 0 16.971l211.051 211.05c4.686 4.686 12.284 4.686 16.97-.001z" />
					</svg>
				</button>
			)}

			{Array.from({ length: pagesCount }, (_, i) => i + 1).map((page) => (
				<button
					type="button"
					class={classNames(
						`ml-1 flex h-10 w-10 items-center justify-center rounded-full`,
						`outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:ring-fg`,
						`transition-colors motion-reduce:transition-none`,
						page !== currentPage() && `bg-bg hover-hover:hover:bg-alt`,
						page === currentPage() && [`cursor-default bg-fg text-alt`]
					)}
					title={`Page ${page}`}
					tabindex={page === currentPage() || disabled ? -1 : undefined}
					onClick={(e) => {
						e.preventDefault()
						window.scrollTo({ top: 0, behavior: 'smooth' })
						onPageChange(Math.max(1, page))
					}}
				>
					{page}
				</button>
			))}
			{currentPage() !== pagesCount && (
				<button
					type="button"
					class={classNames(
						`ml-1 flex h-10 w-10 items-center justify-center rounded-full`,
						`bg-bg hover-hover:hover:bg-alt`,
						`outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:ring-fg`,
						`transition-colors motion-reduce:transition-none`
					)}
					tabindex={disabled ? '-1' : '0'}
					title="Next Page"
					onClick={(e) => {
						e.preventDefault()
						window.scrollTo({ top: 0, behavior: 'smooth' })
						onPageChange(Math.max(1, currentPage() + 1))
					}}
				>
					<span class="sr-only">Next Page</span>
					<svg
						class="block h-4 w-4 fill-current"
						viewBox="0 0 256 512"
						aria-hidden="true"
						role="presentation"
					>
						<path d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z" />
					</svg>
				</button>
			)}
		</nav>
	)
}

export default Pagination
