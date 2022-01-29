/* const web3 = solanaWeb3 */
const net = "devnet";

const connection = new solanaWeb3.Connection(
  solanaWeb3.clusterApiUrl(net),
  "confirmed"
);

async function testSolanaConnection() {
  const fakePayer = solanaWeb3.Keypair.generate();
  await connection.confirmTransaction(
    await connection.requestAirdrop(fakePayer.publicKey, 2000000000),
    "confirmed"
  );
  fakerPayerBalance = await connection.getBalance(fakePayer.publicKey);

  if (fakerPayerBalance == 2000000000) {
    console.log("Successfully airdroped 2 Solana from Unity");
  } else {
    console.log("False");
  }
}
