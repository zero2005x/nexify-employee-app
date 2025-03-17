# Nexify 員工應用程式

一個基於 React 的網頁應用程式，用於管理員工記錄，具有 CRUD 功能。

## 線上展示

訪問線上應用程式：[https://nexify-employee-app.vercel.app/](https://nexify-employee-app.vercel.app/)

## 程式碼庫

原始碼：[https://github.com/zero2005x/nexify-employee-app](https://github.com/zero2005x/nexify-employee-app)

## 功能特點

- **檢視員工**：以表格格式顯示員工資訊
- **新增員工**：創建新的員工記錄並進行驗證
- **編輯員工**：更新現有員工資訊
- **表單驗證**：確保所有必填欄位正確完成
- **響應式設計**：使用 Tailwind CSS 實現的行動裝置友好介面

## 技術堆疊

- **前端**：React.js
- **樣式**：Tailwind CSS
- **API 整合**：Fetch API 與 Vercel 無伺服器函數
- **部署**：Vercel
- **套件管理**：npm
- **表單驗證**：自訂驗證實作
- **代理設定**：用於 API 轉發的 Vercel 重寫規則

## 開始使用

### 系統需求

- Node.js (v16.0.0 或更高版本)
- npm (v8.0.0 或更高版本)

### 安裝步驟

1. 複製程式碼庫：

```bash
git clone https://github.com/zero2005x/nexify-employee-app.git
cd nexify-employee-app
```

2. 安裝相依套件：

```bash
npm install
```

3. 啟動開發伺服器：

```bash
npm start
```

4. 應用程式將在 `http://localhost:3000` 可用

## 生產環境建置

```bash
npm run build
```

這將在 `build` 資料夾中創建生產環境建置檔案。

## API 整合

應用程式透過 Vercel 的重寫規則與後端 API 通訊：

- `GET /api/Record/GetRecords`：獲取員工記錄
- `POST /api/Record/SaveRecords`：儲存員工資料

API 代理設定在 vercel.json 中定義，將請求重定向到 `http://nexifytw.mynetgear.com:45000/api/`。

## 員工資料結構

```javascript
{
  Name: string,         // 員工全名
  DateOfBirth: string,  // 日期格式：yyyy-mm-dd
  Salary: number,       // 薪資金額 (0-100000)
  Address: string       // 實體地址
}
```

## 使用說明

1. **檢視員工**：點擊「更新」按鈕載入現有員工
2. **新增員工**：點擊「新增」按鈕顯示輸入列
3. **儲存新員工**：填寫表單並點擊「儲存」
4. **編輯員工**：載入員工後，在編輯模式下修改他們的資訊
5. **儲存變更**：編輯後點擊「更新」按鈕

## 開發指令

- `npm start`：啟動開發伺服器
- `npm test`：執行測試
- `npm run build`：產生生產環境建置
- `npm run lint`：程式碼檢查
- `npm run format`：使用 prettier 格式化程式碼

## 授權條款

MIT 授權 - 詳見 package.json
