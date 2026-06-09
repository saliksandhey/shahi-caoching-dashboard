import React, { useState, useEffect, useRef } from 'react';
import type { Student } from '../types/database';
import { X, Phone, MessageCircle, StickyNote, User, FileDown, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { StudentPDFTemplate } from './StudentPDFTemplate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './StudentDrawer.css';

interface StudentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const StudentDrawer: React.FC<StudentDrawerProps> = ({ isOpen, onClose, student }) => {
  const { updateStudentStatus, updateAdminNotes, deleteStudent } = useStore();
  const [adminNotes, setAdminNotes] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (student) {
      setAdminNotes(student.admin_notes || '');
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStudentStatus(student.id, e.target.value as any);
  };

  const handleSaveNotes = () => {
    updateAdminNotes(student.id, adminNotes);
    alert('Notes saved successfully');
  };

  const getWhatsAppLink = () => {
    if (!student.mobile_number) return '#';
    const message = encodeURIComponent("Hello, thank you for registering for our Stitching Training Program.");
    const phone = String(student.mobile_number).replace(/\D/g, '');
    return `https://wa.me/${phone}?text=${message}`;
  };

  const generatePDF = async () => {
    if (!pdfRef.current || !student) return;
    
    try {
      setIsGeneratingPDF(true);
      
      // Capture the hidden div
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2, // Higher scale for better crispness
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${student.full_name.replace(/\s+/g, '_')}_Profile.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const s = student as any;

  return (
    <>
      <div className="drawer-overlay animate-fade-in" onClick={onClose} />
      <div className="drawer-container animate-slide-up">
        <div className="drawer-content-box">
          <div className="drawer-header">
            <div className="drawer-profile-container">
              <div className="drawer-avatar">
                {student.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="drawer-title-area">
                <h3>{student.full_name}</h3>
                <div className="drawer-status">
                  <select 
                    className={`status-badge status-${(student.status || 'New Lead').toLowerCase().replace(/\s+/g, '-')} clean-select`}
                    value={student.status || 'New Lead'} 
                    onChange={handleStatusChange}
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>
              </div>
            </div>
            <button className="icon-btn close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="drawer-scroll-area">
            <div className="drawer-actions-grid">
              <a href={`tel:${student.mobile_number}`} className="drawer-btn call-btn">
                <Phone size={16} /> Call
              </a>
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="drawer-btn wa-btn">
                <MessageCircle size={16} /> WhatsApp
              </a>
              <button 
                className="drawer-btn pdf-btn" 
                onClick={generatePDF}
                disabled={isGeneratingPDF}
              >
                <FileDown size={16} /> {isGeneratingPDF ? 'Gen...' : 'PDF'}
              </button>
            </div>

            <div className="info-group">
              <h4 className="group-title">Personal Information</h4>
              <div className="info-card">
                <div className="info-row">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{student.full_name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Father Name</span>
                  <span className="info-value">{s.father_name || 'Not Provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Mobile Number</span>
                  <span className="info-value">{student.mobile_number}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value">{student.email_address || 'Not Provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Age</span>
                  <span className="info-value">{student.age} Years</span>
                </div>
                <div className="info-row">
                  <span className="info-label">City</span>
                  <span className="info-value">{student.city}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Short Address</span>
                  <span className="info-value">{s.short_address || 'Not Provided'}</span>
                </div>
              </div>
            </div>

            <div className="info-group">
              <h4 className="group-title">Training Information</h4>
              <div className="info-card">
                <div className="info-row">
                  <span className="info-label">Skill Level</span>
                  <span className="info-value">
                    <span className="skill-badge">{student.skill_level}</span>
                  </span>
                </div>
                <div className="info-row col-stack">
                  <span className="info-label">Skills Selected For Learning</span>
                  <div className="tags mt-2">
                    {Array.isArray(student.skills_to_learn) 
                      ? student.skills_to_learn.map((skill, idx) => (
                          <span key={idx} className="tag">{skill}</span>
                        ))
                      : student.skills_to_learn ? (
                          <span className="tag">{String(student.skills_to_learn)}</span>
                        ) : <span className="text-muted">None specified</span>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="info-group">
              <h4 className="group-title">Additional Notes</h4>
              <div className="notes-container">
                {student.additional_notes && (
                  <div className="note-block student-note">
                    <div className="note-header">
                      <User size={14} /> Student Note
                    </div>
                    <p className="note-body">{student.additional_notes}</p>
                  </div>
                )}

                <div className="note-block admin-note">
                  <div className="note-header">
                    <StickyNote size={14} /> Admin Notes
                  </div>
                  <textarea 
                    className="input-field notes-textarea mt-2" 
                    placeholder="Add private notes here..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                  />
                  <button className="btn-primary mt-3" onClick={handleSaveNotes}>
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="drawer-footer" style={{ padding: '20px', borderTop: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="drawer-btn" 
            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', background: 'transparent' }}
            onClick={() => {
              if(confirm(`Are you sure you want to permanently delete ${student.full_name}?`)) {
                deleteStudent(student.id);
                onClose();
              }
            }}
          >
            <Trash2 size={16} /> Delete Profile
          </button>
        </div>
      </div>
      <StudentPDFTemplate student={student} pdfRef={pdfRef} />
    </>
  );
};
