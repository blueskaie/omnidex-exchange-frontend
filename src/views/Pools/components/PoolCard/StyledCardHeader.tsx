import React from 'react'
import { CardHeader, Heading, Text, Flex, Link } from 'pancakeswap-uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'
import CakeVaultTokenPairImage from '../CakeVaultCard/CakeVaultTokenPairImage'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background]};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`

const StyledCardHeader: React.FC<{
  sousId: number
  earningToken: Token
  stakingToken: Token
  isAutoVault?: boolean
  isFinished?: boolean
  isStaking?: boolean
}> = ({ sousId, earningToken, stakingToken, isFinished = false, isAutoVault = false, isStaking = false }) => {
  const { t } = useTranslation()
  const isCakePool = earningToken.symbol === 'CHARM' && stakingToken.symbol === 'CHARM'
  const background = isStaking ? 'bubblegum' : 'cardHeader'

  const getHeadingPrefix = () => {
    if (isAutoVault) {
      // vault
      return t('Auto')
    }
    if (isCakePool) {
      // manual cake
      return t('Stake')
    }
    // all other pools
    return t('Earn')
  }

  const getSubHeading = () => {
    if (isAutoVault && sousId !== 0) {
      return t('Automatic restaking')
    }
    if (isCakePool  && sousId !== 0) {
      return t('Stake CHARM, earn CHARM')
    }
    if (sousId === 0) {
      return t('')
    }
    return t('Stake %symbol%', { symbol: stakingToken.symbol })
  }

  const getIsSousId0 = () => {
    if (sousId === 0) {
      return true
    }
    return false
  }

  const StyledLink = styled(Link)`
  width: 100%;
`

  const getFinishingHeading = () => {
    if (sousId === 0) {
      return t('This pool will be finishing soon and will be set to withdraw only.  Please restake in the CHARM-KARMA pool to earn higher rewards.')
    }
    return t(' ')    
  }

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color={isFinished ? 'textDisabled' : 'body'} scale="lg">
            {`${getHeadingPrefix()} ${earningToken.symbol}`}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>{getSubHeading()}</Text>
          <StyledLink external href="/karmapool">
            <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>{getFinishingHeading()}</Text>
          </StyledLink> 
        </Flex>
        {isAutoVault ? (
          <CakeVaultTokenPairImage width={64} height={64} />
        ) : (
          <TokenPairImage primaryToken={earningToken} secondaryToken={stakingToken} width={64} height={64} />
        )}
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
