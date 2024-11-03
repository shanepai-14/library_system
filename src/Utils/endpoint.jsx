

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

export const viewPassword = (userId) => `/admin/users/${userId}/password`;

export const updatePassword = (userId) => `/admin/users/${userId}/update-password`;

export const deactivateStudent = (userId) => `/admin/students/${userId}`

export const monthlyAttendance =()   =>  `/attendance/analytics/monthly`;

export const dailyAttendance =() => `/attendance/analytics/daily`;

export const weeklyAttendance =() => `/attendance/analytics/weekly`;

export const getSubjects = () => '/subjects';

export const getSubject = (id) => `/subjects/${id}`;

export const createSubject = () => '/subjects';

export const updateSubject = (id) => `/subjects/${id}`;

export const deleteSubjects = (id) => `/subjects/${id}`;

export const booksSubject = (id) => `/subjects/${id}/books`;

export const allSubjects = (id) => `/all-subjects`;

export const getRecommendedBooks = (userId) => `recommended-books/${userId}`;
