export const PORT = +(Deno.env.get('PORT') ?? '3000')
export const DATABASE_USER = Deno.env.get('DATABASE_USER') ?? 'postgres'
export const DATABASE_PASSWORD = Deno.env.get('DATABASE_PASSWORD') ?? 'postgres'
export const DATABASE_HOST = Deno.env.get('DATABASE_HOST') ?? 'localhost'
export const DATABASE_PORT = +(Deno.env.get('DATABASE_PORT') ?? '5432')
export const DATABASE_DBNAME = Deno.env.get('DATABASE_DBNAME') ?? 'mfus'
