import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

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
  value!: number
}
