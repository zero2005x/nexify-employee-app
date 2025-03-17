import React, { useState } from "react";
import PropTypes from "prop-types";
import "./App.css";
import { fetchEmployees, saveEmployee } from "./api";

/**
 * 格式化日期為 yyyy/mm/dd
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化後的日期字符串
 */
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // 如果無效則返回原始字符串

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
};

/**
 * 員工行元件 - 在表格中顯示單個員工信息
 * @param {Object} props - 元件屬性
 * @param {Object} props.emp - 員工數據對象
 * @returns {JSX.Element} 員工資料行
 */
const EmployeeRow = ({ emp }) => (
  <tr>
    <td className="p-2 border border-gray-300">{emp.Name}</td>
    <td className="p-2 border border-gray-300">
      {formatDate(emp.DateOfBirth)}
    </td>
    <td className="p-2 border border-gray-300">
      <input
        type="range"
        min="0"
        max="100000"
        value={emp.Salary}
        readOnly
        className="w-[100px] align-middle"
      />
      <span className="ml-2.5">{emp.Salary}</span>
    </td>
    <td className="p-2 border border-gray-300">{emp.Address}</td>
  </tr>
);
// 定義 EmployeeRow 元件的屬性類型
EmployeeRow.propTypes = {
  emp: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    DateOfBirth: PropTypes.string.isRequired,
    Salary: PropTypes.number.isRequired,
    Address: PropTypes.string.isRequired,
  }).isRequired,
};

/**
 * 新增員工行元件 - 提供輸入欄位以添加新員工
 * @param {Object} props - 元件屬性
 * @param {Object} props.newEmployee - 新員工數據對象
 * @param {Function} props.onChange - 輸入變更處理函數
 * @param {Object} props.errors - 表單驗證錯誤
 * @returns {JSX.Element} 新增員工表單行
 */
const AddEmployeeRow = ({ newEmployee, onChange, errors }) => (
  <tr>
    <td className="p-2 border border-gray-300">
      <input
        type="text"
        name="Name"
        value={newEmployee.Name}
        onChange={onChange}
        placeholder="Name"
        className="w-full p-1.5 box-border"
      />
      {errors.Name && (
        <span className="ml-2.5 text-red-500">{errors.Name}</span>
      )}
    </td>
    <td className="p-2 border border-gray-300">
      <input
        type="date"
        name="DateOfBirth"
        value={newEmployee.DateOfBirth}
        onChange={onChange}
        className="w-full p-1.5 box-border"
      />
      {errors.DateOfBirth && (
        <span className="ml-2.5 text-red-500">{errors.DateOfBirth}</span>
      )}
    </td>
    <td className="p-2 border border-gray-300">
      <input
        type="range"
        name="Salary"
        min="0"
        max="100000"
        value={newEmployee.Salary}
        onChange={onChange}
        className="w-[100px] align-middle"
      />
      <span className="ml-2.5">{newEmployee.Salary}</span>
    </td>
    <td className="p-2 border border-gray-300">
      <input
        type="text"
        name="Address"
        value={newEmployee.Address}
        onChange={onChange}
        placeholder="Address"
        className="w-full p-1.5 box-border"
      />
      {errors.Address && (
        <span className="ml-2.5 text-red-500">{errors.Address}</span>
      )}
    </td>
  </tr>
);

// 定義 AddEmployeeRow 元件的屬性類型
AddEmployeeRow.propTypes = {
  newEmployee: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    DateOfBirth: PropTypes.string.isRequired,
    Salary: PropTypes.number.isRequired,
    Address: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

/**
 * App 主要元件 - 管理整個應用程式的狀態和功能
 * @returns {JSX.Element} 完整的應用界面
 */
function App() {
  // 定義應用程式狀態
  const [employees, setEmployees] = useState([]); // 儲存所有員工數據
  const [newEmployee, setNewEmployee] = useState({
    Name: "",
    DateOfBirth: "",
    Salary: 0,
    Address: "",
  }); // 新員工表單數據
  const [showAddRow, setShowAddRow] = useState(false); // 控制是否顯示新增表單
  const [loading, setLoading] = useState(false); // 載入狀態
  const [error, setError] = useState(null); // 錯誤訊息
  const [successMessage, setSuccessMessage] = useState(null); // 成功訊息
  const [validationErrors, setValidationErrors] = useState({}); // 表單驗證錯誤

  /**
   * 從 API 載入員工數據
   * @async
   */
  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 處理表單輸入變更
   * @param {Event} e - 事件對象
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedEmployee = {
      ...newEmployee,
      [name]: name === "Salary" ? parseInt(value) || 0 : value,
    };
    setNewEmployee(updatedEmployee);

    // 即時驗證輸入
    const errors = { ...validationErrors };
    errors[name] = !value && name !== "Salary" ? `${name} is required` : "";
    if (name === "Salary" && (value < 0 || value > 100000))
      errors.Salary = "Salary must be 0-100000";
    setValidationErrors(errors);
  };

  /**
   * 儲存新員工數據到 API
   * @async
   */
  const handleSave = async () => {
    // 表單驗證
    const errors = {};
    if (!newEmployee.Name) errors.Name = "Name is required";
    if (!newEmployee.DateOfBirth)
      errors.DateOfBirth = "Date of Birth is required";
    if (!newEmployee.Address) errors.Address = "Address is required";
    setValidationErrors(errors);

    // 如果有錯誤則不繼續
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      // 合併現有員工數據與新增員工數據
      const updatedEmployees = [...employees, newEmployee];

      // 將所有員工數據一起發送到後端 API
      await saveEmployee(updatedEmployees);

      // 按照 Name 進行字典排序
      const sortedEmployees = [...updatedEmployees].sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );

      setSuccessMessage("Employee saved successfully!");
      setShowAddRow(false);
      setNewEmployee({ Name: "", DateOfBirth: "", Salary: 0, Address: "" });
      setValidationErrors({});

      // 更新本地狀態來反映新增的員工 (已按 Name 排序)
      setEmployees(sortedEmployees);
    } catch (err) {
      setError("Failed to save employee.");
    } finally {
      setLoading(false);
    }
  };

  // 渲染用戶界面
  return (
    <div className="p-5 font-sans">
      {/* 按鈕區域 */}
      <div className="flex justify-between mb-5">
        <button className="btn-add" onClick={() => setShowAddRow(true)}>
          Add
        </button>
        <button
          className={`btn-save ${!showAddRow || loading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleSave}
          disabled={!showAddRow || loading}
        >
          Save
        </button>
        <button className="btn-update" onClick={loadEmployees}>
          Update
        </button>
      </div>

      {/* 狀態訊息 */}
      {loading && <div className="text-blue-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}

      {/* 員工數據表 */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left border border-gray-300 bg-white-100">
              Name
            </th>
            <th className="p-2 text-left border border-gray-300 bg-white-100">
              Birthday
            </th>
            <th className="p-2 text-left border border-gray-300 bg-white-100">
              Salary
            </th>
            <th className="p-2 text-left border bg-white-100 border-white-300">
              Address
            </th>
          </tr>
        </thead>
        <tbody>
          {/* 顯示新增員工表單 (置於頂部) */}
          {showAddRow && (
            <AddEmployeeRow
              newEmployee={newEmployee}
              onChange={handleInputChange}
              errors={validationErrors}
            />
          )}
          {/* 顯示現有員工 */}
          {employees.map((emp, index) => (
            <EmployeeRow key={index} emp={emp} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
