/*
 * Filename: /Users/bakbeom/work/sm/surginus-htms/src/layout/gridLayout.ts
 * Path: /Users/bakbeom/work/sm/surginus-htms
 * Created Date: Wednesday, October 23rd 2024, 11:59:10 am
 * Author: bakbeom
 *
 * Copyright (c) 2024 BioCube
 */

import React from 'react';
import Grid2 from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import { s_full } from '../style/size';

type LayoutConfig = {
  areas: Array<{
    content: React.ReactNode;
    size?: number;
    backgroundColor?: string;
    height?: string;
    justifyContent?: string;
    alignItems?: string;
  }>;
  rowSpacing?: number;
  columnSpacing?: number;
  flexDirection?: 'row' | 'column';
};

export const generateGridLayout = (
  { areas, rowSpacing, columnSpacing }: LayoutConfig,
  flexDirection = 'row', //! inportant
) => {
  return (
    <Grid2
      container
      sx={{
        height: s_full,
        display: 'flex',
        flexDirection: flexDirection,
      }}
      rowSpacing={rowSpacing}
      columnSpacing={columnSpacing}
    >
      {areas.map((area, index) => {
        return (
          <Grid2
            key={index}
            size={area.size || 12}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: area.height || s_full,
            }}
          >
            <Box
              sx={{
                backgroundColor: area.backgroundColor || '#FFFFFFFF',
                display: 'flex',
                justifyContent: area.justifyContent
                  ? area.justifyContent
                  : 'center',
                alignItems: area.alignItems ? area.alignItems : 'center',
                height: area.height ? area.height : s_full,
                width: s_full,
              }}
            >
              {area.content}
            </Box>
          </Grid2>
        );
      })}
    </Grid2>
  );
};
