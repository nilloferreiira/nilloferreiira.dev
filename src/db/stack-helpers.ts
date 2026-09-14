import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { stacks, projectStacks, experienceStacks } from "@/db/schema"
import type { StackRef } from "@/types/stack/stack"

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]
type Queryable = Tx | typeof db

async function upsertStackIds(tx: Tx, names: string[]): Promise<number[]> {
	const uniqueNames = Array.from(new Set(names.map((n) => n.trim()).filter(Boolean)))
	const ids: number[] = []
	for (const name of uniqueNames) {
		const [row] = await tx
			.insert(stacks)
			.values({ name })
			.onConflictDoUpdate({ target: stacks.name, set: { name } })
			.returning({ id: stacks.id })
		ids.push(row.id)
	}
	return ids
}

export async function syncProjectStackLinks(tx: Tx, projectId: number, names: string[]): Promise<void> {
	const stackIds = await upsertStackIds(tx, names)
	await tx.delete(projectStacks).where(eq(projectStacks.projectId, projectId))
	if (stackIds.length > 0) {
		await tx.insert(projectStacks).values(stackIds.map((stackId) => ({ projectId, stackId })))
	}
}

export async function loadProjectStackRefs(dbOrTx: Queryable, projectId: number): Promise<StackRef[]> {
	return dbOrTx
		.select({ id: stacks.id, name: stacks.name })
		.from(projectStacks)
		.innerJoin(stacks, eq(projectStacks.stackId, stacks.id))
		.where(eq(projectStacks.projectId, projectId))
}

export async function syncExperienceStackLinks(tx: Tx, experienceId: number, names: string[]): Promise<void> {
	const stackIds = await upsertStackIds(tx, names)
	await tx.delete(experienceStacks).where(eq(experienceStacks.experienceId, experienceId))
	if (stackIds.length > 0) {
		await tx.insert(experienceStacks).values(stackIds.map((stackId) => ({ experienceId, stackId })))
	}
}

export async function loadExperienceStackRefs(dbOrTx: Queryable, experienceId: number): Promise<StackRef[]> {
	return dbOrTx
		.select({ id: stacks.id, name: stacks.name })
		.from(experienceStacks)
		.innerJoin(stacks, eq(experienceStacks.stackId, stacks.id))
		.where(eq(experienceStacks.experienceId, experienceId))
}
