








# ------------------------------------------------------

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




# ------------------------------------------------------
# supabase

















## インストールコマンド
```bash
npm i @nuxtjs/supabase
npm i supabase --save-dev
```

## Supabase用フォルダ作成コマンド
```bash
npx supabase init 
```

## Supabaseコンテナ起動

※コンテナ名はsupabnase/config.toml の project_id になります
※これは変更OK

```bash
npx supabase start 
......
     Started supabase local development setup.
         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: 
service_role key: 
```

下記URLで実際に管理画面に入れるか確認
 http://localhost:54323


※「Inbucket」がメールボックス、ここにSupabasaeの認証系メールが仮想的に受信される
http://localhost:54324


```bash
npx supabase start 


```

## Supabaseコンテナ停止
コンテナを停止する場合 

>ちなみにこれをしないとPC再起動で勝手にコンテナが起動している。
ただし一部のコンテナが正常に起動していないケースがある。
※開発開始前に念のため、コンテナ停止→コンテナ起動 をすると良い


```bash
npx supabase stop
```



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
