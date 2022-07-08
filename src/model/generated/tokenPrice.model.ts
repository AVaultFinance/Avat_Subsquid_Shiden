import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class TokenPrice {
  constructor(props?: Partial<TokenPrice>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  idInt!: number

  @Column_("text", {nullable: false})
  tokenPrice!: string

  @Column_("text", {nullable: false})
  tokenSymbol!: string

  @Column_("text", {nullable: false})
  event!: string

  @Column_("integer", {nullable: false})
  block!: number

  @Column_("text", {nullable: false})
  txHash!: string
}
