import { formatDistanceToNow, format } from 'date-fns'

export const timeAgo    = (date) => formatDistanceToNow(new Date(date), { addSuffix: true })
export const formatDate = (date) => format(new Date(date), 'MMM d, yyyy')

export const scoreColor = (score) => {
  if (score >= 80) return 'var(--success)'
  if (score >= 60) return 'var(--warning)'
  return 'var(--critical)'
}

export const getErrorMessage = (err) =>
  err?.response?.data?.detail || err?.message || 'Something went wrong.'