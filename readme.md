# Authentication nodejs server

## DB Configuration

First of all set up the database. Create a Mysql instance wherever you want and then run the SQL script that i attached you in freelance (Also you can find it in this project root folder).<br>
This will create a database named "users_database" and one table "users"

## Environment configuration.

After the database configuration lets set up the environment variables:

### Database environment variables

1. DB_USER = mysql instance user - _defaults to "root"_
2. DB_PASS = mysql instance password - _defaults to an empty string ""_
3. DB_HOST = mysqs instance host - _defaults to localhost_
4. DB_PORT = mysql instance port - _defaults to 3306_
5. DB_NAME = the database name - **required and if you runned the sql script it should be "users_database"**

### Nodemailer environment configuration

If you are going to use GMAIL as your email sender you must take in consideration that after 2022-05-30 google desactivates the "able less secure apps" so in order to use it you must create an app password. See more: [Google Support](https://support.google.com/accounts/answer/185833 "Sign in with App Passwords")

1. MAIl_USER = Email adress **required**
2. APP_PASSWORD = Generated app password for that gmail || if's not gmail the email password. **required**
3. APP_NAME = Name that you want to appear in the confirmation email template. **required**
4. SMTP_HOST = Smtp host, _default: "smtp.gmail.com"_
5. SMTP_PORT = Smtp port, _default: 587. If you are using app passwords in gmail it should be 465._
6. SMTP_SECURE = _defaults to false, if port is 465 should be true._
7. SMTP_POOL = _defaults to false_, set to true if you want multiple connections in nodemailer.
8. EMAIL_CONFIRMATION_SECRET = a random secret that will be used to generate the unique token for email confirmation url. **required**
9. EMAIL_CONFIRMATION_BACKL_URL = Url where redirect the user when the email was validated. **required**

### JWT SECRETS

There are 3 secrets that you must provide that are used by jwt to generate the tokens: **JWT_SECRET**, **JWT_REFRESH_SECRET**, and **TFA_SECRET**. The first one is used to generate de full access token with the user info. The second one is used to generate the refresh token that only contains the user id, because it´s only used to refresh the token. The third one is used to generate the unique secret token that will be use to register the Microsoft Authenticator App in the user smartphone.

The token expires in 30min of inactivity, each request made to private routes will refresh the token unless it's expired or is invalid or the refresh token it's expired.

## ENDPOINTS

1. /auth/register - POST - expects FirstName, LastName, email and password, if successfull will send an email to the email adress for confirmation.
2. /auth/login - POST - expects email and password. Check if both are ok, then check if email is validated, then checks if Microsoft Authenticator App is validated and send the url for the qr if not, finally after all these validations send a token with the user_id that expires in 10m that will be used with the 6 digits code to the second step verification.
3. /auth/login/second-step - POST - expects the token with the id and the 6 digits code from the user and returns the accessToken and the refresh token.
4. /auth/confirmation/:token - POST - endpoint for email validation.
5. /test/private - GET - testing endpoint - needs to be authenticated.
6. /users/get-user - GET - get the user information from db - needs to be authenticated.

## CONFIG FOLDER

**You can set the environment variables but you can also modify the configuration objects provided to mysql.createPool({}) and mailer.createTransport({}). To do that do it directly in the config folder files.**
