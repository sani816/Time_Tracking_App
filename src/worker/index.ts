import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { CreateActivitySchema, UpdateActivitySchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// Auth routes
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Activity routes
app.get("/api/activities", authMiddleware, async (c) => {
  const user = c.get("user");
  
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE user_id = ? ORDER BY date DESC, created_at DESC"
  )
    .bind(user!.id)
    .all();

  return c.json(results);
});

app.get("/api/activities/by-date/:date", authMiddleware, async (c) => {
  const user = c.get("user");
  const date = c.req.param("date");
  
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE user_id = ? AND date = ? ORDER BY created_at DESC"
  )
    .bind(user!.id, date)
    .all();

  return c.json(results);
});

app.get("/api/activities/summary", authMiddleware, async (c) => {
  const user = c.get("user");
  
  const { results } = await c.env.DB.prepare(
    `SELECT 
      date,
      SUM(minutes) as total_minutes,
      COUNT(*) as activity_count
    FROM activities 
    WHERE user_id = ? 
    GROUP BY date 
    ORDER BY date DESC`
  )
    .bind(user!.id)
    .all();

  return c.json(results);
});

app.post("/api/activities", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  
  const validation = CreateActivitySchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }

  const { date, name, category, minutes } = validation.data;

  // Check if adding this activity would exceed 1440 minutes for the day
  const { total_minutes } = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(minutes), 0) as total_minutes FROM activities WHERE user_id = ? AND date = ?"
  )
    .bind(user!.id, date)
    .first() as { total_minutes: number };

  if (total_minutes + minutes > 1440) {
    return c.json({ 
      error: `Cannot add activity. Would exceed 1440 minutes for ${date}. Current total: ${total_minutes} minutes.` 
    }, 400);
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO activities (user_id, date, name, category, minutes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  )
    .bind(user!.id, date, name, category, minutes)
    .run();

  const activity = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE id = ?"
  )
    .bind(result.meta.last_row_id)
    .first();

  return c.json(activity, 201);
});

app.put("/api/activities/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();
  
  const validation = UpdateActivitySchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: validation.error.errors }, 400);
  }

  // Check if activity exists and belongs to user
  const existing = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE id = ? AND user_id = ?"
  )
    .bind(id, user!.id)
    .first();

  if (!existing) {
    return c.json({ error: "Activity not found" }, 404);
  }

  const updates = validation.data;
  
  // If minutes are being updated, check the daily limit
  if (updates.minutes !== undefined) {
    const { total_minutes } = await c.env.DB.prepare(
      "SELECT COALESCE(SUM(minutes), 0) as total_minutes FROM activities WHERE user_id = ? AND date = ? AND id != ?"
    )
      .bind(user!.id, (existing as any).date, id)
      .first() as { total_minutes: number };

    if (total_minutes + updates.minutes > 1440) {
      return c.json({ 
        error: `Cannot update activity. Would exceed 1440 minutes for this day. Current total (excluding this activity): ${total_minutes} minutes.` 
      }, 400);
    }
  }

  const setClauses: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) {
    setClauses.push("name = ?");
    values.push(updates.name);
  }
  if (updates.category !== undefined) {
    setClauses.push("category = ?");
    values.push(updates.category);
  }
  if (updates.minutes !== undefined) {
    setClauses.push("minutes = ?");
    values.push(updates.minutes);
  }

  if (setClauses.length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }

  setClauses.push("updated_at = datetime('now')");

  await c.env.DB.prepare(
    `UPDATE activities SET ${setClauses.join(", ")} WHERE id = ? AND user_id = ?`
  )
    .bind(...values, id, user!.id)
    .run();

  const activity = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE id = ?"
  )
    .bind(id)
    .first();

  return c.json(activity);
});

app.delete("/api/activities/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  const existing = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE id = ? AND user_id = ?"
  )
    .bind(id, user!.id)
    .first();

  if (!existing) {
    return c.json({ error: "Activity not found" }, 404);
  }

  await c.env.DB.prepare(
    "DELETE FROM activities WHERE id = ? AND user_id = ?"
  )
    .bind(id, user!.id)
    .run();

  return c.json({ success: true });
});

export default app;
