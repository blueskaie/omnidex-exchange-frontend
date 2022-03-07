import BigNumber from 'bignumber.js'
import { Farm, Pool } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { BLOCKS_PER_YEAR } from 'config'

type UserData =
  | Pool['userData']
  | {
      allowance: number | string
      stakingTokenBalance: number | string
      stakedBalance: number | string
      pendingReward: number | string
    }

export const transformUserData = (userData: UserData) => {
  return {
//    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
  }
}

export const transformPool = (dojo: Pool): Pool => {
  const { totalStaked, stakingLimit, userData, ...rest } = dojo

  return {
    ...rest,
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked),
    stakingLimit: new BigNumber(stakingLimit),
  } as Pool
}

export const getTokenPricesFromFarm = (farms: Farm[]) => {
  return farms.reduce((prices, farm) => {
    const quoteTokenAddress = getAddress(farm.quoteToken.address).toLocaleLowerCase()
    const tokenAddress = getAddress(farm.token.address).toLocaleLowerCase()

    /* eslint-disable no-param-reassign */
    if (!prices[quoteTokenAddress]) {
      prices[quoteTokenAddress] = new BigNumber(farm.quoteToken.busdPrice).toNumber()
    }
    if (!prices[tokenAddress]) {
      prices[tokenAddress] = new BigNumber(farm.token.busdPrice).toNumber()
    }
    /* eslint-enable no-param-reassign */
    return prices
  }, {})
}

// dojoShareOfPid0 = totalSharesInDojoVault / totalSupplyOfXcharm
// totalCharmRewardPerYear = ((tokenPerBlock x BlocksPerYear x dojoShareOfPid0 x (1 - vaultV2BurnRate)) + charmFeesPerYear
// apr = totalCharmRewardPerYear / totalCharmInDojo
export const getDojoApr = (
 totalStaked: number,
 tokenPerBlock: number,
 vaultV2BurnRate: number,
 cumulativeCharmFees: number,
 totalCharmInDojo: number,
): number => {
  const dojoShareOfPid0 = new BigNumber(totalCharmInDojo).div(totalStaked)  
  const bigOne = new BigNumber(1)
  const keepRate = bigOne.minus(vaultV2BurnRate)  
  const pid0RewardsPerYear = new BigNumber(tokenPerBlock).times(BLOCKS_PER_YEAR).times(dojoShareOfPid0).times(keepRate)
  const totalRewardsPerYear = BigNumber.sum(pid0RewardsPerYear.toString(), cumulativeCharmFees)
  const apr = totalRewardsPerYear.div(totalCharmInDojo).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

