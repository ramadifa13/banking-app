'use client';

import React from 'react';
import { useTable, usePagination } from 'react-table';

const Table = ({ columns, data, loading, pageIndex, pageSize, setPageIndex, setPageSize, pageCount }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex,
        pageSize,
      },
    },
    usePagination
  );

  return (
    <div>
      {loading ? (
        <div className="flex justify-center">Loading...</div>
      ) : data.length === 0 ? (
        <div className="flex justify-center text-gray-500">No data found</div>
      ) : (
        <table {...getTableProps()} className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th {...column.getHeaderProps()} key={columnIndex} className="py-2 px-4 border-b text-left">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={rowIndex} className="border-b">
                  {row.cells.map((cell, cellIndex) => (
                    <td {...cell.getCellProps()} key={cellIndex} className="py-2 px-4">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => setPageIndex(0)}
            disabled={pageIndex === 0}
            className="px-4 py-2 bg-gray-300 rounded-l-md disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="px-4 py-2 bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={pageIndex === pageCount - 1}
            className="px-4 py-2 bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={pageIndex === pageCount - 1}
            className="px-4 py-2 bg-gray-300 rounded-r-md disabled:opacity-50"
          >
            Last
          </button>
        </div>
        <div>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-4 py-2 border rounded-md"
          >
            {[10, 20, 30].map((size, index) => (
              <option key={index} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Table;
