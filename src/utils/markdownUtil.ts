export const mdLinksToHtml = (stringWithLinks: string) =>
	stringWithLinks.replace(
		/\[(.+?)\]\((.+?)\)/g,
		`<a
        href="$2"
        target="_blank"
        rel="noreferrer nofollow"
        class="underline decoration-alt underline-offset-4 decoration-wavy decoration-clone leading-relaxed hyphen-auto dark:decoration-from-font outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-8 focus-visible:ring-offset-alt focus-visible:rounded-full focus-visible:no-underline pt-1 bg-alt/20 focus-visible:bg-alt [text-decoration-skip-ink:none] hover-hover:hover:bg-alt hover-hover:hover:decoration-fg transition-colors motion-reduce:transition-none"
      >
        $1
      </a>`,
	)
