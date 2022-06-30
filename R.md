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

  - 如果是 USDC
    - `1257759.5744872892 = (764.570973*2)/(1215766492275232/Math.pow(10,18))`
    - `lpprice = (quoteTokenAmount*2)/(totalSupply/Math.pow(10,18))`
    - `0.3188772034823439 = (1257759.5744872892*(1215766492275232/Math.pow(10,18)))/(2397.697184528695775918*2)`
    - `tokenPrice = (lpprice*(totalSupply/Math.pow(10,18)))/(tokenAmount*2)`
