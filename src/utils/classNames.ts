export default function classNames(...classes: unknown[] | unknown[][]): string {
	const flatClasses = classes.map((className: unknown) => {
		if (typeof className === 'string') return className
		if (Array.isArray(className)) return classNames(...className)
		return ''
	})
	return flatClasses.filter(Boolean).join(' ')
}
