import { useState } from 'react'
import { reviewService }   from '../services/reviewService'
import { getErrorMessage } from '../utils/helpers'
import { useNavigate }     from 'react-router-dom'
import toast from 'react-hot-toast'

export function useReview() {
  const [loading, setLoading] = useState(false)
  const [review,  setReview]  = useState(null)
  const [reviews, setReviews] = useState([])
  const [stats,   setStats]   = useState(null)
  const navigate              = useNavigate()

  const submitReview = async (formData) => {
    setLoading(true)
    const tid = toast.loading('Analyzing your code with AI…')
    try {
      const { data } = await reviewService.create(formData)
      toast.success('Review complete!', { id: tid })
      navigate(`/review/${data.id}`)
    } catch (err) {
      toast.error(getErrorMessage(err), { id: tid })
    } finally {
      setLoading(false)
    }
  }

  const fetchReview = async (id) => {
    setLoading(true)
    try {
      const { data } = await reviewService.getById(id)
      setReview(data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async (params) => {
    setLoading(true)
    try {
      const { data } = await reviewService.getHistory(params)
      setReviews(data.reviews)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await reviewService.getStats()
      setStats(data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const deleteReview = async (id) => {
    setLoading(true)
    try {
      await reviewService.delete(id)
      toast.success('Review deleted.')
      navigate('/history')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return {
    loading, review, reviews, stats,
    submitReview, fetchReview, fetchHistory, fetchStats, deleteReview,
  }
}