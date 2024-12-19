import { as_center, as_start } from '../align';
import { c_success, c_dis_text, c_primary, c_white } from '../colors';
import { s_full } from '../size';
/*
 * Filename: /Users/bakbeom/work/sm/surginus-htms/src/style/sx/containerSx.ts
 * Path: /Users/bakbeom/work/sm/surginus-htms
 * Created Date: Wednesday, October 23rd 2024, 2:55:02 pm
 * Author: bakbeom
 *
 * Copyright (c) 2024 BioCube
 */

export const defaultContainerColumnSx = {
  backgroundColor: '#FFFFFFFF',
  display: 'flex',
  // justifyContent: as_center,
  justifyContent: as_start,
  alignItems: as_start,
  width: s_full,
  height: s_full,
  // border: ".1px solid black",
  flexDirection: 'column',
};

export const defaultContainerRowSx = {
  backgroundColor: '#FFFFFFFF',
  justifyContent: as_center,
  alignItems: as_start,
  display: 'flex',
  flexDirection: 'row',
};

export const stickySx = {
  width: s_full,
  position: 'sticky',
  top: 0,
  zIndex: 1,
};
export const fullSx = {
  display: 'flex',
  height: s_full,
  width: s_full,
};

export const borderSx = {
  border: '.1px solid black',
};
export const chartBorderSx = {
  border: `1px solid ${c_primary}`,
};
export const chartNoneBorderSx = {
  border: `1px solid ${c_white}`,
};
export const borderLightSx = {
  borderTop: '.6px solid #EAE3E3FF',
  borderRight: '.6px solid#EAE3E3FF',
  borderBottom: 'none',
  borderLeft: '.6px solid #EAE3E3FF',
};

export const borderAllSx = {
  borderTop: '.6px solid #EAE3E3FF',
  borderRight: '.6px solid#EAE3E3FF',
  borderBottom: '.6px solid#EAE3E3FF',
  borderLeft: '.6px solid #EAE3E3FF',
};
// 定义单独的边框样式
export const topBorderSx = {
  borderTop: '.1px solid black',
};

export const bottomBorderSx = {
  borderBottom: '.1px solid black',
};

export const leftBorderSx = {
  borderLeft: '.1px solid black',
};

export const rightBorderSx = {
  borderRight: '.1px solid black',
};
export const pinterSx = {
  cursor: 'pointer',
};

export const harfPairentSxWithRow = {
  width: '50%',
  display: 'flex',
  alignItems: 'center',
  // justifyContent: "space-between",
};
export const harfPairentSxWithColum = {
  width: '50%',
  display: 'flex',
  // alignItems: "center",
  justifyContent: 'center',
};
export const bindingSx = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: c_success, // 使用当前文本颜色，可以根据需要更改
};

export const unBindingSx = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: c_dis_text, // 使用当前文本颜色，可以根据需要更改
};
