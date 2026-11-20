import { cx } from '../ui.jsx';

export function DataTable({ caption, headings, rows, className = "" }) {
  return (
    <div className="reference-board-table-wrap">
      <table className={className}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {headings.map((heading) => (
              <th scope="col" key={heading}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${caption}-${index}`}>
              {row.map((cell, i) => (
                <td key={`${caption}-${index}-${i}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
