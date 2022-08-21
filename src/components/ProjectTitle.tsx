import { motion } from "framer-motion";
import { FC } from "react";
import classNames from "../utils/classNames";

interface ProjectTitlePropType {
  projectTitleLine1: string;
  projectTitleLine2: string;
  className?: React.HTMLAttributes<HTMLElement>["className"];
}

const titleParentVariants = {
  shown: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const projectTitleVariants = {
  shown: {
    transition: {
      staggerChildren: 0.04,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const typeCharsVariants = {
  hidden: { opacity: 0, y: -40 },
  shown: {
    opacity: 1,
    y: 0,
    transition: {
      y: { type: "tween", duration: 2, ease: [0, 0.88, 0, 1] },
      opacity: { duration: 0.1, ease: "easeOut" },
    },
  },
  exit: {
    opacity: 0,
    y: 40,
    transition: {
      y: { type: "tween", duration: 1, ease: [0, 0.88, 0, 1] },
      opacity: { duration: 0.1, ease: "easeOut" },
    },
  },
};

const TitleLine: FC<{ children: string; id: string }> = ({ children, id }) => (
  <motion.span
    variants={projectTitleVariants}
    className="flex flex-nowrap overflow-hidden w-full h-[2ch] pt-[0.2ch] -mt-[0.2ch]"
    style={{ willChange: "opacity, transform" }}
  >
    {children.split("").map((c, i) => (
      <motion.span
        variants={typeCharsVariants}
        key={[id, c, i].join("-")}
        className="inline-block"
        style={{ willChange: "opacity, transform" }}
      >
        {c}
      </motion.span>
    ))}
  </motion.span>
);

export const ProjectTitle: FC<ProjectTitlePropType> = ({
  projectTitleLine1,
  projectTitleLine2,
  className = "",
}) => (
  <motion.h2
    variants={titleParentVariants}
    className={classNames(
      className,
      "font-headline text-8xl uppercase font-extrabold leading-[.71em]",
      "absolute top-2 left-0 z-10"
    )}
  >
    <TitleLine id="line-1">{projectTitleLine1}</TitleLine>
    <TitleLine id="line-2">{projectTitleLine2}</TitleLine>
  </motion.h2>
);
