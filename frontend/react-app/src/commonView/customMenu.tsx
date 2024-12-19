import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface CustomMenuProps {
  items: string[]; // 菜单项文本列表
  callbacks: Array<() => void>; // 每个菜单项的回调函数列表
  icon: React.ReactNode; // 显示菜单的触发图标
}

const CustomMenu: React.FC<CustomMenuProps> = ({ items, callbacks, icon }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault(); // 阻止默认右键菜单（可选）
    setAnchorEl(event.currentTarget); // 设置菜单位置
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      {/* 触发菜单的图标 */}
      <Box onClick={handleOpenMenu} onContextMenu={handleOpenMenu}>
        {icon}
      </Box>
      {/* 菜单组件 */}
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
