# How to Access the Admin Page

Accessing the admin page requires two levels of security clearance: authentication and authorization. This guide will walk you through the necessary steps to gain access.

## 1. Authentication: Log In to Your Account

First and foremost, you must be logged into the application. If you attempt to access the `/admin` URL without an active session, you will be automatically redirected to the `/auth` page to log in.

**Steps:**
1. Navigate to the application's authentication page, typically found at `/auth`.
2. Enter your credentials (e.g., email and password) to log in.
3. Upon successful login, you will be redirected back to the application.

## 2. Authorization: Verify Admin Privileges

Simply being logged in is not enough to access the admin dashboard. Your user account must be granted administrative privileges. The application checks this by verifying if your user ID is associated with an 'admin' role in the `user_roles` table of the Supabase database.

**What to do if you don't have admin access:**

If you log in with a non-admin account and attempt to navigate to `/admin`, the system will perform a check. Finding no 'admin' role associated with your user ID, it will:
1. Display a toast notification with the error message: "Access Denied: You don't have admin privileges."
2. Redirect you to the home page (`/`).

**How to get admin access:**

To gain administrative rights, a database administrator must manually assign the 'admin' role to your user ID in the `user_roles` table.

**Example SQL for granting admin access:**
```sql
-- Replace 'your_user_id_here' with the actual user ID from the auth.users table.
INSERT INTO user_roles (user_id, role)
VALUES ('your_user_id_here', 'admin');
```

Once you are logged in with an account that has the 'admin' role, you will be able to successfully access and use the features of the admin dashboard at `/admin`.
