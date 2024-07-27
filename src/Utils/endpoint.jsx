

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

export const booksCategory = (id) => `/books/category/${id}`
export const booksAuthor = (id) => `/books/author/${id}`