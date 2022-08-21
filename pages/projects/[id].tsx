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

const smoothTransition = {
  type: "tween",
  ease: [0.5, 0, 0.04, 1],
  duration: 2,
};

const thumbnailVariants = {
  initial: { opacity: 1, y: 200 },
  animate: { opacity: 1, y: 0, transition: smoothTransition },
};

const IndexPage = ({ project }) => (
  <Layout title="Home | Next.js + TypeScript Example">
    <motion.div
      key={`project-${project.slug}-container`}
      initial="initial"
      exit="initial"
      animate="animate"
      className="z-0"
    >
      <motion.div
        key={`project-${project.slug}-img-container`}
        layoutId={`${project.slug}-img-container`}
        variants={{
          initial: { height: 500 },
          animate: {
            height: 600,
            transition: smoothTransition,
          },
        }}
        className="aspect-[16/13] relative overflow-hidden w-full"
        style={{ willChange: "height" }}
      >
        <motion.img
          key={`project-${project.slug}-img`}
          layoutId={`${project.slug}-img`}
          src={project.imagePath}
          alt={project.imageAlt}
          variants={thumbnailVariants}
          className="absolute top-0 left-0 w-full -mt-[30vh]"
          style={{ willChange: "transform, opacity" }}
        />
        <OverlayingPixel
          variants={{ animate: { opacity: 0 } }}
          className={classNames(
            "w-full h-full opacity-0",
            "inset-0 absolute",
            "bg-black mix-blend-overlay "
          )}
        />
        <ImageLittleSquares showBottonLeftCorner={false} />
      </motion.div>
      <motion.div
        key={`project-${project.slug}-title-container`}
        className="container mx-auto px-8 z-10 min-h-screen -mt-[87px]"
        variants={{
          animate: {
            transition: {
              delay: 2,
              beforeChildren: true,
            },
          },
        }}
      >
        <div className="relative">
          <ProjectTitle
            id={`project-${project.slug}-title-line-1`}
            projectTitleLine1={project.titleLine1}
            projectTitleLine2={""}
            className="text-9xl mix-blend-difference text-black-negative z-20"
            delay={1}
          />
          <ProjectTitle
            id={`project-${project.slug}-title-line-1`}
            projectTitleLine1={project.titleLine1}
            projectTitleLine2={""}
            className="text-9xl mix-blend-overlay text-black/60 z-20"
            delay={1}
          />
          <ProjectTitle
            id={`project-${project.slug}-title-line-2`}
            projectTitleLine1={project.titleLine2}
            projectTitleLine2={""}
            className="mt-[89px] text-9xl text-black z-20"
            delay={1.2}
          />
        </div>
      </motion.div>
    </motion.div>
  </Layout>
);

export default IndexPage;
