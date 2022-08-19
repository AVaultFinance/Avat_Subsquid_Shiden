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
  token0Amount!: string

  @Column_("text", {nullable: false})
  token0Symbol!: string

  @Column_("text", {nullable: false})
  token0Address!: string

  @Column_("text", {nullable: false})
  token1Symbol!: string

  @Column_("text", {nullable: false})
  token1Amount!: string

  @Column_("text", {nullable: false})
  token1Address!: string

  @Column_("integer", {nullable: false})
  block!: number

  @Column_("text", {nullable: false})
  txHash!: string

  @Column_("text", {nullable: false})
  lpAddress!: string

  @Column_("text", {nullable: false})
  event!: string
}
