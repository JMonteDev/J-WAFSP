export default function AntlrErrorReport({ errorsByFile }) {
  if (!errorsByFile || errorsByFile.length === 0) {
    return <p style={{ fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif" }}>No syntax errors have been detected.</p>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      {errorsByFile.map(({ path, errors }) => (
        <div
          key={path}
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            border: '1px solid #f00',
            borderRadius: '4px',
            backgroundColor: '#ffecec',
          }}
        >
          <h3 style={{ margin: 0, color: '#900' }}>{path}</h3>
          <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, listStyleType: 'disc' }}>
            {errors.map((err, i) => (
              <li key={i} style={{ marginBottom: '0.25rem' }}>
                <strong>Line {err.line}, Col {err.column}:</strong> {err.msg}
                {err.offending_symbol && (
                  <em style={{ marginLeft: '0.5rem' }}>(symbol: “{err.offending_symbol}”)</em>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
