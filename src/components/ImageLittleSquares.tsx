import { FC } from "react";
import { AnimationProps, motion } from "framer-motion";
import classNames from "../utils/classNames";
import { OverlayingPixel } from "./OverlayingPixel";

const littleSquareParentVarians: AnimationProps["variants"] = {
  shown: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const littleSquaresVariants = {
  hidden: { opacity: 0, y: `-100%` },
  hover: { opacity: 0, y: `100%`, transition: { duration: 0.1 } },
  shown: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.1, ease: "easeOut" },
      y: { duration: 2, ease: [0, 0.88, 0, 1] },
    },
  },
  exit: { opacity: 0, y: `100%` },
};

export const ImageLittleSquares: FC<{
  showTopRightCorner?: boolean;
  showTopLeftCorner?: boolean;
  showBottonRightCorner?: boolean;
  showBottonLeftCorner?: boolean;
}> = ({
  showTopRightCorner = true,
  showTopLeftCorner = true,
  showBottonRightCorner = true,
  showBottonLeftCorner = true,
}) => (
  <>
    {showBottonLeftCorner && (
      <motion.div variants={littleSquareParentVarians}>
        <OverlayingPixel
          variants={littleSquaresVariants}
          className={classNames(
            "w-8 h-8",
            "bottom-0 left-8",
            "bg-black mix-blend-overlay"
          )}
        />
        <OverlayingPixel
          className={classNames("w-8 h-8", "bottom-0 left-0", "bg-white")}
        />
        <OverlayingPixel
          className={classNames("w-8 h-8", "bottom-0 left-16", "bg-white")}
        />
        <OverlayingPixel
          className={classNames("w-8 h-8", "bottom-0 left-24", "bg-white")}
        />
        <OverlayingPixel
          className={classNames("w-8 h-8", "bottom-0 left-32", "bg-white")}
        />
        <OverlayingPixel
          className={classNames(
            "w-8 h-8",
            "bottom-0 left-40",
            "bg-white mix-blend-overlay"
          )}
        />
        <OverlayingPixel
          variants={littleSquaresVariants}
          className={classNames(
            "w-4 h-4",
            "bottom-8 left-4",
            "bg-black mix-blend-overlay"
          )}
        />
        <OverlayingPixel
          variants={littleSquaresVariants}
          className={classNames(
            "w-4 h-4",
            "bottom-12 left-0",
            "bg-black mix-blend-overlay"
          )}
        />
      </motion.div>
    )}

    {showBottonRightCorner && (
      <motion.div variants={littleSquareParentVarians}>
        <OverlayingPixel
          variants={littleSquaresVariants}
          className={classNames(
            "w-8 h-8",
            "bottom-0 right-0",
            "bg-black mix-blend-overlay"
          )}
        />
        <OverlayingPixel
          variants={littleSquaresVariants}
          className={classNames(
            "w-8 h-8",
            "bottom-8 right-0",
            "bg-white mix-blend-overlay"
          )}
        />
        <OverlayingPixel
          variants={littleSquaresVariants}
          className={classNames(
            "w-4 h-4",
            "bottom-4 right-8",
            "bg-white mix-blend-overlay"
          )}
        />
        <OverlayingPixel
          variants={littleSquaresVariants}
          className={classNames(
            "w-4 h-4",
            "bottom-4 right-4",
            "bg-black mix-blend-overlay"
          )}
        />
      </motion.div>
    )}

    {showTopRightCorner && (
      <motion.div variants={littleSquareParentVarians}>
        <OverlayingPixel
          className={classNames(
            "w-8 h-8",
            "top-0 right-0",
            "bg-white mix-blend-overlay"
          )}
        />
        <OverlayingPixel
          variants={littleSquaresVariants}
          className={classNames("w-4 h-4", "top-8 right-0", "bg-black")}
        />
      </motion.div>
    )}
  </>
);
