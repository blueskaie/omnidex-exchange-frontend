import BigNumber from 'bignumber.js'
import { getDojoVaultContract, getDojoContract } from 'utils/contractHelpers'  

const dojoVaultContract = getDojoVaultContract() 
const dojoContract = getDojoContract() 

const fetchVaultUser = async (account: string) => {  
  const userContractResponse = await dojoVaultContract.userInfo(account) 
  const userKarmaBalance = await dojoContract.balanceOf(account) //  get amount of karma in user wallet

  return {
    isLoading: false,
    userShares: new BigNumber(userKarmaBalance.toString()).toJSON(),  //  the only record of shares is the karma in the user wallet
    lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
    lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
    charmAtLastUserAction: new BigNumber(userContractResponse.charmAtLastUserAction.toString()).toJSON(),
  }
}

export default fetchVaultUser


