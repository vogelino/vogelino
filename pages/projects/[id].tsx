import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Layout from "../../src/components/Layout";
import Thumbnail from "../../src/components/Thumbnail";
import { projects, ProjectType } from "../../src/content/projects";
import classNames from "../../src/utils/classNames";
import { motion } from "framer-motion";
import { OverlayingPixel } from "../../src/components/OverlayingPixel";
import { ImageLittleSquares } from "../../src/components/ImageLittleSquares";
import { ProjectTitle } from "../../src/components/ProjectTitle";

export const getStaticPaths: GetStaticPaths<{
  id: string;
}> = async () => ({
  paths: projects.map(({ slug }) => ({
    params: { id: slug },
  })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{
  project: ProjectType;
}> = async (context) => {
  const project = projects.find(({ slug }) => slug === context.params.id);
  if (!project) return { notFound: true };
  return { props: { project } };
};

const thumbnailVariants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1 },
};

const IndexPage = ({ project }) => (
  <Layout title="Home | Next.js + TypeScript Example">
    <motion.div initial="hidden" animate="shown" className="z-0">
      <motion.div
        variants={{
          initial: { height: 0 },
          shown: {
            height: 600,
            transition: { type: "tween", ease: [0, 0.88, 0, 1], duration: 2 },
          },
        }}
        layoutId={`thumbnail-${project.slug}`}
        className="aspect-[16/13] relative overflow-hidden w-full"
      >
        <motion.img
          src={project.imagePath}
          alt={project.imageAlt}
          variants={thumbnailVariants}
          className="absolute top-0 left-0 w-full -mt-[30vh] transition-all"
          style={{ willChange: "transform, opacity" }}
          layoutId={`thumbnail-${project.slug}-img`}
        />
        <OverlayingPixel
          variants={{ shown: { opacity: 0 } }}
          className={classNames(
            "w-full h-full opacity-0",
            "inset-0 absolute",
            "bg-black mix-blend-overlay "
          )}
        />
        <ImageLittleSquares id={project.slug} showBottonLeftCorner={false} />
      </motion.div>
      <motion.div
        transition={{ delayChildren: 3 }}
        className="container mx-auto relative px-8 z-10 min-h-screen -mt-[87px]"
      >
        <ProjectTitle
          projectTitleLine1={project.titleLine1}
          projectTitleLine2={project.titleLine2}
          className="text-9xl mix-blend-overlay text-black opacity-80 z-20"
        />
        <ProjectTitle
          projectTitleLine1={project.titleLine2}
          projectTitleLine2={""}
          className="mt-[89px] text-9xl text-black z-20"
        />
      </motion.div>
    </motion.div>
  </Layout>
);

export default IndexPage;
