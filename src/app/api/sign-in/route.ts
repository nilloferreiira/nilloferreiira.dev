import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { z } from "zod"
import { db } from "@/lib/db"
import { sessions as sessionsTable } from "@/db/schema"

const loginSchema = z.object({
	email: z.email("Email inválido"),
	password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
})

export async function POST(request: NextRequest) {
	const body = await request.json()
	const parsedBody = loginSchema.safeParse(body)

	if (!parsedBody.success) {
		return NextResponse.json({ message: "Dados inválidos", errors: parsedBody.error.message }, { status: 400 })
	}

	// hash da senha
	const { email, password } = parsedBody.data

	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email)
	})

	if (!user) {
		return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
	}

	const isValidPassword = bcrypt.compareSync(password, user.password)

	if (!isValidPassword) {
		return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
	}

	// create a persistent session in the DB
	const sessionId = crypto.randomUUID()
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
	await db.insert(sessionsTable).values({
		id: sessionId,
		userId: user.id,
		expiresAt: expiresAt,
		userAgent: request.headers.get("user-agent") || undefined,
		ip: request.headers.get("x-forwarded-for") || undefined
	})

	const response = NextResponse.json({ ok: true, message: "Login realizado com sucesso" })

	response.cookies.set({
		name: "session",
		value: sessionId,
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		secure: process.env.NODE_ENV === "production",
		// expire cookie at the same time as the DB session
		expires: expiresAt
	})

	return response
}
