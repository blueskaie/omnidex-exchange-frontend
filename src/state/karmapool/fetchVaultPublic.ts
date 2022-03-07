import BigNumber from 'bignumber.js'
import { convertSharesToCharm } from 'views/KarmaPool/helpers'
import multicall from 'utils/multicall'
import dojoVaultAbi from 'config/abi/DojoVault.json'
import { getDojoVaultAddress, getDojoAddress } from 'utils/addressHelpers' 
import { getDojoContract } from 'utils/contractHelpers' 
import { BIG_ZERO } from 'utils/bigNumber'

 const dojoContract = getDojoContract() 


export const fetchPublicVaultData = async () => {
  try {
    const calls = [
      'calculateHarvestCharmRewards',
      'calculateTotalPendingCharmRewards',
    ].map((method) => ({
      address: getDojoAddress(),
      name: method,
    }))

    const [[estimatedCakeBountyReward], [totalPendingCakeHarvest]] = await multicall(
      dojoVaultAbi,
      calls,
    )    
    
    const shares = await dojoContract.totalSupply() // get amount of karma un circulation
    const oneShare = new BigNumber(1000000000000000000).toJSON()  
    const sharePrice = await dojoContract.karmaForCharm(oneShare)       
    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const totalCharmInVaultEstimate = convertSharesToCharm(totalSharesAsBigNumber, sharePriceAsBigNumber) 
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalCakeInVault: totalCharmInVaultEstimate.cakeAsBigNumber.toJSON(), 
      estimatedCakeBountyReward: new BigNumber(estimatedCakeBountyReward.toString()).toJSON(),
      totalPendingCakeHarvest: new BigNumber(totalPendingCakeHarvest.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalCakeInVault: null,
      estimatedCakeBountyReward: null,
      totalPendingCakeHarvest: null,
    }
  }
}

export const fetchVaultFees = async () => {
  try {
    const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: getDojoVaultAddress(), 
      name: method,
    }))

    const [[performanceFee], [callFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicall(dojoVaultAbi, calls)

    return {
      performanceFee: performanceFee.toNumber(),
      callFee: callFee.toNumber(),
      withdrawalFee: withdrawalFee.toNumber(),
      withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
    }
  } catch (error) {
    return {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicVaultData
