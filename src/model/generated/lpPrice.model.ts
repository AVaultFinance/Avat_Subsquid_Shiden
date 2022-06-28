import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class LpPrice {
  constructor(props?: Partial<LpPrice>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  lpPrice!: string

  @Column_("text", {nullable: false})
  lpAddress!: string

  @Column_("text", {nullable: false})
  event!: string

  @Column_("integer", {nullable: false})
  block!: number

  @Column_("text", {nullable: true})
  txHash!: string | undefined | null

  @Column_("text", {nullable: true})
  totalSupply!: string | undefined | null
}
