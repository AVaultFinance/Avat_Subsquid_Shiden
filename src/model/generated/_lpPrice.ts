import assert from "assert"
import * as marshal from "./marshal"

export class LpPrice {
  private _id!: string
  private _tokenSymbol!: string
  private _price!: number

  constructor(props?: Partial<Omit<LpPrice, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._id = marshal.id.fromJSON(json.id)
      this._tokenSymbol = marshal.string.fromJSON(json.tokenSymbol)
      this._price = marshal.float.fromJSON(json.price)
    }
  }

  get id(): string {
    assert(this._id != null, 'uninitialized access')
    return this._id
  }

  set id(value: string) {
    this._id = value
  }

  get tokenSymbol(): string {
    assert(this._tokenSymbol != null, 'uninitialized access')
    return this._tokenSymbol
  }

  set tokenSymbol(value: string) {
    this._tokenSymbol = value
  }

  get price(): number {
    assert(this._price != null, 'uninitialized access')
    return this._price
  }

  set price(value: number) {
    this._price = value
  }

  toJSON(): object {
    return {
      id: this.id,
      tokenSymbol: this.tokenSymbol,
      price: this.price,
    }
  }
}
