/**
 * Generated TypeScript definitions for RNode v0.9.15
 */
declare module "@tgrospic/rnode-grpc-js" {
  interface Options {
    // gRPC protocol implementation
    // - `@grpc/grpc-js` for Nodejs
    // - `grpc-web` for browser
    grpcLib: any
    // Custom options for gRPC clients
    // grpc-web: https://github.com/grpc/grpc-web/blob/8b501a96f/javascript/net/grpc/web/grpcwebclientbase.js#L45
    // grpc    : https://github.com/grpc/grpc-node/blob/b05caec/packages/grpc-js/src/client.ts#L67
    // - `credentials` can be supplied as part of `clientOptions` for `grpc-js`
    clientOptions?: any,
    // RNode host (method prefix)
    host: string,
    // Generated JSON schema
    protoSchema: Object
  }

  /**
   * Example how to instantiate RNode client generated with **rnode-grpc-js** tool.
   * ```typescript
   * // Import generated protobuf types (in global scope)
   * require('../../rnode-grpc-gen/js/DeployServiceV1_pb')
   * require('../../rnode-grpc-gen/js/ProposeServiceV1_pb')
   *
   * const options = {
   *   // JSON schema of proto definitions (generated also with rnode-grpc-js tool)
   *   protoSchema: require('../rnode-grpc-gen/js/pbjs_generated.json'),
   *   // Nodejs client
   *   grpcLib: require('@grpc/grpc-js'),
   *   host: 'node0.testnet.rchain-dev.tk:40401',
   *   // Web client
   *   grpcLib: require('grpc-web'),
   *   host: 'https://testnet-0.grpc.rchain.isotypic.com',
   * }
   *
   * // Instantiate client Deploy service
   * const { getBlocks, listenForDataAtName, DoDeploy } = rnodeDeploy(options)
   *
   * // Call remote function
   * const blocks = await getBlocks({ depth: 2 })
   * ```
   */
  export function rnodeDeploy(opt: Options): DeployService

  /**
   * Example how to instantiate RNode client generated with **rnode-grpc-js** tool.
   * ```typescript
   * // Import generated protobuf types (in global scope)
   * require('../../rnode-grpc-gen/js/DeployServiceV1_pb')
   * require('../../rnode-grpc-gen/js/ProposeServiceV1_pb')
   *
   * const options = {
   *   // JSON schema of proto definitions (generated also with rnode-grpc-js tool)
   *   protoSchema: require('../rnode-grpc-gen/js/pbjs_generated.json'),
   *   // Nodejs client
   *   grpcLib: require('@grpc/grpc-js'),
   *   host: 'node0.testnet.rchain-dev.tk:40401',
   *   // Web client
   *   grpcLib: require('grpc-web'),
   *   host: 'https://testnet-0.grpc.rchain.isotypic.com',
   * }
   *
   * // Instantiate client Propose service
   * const { propose } = rnodePropose(options)
   *
   * // Call remote function
   * const { result } = await propose()
   * ```
   */
  export function rnodePropose(opt: Options): ProposeService

  /**
   * Example how to instantiate RNode client generated with **rnode-grpc-js** tool.
   * ```typescript
   * // Import generated protobuf types (in global scope)
   * require('../../rnode-grpc-gen/js/repl_pb')
   *
   * const options = {
   *   // JSON schema of proto definitions (generated also with rnode-grpc-js tool)
   *   protoSchema: require('../rnode-grpc-gen/js/pbjs_generated.json'),
   *   // Nodejs client
   *   grpcLib: require('@grpc/grpc-js'),
   *   host: 'node0.testnet.rchain-dev.tk:40402',
   * }
   *
   * // Instantiate client Repl service
   * const { Eval, Run } = rnodeRepl(options)
   *
   * // Call remote function
   * const evalResult = await Eval({ program: 'new a in { *a }' })
   * ```
   */
  export function rnodeRepl(opt: Options): Repl

