import BigNumber from 'bignumber.js'
import { getDojoVaultContract, getDojoContract } from 'utils/contractHelpers'  
import { getDojoAddress } from 'utils/addressHelpers'  
import addresses from 'config/constants/contracts'

const dojoVaultContract = getDojoVaultContract() 
const dojoContract = getDojoContract() 
const dojoAddress = getDojoAddress() 

const fetchVaultUser = async (account: string) => {  
  try {
    const userContractResponse = await dojoVaultContract.userInfo(dojoAddress) 
    const userKarmaBalance = await dojoContract.balanceOf(account) // get amount of karma in user wallet
    const totalKarma = await dojoContract.totalSupply() // get total karma in circulation 
    const shareOfOutstandingCharm = new BigNumber(userKarmaBalance.toString()).div(new BigNumber(totalKarma.toString()).times(new BigNumber(userContractResponse.charmAtLastUserAction.toString()))) 

    return {
      isLoading: false,
      userShares: new BigNumber(userKarmaBalance.toString()).toJSON(),  //  the only record of shares is the karma in the user wallet
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),

      charmAtLastUserAction: shareOfOutstandingCharm.toJSON(),
      //      charmAtLastUserAction: new BigNumber(userContractResponse.charmAtLastUserAction.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      charmAtLastUserAction: null,
    }
  }
}

export default fetchVaultUser


