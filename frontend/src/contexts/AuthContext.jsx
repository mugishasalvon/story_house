import { useCallback, useState } from 'react'
import AuthContext from './auth-context'
import { loginAdmin } from '../data/api'

export function AuthProvider({ children }) {
	const [token, setToken] = useState(
		() => localStorage.getItem('storyhouse_admin_token') || '',
	)

	const login = useCallback(async (username, password) => {
		const result = await loginAdmin(username, password)
		if (result.token) {
			localStorage.setItem('storyhouse_admin_token', result.token)
			setToken(result.token)
			return true
		}
		return false
	}, [])

	const logout = useCallback(() => {
		localStorage.removeItem('storyhouse_admin_token')
		setToken('')
	}, [])

	return (
		<AuthContext.Provider
			value={{ isAdmin: Boolean(token), token, login, logout, loading: false }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider
