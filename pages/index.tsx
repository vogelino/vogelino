import Layout from "../src/components/Layout";
import Thumbnail from "../src/components/Thumbnail";
import { projects } from "../src/content/projects";
import classNames from "../src/utils/classNames";

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <main className="grid grid-cols-1 max-w-3xl mx-auto gap-8 py-16">
      {projects.map((work, idx) => (
        <div
          key={work.slug}
          className={classNames(
            "flex",
            idx % 2 === 0 ? "justify-start" : "justify-end"
          )}
        >
          <div className="sm:w-2/3">
            <Thumbnail
              projectSlug={work.slug}
              projectTitleLine1={work.titleLine1}
              projectTitleLine2={work.titleLine2}
              projectType={work.type}
              projectImagePath={work.imagePath}
              projectImageAlt={work.imageAlt}
            />
          </div>
        </div>
      ))}
    </main>
  </Layout>
);

export default IndexPage;
