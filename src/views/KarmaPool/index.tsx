import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image, Text } from 'pancakeswap-uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { useFetchPublicPoolsData, usePools, useFetchDojoVault, useDojoVault } from 'state/karmapool/hooks'
import { usePollFarmsData } from 'state/farms/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { Pool } from 'state/types'
import Loading from 'components/Loading'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'
import HelpButton from './components/HelpButton'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { ViewMode } from './components/ToggleView/ToggleView'
import { getAprData, getDojoVaultEarnings } from './helpers'
import useGetAccount from '../../hooks/useGetAccount'
import leftimage from '../../images/karmaicon.png'

const BackgroundContainer = styled.div`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
`

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolControls = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const Karma: React.FC = () => {
  const { t } = useTranslation()
  // const { account } = useWeb3React()
  const account = useGetAccount()
  const { pools: poolsWithoutAutoVault, userDataLoaded } = usePools(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'karma_pool_staked' })
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const viewMode = ViewMode.CARD
  const chosenPoolsLength = useRef(0)
  const {
    userData: { charmAtLastUserAction, userShares },
    fees: { performanceFee },
    pricePerFullShare,
    totalCakeInVault,
  } = useDojoVault()

  const accountHasVaultShares = userShares && userShares.gt(0)
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  const pools = useMemo(() => {
    const dojoPool = poolsWithoutAutoVault.find((pool) => pool.isDojo === true)   
    const cakeAutoVault = { ...dojoPool, isAutoVault: true }  
    return  [cakeAutoVault, ...poolsWithoutAutoVault] // poolsWithoutAutoVault
  }, [poolsWithoutAutoVault])

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  // const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])

  usePollFarmsData()
  useFetchDojoVault()
  useFetchPublicPoolsData()

  let chosenPools
    chosenPools = pools
    chosenPools = pools.find((pool) => pool.isAutoVault)
  chosenPoolsLength.current = chosenPools.length
  
  const cardLayout = (
    <CardLayout>
          <CakeVaultCard key="auto-cake" pool={chosenPools} showStakedOnly={stakedOnly} />
    </CardLayout>
  )

  return (
    <>
      <BackgroundContainer>
        <PageHeader>
          <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
            <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
              <Heading as="h1" scale="xxl" color="text" mb="24px">
                {t('Karma')}
              </Heading>
              <Heading scale="md" color="text">
                {t('Stake Charm to earn Karma.')}
              </Heading>
              <Heading scale="md" color="text">
                {t('Earn interest plus a share of OmniDex fees.')}
              </Heading>
            </Flex>
        {/*    <Flex maxWidth= '150px' maxHeight="150px" flex={[null, null, null, '1']}> */}
        {/*        <img src={leftimage} alt='' /> */}
        {/*    </Flex> */}
            <Flex flex="1" height="fit-content" justifyContent="center" alignItems="flex-end" mt={['24px', null, '0']}>
              {/* <HelpButton /> */}
              <BountyCard />
            </Flex>
          </Flex>
        </PageHeader>
        <Page>
          {account && !userDataLoaded && stakedOnly && (
            <Flex justifyContent="center" mb="4px">
              <Loading />
            </Flex>
          )}
          {viewMode === ViewMode.CARD ? cardLayout : cardLayout}
          <div ref={loadMoreRef} />
        </Page>
      </BackgroundContainer>
    </>
  )
}

export default Karma
