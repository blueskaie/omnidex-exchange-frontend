import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.cake,
    earningToken: tokens.cake,
    contractAddress: {
      40: '0x79f5A8BD0d6a00A41EA62cdA426CEf0115117a61',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1.535',
    sortOrder: 1,
    isFinished: false,
    isDojo: false,  
  },
  {
    sousId: 1,
    stakingToken: tokens.cake,
    earningToken: tokens.cake,
     contractAddress: {
       40: '0xDB895a9c45e4A671f00EebEe8BeC43F44bD3096d'  // 0x6357D86Bd149e85322438B62C65ECDa8F60862F3', // '0xDB895a9c45e4A671f00EebEe8BeC43F44bD3096d', // '0x9E289F8FAaEA65DfA4C87BfB54d96204Fd944F17', // TODO: Replace temp address with a normal one.
     },
     poolCategory: PoolCategory.AUTO,
     harvest: true,
     tokenPerBlock: '1.535',
     sortOrder: 999,
     isFinished: false,
     isDojo: true,    
   },
  {
    sousId: 2,
    stakingToken: tokens.karma,
    earningToken: tokens.elk,
    contractAddress: {
      40: '0xC16466acca4eBb6F5f430170f5009509e55f348F',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.000289351851851852',
    sortOrder: 1,
    isFinished: false,
    isDojo: false,
   },
]

export default pools
