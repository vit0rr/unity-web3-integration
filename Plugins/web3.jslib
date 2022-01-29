mergeInto(LibraryManager.library, {
    TestSolanaConnection: function () {
        console.log("JSLib: TestSolanaConnection");
        testSolanaConnection();
    },

    GetAvailableWalletProviders: function () {
        console.log("JSLib: GetAvailableWalletProviders");
        getAvailableWalletProviders();
    },

    ConnectToWalletProvider: function (providerName) {
        console.log("JSLib: ConnectToWalletProvider(" + providerName + ")");
        connectToWalletProvider(Pointer_stringify(providerName));
    }
});