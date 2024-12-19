import React from 'react';
import { ReactSVG } from 'react-svg';
import { SxProps, Theme } from '@mui/system';
import { Box } from '@mui/material';
import { s_full, s_button_icon_size } from '../style/size';

interface SvgWrapperProps {
  src: string; // SVG 文件路径
  sx?: SxProps<Theme>; // 可选的自定义样式
  color?: string; // 控制 SVG 颜色的属性
}

const CustomSvgWrapper: React.FC<SvgWrapperProps> = ({
  src,
  sx = {},
  color,
}) => {
  return (
    <Box
      sx={{
        width: s_button_icon_size,
        height: s_button_icon_size,
        ...sx,
      }}
    >
      <ReactSVG
        src={src}
        beforeInjection={(svg) => {
          svg.setAttribute('style', `width: ${s_full}; height: ${s_full}`); // 设置SVG大小

          // 设置 SVG 的 fill 颜色
          if (color) {
            svg.querySelectorAll('path').forEach((path) => {
              path.setAttribute('fill', color);
            });
          }
        }}
      />
    </Box>
  );
};

export default CustomSvgWrapper;
