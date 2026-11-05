import { runMigrations } from "@/infra/database/migration-runner";

export async function POST() {
  runMigrations();
  return Response.json(
    { message: "Migrations executadas com sucesso" },
    { status: 201 },
  );
}