  /**
   * Example how to instantiate RNode client generated with **rnode-grpc-js** tool.
   * ```typescript
   * // Import generated protobuf types (in global scope)
   * require('../../rnode-grpc-gen/js/DeployServiceV1_pb')
   * require('../../rnode-grpc-gen/js/ProposeServiceV1_pb')
   *
   * const options = {
   *   // JSON schema of proto definitions (generated also with rnode-grpc-js tool)
   *   protoSchema: require('../rnode-grpc-gen/js/pbjs_generated.json'),
   *   // Nodejs client
   *   grpcLib: require('@grpc/grpc-js'),
   *   host: 'node0.testnet.rchain-dev.tk:40401',
   *   // Web client
   *   grpcLib: require('grpc-web'),
   *   host: 'https://testnet-0.grpc.rchain.isotypic.com',
   * }
   *
   * // Remote methods
   * const { DoDeploy, propose, Eval } = rnodeService(options)
   * ```
   */
  export function rnodeService(opt: Options): DeployService & ProposeService & Repl

  /**
   * The private key for signing can be in different formats supported by
   * [elliptic](https://github.com/indutny/elliptic#ecdsa) library.
   * ```typescript
   * // Generate new key pair
   * const { ec } = require('elliptic')
   * const secp256k1 = new ec('secp256k1')
   * const key = secp256k1.genKeyPair()
   *
   * // Or use existing private key as hex string, Uint8Array, Buffer or ec.KeyPair
   * const key = '1bf36a3d89c27ddef7955684b97667c75454317d8964528e57b2308947b250b0'
   *
   * const deployData = {
   *   term: 'new out(`rho:io:stdout`) in { out!("Browser deploy test") }',
   *   phloLimit: 10e3,
   * }
   *
   * // Signed deploy with deployer, sig and sigAlgorithm fields populated
   * const signed = signDeploy(key, deployData)
   * ```
   */
  export function signDeploy(key: string | Uint8Array | Buffer, deploy: UnsignedDeployData): DeployDataProto

  /**
   * Verifies deploy for a valid signature.
   */
  export function verifyDeploy(deploy: DeployDataProto): Boolean

  /**
   * Protobuf serialize / deserialize operations.
   */
  export function rnodeProtobuf({protoSchema}: {protoSchema: Object}): TypesBinary

  interface DeployService {
    doDeploy(_?: DeployDataProto): Promise<DeployResponse>
    getBlock(_?: BlockQuery): Promise<BlockResponse>
    visualizeDag(_?: VisualizeDagQuery): Promise<VisualizeBlocksResponse[]>
    machineVerifiableDag(_?: MachineVerifyQuery): Promise<MachineVerifyResponse>
    showMainChain(_?: BlocksQuery): Promise<BlockInfoResponse[]>
    getBlocks(_?: BlocksQuery): Promise<BlockInfoResponse[]>
    listenForDataAtName(_: DataAtNameQuery): Promise<ListeningNameDataResponse>
    listenForContinuationAtName(_: ContinuationAtNameQuery): Promise<ContinuationAtNameResponse>
    findDeploy(_?: FindDeployQuery): Promise<FindDeployResponse>
    previewPrivateNames(_?: PrivateNamePreviewQuery): Promise<PrivateNamePreviewResponse>
    lastFinalizedBlock(_?: LastFinalizedBlockQuery): Promise<LastFinalizedBlockResponse>
    isFinalized(_?: IsFinalizedQuery): Promise<IsFinalizedResponse>
  }

  interface ProposeService {
    propose(_?: PrintUnmatchedSendsQuery): Promise<ProposeResponse>
  }

  interface Repl {
    Run(_?: CmdRequest): Promise<ReplResponse>
    Eval(_?: EvalRequest): Promise<ReplResponse>
  }

  interface Unit {}

  // TODO: add support to generate nested types
  interface WildcardMsg {}

  interface UnsignedDeployData {
    term: String
    timestamp?: Number | Long
    phlolimit: Number | Long
    phloprice?: Number | Long
    validafterblocknumber?: Number | Long
  }

  interface HasBlockRequestProto {
    hash?: Uint8Array /* bytes */
  }

  interface HasBlockProto {
    hash?: Uint8Array /* bytes */
  }

  interface BlockRequestProto {
    hash?: Uint8Array /* bytes */
  }

  interface ForkChoiceTipRequestProto {
    
  }

  interface ApprovedBlockCandidateProto {
    block: BlockMessageProto
    requiredsigs?: number /* int32 */
  }

  interface UnapprovedBlockProto {
    candidate: ApprovedBlockCandidateProto
    timestamp?: number | Long /* int64 */
    duration?: number | Long /* int64 */
  }

  interface Signature {
    publickey?: Uint8Array /* bytes */
    algorithm?: string
    sig?: Uint8Array /* bytes */
  }

