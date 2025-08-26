import React, { useState, useEffect } from 'react';

interface ActivityLog {
  id: string;
  timestamp: string;
  tableName: string;
  recordId: string;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}

interface ActivityLogsProps {
  onBackToDashboard: () => void;
}

const ActivityLogs: React.FC<ActivityLogsProps> = ({ onBackToDashboard }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivityLogs();
  }, []);

  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      const allLogs = await window.electronAPI.getAllActivityLogs();
      setLogs(allLogs);
      console.log("Loaded activity logs:", allLogs);
    } catch (error) {
      console.error("Error loading activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return '#27ae60';
      case 'UPDATE':
        return '#f39c12';
      case 'DELETE':
        return '#e74c3c';
      default:
        return '#3498db';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading activity logs...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        padding: '20px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>📊 Activity Logs</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onBackToDashboard}
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="items-form">
        <h2>🔄 System Activity History</h2>
        
        {logs.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px", 
            color: "#666", 
            background: "#f8f9fa", 
            borderRadius: "8px" 
          }}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>📝 No activity logs found</div>
            <div>Activity will appear here when you make changes to rooms, items, or invoices.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              background: 'white', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              <thead>
                <tr style={{ background: '#2c3e50', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date & Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Action</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Table</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Field</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Old Value</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>New Value</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>User</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px' }}>
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                      <span style={{
                        background: getActionColor(log.action),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                      {log.tableName}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', maxWidth: '200px' }}>
                      {log.description}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px' }}>
                      {log.fieldName || '-'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px' }}>
                      {log.oldValue || '-'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '12px' }}>
                      {log.newValue || '-'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                      {log.userId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
