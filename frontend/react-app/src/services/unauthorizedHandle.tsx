import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { subscribe, unsubscribe } from "./emitServer";
import { entryPage } from "../config/statics";
import { toast } from "react-toastify";

const UnauthorizedHandler: React.FC = () => {
  const navigate = useNavigate();
  const isSubscribed = useRef(false); // 确保订阅只发生一次

  useEffect(() => {
    if (!isSubscribed.current) {
      // 处理 Unauthorized 错误
      const handleUnauthorized = (error?: any) => {
        console.error("Unauthorized error received:", error);
        navigate(entryPage, { state: { type: "user" } });
      };

      // 处理 Bad Request 错误
      const handleBadRequest = (error?: any) => {
        toast.error(error?.message || "Bad Request!", {
          position: "top-right",
          autoClose: 3000,
        });
      };

      // 订阅事件
      subscribe("unauthorized", handleUnauthorized);
      subscribe("badRequest", handleBadRequest);

      // 设置为已订阅
      isSubscribed.current = true;

      // 清理函数：在组件销毁时取消订阅
      return () => {
        unsubscribe("unauthorized", handleUnauthorized);
        unsubscribe("badRequest", handleBadRequest);
        isSubscribed.current = false; // 重置订阅状态
      };
    }
  }, [navigate]);

  return null; // 不需要渲染任何内容
};

export default UnauthorizedHandler;
