module.exports = class Init1657622770111 {
  name = 'Init1657622770111'

  async up(db) {
    await db.query(`CREATE TABLE "tvl_chart" ("id" character varying NOT NULL, "id_int" integer NOT NULL, "current_timestamp" numeric NOT NULL, "total_a_lp_amount_usd" text NOT NULL, "a_lp_amount" text NOT NULL, "a_lp_amount_usd" text NOT NULL, "a_lp_address" text NOT NULL, "lp_price" text NOT NULL, "tx_hash" text NOT NULL, "block" integer NOT NULL, "event" text NOT NULL, CONSTRAINT "PK_f66cd7d4c33771e532ab8517aa1" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "lp_token_amount" ("id" character varying NOT NULL, "id_int" integer NOT NULL, "token" text NOT NULL, "quote_token" text NOT NULL, "token_amount" text NOT NULL, "quote_token_amount" text NOT NULL, "block" integer NOT NULL, "tx_hash" text NOT NULL, "lp_address" text NOT NULL, "event" text NOT NULL, CONSTRAINT "PK_bd4293964632e8f48a9e553568c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "lp_total_supply_amount" ("id" character varying NOT NULL, "id_int" integer NOT NULL, "from_address" text NOT NULL, "to_address" text NOT NULL, "block" integer NOT NULL, "tx_hash" text NOT NULL, "lp_address" text NOT NULL, "value" text NOT NULL, "event" text NOT NULL, "total_supply" text NOT NULL, CONSTRAINT "PK_a99a929218c8bd23cb9c672a2fe" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "lp_price" ("id" character varying NOT NULL, "id_int" integer NOT NULL, "lp_price" text NOT NULL, "lp_address" text NOT NULL, "lp_symbol" text NOT NULL, "event" text NOT NULL, "block" integer NOT NULL, "tx_hash" text NOT NULL, CONSTRAINT "PK_3f04d144163b67ae9788d05b435" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "token_price" ("id" character varying NOT NULL, "id_int" integer NOT NULL, "token_price" text NOT NULL, "token_symbol" text NOT NULL, "event" text NOT NULL, "block" integer NOT NULL, "tx_hash" text NOT NULL, CONSTRAINT "PK_dcc681716689f0d6311c0498c61" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "tvl_chart"`)
    await db.query(`DROP TABLE "lp_token_amount"`)
    await db.query(`DROP TABLE "lp_total_supply_amount"`)
    await db.query(`DROP TABLE "lp_price"`)
    await db.query(`DROP TABLE "token_price"`)
  }
}
