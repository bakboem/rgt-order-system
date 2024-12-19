/*
 * Filename: /Users/bakbeom/work/sm/surginus-htms/src/style/sx/alignSx.ts
 * Path: /Users/bakbeom/work/sm/surginus-htms
 * Created Date: Wednesday, October 30th 2024, 3:22:51 pm
 * Author: bakbeom
 *
 * Copyright (c) 2024 BioCube
 */

import { as_between, as_c, as_center, as_end, as_r, as_start } from "../align";
import { s_full } from "../size";

export const columnStart_rowCenter = {
  display: "flex",
  flexDirection: as_c,
  justifyContent: as_center,
  alignItems: as_start,
};
export const columnStart_rowLeft = {
  ...columnStart_rowCenter,
  justifyContent: as_start,
};
export const columnStart_rowEnd = {
  ...columnStart_rowCenter,
  justifyContent: as_end,
};
export const columnEnd_rowCenter = {
  display: "flex",
  flexDirection: as_c,
  justifyContent: as_center,
  alignItems: as_end,
};

export const columnEnd_rowLeft = {
  ...columnEnd_rowCenter,
  justifyContent: as_start,
};
export const columnEnd_rowRight = {
  ...columnEnd_rowCenter,
  justifyContent: as_end,
};

export const columnCenter_rowCenter = {
  display: "flex",
  flexDirection: as_c,
  justifyContent: as_center,
  alignItems: as_center,
};

export const columnCenter_rowStart = {
  ...columnCenter_rowCenter,
  alignItems: as_start,
};

export const columnCenter_rowEnd = {
  ...columnCenter_rowCenter,
  alignItems: as_end,
};

export const rowStart_columnCenter = {
  display: "flex",
  flexDirection: as_r,
  justifyContent: as_start,
  alignItems: as_center,
};

export const rowSpaceBetwon_columnCenter = {
  display: "flex",
  width: s_full,
  flexDirection: as_r,
  justifyContent: as_between,
  alignItems: as_center,
};

export const rowStart_ColumnStart = {
  ...rowStart_columnCenter,
  alignItems: as_start,
};
export const rowStart_columnEnd = {
  ...rowStart_ColumnStart,
  alignItems: as_end,
};
export const rowEnd_columnCenter = {
  display: "flex",
  flexDirection: as_c,
  justifyContent: as_end,
  alignItems: as_center,
};

export const rowEnd_columnStart = {
  ...rowEnd_columnCenter,
  alignItems: as_start,
};
export const rowEnd_columnRight = {
  ...rowEnd_columnCenter,
  alignItems: as_end,
};
export const rowCenter_columnCenter = {
  display: "flex",
  flexDirection: as_r,
  justifyContent: as_center,
  alignItems: as_center,
};
export const rowCenter_columnStart = {
  ...rowCenter_columnCenter,
  alignItems: as_start,
};
export const rowCenter_columnEnd = {
  ...rowCenter_columnCenter,
  alignItems: as_end,
};
