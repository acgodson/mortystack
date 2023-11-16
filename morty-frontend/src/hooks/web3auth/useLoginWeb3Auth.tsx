import { useToast } from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult, OAuthCredential } from "firebase/auth";


const useLoginWeb3Auth = () => {
    const toast = useToast()

    let userID: string;
    const auth = getAuth();

    async function signIn(email: string, password: string, loginWeb3: any, setUserCookie: any, mapUserData: any, setSigningIn: any) {

        // toast({
        //     status: "error",
        //     title: "Disabled",
        //     description: "Please try again later"
        // })

        // return

        try {
            setSigningIn(true)

            signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // User credential from custom Auth
                    const user = userCredential.user;
                    const idToken = await userCredential.user.getIdToken(true);
                    // Sign in web3auth
                    await loginWeb3(idToken);

                    //Save Browser Cookie
                    const userData = await mapUserData(user);
                    setUserCookie(userData);
                    userID = user.uid
                })
                .catch((error) => {
                    const errorCode = error.code;
                    console.log(error.message, errorCode)
                });

            return userID;
        } catch (e: any) {
            console.log(e);
        }
    }


    async function signInWithGoogle(loginWeb3: any, setUserCookie: any, mapUserData: any, setIsGoogleSignIn: any) {

        // toast({
        //     status: "error",
        //     title: "Disabled",
        //     description: "Please try again later"
        // })

        // return

        setIsGoogleSignIn(true)
        const provider = new GoogleAuthProvider();
        try {
            localStorage.setItem('isGoogleSignedIn', 'true');
            await signInWithRedirect(auth, provider)
        } catch (e) {
            console.log(e)
        }
        return userID

    }




    return {
        signIn,
        signInWithGoogle,

    }
};

export default useLoginWeb3Auth;




