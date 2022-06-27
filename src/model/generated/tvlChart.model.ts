import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {LpPrice} from "./_lpPrice"

@Entity_()
export class TVLChart {
  constructor(props?: Partial<TVLChart>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  currentTimestamp!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  endTimestamp!: bigint

  @Column_("numeric", {nullable: false})
  aLpAmount!: number

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new LpPrice(undefined, marshal.nonNull(val)))}, nullable: false})
  lpPrice!: (LpPrice)[]

  @Column_("integer", {nullable: false})
  block!: number
}
