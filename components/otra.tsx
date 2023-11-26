// pages/index.tsx

import React from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import styles from "./Table.module.css"; // Import your CSS module

interface TableRow {
  username: string;
  email: string;
  type: number;
}

interface TableProps {
  rows: TableRow[];
  deleteRow: (idx: number) => void;
  editRow: (idx: number) => void;
}

const Table: React.FC<TableProps> = ({ rows, deleteRow, editRow }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: TableRow, idx: number) => (
            <tr key={idx}>
              <td>{row.username}</td>
              <td className={styles.expand}>{row.email}</td>
              <td>
                <span>{row.type !== 1 ? "Admin" : "User"}</span>
              </td>
              <td className={styles.fit}>
                <span className={styles.actions}>
                  <BsFillTrashFill className={styles.deleteBtn} />
                  <BsFillPencilFill className={styles.editBtn} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
