import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { subscribe, unsubscribe } from "./emitServer";
import { entryPage } from "../config/statics";
import { toast } from "react-toastify";

const UnauthorizedHandler: React.FC = () => {
  const navigate = useNavigate();
  const isSubscribed = useRef(false); // Tracks if the component has subscribed to events / 이벤트에 구독했는지 추적

  useEffect(() => {
    if (!isSubscribed.current) {
      // Handles unauthorized events and navigates to the entry page / 권한 없음 이벤트를 처리하고 entry 페이지로 이동
      const handleUnauthorized = (error?: any) => {
        console.error("Unauthorized error received:", error); // Log the error / 에러를 로그로 출력
        navigate(entryPage, { state: { type: "user" } }); // Navigate to the entry page with user state / user 상태로 entry 페이지로 이동
      };

      // Handles bad request events and shows a toast notification / 잘못된 요청 이벤트를 처리하고 알림을 표시
      const handleBadRequest = (error?: any) => {
        toast.error(error?.message || "Bad Request!", {
          position: "top-right", // Toast appears in the top-right corner / 알림이 오른쪽 상단에 표시됨
          autoClose: 3000, // Automatically closes after 3 seconds / 3초 후 자동 닫힘
        });
      };

      // Subscribe to events / 이벤트 구독
      subscribe("unauthorized", handleUnauthorized); // Subscribe to unauthorized events / 권한 없음 이벤트에 구독
      subscribe("badRequest", handleBadRequest); // Subscribe to bad request events / 잘못된 요청 이벤트에 구독

      isSubscribed.current = true; // Mark as subscribed / 구독 상태로 표시

      // Cleanup function to unsubscribe from events / 이벤트 구독 해제를 위한 정리 함수
      return () => {
        unsubscribe("unauthorized", handleUnauthorized); // Unsubscribe from unauthorized events / 권한 없음 이벤트 구독 해제
        unsubscribe("badRequest", handleBadRequest); // Unsubscribe from bad request events / 잘못된 요청 이벤트 구독 해제
        isSubscribed.current = false; // Reset subscription status / 구독 상태 초기화
      };
    }
  }, [navigate]); // Depend on navigate for navigation / 이동에 필요한 navigate 의존성 추가

  return null; // This component renders nothing / 이 컴포넌트는 아무것도 렌더링하지 않음
};

export default UnauthorizedHandler;
