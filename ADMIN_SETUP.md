# How to Add Admins

To give a user admin privileges, you need to assign them the `admin` role in the database.

## Prerequisites

1.  The user must have **already signed up** on the website.
2.  You need access to the **Supabase Dashboard**.

> **For Lovable Users:**
> Your project is hosted on Supabase. Access your database directly here:
> [**Open Supabase Dashboard**](https://supabase.com/dashboard/project/sgmsjdvrsbnygrpanjqy)

## Step 1: Get User IDs

1.  Go to the **Supabase Dashboard** (link above).
2.  Navigate to **Authentication** -> **Users**.
3.  Find the user's email address.
4.  Copy the **User UID** (it looks like a long string of random characters, e.g., `a1b2c3d4-e5f6...`).

## Step 2: Run SQL Command

1.  In Supabase, go to the **SQL Editor** (on the left sidebar).
2.  Click **New Query**.
3.  Paste one of the following commands:

### Option A: Add Single Admin

Replace `YOUR_USER_ID_HERE` with the UID you copied.

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin');
```

### Option B: Add Multiple Admins

If you want to add multiple people at once, use this format. Replace the placeholders with real User UIDs.

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES
  ('USER_ID_1', 'admin'),
  ('USER_ID_2', 'admin'),
  ('USER_ID_3', 'admin');
```

## Step 3: Verify

1.  Click **Run**.
2.  Ask the users to refresh the page. They should now have access to the `/admin` dashboard.
