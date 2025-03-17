import React, { useState } from "react";
import PropTypes from "prop-types";
import "./App.css";
import { fetchEmployees, saveEmployee } from "./api";

/**
 * 將日期字串轉換為 yyyy-mm-dd 格式，用於 date 輸入框
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化後的日期字符串
 */
const parseDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // 若無法解析，返回空字串
  return date.toISOString().split("T")[0]; // 轉為 yyyy-mm-dd
};

/**
 * 格式化日期為 yyyy/mm/dd
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化後的日期字符串
 */
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  console.log(`${year}/${month}/${day}`);
  return `${year}/${month}/${day}`;
};

/**
 * 員工行元件 - 在表格中顯示單個員工信息，支持編輯模式
 */
let EmployeeRow = ({ emp, isEditing, onChange }) => {
  if (isEditing) {
    return (
      <tr>
        <td className="p-2 border border-gray-300">
          <input
            type="text"
            name="Name"
            value={emp.Name}
            onChange={(e) => onChange(emp, e)}
            className="w-full p-1.5 box-border"
          />
        </td>
        <td className="p-2 border border-gray-300">
          <input
            type="date"
            name="DateOfBirth"
            value={emp.DateOfBirth}
            onChange={(e) => onChange(emp, e)}
            className="w-full p-1.5 box-border"
          />
        </td>
        <td className="p-2 border border-gray-300">
          <input
            type="range"
            name="Salary"
            min="0"
            max="100000"
            value={emp.Salary}
            onChange={(e) => onChange(emp, e)}
            className="w-[100px] align-middle"
          />
          <span className="ml-2.5">{emp.Salary}</span>
        </td>
        <td className="p-2 border border-gray-300">
          <input
            type="text"
            name="Address"
            value={emp.Address}
            onChange={(e) => onChange(emp, e)}
            className="w-full p-1.5 box-border"
          />
        </td>
      </tr>
    );
  }

  return (
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
};

EmployeeRow.propTypes = {
  emp: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    DateOfBirth: PropTypes.string.isRequired,
    Salary: PropTypes.number.isRequired,
    Address: PropTypes.string.isRequired,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

/**
 * 新增員工行元件 - 提供輸入欄位以添加新員工
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
 */
function App() {
  const [employees, setEmployees] = useState([]);
  const [editedEmployees, setEditedEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    Name: "",
    DateOfBirth: "",
    Salary: 0,
    Address: "",
  });
  const [showAddRow, setShowAddRow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      if (data && data.length > 0) {
        const formattedData = data.map((emp) => ({
          ...emp,
          DateOfBirth: parseDateForInput(emp.DateOfBirth),
        }));
        setEmployees(formattedData);
        setEditedEmployees(formattedData);
        setIsEditing(true);
        setError(null);
      } else {
        setError("No employees found.");
        setEmployees([]);
        setEditedEmployees([]);
      }
    } catch (err) {
      setError("Failed to load employees.");
      setEmployees([]);
      setEditedEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedEmployee = {
      ...newEmployee,
      [name]: name === "Salary" ? parseInt(value) || 0 : value,
    };
    setNewEmployee(updatedEmployee);

    const errors = { ...validationErrors };
    errors[name] = !value && name !== "Salary" ? `${name} is required` : "";
    if (name === "Salary" && (value < 0 || value > 100000))
      errors.Salary = "Salary must be 0-100000";
    setValidationErrors(errors);
  };

  const handleEmployeeChange = (employee, e) => {
    const { name, value } = e.target;
    const updatedEmployee = {
      ...employee,
      [name]: name === "Salary" ? parseInt(value) || 0 : value,
    };
    const updatedEmployees = editedEmployees.map((emp) =>
      emp === employee ? updatedEmployee : emp
    );
    setEditedEmployees(updatedEmployees);
  };

  const handleSave = async () => {
    const errors = {};
    if (!newEmployee.Name) errors.Name = "Name is required";
    if (!newEmployee.DateOfBirth)
      errors.DateOfBirth = "Date of Birth is required";
    if (!newEmployee.Address) errors.Address = "Address is required";
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const updatedEmployees = [...employees, newEmployee];
      await saveEmployee(updatedEmployees);
      const sortedEmployees = [...updatedEmployees].sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );
      setSuccessMessage("Employee saved successfully!");
      setShowAddRow(false);
      setNewEmployee({ Name: "", DateOfBirth: "", Salary: 0, Address: "" });
      setValidationErrors({});
      setEmployees(sortedEmployees);
      setEditedEmployees(sortedEmployees); // Sync editedEmployees
    } catch (err) {
      setError("Failed to save employee.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (isEditing) {
      setLoading(true);
      try {
        await saveEmployee(editedEmployees);
        setEmployees(editedEmployees);
        setIsEditing(false);
        setSuccessMessage("All changes saved successfully!");
        setError(null);
      } catch (err) {
        setError("Failed to save changes.");
      } finally {
        setLoading(false);
      }
    } else {
      await loadEmployees();
    }
  };

  return (
    <div className="p-5 font-sans">
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
        <button className="btn-update" onClick={handleUpdate}>
          Update
        </button>
      </div>

      {loading && <div className="text-blue-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}

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
          {showAddRow && (
            <AddEmployeeRow
              newEmployee={newEmployee}
              onChange={handleInputChange}
              errors={validationErrors}
            />
          )}
          {employees.map((emp, index) => {
            const editedEmp = editedEmployees[index];
            if (!editedEmp) return null;
            return (
              <EmployeeRow
                key={index} // Replace with emp.id if available
                emp={editedEmp}
                isEditing={isEditing}
                onChange={handleEmployeeChange}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default App;
