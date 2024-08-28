import classNames from '../utils/classNames'

function Tag({
	name,
	count,
	isActive = false,
	onClick = () => {},
}: {
	name: string
	slug: string
	count?: number
	isActive?: boolean
	onClick?: () => void
}) {
	return (
		<button
			type="button"
			class={classNames(
				`px-2.5 pt-[0.2rem] leading-tight bg-grayUltraLight text-grayDark`,
				`text-sm rounded-full focusable hover-hover:hover:bg-fg hover-hover:hover:text-alt`,
				`transition w-fit`,
				isActive && `bg-alt text-fg`
			)}
			onClick={(evt) => {
				evt.preventDefault()
				evt.stopPropagation()
				onClick()
			}}
		>
			{name}
			{typeof count === 'number' && <span class="text-xs ml-2 opacity-50">{count}</span>}
		</button>
	)
}

export default Tag
