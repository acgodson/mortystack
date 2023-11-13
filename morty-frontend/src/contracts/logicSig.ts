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