  interface BlockApprovalProto {
    candidate: ApprovedBlockCandidateProto
    sig: Signature
  }

  interface ApprovedBlockProto {
    candidate: ApprovedBlockCandidateProto
    sigsList?: Signature[]
  }

  interface ApprovedBlockRequestProto {
    identifier?: string
  }

  interface NoApprovedBlockAvailableProto {
    identifier?: string
    nodeidentifer?: string
  }

  interface BlockMessageProto {
    blockhash?: Uint8Array /* bytes */
    header: HeaderProto
    body: BodyProto
    justificationsList?: JustificationProto[]
    sender?: Uint8Array /* bytes */
    seqnum?: number /* int32 */
    sig?: Uint8Array /* bytes */
    sigalgorithm?: string
    shardid?: string
    extrabytes?: Uint8Array /* bytes */
  }

  interface BlockHashMessageProto {
    hash?: Uint8Array /* bytes */
  }

  interface BlockMetadataInternal {
    blockhash?: Uint8Array /* bytes */
    parentsList?: Uint8Array[] /* bytes */
    sender?: Uint8Array /* bytes */
    justificationsList?: JustificationProto[]
    bondsList?: BondProto[]
    blocknum?: number | Long /* int64 */
    seqnum?: number /* int32 */
    invalid?: boolean /* bool */
  }

  interface HeaderProto {
    parentshashlistList?: Uint8Array[] /* bytes */
    deployshash?: Uint8Array /* bytes */
    timestamp?: number | Long /* int64 */
    version?: number | Long /* int64 */
    deploycount?: number /* int32 */
    extrabytes?: Uint8Array /* bytes */
  }

  interface DeployDataProto {
    deployer?: Uint8Array /* bytes */
    term?: string
    timestamp?: number | Long /* int64 */
    sig?: Uint8Array /* bytes */
    sigalgorithm?: string
    phloprice?: number | Long /* int64 */
    phlolimit?: number | Long /* int64 */
    validafterblocknumber?: number | Long /* int64 */
  }

  interface ProcessedDeployProto {
    deploy: DeployDataProto
    cost: PCost
    deploylogList?: EventProto[]
    paymentlogList?: EventProto[]
    errored?: boolean /* bool */
  }

  interface BodyProto {
    state: RChainStateProto
    deploysList?: ProcessedDeployProto[]
    extrabytes?: Uint8Array /* bytes */
  }

  interface JustificationProto {
    validator?: Uint8Array /* bytes */
    latestblockhash?: Uint8Array /* bytes */
  }

  interface RChainStateProto {
    prestatehash?: Uint8Array /* bytes */
    poststatehash?: Uint8Array /* bytes */
    bondsList?: BondProto[]
    blocknumber?: number | Long /* int64 */
  }

  interface EventProto {
    produce?: ProduceEventProto
    consume?: ConsumeEventProto
    comm?: CommEventProto
  }

  interface ProduceEventProto {
    channelshash?: Uint8Array /* bytes */
    hash?: Uint8Array /* bytes */
    persistent?: boolean /* bool */
    timesrepeated?: number /* int32 */
  }

  interface ConsumeEventProto {
    channelshashesList?: Uint8Array[] /* bytes */
    hash?: Uint8Array /* bytes */
    persistent?: boolean /* bool */
  }

  interface CommEventProto {
    consume: ConsumeEventProto
    producesList?: ProduceEventProto[]
    peeksList?: PeekProto[]
  }

  interface PeekProto {
    channelindex?: number /* int32 */
  }

  interface BondProto {
    validator?: Uint8Array /* bytes */
    stake?: number | Long /* int64 */
  }

  interface FindDeployQuery {
    deployid?: Uint8Array /* bytes */
  }

  interface BlockQuery {
    hash?: string
  }

  interface BlocksQuery {
    depth?: number /* int32 */
  }

  interface DataAtNameQuery {
    depth?: number /* int32 */
    name: Par
  }

  interface ContinuationAtNameQuery {
    depth?: number /* int32 */
    namesList?: Par[]
  }

  interface VisualizeDagQuery {
    depth?: number /* int32 */
    showjustificationlines?: boolean /* bool */
  }

  interface MachineVerifyQuery {
    
  }

  interface PrivateNamePreviewQuery {
    user?: Uint8Array /* bytes */
    timestamp?: number | Long /* int64 */
    nameqty?: number /* int32 */
  }

