export default function classNames(...classes: string[] | string[][]): string {
  const flatClasses = classes.map((className) => {
    if (typeof className === "string") return className
    if (Array.isArray(className)) return classNames(className)
    return ""
  })
  return flatClasses.filter(Boolean).join(" ")
}