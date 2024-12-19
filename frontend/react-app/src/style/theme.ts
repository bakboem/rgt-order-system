import { createTheme, darken } from '@mui/material/styles';
import { as_center, as_full, as_start } from './align';
import { s_buttonHeight, s_borderRadius } from './size';
import { c_bg } from './colors';
import {
  c_warning,
  c_info,
  c_second,
  c_success,
  c_white,
  c_gray,
  c_dis_text,
  c_error,
  c_primary,
  c_hint_text,
  c_text,
  c_sub_text,
} from './colors';

// 创建动态生成主题的函数，允许你根据 primaryColor 动态控制相关颜色
function generateTheme(primaryColor: string) {
  return createTheme({
    palette: {
      primary: {
        main: primaryColor, // 主色调
        contrastText: c_white, // 文字颜色
      },
      secondary: {
        main: c_second, // 次色调
        contrastText: c_white,
      },
      background: {
        default: c_gray, // 默认背景色
        paper: c_white, // 卡片和弹窗的背景色
      },
      text: {
        primary: c_text, // 主文本颜色
        secondary: c_hint_text, // 次文本颜色
        disabled: c_dis_text, // 禁用文本颜色
      },
      error: {
        main: c_error,
        contrastText: c_white,
      },
      warning: {
        main: c_warning,
        contrastText: c_white,
      },
      info: {
        main: c_info,
        contrastText: c_white,
      },
      success: {
        main: c_success,
        contrastText: c_white,
      },
      divider: c_bg, // 分隔线颜色
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif', // 全局字体设置
      h1: {
        fontSize: 'clamp(2rem, 2vw + 1rem, 3rem)', // 动态调整字体大小
        fontWeight: 600,
        letterSpacing: '0.02em',
        color: c_text,
      },
      h2: {
        fontSize: 'clamp(1.75rem, 1.5vw + 1rem, 2.5rem)', // 动态调整字体大小
        fontWeight: 600,
        letterSpacing: '0.02em',
        color: c_text,
      },
      h3: {
        fontSize: 'clamp(1.5rem, 1.2vw + 1rem, 2rem)',
        fontWeight: 600,
        color: c_text,
      },
      h4: {
        fontSize: 'clamp(1.25rem, 1vw + 0.75rem, 1.75rem)',
        fontWeight: 600,
        color: c_text,
      },
      h5: {
        fontSize: 'clamp(0.75rem, 0.6vw + 0.3rem, 1rem)',
        fontWeight: 600,
        color: c_text,
      },
      h6: {
        fontSize: 'clamp(0.625rem, 0.4vw + 0.4rem, 0.875rem)',
        fontWeight: 500,
        color: c_text,
      },
      body1: {
        fontSize: 'clamp(0.75rem, 0.6vw + 0.6rem, 1rem)',
        color: c_sub_text,
        // fontWeight: 200,
      },
      body2: {
        fontSize: 'clamp(0.625rem, 0.4vw + 0.4rem, 0.875rem)',
        color: c_sub_text,
      },

      button: {
        fontSize: 'clamp(0.75rem, 0.5vw + 0.5rem, 1rem)',
        fontWeight: 600,
        textTransform: 'uppercase',
      },
      caption: {
        fontSize: 'clamp(0.625rem, 0.4vw + 0.4rem, 0.875rem)',
        color: '#999999',
      },
      subtitle1: {
        fontSize: 'clamp(0.75rem, 0.6vw + 0.6rem, 1rem)',
        color: c_text,
      },
      subtitle2: {
        fontSize: 'clamp(0.625rem, 0.4vw + 0.4rem, 0.875rem)',
        color: c_text,
      },
    },
    spacing: 8, // 间距单位为8px
    shape: {
      borderRadius: 12, // 全局圆角设置
    },
    components: {
      // 其他组件配置
      MuiCssBaseline: {
        styleOverrides: {
          iframe: {
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            textTransform: 'none',
          },
          containedPrimary: {
            backgroundColor: primaryColor,
            '&:hover': {
              backgroundColor: darken(primaryColor, 0.2),
            },
          },
          containedSecondary: {
            backgroundColor: c_second,
            '&:hover': {
              backgroundColor: darken(c_second, 0.2),
            },
          },
          // 覆盖不同size的样式
          sizeSmall: {
            padding: '6px 12px',
            fontSize: '0.75rem',
          },
          sizeMedium: {
            padding: '10px 20px',
            fontSize: '0.875rem',
          },
          sizeLarge: {
            padding: '12px 24px',
            fontSize: '1rem',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 阴影效果
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: primaryColor, // AppBar 使用动态主色调
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            padding: '16px',
            borderRadius: '16px',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            // TextField 根样式
            '& .MuiOutlinedInput-root': {
              height: s_buttonHeight, // 设置统一的高度
              borderRadius: s_borderRadius, // 设置圆角
              paddingRight: '10px', // 设置右边距
              paddingLeft: '20px', // 设置左边距
              '& input': {
                padding: '0px', // 输入框内 padding 清零
                display: 'flex',
                alignItems: as_center, // 确保输入框内的内容垂直居中
              },
              '& ::placeholder': {
                textAlign: as_start, // 占位符居中
                opacity: 0.5, // 显示占位符
              },
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '1px', // 设置焦点时的边框粗细
            },
            height: s_buttonHeight, // 确保高度正确
            padding: '0 12px', // 水平 padding
            alignItems: as_full, // 垂直居中对齐
          },
          input: {
            textAlign: 'start', // 水平对齐
            padding: '0', // 移除垂直方向的 padding
            lineHeight: 1.5, // 调整行高，确保文字垂直居中
            height: '100%', // 确保输入框的高度充满容器
            boxSizing: 'border-box', // 确保内边距不会影响高度
          },
          notchedOutline: {
            borderColor: 'gray', // 自定义边框颜色
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            margin: '16px 0',
            backgroundColor: c_bg,
          },
        },
      },
    },
  });
}

// 通过函数动态创建主题
export const appTheme = generateTheme(c_primary); // 调用函数并传入主色调
