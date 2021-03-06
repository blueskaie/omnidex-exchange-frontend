import React from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Flex, LogoutIcon, useModal, UserMenu as UIKitUserMenu, UserMenuDivider, UserMenuItem } from 'pancakeswap-uikit'
import useAuth from 'hooks/useAuth'
import { useProfile } from 'state/profile/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FetchStatus, useGetTlosBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import WalletModal, { WalletView, LOW_TLOS_BALANCE } from './WalletModal'
import ProfileUserMenuItem from './ProfileUserMenutItem'
import WalletUserMenuItem from './WalletUserMenuItem'

const UserMenu = () => {
  const { t } = useTranslation()
  const { account, error, chainId } = useWeb3React()
  const { logout } = useAuth()
  const { balance, fetchStatus } = useGetTlosBalance()
  const { isInitialized, isLoading, profile } = useProfile()
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const hasProfile = isInitialized && !!profile
  const avatarSrc = profile && profile.nft ? `/images/nfts/${profile.nft.images.sm}` : undefined
  const hasLowTlosBalance = fetchStatus === FetchStatus.SUCCESS && balance.lte(LOW_TLOS_BALANCE)
  const isWrongNetwork: boolean = error && error instanceof UnsupportedChainIdError

  // console.log("Wrong Network ", isWrongNetwork, chainId, account)

  if( isWrongNetwork || ( chainId !== parseInt(process.env.REACT_APP_CHAIN_ID) && chainId )) {
    return (
      <UIKitUserMenu account={t('Network')} avatarSrc={avatarSrc} variant="danger">
        <WalletUserMenuItem hasLowTlosBalance={hasLowTlosBalance} onPresentWalletModal={onPresentWalletModal} />
        <UserMenuItem as="button" onClick={onPresentTransactionModal}>
          {t('Transactions')}
        </UserMenuItem>
        <UserMenuDivider />
        {/* <ProfileUserMenuItem isLoading={isLoading} hasProfile={hasProfile} /> */}
        {/* <UserMenuDivider /> */}
        <UserMenuItem as="button" onClick={logout}>
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {t('Disconnect')}
            <LogoutIcon />
          </Flex>
        </UserMenuItem>
      </UIKitUserMenu>
    )
  }

  if (!account || !window.localStorage.getItem('walletconnect') ) {
    return <ConnectWalletButton scale="sm" />
  }

  return (
    <UIKitUserMenu account={account} avatarSrc={avatarSrc} >
      <WalletUserMenuItem hasLowTlosBalance={hasLowTlosBalance} onPresentWalletModal={onPresentWalletModal} />
      <UserMenuItem as="button" onClick={onPresentTransactionModal}>
        {t('Transactions')}
      </UserMenuItem>
      <UserMenuDivider />
      {/* <ProfileUserMenuItem isLoading={isLoading} hasProfile={hasProfile} /> */}
      {/* <UserMenuDivider /> */}
      <UserMenuItem as="button" onClick={logout}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {t('Disconnect')}
          <LogoutIcon />
        </Flex>
      </UserMenuItem>
    </UIKitUserMenu>
  )
}

export default UserMenu