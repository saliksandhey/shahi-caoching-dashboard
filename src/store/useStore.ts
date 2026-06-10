import { create } from 'zustand';
import type { Student, StudentStatus, Announcement } from '../types/database';
import { supabase } from '../lib/supabase';

interface AppState {
  students: Student[];
  announcements: Announcement[];
  instituteName: string;
  isLoading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  updateStudentStatus: (id: string, status: StudentStatus) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: StudentStatus) => Promise<void>;
  bulkDeleteStudents: (ids: string[]) => Promise<void>;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'sent_date'>) => void;
  addStudent: (studentData: Omit<Student, 'id' | 'created_at'>) => Promise<void>;
  // Global Drawer State
  isDrawerOpen: boolean;
  selectedStudentForDrawer: Student | null;
  openDrawer: (student: Student) => void;
  closeDrawer: () => void;
}

export const useStore = create<AppState>((set) => ({
  students: [],
  announcements: [],
  instituteName: "Women's Stitching & Tailoring Training Institute",
  isLoading: false,
  error: null,
  isDrawerOpen: false,
  selectedStudentForDrawer: null,

  openDrawer: (student) => set({ isDrawerOpen: true, selectedStudentForDrawer: student }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedData = (data || []).map((row: any) => ({
        ...row,
        status: row.status || 'New Lead'
      }));

      set({ students: mappedData as Student[], isLoading: false });
    } catch (err: any) {
      console.error('Error fetching students:', err);
      set({ error: err.message, isLoading: false });
    }
  },
  
  updateStudentStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      set((state) => ({
        students: state.students.map((s) => s.id === id ? { ...s, status } : s)
      }));
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please make sure the status column exists in your Supabase table.');
    }
  },
  
  deleteStudent: async (id) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set((state) => ({
        students: state.students.filter((s) => s.id !== id)
      }));
    } catch (err: any) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student: ' + err.message);
    }
  },
  
  bulkUpdateStatus: async (ids, status) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status })
        .in('id', ids);
        
      if (error) throw error;
      
      set((state) => ({
        students: state.students.map((s) => ids.includes(s.id) ? { ...s, status } : s)
      }));
    } catch (err: any) {
      console.error('Error bulk updating status:', err);
      alert('Failed to bulk update status: ' + err.message);
    }
  },
  
  bulkDeleteStudents: async (ids) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .in('id', ids);
        
      if (error) throw error;
      
      set((state) => ({
        students: state.students.filter((s) => !ids.includes(s.id))
      }));
    } catch (err: any) {
      console.error('Error bulk deleting students:', err);
      alert('Failed to bulk delete students: ' + err.message);
    }
  },

  addStudent: async (studentData) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([studentData])
        .select('*');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newStudent = {
          ...data[0],
          status: data[0].status || 'New Lead'
        } as Student;
        
        set((state) => ({
          students: [newStudent, ...state.students]
        }));
      }
    } catch (err: any) {
      console.error('Error adding student:', err);
      throw err; // Re-throw to handle in the component
    }
  },
  
  addAnnouncement: (announcement) => set((state) => ({
    announcements: [
      {
        ...announcement,
        id: `ann-${Date.now()}`,
        sent_date: new Date().toISOString()
      },
      ...state.announcements
    ]
  }))
}));
