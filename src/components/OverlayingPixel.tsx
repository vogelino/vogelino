import { motion, AnimationProps } from "framer-motion";
import { FC } from "react";
import classNames from "../utils/classNames";

export const OverlayingPixel: FC<{
  variants?: AnimationProps["variants"];
  className?: React.HTMLAttributes<HTMLElement>["className"];
  delay?: number;
}> = ({ className = "", delay = 0, variants }) => (
  <motion.span
    style={{ willChange: "transform, opacity" }}
    variants={!variants ? {} : variants}
    aria-initial="true"
    className={classNames(className, "inline-block absolute")}
    custom={delay}
  />
);
