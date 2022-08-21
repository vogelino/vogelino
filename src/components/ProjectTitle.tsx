import { motion } from "framer-motion";
import { FC } from "react";
import classNames from "../utils/classNames";

interface ProjectTitlePropType {
  id: number | string;
  delay?: number;
  ariaHidden?: boolean;
  projectTitleLine1: string;
  projectTitleLine2: string;
  className?: React.HTMLAttributes<HTMLElement>["className"];
}

const titleParentVariants = {
  initial: { opacity: 0 },
  animate(delay = 0) {
    return {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: 0.2,
        beforeChildren: true,
      },
    };
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const projectTitleVariants = {
  animate(delay = 0) {
    return {
      transition: {
        delay,
        staggerChildren: 0.04,
      },
    };
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const typeCharsVariants = {
  initial: { opacity: 0, y: -40 },
  animate(delay = 0) {
    return {
      opacity: 1,
      y: 0,
      transition: {
        delay,
        y: { type: "tween", duration: 2, ease: [0, 0.88, 0, 1] },
        opacity: { duration: 0.1, ease: "easeOut" },
      },
    };
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

const TitleLine: FC<{ children: string; id: string; delay: number }> = ({
  children,
  id,
  delay,
}) => (
  <motion.span
    key={id}
    variants={projectTitleVariants}
    className="flex flex-nowrap overflow-hidden w-full h-[2ch] pt-[0.2ch] -mt-[0.2ch]"
    style={{ willChange: "opacity, transform" }}
    custom={delay}
  >
    {children.split("").map((c, i) => (
      <motion.span
        variants={typeCharsVariants}
        key={[id, c, i].join("-")}
        className="inline-block"
        style={{ willChange: "opacity, transform" }}
        custom={delay + 0.04 * i}
      >
        {c}
      </motion.span>
    ))}
  </motion.span>
);

export const ProjectTitle: FC<ProjectTitlePropType> = ({
  id,
  ariaHidden = false,
  delay = 0,
  projectTitleLine1,
  projectTitleLine2,
  className = "",
}) => (
  <motion.h2
    key={id}
    aria-hidden={ariaHidden}
    variants={titleParentVariants}
    className={classNames(
      className,
      "font-headline text-8xl uppercase font-extrabold leading-[.71em]",
      "absolute top-2 left-0 z-10"
    )}
    custom={delay}
  >
    <TitleLine delay={delay} id={`${id}-line-1`}>
      {projectTitleLine1}
    </TitleLine>
    <TitleLine delay={delay + 0.1} id={`${id}-line-2`}>
      {projectTitleLine2}
    </TitleLine>
  </motion.h2>
);
