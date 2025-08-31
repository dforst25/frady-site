import React, { createContext, useContext, useState, useEffect } from 'react';

interface MediaItem {
  id: string;
  url: string;
  alt: string;
  filename: string;
  size: number;
  type: string;
  uploadedAt: string;
  category?: string;
  order?: number;
}

interface GalleryItem extends MediaItem {
  category: string;
  order: number;
}

interface SiteContent {
  // Hero Section
  hero: {
    title: { he: string; en: string };
    subtitle: { he: string; en: string };
    cta: { he: string; en: string };
    backgroundImage: string;
  };
  
  // Navigation
  navigation: {
    home: { he: string; en: string };
    gallery: { he: string; en: string };
    about: { he: string; en: string };
    contact: { he: string; en: string };
    blog: { he: string; en: string };
  };
  
  // Gallery Categories
  galleryCategories: {
    chalaka: { he: string; en: string };
    family: { he: string; en: string };
    newborn: { he: string; en: string };
    smash: { he: string; en: string };
  };
  
  // About Page
  about: {
    title: { he: string; en: string };
    content: { he: string; en: string };
    image: string;
  };
  
  // Contact Info
  contact: {
    title: { he: string; en: string };
    phone: string;
    email: string;
    address: { he: string; en: string };
    whatsapp: string;
    socialMedia: {
      instagram: string;
      facebook: string;
      youtube: string;
    };
  };
  
  // SEO
  seo: {
    siteName: { he: string; en: string };
    description: { he: string; en: string };
    keywords: { he: string; en: string };
    favicon: string;
  };
  
  // Design Settings
  design: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      hebrew: string;
      english: string;
      headingWeight: string;
      bodyWeight: string;
    };
    layout: {
      maxWidth: string;
      sectionPadding: string;
    };
  };
  
  // Analytics
  analytics: {
    googleAnalytics: string;
    metaPixel: string;
  };
  
  // Email Settings
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    toEmail: string;
    enabled: boolean;
  };
  
  // Maintenance
  maintenance: {
    enabled: boolean;
    message: { he: string; en: string };
  };
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
  read: boolean;
  emailSent: boolean;
  emailError?: string;
}

interface BlogPost {
  id: string;
  title: { he: string; en: string };
  content: { he: string; en: string };
  excerpt: { he: string; en: string };
  slug: { he: string; en: string };
  featuredImage: string;
  publishedAt: string;
  status: 'draft' | 'published';
  author: string;
}

interface EmailLog {
  id: string;
  timestamp: string;
  to: string;
  subject: string;
  status: 'success' | 'failed';
  error?: string;
  type: 'contact' | 'test';
}

interface ContentContextType {
  content: SiteContent;
  mediaLibrary: MediaItem[];
  galleryItems: GalleryItem[];
  contactSubmissions: ContactSubmission[];
  blogPosts: BlogPost[];
  emailLogs: EmailLog[];
  updateContent: (section: string, data: any) => Promise<void>;
  saveContent: () => Promise<void>;
  uploadMedia: (file: File) => Promise<MediaItem>;
  uploadGalleryImage: (file: File, category: string) => Promise<GalleryItem>;
  deleteMedia: (id: string) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;
  reorderGalleryImages: (category: string, imageIds: string[]) => Promise<void>;
  updateGalleryImage: (id: string, updates: Partial<GalleryItem>) => Promise<void>;
  addContactSubmission: (submission: Omit<ContactSubmission, 'id' | 'submittedAt' | 'read' | 'emailSent'>) => Promise<void>;
  sendContactEmail: (submission: ContactSubmission) => Promise<boolean>;
  sendTestEmail: () => Promise<boolean>;
  markContactAsRead: (id: string) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  saveBlogPost: (post: Omit<BlogPost, 'id'>) => Promise<void>;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  applyDesignChanges: (designSettings: any) => Promise<void>;
  getGalleryByCategory: (category: string) => GalleryItem[];
}

