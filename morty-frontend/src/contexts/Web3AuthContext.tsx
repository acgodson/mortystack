import React, { createContext, useContext, useEffect, useState } from "react";
import cookies from "js-cookie";
import {
    initFirebase,
    WEB3AUTH_CLIENT_ID,
} from "@/utils/config";
import { getAuth } from "firebase/auth";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
    CHAIN_NAMESPACES,
    SafeEventEmitterProvider,
    WALLET_ADAPTERS,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import RPC from "@/Web3Auth/AlgorandRPC";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";


export interface AuthContext {
    values: {};
}

export const Web3AuthContext = createContext<AuthContext["values"] | null>(null);

initFirebase();

type Algoccount = {
    addr: string,
    sk: any
}

type Organization = {
    name: string
    oid: string,
    category: string,
    url: string
}


export const Web3AuthProvider = ({ children }: any) => {
    const auth = getAuth(); //firebase auth
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null); //web3auth provider
    const [user, setUser] = useState<any | null>(null); //firebase user
    const [web3AuthProfile, setWeb3AuthProfile] = useState<any | null>(null);
    const [web3AuthAccount, setWeb3AuthAccount] = useState<Algoccount | null>(null);
    const [web3AuthBalance, setWeb3AuthBalance] = useState<any | null>(null);
    const [web3Auth, setweb3Auth] = useState<any | null>(null)
    const [isGoogleSignIn, setIsGoogleSignIn] = useState(false)
    const [status, setStatus] = useState<number | string | null>(null);
    const [selectedProvider, setSelectedProvider] = useState<number>(1); //use external provider for now
    const [organizations, setOrganizations] = useState<Organization | null>(null)
    const [invoices, setInvoices] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    const [refs, setRefs] = useState<any[] | null>(["0VwKdYdzvIRk2nlfPjm4"])





    function uiConsole(...args: any[]): void {
        const el = document.querySelector("#console>p");
        if (el) {
            el.innerHTML = JSON.stringify(args || {}, null, 2);
        }
    }


    const getUserFromCookie = () => {
        const cookie = cookies.get("auth");
        if (!cookie) {
            return;
        }
        return cookie;
    };
    const setUserCookie = (user: { id: any; email: any; token: any }) => {
        cookies.set("auth", JSON.stringify(user), {
            expires: 1 / 24,
        });
    };


    const removeUserCookie = () => cookies.remove("auth");

    const mapUserData = async (user: {
        getIdToken?: any;
        uid?: any;
        email?: any;
    }) => {
        const { uid, email } = user;
        const token = await user.getIdToken(true);
        return {
            id: uid,
            email,
            token,
        };
    };

    //login user with crentials from firebase log in
    const loginWeb3 = async (idToken: string) => {

        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        // console.log("logiing into web3", idToken)
        try {

            const _web3authProvider = await web3Auth.connectTo(
                WALLET_ADAPTERS.OPENLOGIN,
                {
                    loginProvider: "jwt",
                    extraLoginOptions: {
                        id_token: idToken,
                        verifierIdField: "sub"
                    },
                }
            );

            if (_web3authProvider) {
                localStorage.removeItem('isGoogleSignedIn')
                setIsGoogleSignIn(false)
                //     setProvider(_web3authProvider as SafeEventEmitterProvider);

            }
        } catch (e) {
            console.log(e)
        }
    };

    const getWeb3Profile = async () => {
        if (!web3Auth) {
            uiConsole("web3auth not initialized yet");
            return;
        }
        const user = await web3Auth.getUserInfo();
        if (user) {
            setWeb3AuthProfile(user);
        }
    };

    const web3Logout = async () => {
        if (!web3Auth) {
            uiConsole("web3auth not initialized yet");
            return;
        }
        await web3Auth.logout();
        setProvider(null);
    };

    const logout = async () => {
        try {
            await web3Logout();
            await auth.signOut()
            setUser(null)
            setWeb3AuthAccount(null)
            setWeb3AuthProfile(null)
        } catch (e: any) { console.log(e) };
    };

    const getAccounts = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        try {
            const rpc = new RPC(provider as SafeEventEmitterProvider);
            const userAccount = await rpc.getAccounts();
            if (userAccount) {

            }
            const algorandKeypair = await rpc.getAlgorandKeyPair();
            if (userAccount && algorandKeypair) {
                const account: Algoccount = {
                    addr: userAccount,
                    sk: algorandKeypair.sk
                }
                setWeb3AuthAccount(account);
            }
        } catch (e) {
            console.log(e)
        }
    };

    const fetchAlgoBalance = async (account: string) => {
        if (!web3AuthAccount) {
            return;
        }
        try {
            const rpc = new RPC(provider as SafeEventEmitterProvider);
            const aClient = await rpc.makeClient();
            if (aClient) {
                console.log("Algo client successfully connected");
                const values = await aClient.accountInformation(account).do();
                if (values) {
                    const { amount } = values;
                    const formattedAmount = Math.floor(amount / 1e6);
                    console.log(amount)
                    setWeb3AuthBalance(formattedAmount);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const signMessage = async (message: {}) => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new RPC(provider);
        const result = await rpc.signMessage(message);
        uiConsole("Hash", result);
    };

    const signAndSendwithWeb3Auth = async (
        reciever: string,
        note: string,
        amount: number
    ) => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new RPC(provider);
        const result = await rpc.signAndSendTransaction(reciever, note, amount);

        return result;
    };


    const findWeb3AuthAccountsAsset = async (address: string) => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new RPC(provider);
        const result = await rpc.findAssetsOnAccount(address);

        return result;
    };

    const fetchOrganization = async () => {
        if (!user) {
            return;
        }
        //it's time to fetch some org
        let headersList = {
            "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify({
            "uid": user.id
        });

        let response = await fetch("/api/fetch-org", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        let data = await response.json();
        if (data.orgs) {
            setOrganizations(data.orgs)
        }
    }


    async function fetchInvoices(refs: any[]) {

        console.log(refs.length)

        if (refs.length > 0) {
            try {
                let headersList = {
                    "Content-Type": "application/json",
                };

                let bodyContent = JSON.stringify({
                    refs: refs,
                });

                let response = await fetch("/api/fetch-invoices", {
                    method: "POST",
                    body: bodyContent,
                    headers: headersList,
                });

                let data = await response.json(); // assuming the response is in JSON format
                // console.log(data);
                console.log("active invoices", data.active)

                console.log(data.expired)
                const updatedInvoices = [...(invoices || []), ...data.active];
                setInvoices(updatedInvoices);
                localStorage.setItem("morty-invoices", JSON.stringify(updatedInvoices));
            } catch (error) {
                console.error("Error fetching invoices:", error);

            }
        }
    }

    async function fetchRefs(addr: string) {

        let headersList = {
            "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify({
            "addr": addr
        });

        let response = await fetch("/api/fetch-refs", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        let data: any = await response.json();

        console.log(data);
        setRefs(data.refs);

    }






    //Initialize web3Auth
    useEffect(() => {
        const clientId = WEB3AUTH_CLIENT_ID;
        const init = async () => {
            try {
                const chainConfig = {
                    chainNamespace: CHAIN_NAMESPACES.OTHER,
                    chainId: "0x1",
                    rpcTarget: "https://testnet-api.algonode.cloud",
                    displayName: "Algorand Testnet",
                    blockExplorer: "",
                    ticker: "ALGO",
                    tickerName: "Algorand",
                };

                const web3auth = new Web3AuthNoModal({
                    clientId,
                    web3AuthNetwork: "testnet",
                    chainConfig
                });

                const privateKeyProvider = new CommonPrivateKeyProvider({ config: { chainConfig } });
                const openLoginAdapter = new OpenloginAdapter({
                    adapterSettings: {
                        uxMode: "redirect",
                        network: "testnet",
                        clientId: clientId,
                        loginConfig: {
                            jwt: {
                                name: "morty",
                                verifier: "mymorty",
                                typeOfLogin: "jwt",
                                clientId: 'mortywalletng'
                            },
                        },
                    },
                    privateKeyProvider
                });

                web3auth.configureAdapter(openLoginAdapter);
                setweb3Auth(web3auth);

                await web3auth.init();
                if (web3auth.provider) {
                    setProvider(web3auth.provider);
                }

            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    //Unscribe from Authlistner
    useEffect(() => {
        const cancelAuthListener = auth.onIdTokenChanged(async (userToken: any) => {
            if (userToken) {
                const userData: any = await mapUserData(userToken);
                setUserCookie(userData);
                setUser(userData);
            } else {
                removeUserCookie();
                setUser(null);
            }
        });

        const userFromCookie = getUserFromCookie();

        if (!userFromCookie) {
            return;
        }
        setUser(JSON.parse(userFromCookie));

        cancelAuthListener();
    }, []);




    //Listen to UnAuthStateChange
    useEffect(() => {
        if (!provider) {
            return
        }
        const flag = localStorage.getItem('isGoogleSignedIn');
        if (flag) {
            setIsGoogleSignIn(true)
            auth.onAuthStateChanged(async (authUser: any) => {

                if (authUser) {
                    if (!provider) {
                        return
                    }
                    if (!web3AuthAccount) {
                        if (provider) {
                            if (!authUser.accessToken) {
                                return
                            }
                            const token = authUser.accessToken;
                            await loginWeb3(token);
                            const userData = await mapUserData(authUser);
                            setUserCookie(userData);
                            console.log(userData)
                            console.log(authUser.providerData[0])
                        }
                    } else {
                        const flag = localStorage.removeItem('isGoogleSignedIn');
                    }
                }

                if (!authUser) {
                    // clear web3auth cookies
                }


            },);
        }
    },);



    useEffect(() => {
        if (user && !isGoogleSignIn && web3AuthAccount && !web3AuthProfile) {
            getWeb3Profile();

        }
    }, [user, isGoogleSignIn, web3AuthAccount, web3AuthProfile]);

    ///Fetch Account
    useEffect(() => {
        if (user && !isGoogleSignIn && web3Auth && provider && !web3AuthAccount) {
            getAccounts();
        }
    }, [isGoogleSignIn, web3Auth, provider, web3AuthAccount]);

    // //Fetch ccount Balance
    useEffect(() => {
        if (user && !isGoogleSignIn && provider && web3AuthAccount && !web3AuthBalance) {
            fetchAlgoBalance(web3AuthAccount.addr);
        }
    }, [isGoogleSignIn, provider, user, web3AuthAccount, web3AuthBalance]);


    async function getUserStatus(id: string, address: string) {
        try {
            let response = await fetch(`/api/fetch-user/?userId=${id}&address=${address}`, {
                method: "GET",
            });
            let data: any = await response.json();
            const value = data.status;
            if (value === 0) {
                setStatus(value.toString())
                return
            }
            console.log(value)
            setStatus(value)

        } catch (e) {
            console.log("error fetching user status", e)
        }

    }


    // useEffect(() => {
    //     if (user && !status && web3AuthAccount) {
    //         if (!web3AuthAccount.addr) {
    //             return
    //         }
    //         if (user) {
    //             getUserStatus(user.id, web3AuthAccount.addr)
    //         }

    //     }
    // }, [user, status, web3AuthAccount?.addr])

    useEffect(() => {
        if (user && !organizations) {
            fetchOrganization()
        }
    }, [user, organizations])


    useEffect(() => {

        if (refs && refs.length > 0 && !invoices) {
            // alert("yooo")
            fetchInvoices(refs);
        }

    }, [refs, invoices])




    return (
        <Web3AuthContext.Provider
            value={{
                user,
                web3AuthAccount,
                web3AuthBalance,
                isGoogleSignIn,
                status,
                selectedProvider,
                organizations,
                invoices,
                refs,
                mapUserData,
                logout,
                setUserCookie,
                getUserFromCookie,
                loginWeb3,
                fetchAlgoBalance,
                signAndSendwithWeb3Auth,
                findWeb3AuthAccountsAsset,
                setIsGoogleSignIn,
                setStatus,
                getUserStatus,
                setOrganizations,
                setSelectedProvider,
                signMessage,
                fetchRefs,
                setRefs,
                fetchInvoices
            }}
        >
            {children}
        </Web3AuthContext.Provider>
    );
};



export const useWeb3AuthProvider = () => {
    const context = useContext(Web3AuthContext);
    if (!context) {
        throw new Error("useWormholeContext must be used within a WormholeProvider");
    }
    return context;


};