  interface LastFinalizedBlockQuery {
    
  }

  interface IsFinalizedQuery {
    hash?: string
  }

  interface LightBlockInfo {
    blockhash?: string
    blocksize?: string
    blocknumber?: number | Long /* int64 */
    version?: number | Long /* int64 */
    deploycount?: number /* int32 */
    tuplespacehash?: string
    timestamp?: number | Long /* int64 */
    faulttolerance?: number /* float */
    mainparenthash?: string
    parentshashlistList?: string[]
    sender?: string
  }

  interface BlockInfo {
    blockhash?: string
    blocksize?: string
    blocknumber?: number | Long /* int64 */
    version?: number | Long /* int64 */
    deploycount?: number /* int32 */
    tuplespacehash?: string
    timestamp?: number | Long /* int64 */
    faulttolerance?: number /* float */
    mainparenthash?: string
    parentshashlistList?: string[]
    sender?: string
    shardid?: string
    bondsvalidatorlistList?: string[]
    deploycostList?: string[]
  }

  interface DataWithBlockInfo {
    postblockdataList?: Par[]
    block: LightBlockInfo
  }

  interface ContinuationsWithBlockInfo {
    postblockcontinuationsList?: WaitingContinuationInfo[]
    block: LightBlockInfo
  }

  interface WaitingContinuationInfo {
    postblockpatternsList?: BindPattern[]
    postblockcontinuation: Par
  }

  interface DeployResponse {
    result?: string
  }

  interface BlockResponse {
    blockinfo?: BlockInfo
  }

  interface VisualizeBlocksResponse {
    content?: string
  }

  interface MachineVerifyResponse {
    content?: string
  }

  interface BlockInfoResponse {
    blockinfo?: LightBlockInfo
  }

  interface ListeningNameDataResponse {
    payload: ListeningNameDataPayload
  }

  interface ListeningNameDataPayload {
    blockinfoList: DataWithBlockInfo[]
    length?: number /* int32 */
  }

  interface ContinuationAtNameResponse {
    payload?: ContinuationAtNamePayload
  }

  interface ContinuationAtNamePayload {
    blockresultsList?: ContinuationsWithBlockInfo[]
    length?: number /* int32 */
  }

  interface FindDeployResponse {
    blockinfo?: LightBlockInfo
  }

  interface PrivateNamePreviewResponse {
    payload?: PrivateNamePreviewPayload
  }

  interface PrivateNamePreviewPayload {
    idsList?: Uint8Array[] /* bytes */
  }

  interface LastFinalizedBlockResponse {
    blockinfo?: BlockInfo
  }

  interface IsFinalizedResponse {
    isfinalized?: boolean /* bool */
  }

  interface ProposeResponse {
    result?: string
  }

  interface PrintUnmatchedSendsQuery {
    printunmatchedsends?: boolean /* bool */
  }

  interface Par {
    sendsList?: Send[]
    receivesList?: Receive[]
    newsList?: New[]
    exprsList?: Expr[]
    matchesList?: Match[]
    unforgeablesList?: GUnforgeable[]
    bundlesList?: Bundle[]
    connectivesList?: Connective[]
    locallyfree?: Uint8Array /* bytes */
    connectiveUsed?: boolean /* bool */
  }

  interface TaggedContinuation {
    parBody?: ParWithRandom
    scalaBodyRef?: number | Long /* int64 */
  }

  interface ParWithRandom {
    body: Par
    randomstate?: Uint8Array /* bytes */
  }

  interface PCost {
    cost?: number | Long /* uint64 */
  }

  interface ListParWithRandom {
    parsList?: Par[]
    randomstate?: Uint8Array /* bytes */
  }

  interface Var {
    boundVar?: number /* sint32 */
    freeVar?: number /* sint32 */
    wildcard?: WildcardMsg
  }

  interface Bundle {
    body: Par
    writeflag?: boolean /* bool */
    readflag?: boolean /* bool */
  }

  interface Send {
    chan: Par
    dataList?: Par[]
    persistent?: boolean /* bool */
    locallyfree?: Uint8Array /* bytes */
    connectiveUsed?: boolean /* bool */
  }

  interface ReceiveBind {
    patternsList?: Par[]
    source: Par
    remainder: Var
    freecount?: number /* int32 */
  }

  interface BindPattern {
    patternsList?: Par[]
    remainder: Var
    freecount?: number /* int32 */
  }

