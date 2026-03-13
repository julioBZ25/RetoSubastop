import type { Middleware } from "@reduxjs/toolkit";

export const actionLoggerMiddleware: Middleware =
  (api) => (next) => (action) => {
    if (process.env.NODE_ENV !== "development") {
      return next(action);
    }
    console.groupCollapsed(
      `[Redux] ${String((action as { type: string }).type)}`,
    );
    console.log("prev state:", api.getState());
    console.log("action:", action);
    const result = next(action);
    console.log("next state:", api.getState());
    console.groupEnd();
    return result;
  };
