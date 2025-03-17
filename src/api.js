/**
 * API 服務基礎 URL
 */
//const API_BASE_URL = "http://nexifytw.mynetgear.com:45000";

/**
 * 從 API 獲取員工數據
 * @async
 * @returns {Promise<Array>} 員工數據陣列
 * @throws {Error} 若獲取失敗則拋出錯誤
 */
export const fetchEmployees = async () => {
  const response = await fetch("/api/Record/GetRecords");
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  const data = await response.json();
  return data.Data; // 假設員工數據在 Data 欄位中
};

/**
 * 將員工數據保存到 API
 * @async
 * @param {Array|Object} employees - 單個員工對象或員工數據陣列
 * @returns {Promise<Object>} API 回應
 * @throws {Error} 若保存失敗則拋出錯誤
 */
export const saveEmployee = async (employees) => {
  // 如果傳入單個員工對象，則將其包裝成陣列
  const employeesArray = Array.isArray(employees) ? employees : [employees];

  const response = await fetch(`/api/Record/SaveRecords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // 指定內容類型為 JSON
    },
    body: JSON.stringify(employeesArray),
  });

  if (!response.ok) {
    throw new Error("Failed to save employees");
  }
  const data = await response.json();
  return data;
};
