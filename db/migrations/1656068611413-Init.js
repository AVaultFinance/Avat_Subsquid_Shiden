module.exports = class Init1656068611413 {
  name = 'Init1656068611413'

  async up(db) {
    await db.query(`CREATE TABLE "tvl_chart" ("id" character varying NOT NULL, "current_timestamp" numeric NOT NULL, "end_timestamp" numeric NOT NULL, "value" numeric NOT NULL, "block" numeric NOT NULL, CONSTRAINT "PK_f66cd7d4c33771e532ab8517aa1" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "tvl_chart"`)
  }
}
