import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const TableStatus = () => {
  const [tables, setTables] = useState([]);

  // Fetch the current status of tables
  const fetchTables = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tables`);
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  useEffect(() => {
    // Fetch tables on component mount and every 30 seconds thereafter
    fetchTables();
    const interval = setInterval(fetchTables, 30000); // Polling every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h2>Tables Status</h2>
      <ul>
        {tables.map((table) => (
          <li key={table.tableNumber}>
            Table {table.tableNumber}: {table.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableStatus;
