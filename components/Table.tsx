import React from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import "./Table2.css";

export const Table = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        backgroundColor: "#faf9f6",
      }}
    >
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mail</th>
            <th>User Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test</td>
            <td>test2</td>
            <td>
              <span>test3</span>
            </td>
            <td>
              <span>
                <BsFillTrashFill />
                <BsFillPencilFill />
              </span>
            </td>
          </tr>
          <tr>
            <td>Test</td>
            <td>test2</td>
            <td>
              <span>test3</span>
            </td>
            <td>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "40px",
                }}
              >
                <BsFillTrashFill />
                <BsFillPencilFill />
              </span>
            </td>
          </tr>
          <tr>
            <td>Test</td>
            <td>test2</td>
            <td>
              <span>test3</span>
            </td>
            <td>
              <span>
                <BsFillTrashFill />
                <BsFillPencilFill />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
