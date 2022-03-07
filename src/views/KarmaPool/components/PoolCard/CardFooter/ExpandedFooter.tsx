import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  MetamaskIcon,
  Text,
  TooltipText,
  LinkExternal,
  TimerIcon,
  Skeleton,
  useTooltip,
  Button,
  Link,
  HelpIcon,
} from 'pancakeswap-uikit'
import { BASE_TELOS_EXPLORER_URL } from 'config'
import tokens from 'config/constants/tokens'
import { useBlock } from 'state/block/hooks'
import { useDojoVault } from 'state/karmapool/hooks'
import { Pool } from 'state/types'
import { getAddress, getKarmaAddress, getDojoAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { getTelosExplorerLink } from 'utils'
import Balance from 'components/Balance'
import { getPoolBlockInfo } from 'views/KarmaPool/helpers'

interface ExpandedFooterProps {
  pool: Pool
  account: string
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { currentBlock } = useBlock()
  const {
    userData,
    totalCakeInVault,
    fees: { performanceFee },
  } = useDojoVault()

  const {
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    contractAddress,
    sousId,
    isAutoVault,
  } = pool

  const karmaAddress = earningToken.address ? getKarmaAddress() : ''
  // const karmaSymbol = 
  const poolContractAddress = getAddress(contractAddress)
  const dojoContractAddress = getDojoAddress()
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const isManualCakePool = sousId === 0

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  )

  const getTotalStakedBalance = () => {
    if (isAutoVault) {
      return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
    }
    if (isManualCakePool) {
      const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(totalCakeInVault)
      return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }

  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(t('Total amount of %symbol% staked in this pool', { symbol: stakingToken.symbol }), {
    placement: 'bottom',
  })

  const getKarmaBalance = () => {
    return getBalanceNumber(userData.userShares, stakingToken.decimals)
  }

  const {
    targetRef: totalKarmaTargetRef,
    tooltip: totalKarmaTooltip,
    tooltipVisible: totalKarmaTooltipVisible,
  } = useTooltip(t('Total amount of shares in current wallet', { symbol: stakingToken.symbol }), {
    placement: 'bottom',
  })

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total staked')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked && totalStaked.gte(0) ? (
            <>
              <Balance small value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
              <span ref={totalStakedTargetRef}>
                <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
              </span>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
          {totalStakedTooltipVisible && totalStakedTooltip}
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total Karma in wallet')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked && totalStaked.gte(0) ? (
            <>
              <Balance small value={getKarmaBalance()} decimals={0} unit={` KARMA`} />
              <span ref={totalKarmaTargetRef}>
                <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
              </span>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
          {totalKarmaTooltipVisible && totalKarmaTooltip}
        </Flex>
      </Flex>
      {stakingLimit && stakingLimit.gt(0) && (
        <Flex mb="2px" justifyContent="space-between">
          <Text small>{t('Max. stake per user')}:</Text>
          <Text small>{`${getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0)} ${stakingToken.symbol}`}</Text>
        </Flex>
      )}

      {isAutoVault && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          {tooltipVisible && tooltip}
          <TooltipText ref={targetRef} small>
            {t('Performance Fee')}
          </TooltipText>
          <Flex alignItems="center">
            <Text ml="4px" small>
              {performanceFee / 100}%
            </Text>
          </Flex>
        </Flex>
      )}
      <Flex mb="2px" justifyContent="flex-end">
        {/* <LinkExternal href={`https://pancakeswap.info/token/${getAddress(earningToken.address)}`} bold={false} small> */}
        {/*  {t('See Token Info')} */}
        {/* </LinkExternal> */}
      </Flex>
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal href={earningToken.projectLink} bold={false} small>
          {t('View Project Site')}
        </LinkExternal>
      </Flex>
      {poolContractAddress && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal
            href={`${BASE_TELOS_EXPLORER_URL}/address/${isAutoVault ? dojoContractAddress : poolContractAddress}`}
            bold={false}
            small
          >
            {t('View Contract')}
          </LinkExternal>
        </Flex>
      )}
      {account && isMetaMaskInScope && karmaAddress && (
        <Flex justifyContent="flex-end">
          <Button
            variant="text"
            p="0"
            height="auto"
            onClick={() => registerToken(karmaAddress, tokens.karma.symbol, tokens.karma.decimals)}
          >
            <Text color="primary" fontSize="14px">
              {t('Add to Metamask')}
            </Text>
            <MetamaskIcon ml="4px" />
          </Button>
        </Flex>
      )}
    </ExpandedWrapper>
  )
}

export default React.memo(ExpandedFooter)
