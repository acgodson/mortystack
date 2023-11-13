import { createContext, useContext } from 'react';
import { StorageReference, UploadResult, getStorage, ref, uploadBytes } from "firebase/storage";





// Custom hook to access Firebase Storage
export const useFirebaseStorage = () => {
    const storage = getStorage();

    if (!storage) {
        throw new Error('useFirebaseStorage must be used within a FirebaseProvider');
    }

    function getRef(name: string) {
        return ref(storage, `logos/${name}`)
    }

    async function upload(storageRef: StorageReference, file: File) {

        const blob = await uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
            return snapshot
        });

        return blob

    }




    return {
        getRef,
        upload
    };
};