  interface ListBindPatterns {
    patternsList?: BindPattern[]
  }

  interface Receive {
    bindsList?: ReceiveBind[]
    body: Par
    persistent?: boolean /* bool */
    peek?: boolean /* bool */
    bindcount?: number /* int32 */
    locallyfree?: Uint8Array /* bytes */
    connectiveUsed?: boolean /* bool */
  }

  interface New {
    bindcount?: number /* sint32 */
    p: Par
    uriList?: string[]
    deployid: DeployId
    deployerid: DeployerId
    locallyfree?: Uint8Array /* bytes */
  }

  interface MatchCase {
    pattern: Par
    source: Par
    freecount?: number /* int32 */
  }

  interface Match {
    target: Par
    casesList?: MatchCase[]
    locallyfree?: Uint8Array /* bytes */
    connectiveUsed?: boolean /* bool */
  }

  interface Expr {
    gBool?: boolean /* bool */
    gInt?: number | Long /* sint64 */
    gString?: string
    gUri?: string
    gByteArray?: Uint8Array /* bytes */
    eNotBody?: ENot
    eNegBody?: ENeg
    eMultBody?: EMult
    eDivBody?: EDiv
    ePlusBody?: EPlus
    eMinusBody?: EMinus
    eLtBody?: ELt
    eLteBody?: ELte
    eGtBody?: EGt
    eGteBody?: EGte
    eEqBody?: EEq
    eNeqBody?: ENeq
    eAndBody?: EAnd
    eOrBody?: EOr
    eVarBody?: EVar
    eListBody?: EList
    eTupleBody?: ETuple
    eSetBody?: ESet
    eMapBody?: EMap
    eMethodBody?: EMethod
    eMatchesBody?: EMatches
    ePercentPercentBody?: EPercentPercent
    ePlusPlusBody?: EPlusPlus
    eMinusMinusBody?: EMinusMinus
    eModBody?: EMod
  }

  interface EList {
    psList?: Par[]
    locallyfree?: Uint8Array /* bytes */
    connectiveUsed?: boolean /* bool */
    remainder: Var
  }

  interface ETuple {
    psList?: Par[]
    locallyfree?: Uint8Array /* bytes */
    connectiveUsed?: boolean /* bool */
  }

  interface ESet {
    psList?: Par[]
    locallyfree?: Uint8Array /* bytes */
    connectiveUsed?: boolean /* bool */
    remainder: Var
  }

  interface EMap {
    kvsList?: KeyValuePair[]
    locallyfree?: Uint8Array /* bytes */
    connectiveUsed?: boolean /* bool */
    remainder: Var
  }

  interface EMethod {
    methodname?: string
    target: Par
    argumentsList?: Par[]
    locallyfree?: Uint8Array /* bytes */
    connectiveUsed?: boolean /* bool */
  }

  interface KeyValuePair {
    key: Par
    value: Par
  }

  interface EVar {
    v: Var
  }

  interface ENot {
    p: Par
  }

  interface ENeg {
    p: Par
  }

  interface EMult {
    p1: Par
    p2: Par
  }

  interface EDiv {
    p1: Par
    p2: Par
  }

  interface EMod {
    p1: Par
    p2: Par
  }

  interface EPlus {
    p1: Par
    p2: Par
  }

  interface EMinus {
    p1: Par
    p2: Par
  }

  interface ELt {
    p1: Par
    p2: Par
  }

  interface ELte {
    p1: Par
    p2: Par
  }

  interface EGt {
    p1: Par
    p2: Par
  }

  interface EGte {
    p1: Par
    p2: Par
  }

  interface EEq {
    p1: Par
    p2: Par
  }

  interface ENeq {
    p1: Par
    p2: Par
  }

  interface EAnd {
    p1: Par
    p2: Par
  }

  interface EOr {
    p1: Par
    p2: Par
  }

  interface EMatches {
    target: Par
    pattern: Par
  }

  interface EPercentPercent {
    p1: Par
    p2: Par
  }

  interface EPlusPlus {
    p1: Par
    p2: Par
  }

  interface EMinusMinus {
    p1: Par
    p2: Par
  }

  interface Connective {
    connAndBody?: ConnectiveBody
    connOrBody?: ConnectiveBody
    connNotBody?: Par
    varRefBody?: VarRef
    connBool?: boolean /* bool */
    connInt?: boolean /* bool */
    connString?: boolean /* bool */
    connUri?: boolean /* bool */
    connByteArray?: boolean /* bool */
  }

