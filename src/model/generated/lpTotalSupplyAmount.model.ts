import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class LpTotalSupplyAmount {
  constructor(props?: Partial<LpTotalSupplyAmount>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  idInt!: number

  @Column_("text", {nullable: false})
  fromAddress!: string

  @Column_("text", {nullable: false})
  toAddress!: string

  @Column_("integer", {nullable: false})
  block!: number

  @Column_("text", {nullable: false})
  txHash!: string

  @Column_("text", {nullable: false})
  lpAddress!: string

  @Column_("text", {nullable: false})
  value!: string

  @Column_("text", {nullable: false})
  event!: string

  @Column_("text", {nullable: false})
  totalSupply!: string
}
