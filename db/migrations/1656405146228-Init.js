module.exports = class Init1656405146228 {
  name = 'Init1656405146228'

  async up(db) {
    await db.query(`CREATE TABLE "tvl_chart" ("id" character varying NOT NULL, "current_timestamp" numeric NOT NULL, "end_timestamp" numeric NOT NULL, "a_lp_amount" numeric NOT NULL, "a_lp_address" text NOT NULL, "lp_price" text array, "tx_hash" text, "block" integer NOT NULL, CONSTRAINT "PK_f66cd7d4c33771e532ab8517aa1" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "lp_price" ("id" character varying NOT NULL, "lp_price" text NOT NULL, "lp_address" text NOT NULL, "event" text NOT NULL, "block" integer NOT NULL, "tx_hash" text, "total_supply" text, CONSTRAINT "PK_3f04d144163b67ae9788d05b435" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "tvl_chart"`)
    await db.query(`DROP TABLE "lp_price"`)
  }
}