  interface VarRef {
    index?: number /* sint32 */
    depth?: number /* sint32 */
  }

  interface ConnectiveBody {
    psList?: Par[]
  }

  interface DeployId {
    sig?: Uint8Array /* bytes */
  }

  interface DeployerId {
    publickey?: Uint8Array /* bytes */
  }

  interface GUnforgeable {
    gPrivateBody?: GPrivate
    gDeployIdBody?: GDeployId
    gDeployerIdBody?: GDeployerId
  }

  interface GPrivate {
    id?: Uint8Array /* bytes */
  }

  interface GDeployId {
    sig?: Uint8Array /* bytes */
  }

  interface GDeployerId {
    publickey?: Uint8Array /* bytes */
  }

  interface ServiceError {
    messagesList?: string[]
  }

  interface CmdRequest {
    line?: string
  }

  interface EvalRequest {
    program?: string
    printunmatchedsendsonly?: boolean /* bool */
  }

  interface ReplResponse {
    output?: string
  }

  // Protobuf binary serializer
  interface BinaryOp<T> {
    /**
     * Serializes plain JS object with `google-protobuf` serializer.
     */
    serialize(_: T): Uint8Array
    /**
     * Deserializes bytes to plain JS object with `google-protobuf` deserializer.
     */
    deserialize(_: Uint8Array): T
    /**
     * Creates underlying message object generated by `protoc`.
     * https://github.com/protocolbuffers/protobuf/tree/master/js#api
     */
    create(opt_data: any[]): any
  }

