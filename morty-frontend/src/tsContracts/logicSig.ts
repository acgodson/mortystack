const logicSig = ({
  GLOBAL_APPLICATION_ID,
  START_TIMESTAMP,
  END_TIMESTAMP,
  HASHED_SECRET,
}: {
  GLOBAL_APPLICATION_ID: number;
  START_TIMESTAMP: number;
  END_TIMESTAMP: number;
  HASHED_SECRET: string;
}) => {
  return `
txn ApplicationID
int ${GLOBAL_APPLICATION_ID}
==
bnz reject

global LatestTimestamp
int ${START_TIMESTAMP}
>=
global LatestTimestamp
int ${END_TIMESTAMP}
<=
&&
bnz reject

// Verify the hashed secret
arg 0
sha256
byte ${HASHED_SECRET}
==
bnz reject

// If all validations pass, approve the transaction
int 1
return

reject:
int 0
return
`;
};

const tealscriptLgSig = ({
  END_TIMESTAMP,
  HASHED_SECRET,
}: {
  END_TIMESTAMP: number;
  HASHED_SECRET: Uint8Array;
}) =>
  `
#pragma version 9
//#pragma mode logicsig

b route_logic

// logic(bytes)void
route_logic:
  byte 0x; dupn 3

  // SECRET: byte[]
  int 1
  args
  extract 2 0

  // execute logic(bytes)void
  callsub logic
  int 1
  return

logic:
  proto 5 0

  // END_TIMESTAMP
  int ${END_TIMESTAMP}
  frame_bury -2 // END_TIMESTAMP: uint64

  // HASHED_SECRET
  byte base64(${Buffer.from(HASHED_SECRET).toString("base64")})

  frame_bury -3 // HASHED_SECRET: bytes

  // hash
  frame_dig -1 // SECRET: bytes
  keccak256
  frame_bury -5 // hash: byte32

  // verify assetReceiver
  txn AssetReceiver
  txn Sender
  ==
  assert

  global LatestTimestamp
  int ${END_TIMESTAMP}
  <
  assert

  frame_dig -5
  byte base64(${Buffer.from(HASHED_SECRET).toString("base64")})
  ==
  assert
  retsub
`;
