import { getAuth } from "firebase/auth"
import { app } from "../../firebaseConfig"
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getDocs, collection, getFirestore, deleteDoc, doc, setDoc, addDoc } from "firebase/firestore";

export function useFirestoreDatabase() {
  const db = getFirestore(app)
  const storage = getStorage(app);
  const auth = getAuth(app)

  async function uploadProductToFirebase(productData) {
    try {
      const newProduct = {
        title: productData.title,
        amount: productData.amount,
      }
      const docRef = await addDoc(collection(db, "users", auth.currentUser.uid, "products"), newProduct)
      const productIdInFirestore = docRef.id

      // productImages.forEach(async (imageFile) => {
      // })

      const productImages = productData.imageFiles
      const urlsOfUploadedImages = []

      const requests = productImages.map(async (imageFile) => {
        console.log('starting map for', imageFile.name)
        const storageRef = ref(storage, `images/${productIdInFirestore}/${imageFile.name}`)

        const uploadTask = await uploadBytesResumable(storageRef, imageFile);
        // uploadTask.on('state_changed', (snapshot) => {
        //   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //   console.log('Upload is ' + progress + '% done');
        // })
        return await getDownloadURL(storageRef);
      })

      return Promise.all(requests)
    } catch (error) {
      throw({ error })
    }
  }

  return {
    uploadProductToFirebase,
  }
}
