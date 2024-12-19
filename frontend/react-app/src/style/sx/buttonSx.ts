/*
 * Filename: /Users/bakbeom/work/sm/surginus-htms/src/style/sx/buttonSx.ts
 * Path: /Users/bakbeom/work/sm/surginus-htms
 * Created Date: Wednesday, October 23rd 2024, 10:05:46 am
 * Author: bakbeom
 *
 * Copyright (c) 2024 BioCube
 */

import { s_buttonHeight, s_full } from "../size";
export const defaultButtonSx = {
  width: s_full,
  height: s_buttonHeight,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1px 2px",
};

export const borderButtonSx = {
  ...defaultButtonSx,
  border: ".1px solid", // 添加边框
  borderColor: "primary.main", // 边框颜色为主色
};

export const defaultTextfieldButtonSx = {
  "& .MuiInputLabel-root": {
    top: "8px", // 调整初始的垂直位置
    left: "25px", // 调整初始的水平位置
    transform: "translate(0, 0)", // 控制初始位置的动画变换
    "&.MuiInputLabel-shrink": {
      transform: "translate(-10px, -20px) scale(0.75)", // 控制 label 收缩时的位置
    },
  },
};
