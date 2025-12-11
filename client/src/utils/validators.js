// Validación de formato de email
export const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validación de contraseña segura: mínimo 6 caracteres, al menos 1 mayúscula y 1 número
export const validatePasswordSecurity = (password) => {
  if (password.length < 6) return false

  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  return hasUpperCase && hasNumber
}