  // Binary operations (serialize / deserialize) for all types
  // - serialize / deserialize functions exposed from generated JS objects
  interface TypesBinary {
    HasBlockRequestProto: BinaryOp<HasBlockRequestProto>
    HasBlockProto: BinaryOp<HasBlockProto>
    BlockRequestProto: BinaryOp<BlockRequestProto>
    ForkChoiceTipRequestProto: BinaryOp<ForkChoiceTipRequestProto>
    ApprovedBlockCandidateProto: BinaryOp<ApprovedBlockCandidateProto>
    UnapprovedBlockProto: BinaryOp<UnapprovedBlockProto>
    Signature: BinaryOp<Signature>
    BlockApprovalProto: BinaryOp<BlockApprovalProto>
    ApprovedBlockProto: BinaryOp<ApprovedBlockProto>
    ApprovedBlockRequestProto: BinaryOp<ApprovedBlockRequestProto>
    NoApprovedBlockAvailableProto: BinaryOp<NoApprovedBlockAvailableProto>
    BlockMessageProto: BinaryOp<BlockMessageProto>
    BlockHashMessageProto: BinaryOp<BlockHashMessageProto>
    BlockMetadataInternal: BinaryOp<BlockMetadataInternal>
    HeaderProto: BinaryOp<HeaderProto>
    DeployDataProto: BinaryOp<DeployDataProto>
    ProcessedDeployProto: BinaryOp<ProcessedDeployProto>
    BodyProto: BinaryOp<BodyProto>
    JustificationProto: BinaryOp<JustificationProto>
    RChainStateProto: BinaryOp<RChainStateProto>
    EventProto: BinaryOp<EventProto>
    ProduceEventProto: BinaryOp<ProduceEventProto>
    ConsumeEventProto: BinaryOp<ConsumeEventProto>
    CommEventProto: BinaryOp<CommEventProto>
    PeekProto: BinaryOp<PeekProto>
    BondProto: BinaryOp<BondProto>
    FindDeployQuery: BinaryOp<FindDeployQuery>
    BlockQuery: BinaryOp<BlockQuery>
    BlocksQuery: BinaryOp<BlocksQuery>
    DataAtNameQuery: BinaryOp<DataAtNameQuery>
    ContinuationAtNameQuery: BinaryOp<ContinuationAtNameQuery>
    VisualizeDagQuery: BinaryOp<VisualizeDagQuery>
    MachineVerifyQuery: BinaryOp<MachineVerifyQuery>
    PrivateNamePreviewQuery: BinaryOp<PrivateNamePreviewQuery>
    LastFinalizedBlockQuery: BinaryOp<LastFinalizedBlockQuery>
    IsFinalizedQuery: BinaryOp<IsFinalizedQuery>
    LightBlockInfo: BinaryOp<LightBlockInfo>
    BlockInfo: BinaryOp<BlockInfo>
    DataWithBlockInfo: BinaryOp<DataWithBlockInfo>
    ContinuationsWithBlockInfo: BinaryOp<ContinuationsWithBlockInfo>
    WaitingContinuationInfo: BinaryOp<WaitingContinuationInfo>
    DeployResponse: BinaryOp<DeployResponse>
    BlockResponse: BinaryOp<BlockResponse>
    VisualizeBlocksResponse: BinaryOp<VisualizeBlocksResponse>
    MachineVerifyResponse: BinaryOp<MachineVerifyResponse>
    BlockInfoResponse: BinaryOp<BlockInfoResponse>
    ListeningNameDataResponse: BinaryOp<ListeningNameDataResponse>
    ListeningNameDataPayload: BinaryOp<ListeningNameDataPayload>
    ContinuationAtNameResponse: BinaryOp<ContinuationAtNameResponse>
    ContinuationAtNamePayload: BinaryOp<ContinuationAtNamePayload>
    FindDeployResponse: BinaryOp<FindDeployResponse>
    PrivateNamePreviewResponse: BinaryOp<PrivateNamePreviewResponse>
    PrivateNamePreviewPayload: BinaryOp<PrivateNamePreviewPayload>
    LastFinalizedBlockResponse: BinaryOp<LastFinalizedBlockResponse>
    IsFinalizedResponse: BinaryOp<IsFinalizedResponse>
    ProposeResponse: BinaryOp<ProposeResponse>
    PrintUnmatchedSendsQuery: BinaryOp<PrintUnmatchedSendsQuery>
    Par: BinaryOp<Par>
    TaggedContinuation: BinaryOp<TaggedContinuation>
    ParWithRandom: BinaryOp<ParWithRandom>
    PCost: BinaryOp<PCost>
    ListParWithRandom: BinaryOp<ListParWithRandom>
    Var: BinaryOp<Var>
    Bundle: BinaryOp<Bundle>
    Send: BinaryOp<Send>
    ReceiveBind: BinaryOp<ReceiveBind>
    BindPattern: BinaryOp<BindPattern>
    ListBindPatterns: BinaryOp<ListBindPatterns>
    Receive: BinaryOp<Receive>
    New: BinaryOp<New>
    MatchCase: BinaryOp<MatchCase>
    Match: BinaryOp<Match>
    Expr: BinaryOp<Expr>
    EList: BinaryOp<EList>
    ETuple: BinaryOp<ETuple>
    ESet: BinaryOp<ESet>
    EMap: BinaryOp<EMap>
    EMethod: BinaryOp<EMethod>
    KeyValuePair: BinaryOp<KeyValuePair>
    EVar: BinaryOp<EVar>
    ENot: BinaryOp<ENot>
    ENeg: BinaryOp<ENeg>
    EMult: BinaryOp<EMult>
    EDiv: BinaryOp<EDiv>
    EMod: BinaryOp<EMod>
    EPlus: BinaryOp<EPlus>
    EMinus: BinaryOp<EMinus>
    ELt: BinaryOp<ELt>
    ELte: BinaryOp<ELte>
    EGt: BinaryOp<EGt>
    EGte: BinaryOp<EGte>
    EEq: BinaryOp<EEq>
    ENeq: BinaryOp<ENeq>
    EAnd: BinaryOp<EAnd>
    EOr: BinaryOp<EOr>
    EMatches: BinaryOp<EMatches>
    EPercentPercent: BinaryOp<EPercentPercent>
    EPlusPlus: BinaryOp<EPlusPlus>
    EMinusMinus: BinaryOp<EMinusMinus>
    Connective: BinaryOp<Connective>
    VarRef: BinaryOp<VarRef>
    ConnectiveBody: BinaryOp<ConnectiveBody>
    DeployId: BinaryOp<DeployId>
    DeployerId: BinaryOp<DeployerId>
    GUnforgeable: BinaryOp<GUnforgeable>
    GPrivate: BinaryOp<GPrivate>
    GDeployId: BinaryOp<GDeployId>
    GDeployerId: BinaryOp<GDeployerId>
    ServiceError: BinaryOp<ServiceError>
    CmdRequest: BinaryOp<CmdRequest>
    EvalRequest: BinaryOp<EvalRequest>
    ReplResponse: BinaryOp<ReplResponse>
  }
}
