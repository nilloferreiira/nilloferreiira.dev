import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

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

	const { email, password } = parsedBody.data

	const supabase = await createClient()
	const { error } = await supabase.auth.signInWithPassword({ email, password })

	if (error) {
		return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
	}

	return NextResponse.json({ ok: true, message: "Login realizado com sucesso" })
}
