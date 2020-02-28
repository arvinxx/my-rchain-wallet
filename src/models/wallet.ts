import { Reducer, Effect, DvaModel } from './connect';
import { CurrentUser } from '@/models/user';
import { checkBalance, transferToken } from '@/services/wallet';
import { message } from 'antd';
import { getItem, setItem, sleep } from '@/utils/utils';
import { getBlockInfo, getDeployInfo } from '@/services/rnode';

export type CheckingStatus = 'success' | 'default' | 'error' | 'warning';
export type TransferStatus = 'none' | 'success' | 'error' | 'processing';
export interface TransferContract {
  transferStatus: TransferStatus;
  deployId: string;
  blockHash: string;
  blockStatus: string;
}
export interface WalletModelState {
  revBalance: number;
  fee: number;
  checkStatus: CheckingStatus;
  transferContract: TransferContract;
}

export interface WalletModelStore extends DvaModel<WalletModelState> {
  effects: {
    checkBalance: Effect;
    transfer: Effect;
    checkTransferStatus: Effect;
    initContract: Effect;
  };
  reducers: {
    save: Reducer;
    setTransferContract: Reducer;
  };
}

const WalletModel: WalletModelStore = {
  state: {
    revBalance: 0,
    fee: 0.002,
    checkStatus: 'default',
    transferContract: {
      deployId: '',
      transferStatus: 'none',
      blockHash: '',
      blockStatus: 'none',
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setTransferContract(state, { payload }) {
      const { transferContract } = state;
      setItem<TransferContract>('transferContract', {
        ...transferContract,
        ...payload,
      });
      return {
        ...state,
        transferContract: { ...transferContract, ...payload },
      };
    },
  },

  effects: {
    *checkBalance(_, { put, select }) {
      const { address } = yield select(state => state.user.currentUser);
      yield put({
        type: 'save',
        payload: { checkStatus: 'default' },
      });
      try {
        const { expr } = yield checkBalance(address);
        const balance = expr[0]!.ExprInt!.data;
        yield put({
          type: 'save',
          payload: {
            checkStatus: 'success',
            revBalance: balance / 1e8,
            waitingBlockNumber: 0,
          },
        });
      } catch (e) {
        yield put({
          type: 'save',
          payload: { checkStatus: 'error' },
        });
      }
    },
    *initContract(_, { put }) {
      const transferContract = getItem('transferContract');
      if (!transferContract) return;

      yield put({ type: 'setTransferContract', payload: transferContract });
      yield put({ type: 'checkTransferStatus' });
    },

    *transfer({ payload }, { put, call, select }) {
      const { amount, toAddr } = payload;
      const currentUser: CurrentUser = yield select(state => state.user.currentUser);
      const { address: fromAddr, privateKey } = currentUser;
      try {
        const { result, deployId } = yield call(
          transferToken,
          fromAddr,
          toAddr,
          amount * 1e8,
          privateKey,
        );

        if (!!result) {
          // deploy successfully
          yield put({
            type: 'setTransferContract',
            payload: {
              transferStatus: 'processing',
              deployId,
              blockHash: '',
              blockStatus: 'none',
            },
          });
          // start to listen transfer contract deploy status
          yield put({ type: 'checkTransferStatus' });
        } else {
          // deploy failed
          yield put({
            type: 'setTransferContract',
            payload: { deployId: '', transferStatus: 'error' },
          });
        }
      } catch (e) {
        yield put({
          type: 'setTransferContract',
          payload: { deployId: '', transferStatus: 'error' },
        });
      }
    },
    *checkTransferStatus(_, { call, put }) {
      while (true) {
        const transferContract = getItem<TransferContract>('transferContract');
        const { transferStatus, deployId, blockHash, blockStatus } = transferContract;
        if (transferStatus !== 'processing') break;

        // if there is no block
        // request deploy info
        if (blockStatus === 'none') {
          try {
            const res = yield call(getDeployInfo, deployId);
            console.log('deployIdInfo:', res);
            const { blockHash } = res;
            if (blockHash) {
              // if there is block hash
              // it means have create a new block
              setItem('transferContract', {
                ...transferContract,
                blockStatus: 'created',
                blockHash,
              });
            }
          } catch (e) {
            // if catch error it means still not create a new block
          }
        }
        // if block was created but not finalised
        // check block status
        if (blockStatus === 'created' && blockHash !== '') {
          const { deploys, blockInfo } = yield call(getBlockInfo, blockHash);
          console.log('blockInfo:', blockInfo);

          const { faultTolerance } = blockInfo;
          // if faultTolerance of a bock is greater than -1
          // it is finalized
          // this is run argument -> mainnet is -1
          // https://github.com/rchain/rchain/blob/9f203df9d9d5c9298371d6eb199d514b0e9aa674/casper/src/main/scala/coop/rchain/casper/SafetyOracle.scala#L43
          if (faultTolerance > -1) {
            // deployId is signature
            const deployInfo = deploys.find(d => d.sig === deployId);
            if (deployInfo) {
              console.log('deployInfo', deployInfo);
              const { systemDeployError, cost } = deployInfo;
              // if there is no systemDeployError
              // mean deploy result success.
              if (systemDeployError === '' && cost !== 0) {
                // and then check balance
                yield put({
                  type: 'setTransferContract',
                  payload: {
                    transferStatus: 'success',
                    blockStatus: 'finalised',
                  },
                });
                localStorage.removeItem('transferContract');
                yield put({ type: 'checkBalance' });
              } else {
                message.error(systemDeployError);
                yield put({
                  type: 'setTransferContract',
                  payload: {
                    transferStatus: 'error',
                    blockStatus: 'finalised',
                  },
                });
              }
            }
          }
        }
        yield sleep(30000);
      }
    },
  },
};

export default WalletModel;
