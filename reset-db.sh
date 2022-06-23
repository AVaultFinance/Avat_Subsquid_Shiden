set -e
echo 1
npx sqd codegen
npm run build
rm -rf db/migrations/*.js
echo 2
npx sqd db drop
echo 3
npx sqd db create
npx sqd db create-migration Init
npx sqd db migrate