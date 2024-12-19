import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subscribe, unsubscribe } from "./emitServer";
import { entryPage } from "../config/statics";

const UnauthorizedHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate(entryPage, { state: { type: "user" } });
    };

    subscribe("unauthorized", handleUnauthorized);

    return () => {
      unsubscribe("unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  return null; // 不需要渲染任何内容
};

export default UnauthorizedHandler;
