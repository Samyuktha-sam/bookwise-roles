import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  BookOpen,
  Calendar,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Book } from '@/types/books';

// Mock data for demonstration
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    isbn: '978-0-7432-7356-5',
    publishedYear: 1925,
    categories: ['Fiction', 'Classic Literature'],
    authors: ['F. Scott Fitzgerald'],
    status: 'Available',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin@bookms.com',
    lastModifiedBy: 'admin@bookms.com',
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    isbn: '978-0-06-112008-4',
    publishedYear: 1960,
    categories: ['Fiction', 'Drama'],
    authors: ['Harper Lee'],
    status: 'Checked Out',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
    createdBy: 'admin@bookms.com',
    lastModifiedBy: 'manager@bookms.com',
  },
  {
    id: '3',
    title: 'JavaScript: The Definitive Guide',
    isbn: '978-1-491-95202-3',
    publishedYear: 2020,
    categories: ['Technology', 'Programming'],
    authors: ['David Flanagan'],
    status: 'Available',
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
    createdBy: 'user@bookms.com',
    lastModifiedBy: 'user@bookms.com',
  },
  {
    id: '4',
    title: 'Clean Code',
    isbn: '978-0-13-235088-4',
    publishedYear: 2008,
    categories: ['Technology', 'Software Engineering'],
    authors: ['Robert C. Martin'],
    status: 'Reserved',
    createdAt: '2024-01-18T13:00:00Z',
    updatedAt: '2024-01-18T13:00:00Z',
    createdBy: 'admin@bookms.com',
    lastModifiedBy: 'admin@bookms.com',
  },
];

const mockCategories = ['Fiction', 'Technology', 'Classic Literature', 'Drama', 'Programming', 'Software Engineering'];

export default function Books() {
  const { user, hasRole } = useAuth();
  const [books] = useState<Book[]>(mockBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const canEdit = hasRole('Admin');
  const canDelete = hasRole('Admin');
  const canViewAudit = hasRole('SuperAdmin');

  // Filter and search logic
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = searchTerm === '' || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        book.categories.includes(selectedCategory);
      
      const matchesYear = selectedYear === 'all' || 
        book.publishedYear?.toString() === selectedYear;

      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [books, searchTerm, selectedCategory, selectedYear]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  // Get unique years for filter
  const availableYears = useMemo(() => {
    const years = books
      .map(book => book.publishedYear)
      .filter(Boolean)
      .sort((a, b) => (b as number) - (a as number));
    return [...new Set(years)];
  }, [books]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Available':
        return 'default';
      case 'Checked Out':
        return 'destructive';
      case 'Reserved':
        return 'secondary';
      case 'Maintenance':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Books</h1>
          <p className="text-muted-foreground">
            Manage your library's book collection
          </p>
        </div>
        {canEdit && (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
          <CardDescription>
            Find books by title, ISBN, author, category, or publication year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books, authors, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Filter */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year!.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Books ({filteredBooks.length})
          </CardTitle>
          <CardDescription>
            {canEdit ? 'View, edit, and manage' : 'Browse'} your library collection
            {canEdit && (
              <span className="ml-2 inline-flex items-center gap-1 text-primary">
                <Lock className="h-3 w-3" />
                JWT Protected
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Title</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Authors</TableHead>
                  <TableHead>Status</TableHead>
                  {canViewAudit && <TableHead>Audit</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBooks.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={canViewAudit ? 8 : 7} 
                      className="text-center py-8 text-muted-foreground"
                    >
                      No books found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell className="font-mono text-sm">{book.isbn || '—'}</TableCell>
                      <TableCell>
                        {book.publishedYear ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {book.publishedYear}
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {book.categories.map(category => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {book.authors.map(author => (
                            <div key={author} className="text-sm">{author}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(book.status)}>
                          {book.status}
                        </Badge>
                      </TableCell>
                      {canViewAudit && (
                        <TableCell className="text-xs text-muted-foreground">
                          <div>Created: {book.createdBy}</div>
                          <div>Modified: {book.lastModifiedBy}</div>
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canEdit && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredBooks.length)} of {filteredBooks.length} books
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}