export interface Book {
  id: string;
  title: string;
  isbn?: string;
  publishedYear?: number;
  categories: string[];
  authors: string[];
  status: 'Available' | 'Checked Out' | 'Reserved' | 'Maintenance';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  biography?: string;
  birthYear?: number;
  nationality?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookFormData = Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastModifiedBy'>;
export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type AuthorFormData = Omit<Author, 'id' | 'createdAt' | 'updatedAt'>;