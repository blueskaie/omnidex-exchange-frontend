import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/Mentee.json'
import cakeABI from 'config/abi/cake.json'
import wtlosABI from 'config/abi/weth.json'
import multicall from 'utils/multicall'
import { getAddress, getWtlosAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getSouschefV2Contract, getXcharmContract } from 'utils/contractHelpers'

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => (p.sousId !== 0 && p.isDojo === false))
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'bonusEndBlock',
    }
  })

  const starts = await multicall(sousChefABI, callsStartBlock)
  const ends = await multicall(sousChefABI, callsEndBlock)

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
    }
  })
}

export const fetchPoolsTotalStaking = async () => {  
  const nonSpecialPools = poolsConfig.filter((p) => (p.stakingToken.symbol !== 'TLOS' && p.isDojo === false))  
  const dojoPool = poolsConfig.filter((p) => p.isDojo === true)    
  const tlosPool = poolsConfig.filter((p) => p.stakingToken.symbol === 'TLOS')

  const callsNonSpecialPools = nonSpecialPools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const callsTlosPools = tlosPool.map((poolConfig) => {
    return {
      address: getWtlosAddress(),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const xcharmContract = getXcharmContract() 
  const totalCharmStaked = await xcharmContract.totalSupply()   
  const totalCharmInDojo = new BigNumber(totalCharmStaked.toString())
  
  const nonSpecialPoolsTotalStaked = await multicall(cakeABI, callsNonSpecialPools)
  const tlosPoolsTotalStaked = await multicall(wtlosABI, callsTlosPools)

  return [
    ...nonSpecialPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonSpecialPoolsTotalStaked[index]).toJSON(),
    })),
    ...tlosPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(tlosPoolsTotalStaked[index]).toJSON(),
    })),
    ...dojoPool.map((p, index) => ({      
      sousId: p.sousId,
      totalStaked: new BigNumber(totalCharmInDojo.toString()).toJSON(),
    })),
  ]
}

export const fetchPoolStakingLimit = async (sousId: number): Promise<BigNumber> => {
  try {
    const sousContract = getSouschefV2Contract(sousId)
    const stakingLimit = await sousContract.poolLimitPerUser()
    return new BigNumber(stakingLimit.toString())
  } catch (error) {
    return BIG_ZERO
  }
}

export const fetchPoolsStakingLimits = async (
  poolsWithStakingLimit: number[],
): Promise<{ [key: string]: BigNumber }> => {
  const validPools = poolsConfig
    .filter((p) => p.stakingToken.symbol !== 'TLOS' && !p.isFinished)
    .filter((p) => !poolsWithStakingLimit.includes(p.sousId))

  // Get the staking limit for each valid pool
  // Note: We cannot batch the calls via multicall because V1 pools do not have "poolLimitPerUser" and will throw an error
  const stakingLimitPromises = validPools.map((validPool) => fetchPoolStakingLimit(validPool.sousId))
  const stakingLimits = await Promise.all(stakingLimitPromises)

  return stakingLimits.reduce((accum, stakingLimit, index) => {
    return {
      ...accum,
      [validPools[index].sousId]: stakingLimit,
    }
  }, {})
}
