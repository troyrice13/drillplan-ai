import { render, screen } from './test-utils'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    const drillFitElements = screen.getAllByText(/DrillFit\.io/i)
    expect(drillFitElements.length).toBeGreaterThan(0)
  })

  it('renders the header', () => {
    render(<App />)
    const headerElement = screen.getByRole('navigation')
    expect(headerElement).toBeInTheDocument()
  })

  it('renders the home page content', () => {
    render(<App />)
    const homeElement = screen.getByText(/Welcome to DrillFit\.io/i)
    expect(homeElement).toBeInTheDocument()
  })

  it('renders the login and signup buttons', () => {
    render(<App />)
    const loginButton = screen.getByRole('button', { name: /login/i })
    const signupButton = screen.getByRole('button', { name: /sign up/i })
    expect(loginButton).toBeInTheDocument()
    expect(signupButton).toBeInTheDocument()
  })

  it('renders the main content sections', () => {
    render(<App />)
    const heroSection = screen.getByRole('heading', { name: /Welcome to DrillFit\.io/i }).closest('section')
    const featuresSection = screen.getByRole('heading', { name: /AI-Powered Workouts/i }).closest('section')
    const howItWorksSection = screen.getByRole('heading', { name: /How It Works/i }).closest('section')
    
    expect(heroSection).toBeInTheDocument()
    expect(featuresSection).toBeInTheDocument()
    expect(howItWorksSection).toBeInTheDocument()
  })
})