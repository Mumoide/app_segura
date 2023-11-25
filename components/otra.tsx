import React from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import "./Table.css";

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

export const Table = ({ rows, deleteRow, editRow }: TableProps) => {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: TableRow, idx: number) => {
            // const statusText =
            // row.status.charAt(0).toUpperCase() + row.status.slice(1);

            return (
              <tr key={idx}>
                <td>{row.username}</td>
                <td className="expand">{row.email}</td>
                <td>
                  <span>{row.type !== 1 ? "Admin" : "User"}</span>
                </td>
                <td className="fit">
                  <span className="actions">
                    <BsFillTrashFill
                      className="delete-btn"
                      onClick={() => deleteRow(idx)}
                    />
                    <BsFillPencilFill
                      className="edit-btn"
                      onClick={() => editRow(idx)}
                    />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
