# Authentication nodejs server

## DB Configuration

First of all set up the database. Create a Mysql instance wherever you want and then run the SQL script that i attached you in freelance (Also you can find it in this project root folder).<br>
This will create a database named "users_database" and one table "users"

## Environment configuration.

After the database configuration lets set up the environment variables:

### Database environment variables

1. DB_USER = mysql instance user - defaults to "root"
2. DB_PASS = mysql instance password - defaults to an empty string ""
3. DB_HOST = mysqs instance host - defaults to localhost
4. DB_PORT = mysql instance port - defaults to 3306
5. DB_NAME = the database name - required and if you runned the sql script it should be "users_database"

### Nodemailer environment configuration

If you are going to use GMAIL as your email sender you must take in consideration that after 2022-05-30 google desactivates the "able less secure apps" so in order to use it you must create an app password. See more: [Google Support](https://support.google.com/accounts/answer/185833 "Sign in with App Passwords")

1. MAIl_USER = Email adress
2. APP_PASSWORD = Generated app password for that email.
3. APP_NAME = Name that you want to appear in the confirmation email template.
4. SMTP_HOST = Smtp host, default: "smtp.gmail.com"
5. SMTP_PORT = Smtp port, default: 587. If you are using app passwords in gmail it should be 465.
6. SMTP_SECURE = defaults to false, if port is 465 should be true.
7. SMTP_POOL = defaults to false, set to true if you want multiple connections in nodemailer.
8. EMAIL_CONFIRMATION_SECRET = a random secret that will be used to generate the unique token for email confirmation url.

### JWT SECRETS

There are 2 secrets that you must provide that are used by jwt to generate the tokens: JWT_SECRET and JWT_REFRESH_SECRET. The first one is used to generate de full access token with the user info. The other one is used to generate the refresh token that only contains the user id, because it´s only used to refresh the token.

The token expires in 30min of inactivity, each request made after an successfull login will refresh the token unless it's expired or is invalid.

## ENDPOINTS

/auth/register - POST - expects FirstName, LastName, email and password, if successfull will send an email to the email adress for confirmation.
/auth/login - POST - expects email and password. Check if both are ok, then check if email is validated, then checks if Microsoft Authenticator App is validated and send the url for the qr if not, finally after all these validations send a token with the user_id that expires in 10m that will be used with the 6 digits code to the second step verification.
/auth/login/second-step - POST - expects the token with the id and the 6 digits code from the user and returns the accessToken and the refresh token.
/auth/confirmation/:token - POST - endpoint for email validation.

/test/private - GET - testing endpoint.
