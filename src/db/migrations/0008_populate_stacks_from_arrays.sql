-- 1. Populate `stacks` from distinct trimmed values across BOTH source
--    arrays. Exact string match after trim() only (no case-folding).
--    ON CONFLICT on the unique name constraint handles cross-table overlap
--    (e.g. "React" appearing in both projects.tags and experiences.stack).
INSERT INTO "stacks" ("name")
SELECT DISTINCT trim(tag) AS name
FROM "projects", unnest("tags") AS tag
WHERE trim(tag) <> ''
ON CONFLICT ("name") DO NOTHING;
--> statement-breakpoint

INSERT INTO "stacks" ("name")
SELECT DISTINCT trim(tech) AS name
FROM "experiences", unnest("stack") AS tech
WHERE trim(tech) <> ''
ON CONFLICT ("name") DO NOTHING;
--> statement-breakpoint

-- 2. Populate project_stacks. The outer DISTINCT collapses duplicate
--    values within a single project's own array (e.g. tags = '{React,React}').
INSERT INTO "project_stacks" ("project_id", "stack_id")
SELECT DISTINCT p."id", s."id"
FROM "projects" p, unnest(p."tags") AS tag
JOIN "stacks" s ON s."name" = trim(tag)
WHERE trim(tag) <> ''
ON CONFLICT ("project_id", "stack_id") DO NOTHING;
--> statement-breakpoint

-- 3. Populate experience_stacks, same pattern.
INSERT INTO "experience_stacks" ("experience_id", "stack_id")
SELECT DISTINCT e."id", s."id"
FROM "experiences" e, unnest(e."stack") AS tech
JOIN "stacks" s ON s."name" = trim(tech)
WHERE trim(tech) <> ''
ON CONFLICT ("experience_id", "stack_id") DO NOTHING;
