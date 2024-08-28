import { type Component, type JSX, splitProps } from 'solid-js'
import classNames from '../utils/classNames'

interface Props extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	url?: string
	class?: string
	icon?: (props: { class: string }) => JSX.Element
	variant?: 'primary' | 'secondary'
	children?: () => JSX.Element
	onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}

const RoundedButton: Component<Props> = (props) => {
	const [local, rest] = splitProps(props, [
		'url',
		'class',
		'icon',
		'variant',
		'children',
		'onClick',
	])

	if (!local.url) return null
	return (
		<button
			type="button"
			class={classNames([
				'font-special antialiased w-fit',
				'top-0 rounded-full',
				'transition motion-reduce:transition-none',
				'flex items-center gap-1 md:gap-2',
				'px-2 pb-0.5 md:px-4 md:pb-1 text-xl md:text-2xl',
				'outline-none focus-visible:ring-2',
				'focus-visible:ring-fg focus-visible:ring-offset-2',
				'focus-visible:ring-offset-bg',
				'hover-hover:hover:scale-110',
				local.variant === 'primary' && [
					'bg-fg text-alt',
					'hover-hover:hover:bg-alt hover-hover:hover:text-fg',
				],
				local.variant === 'secondary' && [
					'bg-alt text-fg',
					'hover-hover:hover:bg-fg hover-hover:hover:text-alt',
				],
				local.class,
			])}
			onClick={local.onClick}
			{...rest}
		>
			<span>{local.children?.()}</span> {local.icon && <local.icon class="mt-1" />}
		</button>
	)
}

export default RoundedButton
