



# memo 

npx sequelize migration:generate --name sequelize_init
npx sequelize db:migrate --env development

# ------------------------------------------------------

npx sequelize db:migrate:undo  --env development
npx sequelize db:migrate --env development

# ------------------------------------------------------


npx sequelize migration:generate --name create_account_user
npx sequelize db:migrate --env development

# ------------------------------------------------------

npx sequelize migration:generate --name create_test_db
npx sequelize db:migrate --env development

# ------------------------------------------------------

npx prisma init
npx prisma db pull --force
npx prisma-case-format --file prisma/schema.prisma && npx prisma format
npx prisma generate











# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
