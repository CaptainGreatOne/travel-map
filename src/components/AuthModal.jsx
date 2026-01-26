import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { validateEmail, validatePassword } from '../utils/validation'

function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const { signIn, signUp } = useAuth()

  const modalRoot = document.getElementById('modal-root')

  // Map auth errors to user-friendly messages
  const getAuthErrorMessage = (error) => {
    const message = error.message?.toLowerCase() || ''
    if (message.includes('invalid login credentials')) {
      return 'Invalid email or password.'
    }
    if (message.includes('email not confirmed')) {
      return 'Please check your email and confirm your account.'
    }
    if (message.includes('user already registered')) {
      return 'An account with this email already exists.'
    }
    console.error('Auth error:', error)
    return 'Authentication failed. Please try again.'
  }

  if (!isOpen) return null

  const validateForm = () => {
    const errors = {}

    const emailResult = validateEmail(email)
    if (!emailResult.valid) errors.email = emailResult.message

    // Only validate password strictly for signup
    const passwordResult = validatePassword(password, isSignUp ? 6 : 1)
    if (!passwordResult.valid) errors.password = passwordResult.message

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) throw error
        setMessage('Check your email for the confirmation link!')
        setEmail('')
        setPassword('')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        onClose() // Close modal on successful sign in
      }
    } catch (error) {
      setError(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/70 z-[10000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md text-gray-500 hover:bg-gray-100 flex items-center justify-center"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="mb-6 text-3xl text-secondary font-semibold">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Success message */}
        {message && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm mb-4">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-500 font-medium">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setFieldErrors(prev => ({ ...prev, email: undefined }))
              }}
              className="w-full px-3 py-3 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-500 font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setFieldErrors(prev => ({ ...prev, password: undefined }))
              }}
              className="w-full px-3 py-3 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
            {isSignUp && !fieldErrors.password && (
              <small className="block mt-2 text-gray-400 text-sm">
                Must be at least 6 characters
              </small>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-md text-base font-semibold mb-4 hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        {/* Toggle sign in/sign up */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              setMessage(null)
              setFieldErrors({})
            }}
            className="bg-transparent border-none text-primary cursor-pointer text-sm underline hover:text-primary/80"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )

  // Use portal to render modal at document root level for proper centering
  return modalRoot ? createPortal(modalContent, modalRoot) : modalContent
}

export default AuthModal
