import React from 'react';
import type { Student } from '../types/database';
import './StudentPDFTemplate.css';

interface StudentPDFTemplateProps {
  student: Student;
  pdfRef: React.RefObject<HTMLDivElement | null>;
}

export const StudentPDFTemplate: React.FC<StudentPDFTemplateProps> = ({ student, pdfRef }) => {
  const s = student as any;
  const registrationDate = new Date(student.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="pdf-hidden-container">
      <div className="pdf-document" ref={pdfRef}>
        
        {/* Header / Branding */}
        <div className="pdf-header">
          <div className="pdf-brand-container">
            <h1 className="pdf-brand-title">SHAHI COACHING</h1>
            <p className="pdf-brand-subtitle">Professional Stitching & Tailoring Training Institute</p>
          </div>
          <div className="pdf-doc-meta">
            <div className="pdf-meta-badge">OFFICIAL RECORD</div>
            <p className="pdf-date">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Title */}
        <div className="pdf-title-bar">
          <h2>Student Registration Profile</h2>
          <div className="pdf-status">
            Status: <strong>{student.status || 'New Lead'}</strong>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="pdf-content-grid">
          
          {/* Personal Info */}
          <div className="pdf-section">
            <h3 className="pdf-section-title">Personal Information</h3>
            <div className="pdf-info-table">
              <div className="pdf-info-row">
                <span className="pdf-label">Full Name</span>
                <span className="pdf-value">{student.full_name}</span>
              </div>
              <div className="pdf-info-row">
                <span className="pdf-label">Father/Guardian Name</span>
                <span className="pdf-value">{s.father_name || 'N/A'}</span>
              </div>
              <div className="pdf-info-row">
                <span className="pdf-label">Age</span>
                <span className="pdf-value">{student.age} Years</span>
              </div>
              <div className="pdf-info-row">
                <span className="pdf-label">Mobile Number</span>
                <span className="pdf-value">{student.mobile_number}</span>
              </div>
              <div className="pdf-info-row">
                <span className="pdf-label">Email Address</span>
                <span className="pdf-value">{student.email_address || 'N/A'}</span>
              </div>
              <div className="pdf-info-row">
                <span className="pdf-label">City</span>
                <span className="pdf-value">{student.city}</span>
              </div>
              <div className="pdf-info-row">
                <span className="pdf-label">Short Address</span>
                <span className="pdf-value">{s.short_address || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Training Info */}
          <div className="pdf-section">
            <h3 className="pdf-section-title">Training Details</h3>
            <div className="pdf-info-table">
              <div className="pdf-info-row">
                <span className="pdf-label">Registration Date</span>
                <span className="pdf-value">{registrationDate}</span>
              </div>
              <div className="pdf-info-row">
                <span className="pdf-label">Current Skill Level</span>
                <span className="pdf-value">{student.skill_level}</span>
              </div>
              <div className="pdf-info-row pdf-col-layout">
                <span className="pdf-label">Selected Skills for Training</span>
                <div className="pdf-skills-list">
                  {Array.isArray(student.skills_to_learn) 
                    ? student.skills_to_learn.map((skill, idx) => (
                        <div key={idx} className="pdf-skill-tag">• {skill}</div>
                      ))
                    : student.skills_to_learn ? (
                        <div className="pdf-skill-tag">• {String(student.skills_to_learn)}</div>
                      ) : <div className="pdf-muted">None specified</div>
                  }
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Additional Notes */}
        {student.additional_notes && (
          <div className="pdf-section">
            <h3 className="pdf-section-title">Student Notes</h3>
            <div className="pdf-note-box">
              {student.additional_notes}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pdf-footer">
          <p>This is a system generated document. If you have any questions, please contact the administration.</p>
          <div className="pdf-footer-brand">Shahi Coaching © {new Date().getFullYear()}</div>
        </div>

      </div>
    </div>
  );
};
