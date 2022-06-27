module.exports = class Init1656327537997 {
  name = 'Init1656327537997'

  async up(db) {
    await db.query(`CREATE TABLE "tvl_chart" ("id" character varying NOT NULL, "current_timestamp" numeric NOT NULL, "end_timestamp" numeric NOT NULL, "a_lp_amount" numeric NOT NULL, "lp_price" jsonb NOT NULL, "block" integer NOT NULL, CONSTRAINT "PK_f66cd7d4c33771e532ab8517aa1" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "tvl_chart"`)
  }
}
