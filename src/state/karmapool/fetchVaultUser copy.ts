import BigNumber from 'bignumber.js'
import { getDojoVaultContract, getDojoContract } from 'utils/contractHelpers'  
import { getDojoAddress } from 'utils/addressHelpers'  

const dojoVaultContract = getDojoVaultContract() 
const dojoContract = getDojoContract() 
const dojoAddress = getDojoAddress

const fetchVaultUser = async (account: string) => {  
  try {
    const userContractResponse = await dojoVaultContract.userInfo(dojoAddress) //  Dojo is only one who deposits in vault
    const userKarmaBalance = await dojoContract.balanceOf(account) //  get amount of karma in user wallet
    
    return {
      isLoading: false,
      userShares: new BigNumber(userKarmaBalance.toString()).toJSON(),  //  the only record of shares is the karma in the user wallet
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      // charmAtLastUserAction: shareOfOutstandingCharm.toJSON(),
      charmAtLastUserAction: new BigNumber(userContractResponse.charmAtLastUserAction.toString()).toJSON(),
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


