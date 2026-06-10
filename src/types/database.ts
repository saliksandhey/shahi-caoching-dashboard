export type StudentStatus = 'New Lead' | 'Contacted' | 'Interested' | 'Confirmed' | 'Not Interested';

export interface Student {
  id: string;
  full_name: string;
  father_name: string;
  mobile_number: string;
  email_address: string;
  date_of_birth: string;
  city: string;
  short_address: string;
  skill_level: string;
  additional_notes: string;
  created_at: string;
  status?: StudentStatus;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  sent_date: string;
  recipient_count: number;
}
