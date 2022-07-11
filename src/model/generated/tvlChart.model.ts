import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class TVLChart {
  constructor(props?: Partial<TVLChart>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("integer", {nullable: false})
  idInt!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  currentTimestamp!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  endTimestamp!: bigint

  @Column_("text", {nullable: false})
  totalALpAmountUsd!: string

  @Column_("text", {nullable: false})
  aLpAmount!: string

  @Column_("text", {nullable: false})
  aLpAmountUsd!: string

  @Column_("text", {nullable: false})
  aLpAddress!: string

  @Column_("text", {nullable: false})
  lpPrice!: string

  @Column_("text", {nullable: false})
  txHash!: string

  @Column_("integer", {nullable: false})
  block!: number
}
