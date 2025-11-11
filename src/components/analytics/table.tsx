interface DataTableProps {
  headers: string[];
  data: Record<string, string | number | boolean | null>[];
}

const DataTable: React.FC<DataTableProps> = ({ headers, data }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className={`py-2 ${index === headers.length - 1 ? "text-right" : "text-left"}`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className={`py-2 ${cellIndex === Object.values(row).length - 1 ? "text-right" : ""}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
