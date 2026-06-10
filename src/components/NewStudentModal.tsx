import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, Save } from 'lucide-react';
import { useStore } from '../store/useStore';
import './NewStudentModal.css';

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewStudentModal: React.FC<NewStudentModalProps> = ({ isOpen, onClose }) => {
  const { addStudent } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    mobile_number: '',
    email_address: '',
    date_of_birth: '',
    city: '',
    short_address: '',
    skill_level: 'I am completely new',
    status: 'New Lead',
    additional_notes: ''
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Basic validation
    if (!formData.full_name || !formData.father_name || !formData.mobile_number || !formData.date_of_birth || !formData.city || !formData.short_address) {
      setErrorMsg('Please fill in all required fields marked with an asterisk (*).');
      return;
    }

    try {
      setIsSubmitting(true);
      
      await addStudent({
        full_name: formData.full_name,
        father_name: formData.father_name,
        mobile_number: formData.mobile_number,
        email_address: formData.email_address,
        date_of_birth: formData.date_of_birth,
        city: formData.city,
        short_address: formData.short_address,
        skill_level: formData.skill_level,
        status: formData.status as any,
        additional_notes: formData.additional_notes
      } as any);

      // Reset form and close
      setFormData({
        full_name: '', father_name: '', mobile_number: '', email_address: '',
        date_of_birth: '', city: '', short_address: '', skill_level: 'I am completely new',
        status: 'New Lead', additional_notes: ''
      });
      onClose();
      
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add student. Please check your database permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <>
      <div className="modal-overlay animate-fade-in" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-icon-wrapper">
              <UserPlus size={20} />
            </div>
            <h3>Register New Student</h3>
          </div>
          <button className="icon-btn close-modal-btn" onClick={onClose} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {errorMsg && (
            <div className="modal-error">
              {errorMsg}
            </div>
          )}

          <form id="add-student-form" onSubmit={handleSubmit}>
            
            <div className="form-grid">
              <div className="form-group required">
                <label>Full Name</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="input-field minimal-input" placeholder="Enter full name" required />
              </div>
              <div className="form-group required">
                <label>Father's Name</label>
                <input type="text" name="father_name" value={formData.father_name} onChange={handleChange} className="input-field minimal-input" placeholder="Enter father's name" required />
              </div>
              <div className="form-group required">
                <label>Mobile Number</label>
                <input type="tel" name="mobile_number" value={formData.mobile_number} onChange={handleChange} className="input-field minimal-input" placeholder="Enter mobile number" required />
              </div>
              <div className="form-group">
                <label>Email Address (Optional)</label>
                <input type="email" name="email_address" value={formData.email_address} onChange={handleChange} className="input-field minimal-input" placeholder="Enter email address" />
              </div>
              <div className="form-group required">
                <label>Date of Birth</label>
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="input-field minimal-input" required />
              </div>
              <div className="form-group required">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field minimal-input" placeholder="Enter city" required />
              </div>
              <div className="form-group required col-span-2">
                <label>Short Address</label>
                <input type="text" name="short_address" value={formData.short_address} onChange={handleChange} className="input-field minimal-input" placeholder="Enter short address" required />
              </div>
            </div>

            <div className="form-grid mt-6">
              <div className="form-group required col-span-2">
                <label>CURRENT SKILL LEVEL</label>
                <select name="skill_level" value={formData.skill_level} onChange={handleChange} className="input-field minimal-input">
                  <option value="I am completely new">I am completely new</option>
                  <option value="I know basic techniques">I know basic techniques</option>
                  <option value="I have some experience">I have some experience</option>
                  <option value="I stitch regularly">I stitch regularly</option>
                </select>
              </div>

              <div className="form-group col-span-2 mt-4">
                <label>Initial Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="input-field minimal-input">
                  <option value="New Lead">New Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>

              <div className="form-group col-span-2">
                <label>Additional Notes (Optional)</label>
                <textarea name="additional_notes" value={formData.additional_notes} onChange={handleChange} className="input-field minimal-input" placeholder="Any specific requirements or notes from the student..." rows={3} />
              </div>
            </div>

          </form>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button type="submit" form="add-student-form" className="btn-primary" disabled={isSubmitting}>
            <Save size={16} /> {isSubmitting ? 'Registering...' : 'Register Student'}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};
