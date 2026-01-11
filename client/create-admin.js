// Script para crear un usuario administrador inicial
// Ejecutar: node create-admin.js

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Configuración de conexión a MongoDB
const MONGO_URI = 'mongodb://localhost:27017/ecommerceebyte'

// Datos del usuario administrador
const ADMIN_USER = {
  dni: '0000000000',
  fullName: 'Administrador Sistema',
  email: 'admin@ecommerce.com',
  direccion: 'Loja, Ecuador',
  role: 'superadmin',
  phone: '0999999999',
  password: 'Admin123456' // Esta será hasheada
}

// Schema del usuario (copiado del backend)
const usuarioSchema = new mongoose.Schema({
  dni: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  direccion: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'comprador'], default: 'comprador' },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now }
})

const Usuario = mongoose.model('Usuario', usuarioSchema)

async function crearAdministrador() {
  try {
    console.log('🔄 Conectando a MongoDB...')
    await mongoose.connect(MONGO_URI)
    console.log('✅ Conectado a la base de datos')

    // Verificar si ya existe un usuario con ese email
    const existingUser = await Usuario.findOne({ email: ADMIN_USER.email })
    if (existingUser) {
      console.log('⚠️  Ya existe un usuario con el email:', ADMIN_USER.email)
      console.log('📧 Email:', existingUser.email)
      console.log('👤 Nombre:', existingUser.fullName)
      console.log('🔑 Usa la contraseña que configuraste originalmente')
      await mongoose.connection.close()
      return
    }

    // Hash de la contraseña
    console.log('🔐 Hasheando contraseña...')
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(ADMIN_USER.password, salt)

    // Crear usuario
    console.log('👤 Creando usuario administrador...')
    const newUser = new Usuario({
      dni: ADMIN_USER.dni,
      fullName: ADMIN_USER.fullName,
      email: ADMIN_USER.email,
      direccion: ADMIN_USER.direccion,
      role: ADMIN_USER.role,
      phone: ADMIN_USER.phone,
      password: hashedPassword,
      dateCreation: new Date()
    })

    await newUser.save()

    console.log('\n✅ ¡Usuario administrador creado exitosamente!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:      ', ADMIN_USER.email)
    console.log('🔑 Contraseña: ', ADMIN_USER.password)
    console.log('👤 Nombre:     ', ADMIN_USER.fullName)
    console.log('🎯 Rol:        ', ADMIN_USER.role)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🚀 Ahora puedes iniciar sesión en el dashboard!')

    await mongoose.connection.close()
    console.log('✅ Conexión cerrada')
  } catch (error) {
    console.error('❌ Error:', error.message)
    await mongoose.connection.close()
    process.exit(1)
  }
}

crearAdministrador()
