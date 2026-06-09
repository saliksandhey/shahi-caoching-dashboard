export type StudentStatus = 'New Lead' | 'Contacted' | 'Interested' | 'Confirmed' | 'Not Interested';

export interface Student {
  id: string;
  full_name: string;
  mobile_number: string;
  email_address: string;
  age: number;
  city: string;
  skill_level: string;
  skills_to_learn: string[];
  additional_notes: string;
  created_at: string;
  // These will be added by the user to their DB for the dashboard to work
  status?: StudentStatus;
  admin_notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  sent_date: string;
  recipient_count: number;
}
