export const ROUTES = {
  login: '/login',
  posts: '/posts',
  postCreate: '/posts/create',
  postEdit: '/posts/:id/edit',
  authors: '/authors',
  authorCreate: '/authors/create',
  authorEdit: '/authors/:id/edit',
  tags: '/tags',
  tagCreate: '/tags/create',
  tagEdit: '/tags/:id/edit',
} as const;

export const postEditPath = (id: number | string) => `/posts/${id}/edit`;
export const authorEditPath = (id: number | string) => `/authors/${id}/edit`;
export const tagEditPath = (id: number | string) => `/tags/${id}/edit`;
