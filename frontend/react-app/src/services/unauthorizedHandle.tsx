import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { subscribe, unsubscribe } from "./emitServer";
import { entryPage } from "../config/statics";
import { toast } from "react-toastify";

const UnauthorizedHandler: React.FC = () => {
  const navigate = useNavigate();
  const isSubscribed = useRef(false); 

  useEffect(() => {
    if (!isSubscribed.current) {
      const handleUnauthorized = (error?: any) => {
        console.error("Unauthorized error received:", error);
        navigate(entryPage, { state: { type: "user" } });
      };

      const handleBadRequest = (error?: any) => {
        toast.error(error?.message || "Bad Request!", {
          position: "top-right",
          autoClose: 3000,
        });
      };

      subscribe("unauthorized", handleUnauthorized);
      subscribe("badRequest", handleBadRequest);

      isSubscribed.current = true;

      return () => {
        unsubscribe("unauthorized", handleUnauthorized);
        unsubscribe("badRequest", handleBadRequest);
        isSubscribed.current = false; 
      };
    }
  }, [navigate]);

  return null; 
};

export default UnauthorizedHandler;
