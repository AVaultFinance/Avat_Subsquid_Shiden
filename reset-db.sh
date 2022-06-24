# 没事  初始化和create db 密码对不上  解决了
set -e
npx sqd codegen
npm run build
rm -rf db/migrations/*.js
npx sqd db drop
npx sqd db create
npx sqd db create-migration Init
npx sqd db migrate