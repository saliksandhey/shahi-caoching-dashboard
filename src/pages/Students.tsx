import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Search, Filter, Plus, Trash2, Users, Phone, MessageCircle, MoreVertical } from 'lucide-react';
import { NewStudentModal } from '../components/NewStudentModal';
import './Students.css';

export const Students: React.FC = () => {
  const { students, bulkUpdateStatus, bulkDeleteStudents, deleteStudent, error, openDrawer } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            student.mobile_number.includes(searchTerm);
      const matchesStatus = statusFilter ? student.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const toggleSelectStudent = (id: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  const handleBulkStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value && selectedStudents.size > 0) {
      bulkUpdateStatus(Array.from(selectedStudents), e.target.value as any);
      setSelectedStudents(new Set());
      e.target.value = '';
    }
  };


  const getWhatsAppLink = (mobile: string) => {
    const message = encodeURIComponent("Hello from Shahi Coaching.");
    const phone = String(mobile).replace(/\D/g, '');
    return `https://wa.me/${phone}?text=${message}`;
  };

  const getStatusBadgeClass = (status: string) => {
    return `status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="students-page animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Student Database</h2>
          <p className="subtitle">Manage registrations and student status.</p>
        </div>
        <div className="header-actions hide-on-mobile">
          <button className="btn-secondary">Export CSV</button>
          <button className="btn-primary" onClick={() => setIsAddStudentModalOpen(true)}>
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <strong>Error fetching data:</strong> {error}
        </div>
      )}

      <div className="table-container card glass-card">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search students..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field search-input"
              />
            </div>
            <div className="filter-box">
              <Filter size={16} className="filter-icon" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field select-field"
              >
                <option value="">All Statuses</option>
                <option value="New Lead">New Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Not Interested">Not Interested</option>
              </select>
            </div>
          </div>
          
          {selectedStudents.size > 0 && (
            <div className="bulk-actions animate-fade-in">
              <span className="selected-count">{selectedStudents.size} selected</span>
              <div className="bulk-controls">
                <select onChange={handleBulkStatusChange} className="input-field select-field bulk-select">
                  <option value="">Set Status...</option>
                  <option value="New Lead">New Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Not Interested">Not Interested</option>
                </select>
                <button 
                  className="btn-secondary icon-btn danger"
                  onClick={() => {
                    if(confirm('Are you sure you want to delete selected students?')) {
                      bulkDeleteStudents(Array.from(selectedStudents));
                      setSelectedStudents(new Set());
                    }
                  }}
                  title="Delete Selected"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input 
                    type="checkbox" 
                    className="custom-checkbox"
                    checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Student Name</th>
                <th>Father Name</th>
                <th>Contact</th>
                <th>City</th>
                <th>Date</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Users size={48} strokeWidth={1} />
                      </div>
                      <h3>No students found</h3>
                      <p>Adjust your search filters or add a new student to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const s = student as any;
                  return (
                    <tr key={student.id} className={selectedStudents.has(student.id) ? 'selected-row' : ''}>
                      <td className="checkbox-col">
                        <input 
                          type="checkbox" 
                          className="custom-checkbox"
                          checked={selectedStudents.has(student.id)}
                          onChange={() => toggleSelectStudent(student.id)}
                        />
                      </td>
                      <td>
                        <div className="student-name-cell" onClick={() => openDrawer(student)}>
                          <div className="student-avatar-small">
                            {student.full_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-main">{student.full_name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted">{s.father_name || '-'}</span>
                      </td>
                      <td>
                        <span className="text-main">{student.mobile_number}</span>
                      </td>
                      <td><span className="text-muted">{student.city}</span></td>
                      <td><span className="text-muted">{new Date(student.created_at).toLocaleDateString()}</span></td>
                      <td>
                        <span className={getStatusBadgeClass(student.status || 'New Lead')}>
                          {student.status || 'New Lead'}
                        </span>
                      </td>
                      <td className="actions-col">
                        <div className="table-actions">
                          <a href={`tel:${student.mobile_number}`} className="action-icon call-icon" title="Call">
                            <Phone size={16} />
                          </a>
                          <a href={getWhatsAppLink(student.mobile_number)} target="_blank" rel="noopener noreferrer" className="action-icon wa-icon" title="WhatsApp">
                            <MessageCircle size={16} />
                          </a>
                          <button 
                            className="action-icon delete-icon" 
                            style={{ color: '#ef4444' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if(confirm(`Are you sure you want to permanently delete ${student.full_name}?`)) {
                                deleteStudent(student.id);
                              }
                            }} 
                            title="Delete Student"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button className="action-icon view-icon" onClick={() => openDrawer(student)} title="View Details">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <NewStudentModal 
        isOpen={isAddStudentModalOpen} 
        onClose={() => setIsAddStudentModalOpen(false)} 
      />
    </div>
  );
};
