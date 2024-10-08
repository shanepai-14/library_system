

export const BASE_URL = 'http://127.0.0.1:8000/api';

export const login = () => `/login`;

export const register = () => `/register`;

export const allCategories = () => `/category/all`;
export const getCategories = () => `/categories`;
export const deleteCategories = (id) => `/categories/${id}`;
export const updateCategory = (id) => `/categories/${id}`;

export const allAuthors = () => `/author/all`
export const getAuthors = () => '/authors'

export const deleteAuthors = (id) => `/authors/${id}`

export const updateAuthors = (id) => `/authors/${id}`


export const getBooks= () => '/books'

export const deleteBooks= (id) => `/books/${id}`

export const updateBooks= (id) => `/books/${id}`

export const showBook= (id) => `/books/${id}`

export const booksCategory = (id) => `/books/category/${id}`
export const booksAuthor = (id) => `/books/author/${id}`

export const getBooksLoans= () => `/book-loans`

export const updateBookLoans = (id) => `/book-loans/${id}`

export const deleteBookLoans = (id) => `/book-loans/${id}`

export const getUsers= () => '/users'

export const showUser= (id) => `/user/${id}`

export const activeBookLoans =  (id) => `/books/${id}/active-loans`

export const checkBookLoanReturn = (id) => `/book-loans/${id}/return`

export const checkStudent = () =>`/check-student`;

export const postAttendance = () => `/attendance/check`;

export const getAttendance = () => `/attendances`;

export const PostRoute = () => `/feature-posts`;

export const latestPost = () => `/latest-post`;

export const adminStats = () => `/admin/stats`;

export const studentStats = () => `/student/stats`;