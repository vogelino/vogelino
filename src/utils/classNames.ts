export default function classNames(...classes: string[] | string[][]): string {
  const flatClasses = classes.map((className) => {
    if (typeof className === "string") return className
    return classNames(className)
  })
  return flatClasses.filter(Boolean).join(" ")
}