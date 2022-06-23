module.exports = class Init1655969003139 {
  name = 'Init1655969003139'

  async up(db) {
    await db.query(`CREATE TABLE "contract_lp" ("id" character varying NOT NULL, "balance" numeric NOT NULL, "name" text, CONSTRAINT "PK_7a3fee81c1c67597fbd4d465a02" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "contract" ("id" character varying NOT NULL, "name" text, "symbol" text, "total_supply" numeric, CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "amount" numeric NOT NULL, "timestamp" numeric NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "tvl_chart" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "current_timestamp" numeric NOT NULL, "value" numeric NOT NULL, CONSTRAINT "PK_f66cd7d4c33771e532ab8517aa1" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "contract_lp"`)
    await db.query(`DROP TABLE "contract"`)
    await db.query(`DROP TABLE "transfer"`)
    await db.query(`DROP TABLE "tvl_chart"`)
  }
}
