
export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type SubmissionType = 'volunteer' | 'partner' | 'support' | 'advocate' | 'contact';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export interface Submission {
  id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  date: string;
  data: {
    fullName: string;
    email: string;
    phone?: string;
    organization?: string;
    message: string;
    [key: string]: any;
  };
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  purpose: string;
  description: string;
  story?: string; // Long form content
  category: 'outreach' | 'education' | 'medical' | 'social';
  images: string[]; // Base64 or URLs
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  type: 'corporate' | 'individual' | 'foundation' | 'medical';
  description?: string;
  website?: string;
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  file_data: string; // Base64
  file_name: string;
  file_mime_type: string;
  date: string;
}
