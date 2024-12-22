import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface CustomMenuProps {
  items: string[]; 
  callbacks: Array<() => void>; 
  icon: React.ReactNode; 
}

const CustomMenu: React.FC<CustomMenuProps> = ({ items, callbacks, icon }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault(); 
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box onClick={handleOpenMenu} onContextMenu={handleOpenMenu}>
        {icon}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPaper-root': {
            width: '150px',
            borderRadius: '8px',
          },
        }}
        MenuListProps={{
          disablePadding: true,
          autoFocusItem: false,
        }}
        container={document.body}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleCloseMenu();
              callbacks[index]?.(); // 执行对应的回调函数
            }}
            sx={{
              fontSize: '14px',
              '&.Mui-selected': {
                backgroundColor: '#6200ea', // 选中项的背景色
                color: '#ffffff',
              },
            }}
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CustomMenu;
