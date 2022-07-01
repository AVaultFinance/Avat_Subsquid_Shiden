import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class LpTokenAmount {
  constructor(props?: Partial<LpTokenAmount>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  idInt!: number

  @Column_("text", {nullable: false})
  token!: string

  @Column_("text", {nullable: false})
  quoteToken!: string

  @Column_("text", {nullable: false})
  tokenAmount!: string

  @Column_("text", {nullable: false})
  quoteTokenAmount!: string

  @Column_("integer", {nullable: false})
  block!: number

  @Column_("text", {nullable: false})
  txHash!: string

  @Column_("text", {nullable: false})
  lpAddress!: string

  @Column_("text", {nullable: false})
  event!: string
}
