import { GetStaticProps } from "next";
import { FC } from "react";
import Layout from "../src/components/Layout";
import Thumbnail from "../src/components/Thumbnail";
import classNames from "../src/utils/classNames";
import {
  getNotionProjects,
  MappedNotionProject,
} from "../src/utils/getNotionProjects";

export const getStaticProps: GetStaticProps = async () => {
  const notionProjects = await getNotionProjects();

  return {
    props: {
      projects: notionProjects,
    },
  };
};

const IndexPage: FC<{ projects: MappedNotionProject[] }> = ({ projects }) => (
  <Layout title="Selected Projects | VOGELINO">
    <main
      className="container px-8 grid grid-cols-1 mx-auto gap-8 py-32"
      aria-label="List of selected works"
    >
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
              projectType={work.titleLine1}
              projectImagePath={work.thumbnail}
              projectImageAlt={work.fullTitle}
            />
          </div>
        </div>
      ))}
    </main>
  </Layout>
);

export default IndexPage;
