import React from 'react'
import { Text, TooltipText, useTooltip } from 'pancakeswap-uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

interface KarmaCharmRatioProps {
  charmToDisplay: number
}

const KarmaCharmRatio: React.FC<KarmaCharmRatioProps> = ({
  charmToDisplay,
}) => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Balance fontSize="20px" value={charmToDisplay} decimals={3} bold unit=" CHARM" />


    </>,
    {
      placement: 'bottom-end',
    },
  )

  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        <Balance fontSize="20px" value={charmToDisplay} />
      </TooltipText>
    </>
  )
}

export default KarmaCharmRatio
