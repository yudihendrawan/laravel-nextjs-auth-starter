# Project Name

A full-stack application using Laravel Passport for authentication and Next.js as the frontend framework. This project includes features such as Google login (via Laravel Socialite), multi-role users, and email verification.

## Features

- **Laravel Passport Authentication**
- **Login via Google (powered by Google Socialite)**
- **Multi-role user system**
- **Email verification**

## Requirements

- Laravel Version: **11.9**
- Next.js Version: **14.2.7**

## Getting Started

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Copy .env.example to .env:**

   ```bash
   cp .env.example .env
   ```

3. **Create a new database:**

Ensure that your .env file contains the correct database connection settings.

4. **Install PHP dependencies:**

   ```bash
   composer install
   ```

5. **Seed the database with default roles:**

   ```bash
   php artisan db:seed --class=RolesTableSeeder
   ```

6. **Seed the database with default roles:**

   ```bash
   php artisan db:seed --class=RolesTableSeeder
   ```

   > You can customize the roles by modifying the seeder.

7. **Generate Laravel Passport client for password grant:**

   ```bash
   php artisan passport:client --password
   ```

   **Copy the generated client_id and client_secret and paste them into your .env file:**

```bash
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
```

8. **Generate Laravel Passport client for password grant:**

   ```bash
   php artisan passport:client --password
   ```

9. **Generate Passport encryption keys:**

   ```bash
   php artisan passport:keys
   ```

10. **Serve the application:**

```bash
php artisan serve
```

### OAuth Setup (Google Login)

1. Go to the Google [Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services** > Credentials, then create OAuth 2.0 Client IDs.
3. Follow the Google documentation for setting up OAuth 2.0: [Google OAuth Documentation](https://console.cloud.google.com/).
4. After creating the credentials, copy the following values to your .env file:

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
```

### Frontend Setup

1. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

2. **Copy .env.example to .env and update the backend API URL:**

   ```bash
   cp .env.example .env
   ```

   **Update the .env file with the correct backend API URL:**

   ```bash
   NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
   ```

3. **Run the Next.js development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser and go to http://localhost:3000.**

## Additional Information

### Laravel Passport

After generating the Passport client, the `client_id` and `client_secret` are stored in the database. Ensure these values are copied into your `.env` file as shown above.

For more information on Laravel Passport, you can refer to the official [Laravel Passport Documentation](https://laravel.com/docs/11.x/passport).

Google OAuth Setup
You can follow this [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) tutorial for more detailed information on how to set up your Google credentials.

## License

[MIT](https://choosealicense.com/licenses/mit/)
