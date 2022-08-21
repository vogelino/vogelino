import type { FC, HTMLProps } from "react";
import { AnimatePresence, AnimationProps, motion } from "framer-motion";
import classNames from "../utils/classNames";
import Image from "next/image";
import Link from "next/link";
import { ImageLittleSquares } from "./ImageLittleSquares";
import { OverlayingPixel } from "./OverlayingPixel";
import { ProjectTitle } from "./ProjectTitle";

interface ThumbnailPropType {
  projectSlug: string;
  projectTitleLine1: string;
  projectTitleLine2: string;
  projectType: string;
  projectImagePath: string;
  projectImageAlt: string;
}

const thumbnailVariants = {
  initial: { opacity: 0, scale: 1.2 },
  hover: { opacity: 1, scale: 1.2 },
  animate(i: number) {
    const delay = i / 2 + 0.1;
    return {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { delay, duration: 0.3, ease: "easeOut" },
        scale: { delay, duration: 0.3, ease: "easeOut" },
      },
    };
  },
  exit: { opacity: 0, scale: 1 },
};

const typeWriterParentVariants = {
  animate: {
    transition: {
      staggerChildren: 0.02,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.01,
    },
  },
};

const mainSquareVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 0 },
  hover: { opacity: 1 },
  exit: { opacity: 0 },
};

const projectTypeCharsVariants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      x: { type: "spring", stiffness: 40 },
      opacity: { duration: 0.3, ease: "easeOut" },
    },
  },
  hover: {
    opacity: 1,
    x: 10,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      x: { type: "tween", duration: 0.3 },
      opacity: { duration: 0.3, ease: "easeOut" },
    },
  },
};

const Thumbnail: FC<ThumbnailPropType> = ({
  projectSlug,
  projectTitleLine1,
  projectTitleLine2,
  projectType,
  projectImagePath,
  projectImageAlt,
}) => (
  <Link href={`/projects/${projectSlug}`}>
    <motion.div
      key={`thumbnail-${projectSlug}`}
      className="relative pt-[67px] mb-16 pl-[38px] cursor-pointer"
      whileInView="animate"
      whileHover="hover"
      whileTap="hover"
      initial="initial"
      exit="exit"
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { when: "beforeChildren", delay: 0.1, duration: 0.1 },
        },
      }}
    >
      <ProjectTitle
        id={`thumbnail-${projectSlug}-title-line-1`}
        projectTitleLine1={projectTitleLine1}
        projectTitleLine2={projectTitleLine2}
        className="mix-blend-difference text-black-negative z-20"
      />
      <ProjectTitle
        id={`thumbnail-${projectSlug}-title-line-2`}
        projectTitleLine1={projectTitleLine1}
        projectTitleLine2={projectTitleLine2}
        className="mix-blend-overlay text-black/60 z-20"
      />
      <ProjectTitle
        id={`thumbnail-${projectSlug}-title-line-3`}
        projectTitleLine1={projectTitleLine1}
        projectTitleLine2={projectTitleLine2.slice(0, 1)}
        className="z-30"
      />
      <div
        className={classNames(
          "absolute bottom-8 left-0 uppercase font-headline text-2xl",
          "z-10 tracking-widest leading-4"
        )}
      >
        <motion.h3
          key={`thumbnail-${projectSlug}-type`}
          className={classNames(
            "origin-bottom-left -rotate-90 translate-x-7",
            "pt-1 -mt-1"
          )}
          variants={typeWriterParentVariants}
        >
          {projectType.split("").map((c, idx) => (
            <motion.span
              key={`thumbnail-${projectSlug}-type-${c}-${idx}`}
              variants={projectTypeCharsVariants}
              className="inline-block"
              style={{ willChange: "opacity, transform" }}
            >
              {c}
            </motion.span>
          ))}
        </motion.h3>
      </div>
      <motion.div
        key={`${projectSlug}-img-container`}
        layoutId={`${projectSlug}-img-container`}
        className="aspect-[16/13] relative overflow-hidden"
      >
        <motion.img
          key={`thumbnail-${projectSlug}-img`}
          layoutId={`${projectSlug}-img`}
          src={projectImagePath}
          alt={projectImageAlt}
          variants={thumbnailVariants}
          className="absolute top-0 left-0 w-full"
          style={{ willChange: "transform, opacity" }}
        />
        <OverlayingPixel
          variants={mainSquareVariants}
          className={classNames(
            "w-full h-full opacity-0",
            "inset-0 absolute",
            "bg-black mix-blend-overlay "
          )}
        />
        <ImageLittleSquares
          showTopRightCorner={projectTitleLine2.length < 10}
        />
      </motion.div>
    </motion.div>
  </Link>
);

export default Thumbnail;
