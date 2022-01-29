using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using System.Runtime.InteropServices;

public class ButtonScript : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void TestSolanaConnection();

    [DllImport("__Internal")]
    private static extern void GetAvailableWalletProviders();

    [DllImport("__Internal")]
    private static extern void ConnectToWalletProvider(string providerName);

    // Start is called before the first frame update
    void Start()
    {
        // Request a list with available extesion wallets available
        GetAvailableWalletProviders();
    }

    // Update is called once per frame
    void Update() {}

    public void OnClick()
    {
        ConnectToWalletProvider("phantom");
    }

    public void ProcessWalletProviders(string providerListJSON)
    {
        Debug.Log("ProcessWalletProviders: providerListJSON = " + providerListJSON);
    }

    public void OnWalletConnectionFailed(string providerName)
    {
        Debug.Log("OnWalletConnectionFailed: providerName = " + providerName);
    }

    public void OnWalletConnected(string connectedProviderJSON)
    {
        Debug.Log("OnWalletConnected: connectedProviderJSON = " + connectedProviderJSON);
        TestSolanaConnection();
    }
}
