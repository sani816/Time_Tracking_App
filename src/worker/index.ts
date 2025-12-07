import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { CreateActivitySchema, UpdateActivitySchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// OAuth routes
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
    maxAge: 60 * 24 * 60 * 60,
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
  const date = c.req.query("date");

  if (!date) {
    return c.json({ error: "Date parameter is required" }, 400);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE user_id = ? AND activity_date = ? ORDER BY created_at DESC"
  )
    .bind(user.id, date)
    .all();

  return c.json(results);
});

app.get("/api/activities/stats", authMiddleware, async (c) => {
  const user = c.get("user");

  const { results } = await c.env.DB.prepare(
    `SELECT 
      activity_date,
      category,
      SUM(minutes) as total_minutes
    FROM activities 
    WHERE user_id = ? 
    GROUP BY activity_date, category
    ORDER BY activity_date DESC
    LIMIT 30`
  )
    .bind(user.id)
    .all();

  return c.json(results);
});

app.post("/api/activities", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  const validation = CreateActivitySchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: "Invalid activity data", details: validation.error }, 400);
  }

  const { name, category, minutes, activity_date } = validation.data;

  // Check total minutes for the day
  const { total_minutes } = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(minutes), 0) as total_minutes FROM activities WHERE user_id = ? AND activity_date = ?"
  )
    .bind(user.id, activity_date)
    .first() as { total_minutes: number };

  if (total_minutes + minutes > 1440) {
    return c.json({ 
      error: "Cannot add activity. Total minutes for the day would exceed 1440 (24 hours).",
      current_total: total_minutes,
      remaining: 1440 - total_minutes
    }, 400);
  }

  const result = await c.env.DB.prepare(
    "INSERT INTO activities (user_id, activity_date, name, category, minutes) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(user.id, activity_date, name, category, minutes)
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
    return c.json({ error: "Invalid activity data", details: validation.error }, 400);
  }

  const { name, category, minutes } = validation.data;

  // Get the existing activity
  const existing = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE id = ? AND user_id = ?"
  )
    .bind(id, user.id)
    .first();

  if (!existing) {
    return c.json({ error: "Activity not found" }, 404);
  }

  // Check total minutes for the day (excluding current activity)
  const { total_minutes } = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(minutes), 0) as total_minutes FROM activities WHERE user_id = ? AND activity_date = ? AND id != ?"
  )
    .bind(user.id, existing.activity_date, id)
    .first() as { total_minutes: number };

  if (total_minutes + minutes > 1440) {
    return c.json({ 
      error: "Cannot update activity. Total minutes for the day would exceed 1440 (24 hours).",
      current_total: total_minutes,
      remaining: 1440 - total_minutes
    }, 400);
  }

  await c.env.DB.prepare(
    "UPDATE activities SET name = ?, category = ?, minutes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?"
  )
    .bind(name, category, minutes, id, user.id)
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

  const result = await c.env.DB.prepare(
    "DELETE FROM activities WHERE id = ? AND user_id = ?"
  )
    .bind(id, user.id)
    .run();

  if (result.meta.changes === 0) {
    return c.json({ error: "Activity not found" }, 404);
  }

  return c.json({ success: true });
});

export default app;
