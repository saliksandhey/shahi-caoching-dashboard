import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { FileText, Download, Save } from 'lucide-react';
import './OtherPages.css';


export const Exports: React.FC = () => {
  const { students } = useStore();

  const handleExportCSV = () => {
    // Mock export
    const csvData = [
      ['Name', 'Mobile', 'City', 'Status', 'Date'],
      ...students.map(s => [s.full_name, s.mobile_number, s.city, s.status || 'New Lead', new Date(s.created_at).toLocaleDateString()])
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'students_export.csv');
    a.click();
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Data Exports</h2>
          <p className="subtitle">Download your registration data.</p>
        </div>
      </div>

      <div className="card export-card">
        <FileText size={48} className="export-icon" />
        <h3>Export Students to CSV</h3>
        <p className="text-muted text-center mb-6">
          Download a complete list of all {students.length} registered students including their personal information and training details.
        </p>
        <button className="btn-primary" onClick={handleExportCSV}>
          <Download size={18} /> Download CSV
        </button>
      </div>
    </div>
  );
};

export const Settings: React.FC = () => {
  const { instituteName } = useStore();
  const [name, setName] = useState(instituteName);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p className="subtitle">Manage institute preferences.</p>
        </div>
      </div>

      <div className="card max-w-2xl">
        <h3 className="section-title">General Settings</h3>
        <div className="form-container mt-4">
          <div className="form-group">
            <label>Institute Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input type="email" className="input-field" defaultValue="admin@stitchinginstitute.com" />
          </div>
          <div className="form-group">
            <label>WhatsApp Number (For API)</label>
            <input type="text" className="input-field" defaultValue="+1234567890" />
          </div>
          
          <div className="pt-4 border-t">
            <button className="btn-primary" onClick={() => alert('Settings saved!')}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
