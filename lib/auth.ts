// lib/auth.ts

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      return { success: false, error: err.error }
    }
    const data = await res.json()
    // Save user session in localStorage or cookies here
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(data.user))
    }
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}
export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  }
  return null
}

export const register = async (name: string, email: string, password: string) => {
  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      return { success: false, error: err.error }
    }
    const data = await res.json()
    // Optionally log user in or return user data
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}
