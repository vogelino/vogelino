type AstroImageFormatType = 'jpeg' | 'png' | 'webp' | 'avif' | 'svg'

export interface AstroImageType<
	Format extends AstroImageFormatType = AstroImageFormatType,
> {
	src: string
	width: number
	height: number
	format: Format
}

export interface AstroGlobImageType<
	Format extends AstroImageFormatType = AstroImageFormatType,
> {
	default: AstroImageType<Format>
}
