module.exports = class Init1656553538650 {
  name = 'Init1656553538650'

  async up(db) {
    await db.query(`CREATE TABLE "tvl_chart" ("id" character varying NOT NULL, "id_int" integer NOT NULL, "current_timestamp" numeric NOT NULL, "end_timestamp" numeric NOT NULL, "a_lp_amount" numeric NOT NULL, "a_lp_address" text NOT NULL, "lp_price" text array, "tx_hash" text, "block" integer NOT NULL, CONSTRAINT "PK_f66cd7d4c33771e532ab8517aa1" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "lp_price" ("id" character varying NOT NULL, "id_int" integer NOT NULL, "lp_price" text NOT NULL, "lp_address" text NOT NULL, "event" text NOT NULL, "block" integer NOT NULL, "tx_hash" text, CONSTRAINT "PK_3f04d144163b67ae9788d05b435" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "lp_token_amount" ("id" character varying NOT NULL, "id_int" integer NOT NULL, "token" text NOT NULL, "quote_token" text NOT NULL, "token_amount" text NOT NULL, "quote_token_amount" text NOT NULL, "block" integer NOT NULL, "tx_hash" text, "lp_address" text NOT NULL, "event" text NOT NULL, CONSTRAINT "PK_bd4293964632e8f48a9e553568c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "lp_total_supply_amount" ("id" character varying NOT NULL, "id_int" integer NOT NULL, "from_address" text, "to_address" text, "block" integer NOT NULL, "tx_hash" text, "lp_address" text NOT NULL, "value" text, "event" text NOT NULL, "total_supply" text, CONSTRAINT "PK_a99a929218c8bd23cb9c672a2fe" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "tvl_chart"`)
    await db.query(`DROP TABLE "lp_price"`)
    await db.query(`DROP TABLE "lp_token_amount"`)
    await db.query(`DROP TABLE "lp_total_supply_amount"`)
  }
}
