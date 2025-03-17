import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // 引入全局樣式
import App from "./App"; // 引入主要應用元件

/**
 * 創建 React 根元素並渲染應用
 * 使用 StrictMode 進行額外的開發檢查
 */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
