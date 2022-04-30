export const PORT = +(process.env.PORT ?? '3000')
export const DATABASE_USER = process.env.DATABASE_USER ?? 'postgres'
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD ?? 'postgres'
export const DATABASE_HOST = process.env.DATABASE_HOST ?? 'localhost'
export const DATABASE_PORT = +(process.env.DATABASE_PORT ?? '5432')
export const DATABASE_DBNAME = process.env.DATABASE_DBNAME ?? 'mfus'
export const IS_PRODUCTON = process.env.NODE_ENV === 'production'
export const LEGACY_API_SUPPORT = ['1', 'yes', 'true'].includes(process.env.LEGACY_API_SUPPORT?.toLowerCase() ?? '')
