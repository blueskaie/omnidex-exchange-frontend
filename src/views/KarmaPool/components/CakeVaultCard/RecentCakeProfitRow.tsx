import React from 'react'
import { Flex, Text } from 'pancakeswap-uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useDojoVault } from 'state/karmapool/hooks'
import { getDojoVaultEarnings } from 'views/KarmaPool/helpers'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import KarmaCharmRatio from './KarmaCharmRatio'
import useGetAccount from '../../../../hooks/useGetAccount'

const RecentCakeProfitCountdownRow = () => {
  const { t } = useTranslation()
  // const { account } = useWeb3React()
  const account = useGetAccount()
  const {
    pricePerFullShare,
    userData: { charmAtLastUserAction, userShares, lastUserActionTime },
  } = useDojoVault()
  const cakePriceBusd = usePriceCakeBusd()  
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getDojoVaultEarnings(
    account,
    charmAtLastUserAction,
    userShares,
    pricePerFullShare,
    cakePriceBusd.toNumber(),
  )

  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  return (
    <Flex alignItems="center" justifyContent="space-around">
      <Text fontSize="20px">{`${t('1 Karma   =')}`}</Text>      
        <KarmaCharmRatio
          charmToDisplay={getBalanceNumber(new BigNumber(pricePerFullShare.toString()),18)}
        />
      <Text fontSize="20px">{`${t('Charm')}`}</Text> 
      
    </Flex>
  )
}

export default RecentCakeProfitCountdownRow
