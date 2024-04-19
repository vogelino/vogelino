declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"collaborators": {
"agora-collective.md": {
	id: "agora-collective.md";
  slug: "agora-collective";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"alexandra-martini.md": {
	id: "alexandra-martini.md";
  slug: "alexandra-martini";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"alsino-skowronek.md": {
	id: "alsino-skowronek.md";
  slug: "alsino-skowronek";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"anna-meide.md": {
	id: "anna-meide.md";
  slug: "anna-meide";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"bela-kurek.md": {
	id: "bela-kurek.md";
  slug: "bela-kurek";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"berlinische-galerie.md": {
	id: "berlinische-galerie.md";
  slug: "berlinische-galerie";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"boris-muller.md": {
	id: "boris-muller.md";
  slug: "boris-muller";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"bsr.md": {
	id: "bsr.md";
  slug: "bsr";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"caspar-kirsch.md": {
	id: "caspar-kirsch.md";
  slug: "caspar-kirsch";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"charlotte-stuby.md": {
	id: "charlotte-stuby.md";
  slug: "charlotte-stuby";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"christian-mosau.md": {
	id: "christian-mosau.md";
  slug: "christian-mosau";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"citylab.md": {
	id: "citylab.md";
  slug: "citylab";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"constanze-langer.md": {
	id: "constanze-langer.md";
  slug: "constanze-langer";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"daniel-franz.md": {
	id: "daniel-franz.md";
  slug: "daniel-franz";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"daria-thies.md": {
	id: "daria-thies.md";
  slug: "daria-thies";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"dennis-ostendorf.md": {
	id: "dennis-ostendorf.md";
  slug: "dennis-ostendorf";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"dustin-kummer.md": {
	id: "dustin-kummer.md";
  slug: "dustin-kummer";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"emil-woop.md": {
	id: "emil-woop.md";
  slug: "emil-woop";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"evelyne-brie.md": {
	id: "evelyne-brie.md";
  slug: "evelyne-brie";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"fabian-moron-zirfas.md": {
	id: "fabian-moron-zirfas.md";
  slug: "fabian-moron-zirfas";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"fabian-schultz.md": {
	id: "fabian-schultz.md";
  slug: "fabian-schultz";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"fast-assembled-furniture.md": {
	id: "fast-assembled-furniture.md";
  slug: "fast-assembled-furniture";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"fh-potsdam.md": {
	id: "fh-potsdam.md";
  slug: "fh-potsdam";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"florian-zia.md": {
	id: "florian-zia.md";
  slug: "florian-zia";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"frank-heidmann.md": {
	id: "frank-heidmann.md";
  slug: "frank-heidmann";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"ingo-hinterding.md": {
	id: "ingo-hinterding.md";
  slug: "ingo-hinterding";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"jan-erik-stange.md": {
	id: "jan-erik-stange.md";
  slug: "jan-erik-stange";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"jens-ove.md": {
	id: "jens-ove.md";
  slug: "jens-ove";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"jonas-parnow.md": {
	id: "jonas-parnow.md";
  slug: "jonas-parnow";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"joshua-pacheco.md": {
	id: "joshua-pacheco.md";
  slug: "joshua-pacheco";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"julia-zimmermann.md": {
	id: "julia-zimmermann.md";
  slug: "julia-zimmermann";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"julian-lucas-wohlleber.md": {
	id: "julian-lucas-wohlleber.md";
  slug: "julian-lucas-wohlleber";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"katrin-glinka.md": {
	id: "katrin-glinka.md";
  slug: "katrin-glinka";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"kurt-fendt.md": {
	id: "kurt-fendt.md";
  slug: "kurt-fendt";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"laura-pau-bielsa.md": {
	id: "laura-pau-bielsa.md";
  slug: "laura-pau-bielsa";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"lisa-stubert.md": {
	id: "lisa-stubert.md";
  slug: "lisa-stubert";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"lucas-soth.md": {
	id: "lucas-soth.md";
  slug: "lucas-soth";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"ludwig-frank.md": {
	id: "ludwig-frank.md";
  slug: "ludwig-frank";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"michael-horz.md": {
	id: "michael-horz.md";
  slug: "michael-horz";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"mit-hyperstudio.md": {
	id: "mit-hyperstudio.md";
  slug: "mit-hyperstudio";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"myrian-rigal.md": {
	id: "myrian-rigal.md";
  slug: "myrian-rigal";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"nexenio.md": {
	id: "nexenio.md";
  slug: "nexenio";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"nina-tschiner.md": {
	id: "nina-tschiner.md";
  slug: "nina-tschiner";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"odis.md": {
	id: "odis.md";
  slug: "odis";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"paul-klinski.md": {
	id: "paul-klinski.md";
  slug: "paul-klinski";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"ruzena-hesse.md": {
	id: "ruzena-hesse.md";
  slug: "ruzena-hesse";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"stefan-thomas.md": {
	id: "stefan-thomas.md";
  slug: "stefan-thomas";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"technologiestiftung.md": {
	id: "technologiestiftung.md";
  slug: "technologiestiftung";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
"ubermetrics-technologies.md": {
	id: "ubermetrics-technologies.md";
  slug: "ubermetrics-technologies";
  body: string;
  collection: "collaborators";
  data: InferEntrySchema<"collaborators">
} & { render(): Render[".md"] };
};
"content": {
"about.mdx": {
	id: "about.mdx";
  slug: "about";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".mdx"] };
};
"projects": {
"airbnb-vs-berlin.mdx": {
	id: "airbnb-vs-berlin.mdx";
  slug: "airbnb-vs-berlin";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"bdrive.mdx": {
	id: "bdrive.mdx";
  slug: "bdrive";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"charlotte-stuby.mdx": {
	id: "charlotte-stuby.mdx";
  slug: "charlotte-stuby";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"fast-assembled-furniture.mdx": {
	id: "fast-assembled-furniture.mdx";
  slug: "fast-assembled-furniture";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"hidden-perspectives.mdx": {
	id: "hidden-perspectives.mdx";
  slug: "hidden-perspectives";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"hilf-mirberlin.mdx": {
	id: "hilf-mirberlin.mdx";
  slug: "hilf-mirberlin";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"kiportrait.mdx": {
	id: "kiportrait.mdx";
  slug: "kiportrait";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"letterstories.mdx": {
	id: "letterstories.mdx";
  slug: "letterstories";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"odis.mdx": {
	id: "odis.mdx";
  slug: "odis";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"public-design.mdx": {
	id: "public-design.mdx";
  slug: "public-design";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"refreshment-map.mdx": {
	id: "refreshment-map.mdx";
  slug: "refreshment-map";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"stadtpuls.mdx": {
	id: "stadtpuls.mdx";
  slug: "stadtpuls";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
"ubermetrics.mdx": {
	id: "ubermetrics.mdx";
  slug: "ubermetrics";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".mdx"] };
};
"technologies": {
"after-effects.md": {
	id: "after-effects.md";
  slug: "after-effects";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"apollo.md": {
	id: "apollo.md";
  slug: "apollo";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"asana.md": {
	id: "asana.md";
  slug: "asana";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"astro.md": {
	id: "astro.md";
  slug: "astro";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"auth0.md": {
	id: "auth0.md";
  slug: "auth0";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"backbone.md": {
	id: "backbone.md";
  slug: "backbone";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"bootstrap.md": {
	id: "bootstrap.md";
  slug: "bootstrap";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"bun.md": {
	id: "bun.md";
  slug: "bun";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"confluence.md": {
	id: "confluence.md";
  slug: "confluence";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"css-modules.md": {
	id: "css-modules.md";
  slug: "css-modules";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"css.md": {
	id: "css.md";
  slug: "css";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"cypress.md": {
	id: "cypress.md";
  slug: "cypress";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"d3js.md": {
	id: "d3js.md";
  slug: "d3js";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"decap-cms.md": {
	id: "decap-cms.md";
  slug: "decap-cms";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"docusaurus.md": {
	id: "docusaurus.md";
  slug: "docusaurus";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"emotion.md": {
	id: "emotion.md";
  slug: "emotion";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"eslint.md": {
	id: "eslint.md";
  slug: "eslint";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"express.md": {
	id: "express.md";
  slug: "express";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"figma.md": {
	id: "figma.md";
  slug: "figma";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"gatsby.md": {
	id: "gatsby.md";
  slug: "gatsby";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"github-actions.md": {
	id: "github-actions.md";
  slug: "github-actions";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"github.md": {
	id: "github.md";
  slug: "github";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"graphql.md": {
	id: "graphql.md";
  slug: "graphql";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"grist.md": {
	id: "grist.md";
  slug: "grist";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"html.md": {
	id: "html.md";
  slug: "html";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"illustrator.md": {
	id: "illustrator.md";
  slug: "illustrator";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"javascript.md": {
	id: "javascript.md";
  slug: "javascript";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"jest.md": {
	id: "jest.md";
  slug: "jest";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"jira.md": {
	id: "jira.md";
  slug: "jira";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"mapbox.md": {
	id: "mapbox.md";
  slug: "mapbox";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"maptiler.md": {
	id: "maptiler.md";
  slug: "maptiler";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"mdx.md": {
	id: "mdx.md";
  slug: "mdx";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"netlify.md": {
	id: "netlify.md";
  slug: "netlify";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"next-translate.md": {
	id: "next-translate.md";
  slug: "next-translate";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"nextjs.md": {
	id: "nextjs.md";
  slug: "nextjs";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"nodejs.md": {
	id: "nodejs.md";
  slug: "nodejs";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"nvm.md": {
	id: "nvm.md";
  slug: "nvm";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"photoshop.md": {
	id: "photoshop.md";
  slug: "photoshop";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"pixijs.md": {
	id: "pixijs.md";
  slug: "pixijs";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"playwright.md": {
	id: "playwright.md";
  slug: "playwright";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"prettier.md": {
	id: "prettier.md";
  slug: "prettier";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"ramda.md": {
	id: "ramda.md";
  slug: "ramda";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"react.md": {
	id: "react.md";
  slug: "react";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"redux.md": {
	id: "redux.md";
  slug: "redux";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"rendercom.md": {
	id: "rendercom.md";
  slug: "rendercom";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"sass.md": {
	id: "sass.md";
  slug: "sass";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"sketch-measure.md": {
	id: "sketch-measure.md";
  slug: "sketch-measure";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"sketch.md": {
	id: "sketch.md";
  slug: "sketch";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"storybook.md": {
	id: "storybook.md";
  slug: "storybook";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"stripe.md": {
	id: "stripe.md";
  slug: "stripe";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"styled-components.md": {
	id: "styled-components.md";
  slug: "styled-components";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"stylus.md": {
	id: "stylus.md";
  slug: "stylus";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"supabase.md": {
	id: "supabase.md";
  slug: "supabase";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"swr.md": {
	id: "swr.md";
  slug: "swr";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"tailwind-css.md": {
	id: "tailwind-css.md";
  slug: "tailwind-css";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"tanstack-query.md": {
	id: "tanstack-query.md";
  slug: "tanstack-query";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"threejs.md": {
	id: "threejs.md";
  slug: "threejs";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"trpc.md": {
	id: "trpc.md";
  slug: "trpc";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"typescript.md": {
	id: "typescript.md";
  slug: "typescript";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"vercel.md": {
	id: "vercel.md";
  slug: "vercel";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"visx.md": {
	id: "visx.md";
  slug: "visx";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"vitejs.md": {
	id: "vitejs.md";
  slug: "vitejs";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"webgl.md": {
	id: "webgl.md";
  slug: "webgl";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
"webpack.md": {
	id: "webpack.md";
  slug: "webpack";
  body: string;
  collection: "technologies";
  data: InferEntrySchema<"technologies">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