const defaultContent: SiteContent = {
  hero: {
    title: { 
      he: 'צילומי ילדים ומשפחה מקצועיים', 
      en: 'Professional Children & Family Photography' 
    },
    subtitle: { 
      he: 'מתמחה בצילומי חלאקה, משפחה וילדים - רגעים יקרים שנשמרים לנצח', 
      en: 'Specializing in Chalaka, family and children photography - precious moments preserved forever' 
    },
    cta: { 
      he: 'צרו קשר לתיאום צילום', 
      en: 'Contact for Photo Session' 
    },
    backgroundImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1200'
  },
  navigation: {
    home: { he: 'בית', en: 'Home' },
    gallery: { he: 'גלריה', en: 'Gallery' },
    about: { he: 'אודות', en: 'About' },
    contact: { he: 'צור קשר', en: 'Contact' },
    blog: { he: 'בלוג', en: 'Blog' }
  },
  galleryCategories: {
    chalaka: { he: 'חלאקה', en: 'Chalaka' },
    family: { he: 'משפחה', en: 'Family' },
    newborn: { he: 'ילודים', en: 'Newborn' },
    smash: { he: 'סמאש קייק', en: 'Smash Cake' }
  },
  about: {
    title: { he: 'אודותיי', en: 'About Me' },
    content: { 
      he: 'שמי [שם הצלמת] ואני צלמת מקצועית המתמחה בצילומי ילדים ומשפחות. האמונה שלי היא שכל ילד ומשפחה ייחודיים, ותפקידי להעביר את הקסם הזה דרך העדשה.',
      en: 'My name is [Photographer Name] and I am a professional photographer specializing in children and family photography. My belief is that every child and family is unique, and my job is to capture that magic through the lens.'
    },
    image: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  contact: {
    title: { he: 'צרו קשר', en: 'Contact Me' },
    phone: '050-123-4567',
    email: 'info@photography.co.il',
    address: { he: 'תל אביב והמרכז', en: 'Tel Aviv & Center' },
    whatsapp: '+972501234567',
    socialMedia: {
      instagram: 'https://instagram.com/photographer',
      facebook: 'https://facebook.com/photographer',
      youtube: ''
    }
  },
  seo: {
    siteName: { 
      he: 'Photography Studio - צילומי ילדים ומשפחה', 
      en: 'Photography Studio - Children & Family Photography' 
    },
    description: { 
      he: 'צילומי ילדים ומשפחה מקצועיים - מתמחה בצילומי חלאקה, פורטרטים משפחתיים ורגעים יקרים', 
      en: 'Professional children and family photography - specializing in Chalaka ceremonies, family portraits and precious moments' 
    },
    keywords: { 
      he: 'צילום ילדים, צילום משפחה, צילום חלאקה, צילום ילודים, צלמת מקצועית, תל אביב', 
      en: 'children photography, family photography, chalaka photography, newborn photography, professional photographer, tel aviv' 
    },
    favicon: '/favicon.ico'
  },
  design: {
    colors: {
      primary: '#e11d48',
      secondary: '#f43f5e',
      accent: '#fb7185',
      background: '#ffffff',
      text: '#111827'
    },
    fonts: {
      hebrew: 'Heebo',
      english: 'Inter',
      headingWeight: '700',
      bodyWeight: '400'
    },
    layout: {
      maxWidth: '1280px',
      sectionPadding: '5rem'
    }
  },
  analytics: {
    googleAnalytics: '',
    metaPixel: ''
  },
  emailSettings: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@photography.co.il',
    toEmail: 'admin@photography.co.il',
    enabled: false
  },
  maintenance: {
    enabled: false,
    message: { 
      he: 'האתר נמצא בתחזוקה. נחזור בקרוב!', 
      en: 'Site under maintenance. We\'ll be back soon!' 
    }
  }
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  // Apply design changes to CSS variables on load
  useEffect(() => {
    applyDesignToCSSVariables(content.design);
  }, [content.design]);

  const loadAllData = () => {
    try {
      const savedContent = localStorage.getItem('siteContent');
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        setContent({ ...defaultContent, ...parsedContent });
      }

      const savedMedia = localStorage.getItem('mediaLibrary');
      if (savedMedia) {
        setMediaLibrary(JSON.parse(savedMedia));
      }

      const savedGallery = localStorage.getItem('galleryItems');
      if (savedGallery) {
        setGalleryItems(JSON.parse(savedGallery));
      }

      const savedContacts = localStorage.getItem('contactSubmissions');
      if (savedContacts) {
        setContactSubmissions(JSON.parse(savedContacts));
      }

      const savedBlogPosts = localStorage.getItem('blogPosts');
      if (savedBlogPosts) {
        setBlogPosts(JSON.parse(savedBlogPosts));
      }

      const savedEmailLogs = localStorage.getItem('emailLogs');
      if (savedEmailLogs) {
        setEmailLogs(JSON.parse(savedEmailLogs));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveToStorage = async (key: string, data: any): Promise<boolean> => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return false;
    }
  };

  const applyDesignToCSSVariables = (designSettings: any) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', designSettings.colors.primary);
    root.style.setProperty('--color-secondary', designSettings.colors.secondary);
    root.style.setProperty('--color-accent', designSettings.colors.accent);
    root.style.setProperty('--color-background', designSettings.colors.background);
    root.style.setProperty('--color-text', designSettings.colors.text);
    root.style.setProperty('--font-hebrew', designSettings.fonts.hebrew);
    root.style.setProperty('--font-english', designSettings.fonts.english);
    root.style.setProperty('--max-width', designSettings.layout.maxWidth);
    root.style.setProperty('--section-padding', designSettings.layout.sectionPadding);
  };

  const updateContent = async (section: string, data: any): Promise<void> => {
    const newContent = { ...content };
    const keys = section.split('.');
    let current = newContent as any;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = data;
    setContent(newContent);
    await saveToStorage('siteContent', newContent);
  };

  const saveContent = async (): Promise<void> => {
    await saveToStorage('siteContent', content);
  };

  const uploadMedia = async (file: File): Promise<MediaItem> => {
    const mediaItem: MediaItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^/.]+$/, ""),
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };

    const newMediaLibrary = [...mediaLibrary, mediaItem];
    setMediaLibrary(newMediaLibrary);
    await saveToStorage('mediaLibrary', newMediaLibrary);
    
    return mediaItem;
  };

  const uploadGalleryImage = async (file: File, category: string): Promise<GalleryItem> => {
    const categoryItems = galleryItems.filter(item => item.category === category);
    const maxOrder = categoryItems.length > 0 ? Math.max(...categoryItems.map(item => item.order)) : -1;

    const galleryItem: GalleryItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^/.]+$/, ""),
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      category,
      order: maxOrder + 1
    };

    const newGalleryItems = [...galleryItems, galleryItem];
    setGalleryItems(newGalleryItems);
    await saveToStorage('galleryItems', newGalleryItems);
    
    return galleryItem;
  };

  const deleteMedia = async (id: string): Promise<void> => {
    const newMediaLibrary = mediaLibrary.filter(item => item.id !== id);
    setMediaLibrary(newMediaLibrary);
    await saveToStorage('mediaLibrary', newMediaLibrary);
  };

  const deleteGalleryImage = async (id: string): Promise<void> => {
    const newGalleryItems = galleryItems.filter(item => item.id !== id);
    setGalleryItems(newGalleryItems);
    await saveToStorage('galleryItems', newGalleryItems);
  };

  const reorderGalleryImages = async (category: string, imageIds: string[]): Promise<void> => {
    const newGalleryItems = galleryItems.map(item => {
      if (item.category === category) {
        const newOrder = imageIds.indexOf(item.id);
        return { ...item, order: newOrder >= 0 ? newOrder : item.order };
      }
      return item;
    });
    setGalleryItems(newGalleryItems);
    await saveToStorage('galleryItems', newGalleryItems);
  };

  const updateGalleryImage = async (id: string, updates: Partial<GalleryItem>): Promise<void> => {
    const newGalleryItems = galleryItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    setGalleryItems(newGalleryItems);
    await saveToStorage('galleryItems', newGalleryItems);
  };

  const sendEmail = async (to: string, subject: string, body: string, type: 'contact' | 'test' = 'contact'): Promise<boolean> => {
    const emailLog: EmailLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      to,
      subject,
      status: 'success',
      type
    };

    try {
      // Simulate email sending with SMTP validation
      if (!content.emailSettings.enabled || !content.emailSettings.smtpUser || !content.emailSettings.smtpPassword) {
        throw new Error('Email settings not configured properly');
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success/failure based on settings validity
      const hasValidSettings = content.emailSettings.smtpHost && 
                              content.emailSettings.smtpUser && 
                              content.emailSettings.smtpPassword &&
                              content.emailSettings.toEmail;
      
      if (!hasValidSettings) {
        throw new Error('Invalid SMTP configuration');
      }

      // 95% success rate for demo
      const success = Math.random() > 0.05;
      
      if (!success) {
        throw new Error('SMTP server temporarily unavailable');
      }

      emailLog.status = 'success';
      const newEmailLogs = [emailLog, ...emailLogs];
      setEmailLogs(newEmailLogs);
      await saveToStorage('emailLogs', newEmailLogs);
      
      return true;
    } catch (error) {
      emailLog.status = 'failed';
      emailLog.error = error instanceof Error ? error.message : 'Unknown error';
      
      const newEmailLogs = [emailLog, ...emailLogs];
      setEmailLogs(newEmailLogs);
      await saveToStorage('emailLogs', newEmailLogs);
      
      return false;
    }
  };

  const addContactSubmission = async (submission: Omit<ContactSubmission, 'id' | 'submittedAt' | 'read' | 'emailSent'>): Promise<void> => {
    const newSubmission: ContactSubmission = {
      ...submission,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      read: false,
      emailSent: false
    };

    // Try to send email
    const emailBody = `
New inquiry from Photography Website

Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone}
Message: ${submission.message}

Submitted: ${new Date().toLocaleString()}
    `;

    const emailSent = await sendEmail(
      content.emailSettings.toEmail,
      'New Inquiry from Photography Website',
      emailBody,
      'contact'
    );

    newSubmission.emailSent = emailSent;
    if (!emailSent) {
      newSubmission.emailError = 'Failed to send email notification';
    }

    const newSubmissions = [newSubmission, ...contactSubmissions];
    setContactSubmissions(newSubmissions);
    await saveToStorage('contactSubmissions', newSubmissions);
  };

  const sendContactEmail = async (submission: ContactSubmission): Promise<boolean> => {
    const emailBody = `
New inquiry from Photography Website

Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone}
Message: ${submission.message}

Submitted: ${new Date(submission.submittedAt).toLocaleString()}
    `;

    return sendEmail(
      content.emailSettings.toEmail,
      'New Inquiry from Photography Website',
      emailBody,
      'contact'
    );
  };

  const sendTestEmail = async (): Promise<boolean> => {
    const testBody = `
This is a test email from your Photography Website admin panel.

If you receive this email, your SMTP configuration is working correctly.

Sent: ${new Date().toLocaleString()}
    `;

    return sendEmail(
      content.emailSettings.toEmail,
      'Test Email from Photography Website',
      testBody,
      'test'
    );
  };

  const markContactAsRead = async (id: string): Promise<void> => {
    const newSubmissions = contactSubmissions.map(sub => 
      sub.id === id ? { ...sub, read: true } : sub
    );
    setContactSubmissions(newSubmissions);
    await saveToStorage('contactSubmissions', newSubmissions);
  };

  const deleteContact = async (id: string): Promise<void> => {
    const newSubmissions = contactSubmissions.filter(sub => sub.id !== id);
    setContactSubmissions(newSubmissions);
    await saveToStorage('contactSubmissions', newSubmissions);
  };

  const saveBlogPost = async (post: Omit<BlogPost, 'id'>): Promise<void> => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString()
    };

    const newBlogPosts = [newPost, ...blogPosts];
    setBlogPosts(newBlogPosts);
    await saveToStorage('blogPosts', newBlogPosts);
  };

  const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<void> => {
    const newBlogPosts = blogPosts.map(p => 
      p.id === id ? { ...p, ...post } : p
    );
    setBlogPosts(newBlogPosts);
    await saveToStorage('blogPosts', newBlogPosts);
  };

  const deleteBlogPost = async (id: string): Promise<void> => {
    const newBlogPosts = blogPosts.filter(p => p.id !== id);
    setBlogPosts(newBlogPosts);
    await saveToStorage('blogPosts', newBlogPosts);
  };

  const applyDesignChanges = async (designSettings: any): Promise<void> => {
    await updateContent('design', designSettings);
    applyDesignToCSSVariables(designSettings);
  };

  const getGalleryByCategory = (category: string): GalleryItem[] => {
    return galleryItems
      .filter(item => item.category === category)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <ContentContext.Provider value={{
      content,
      mediaLibrary,
      galleryItems,
      contactSubmissions,
      blogPosts,
      emailLogs,
      updateContent,
      saveContent,
      uploadMedia,
      uploadGalleryImage,
      deleteMedia,
      deleteGalleryImage,
      reorderGalleryImages,
      updateGalleryImage,
      addContactSubmission,
      sendContactEmail,
      sendTestEmail,
      markContactAsRead,
      deleteContact,
      saveBlogPost,
      updateBlogPost,
      deleteBlogPost,
      applyDesignChanges,
      getGalleryByCategory
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};