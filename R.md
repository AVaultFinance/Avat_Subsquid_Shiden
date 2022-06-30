# 思路

- 1. transfer chart 插入 index id
- 2. mint 时

  - 1. 获取到当前 block lpprice
  - 2. 获取最近 block 的 transfer chart id
  - 3. 更新 chart
  - 4. transfer 与 mint 联系的关键是 key

- 1. 监听 lp 的 token0 token1 余额
- 2. lp price

     - totalSupply
     - token0
     - token1

     一共产生了 100 了 wsdn-usdc

     - totalSupply = 100
     - token0 = 10
     - token1 = 10000
