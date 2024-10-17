import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthContext.Provider value={{
        isLoggedIn: false,
        logout: vi.fn(),
      }}>
        {children}
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'

export { customRender as render }