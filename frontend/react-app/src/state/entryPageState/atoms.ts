

// recoil/entryPage/atoms.ts
import { atom } from 'recoil';
import { AuthState } from '../../models/authModel';



// 定义 authState atom
export const authState = atom<AuthState>({
  key: 'authState', // 唯一的 key，标识该 atom
  default: {
    isLoggedIn: false, // 初始状态为未登录
    token: null,       // 初始状态没有 token
  },
}
);


