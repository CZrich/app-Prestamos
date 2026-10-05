# Configure Supabase authentication and authorization

The app uses Supabase Auth for identity and PostgreSQL Row Level Security (RLS) for authorization. The public key identifies the project; the user's JWT and RLS policies determine which rows can be accessed.

## Quick path

1. Open **Supabase Dashboard > SQL Editor**.
2. Run `supabase/migrations/202610050001_auth_and_loans.sql`.
3. Open **Authentication > Providers > Email** and enable Email.
4. Keep **Confirm email** enabled for production.
5. Add the project URL and public key to the local `.env` file.
6. Restart Expo with `npx expo start --clear`.

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=YOUR_UNSIGNED_PRESET
```

The legacy `EXPO_PUBLIC_SUPABASE_ANON_KEY` variable is also accepted, but new projects should use the publishable key shown under **Project Settings > API Keys**.

## Existing prototype data

The migration preserves an existing `prestamos` table. Old rows have no owner and will be hidden by RLS. Assign them to a real authenticated user before making `owner_id` mandatory:

```sql
update public.prestamos
set owner_id = 'USER_UUID_FROM_AUTH_USERS'
where owner_id is null;

alter table public.prestamos
alter column owner_id set not null;
```

Do not disable RLS to expose old rows.

## Verify authorization

1. Create two accounts in the app.
2. Create a loan with the first account.
3. Sign out and enter with the second account.
4. Confirm that the second account cannot see, update, or delete the first account's loan.

The client filters by `owner_id` for clarity, but RLS is the actual security boundary.

## JWT behavior

Supabase issues and refreshes the JWT automatically after login. The client sends it with database requests, and policies compare its user identifier through `auth.uid()`. Never add the service-role key to an Expo environment variable or mobile application.

## Cloudinary note

The current upload uses an unsigned preset. Restrict that preset by file type, file size, folder, and allowed transformations. For stronger control, move uploads behind a signed server or Supabase Edge Function.
