To setup:

1. At the terminal, type in `yarn install`
2. Create a new database user according to the setup steps in the lab.
    ```
    CREATE USER 'foo'@'%' IDENTIFIED WITH mysql_native_password BY 'bar';
    
    grant all privileges on *.* to 'foo'@'%';

    FLUSH PRIVILEGES;
    ```
3. Create a new database by the name of `organic`

4. Install nodemon with `npm install -g nodemon`

5. Create the `db-migrate.sh` file and change its permission as per the lab.
   ```
   node node_modules/db-migrate/bin/db-migrate "$@"
   ```

   and we grant permission with

   ```
   chmod +x ./db-migrate.sh
   ```

6. Configure `database.json` and `bookshelf/index/js` to read DB variables from .env

7. Run migrations with `./db-migrate.sh up`

## Sample .env file
```
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=
DB_DRIVER=mysql
DB_USER=foo
DB_PASSWORD=bar
DB_DATABASE=organic
DB_HOST=localhost
SESSION_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_SUCCESS_URL=
STRIPE_CANCEL_URL=
STRIPE_ENDPOINT_SECRET=
TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```


