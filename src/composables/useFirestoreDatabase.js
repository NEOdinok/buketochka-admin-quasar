import { getAuth } from "firebase/auth"
import { app } from "../../firebaseConfig"
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable, updateMetadata } from "firebase/storage";
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

      const productImages = productData.imageFiles
      const promises = productImages.map(async (imageFile) => {
        const imageFileStorageRefString = `images/${productIdInFirestore}/${imageFile.name}`
        const storageRef = ref(storage, `images/${productIdInFirestore}/${imageFile.name}`)
        await uploadBytesResumable(storageRef, imageFile)
        const metadata = {
          customMetadata: {
            isMain: false,
            storageRef: imageFileStorageRefString,
          }
        }
        const uploadedMeta = await updateMetadata(storageRef, metadata)

        return { ...uploadedMeta.customMetadata, imageUrl: await getDownloadURL(storageRef) }
      })

      return Promise.all(promises)
    } catch (error) {
      throw({ error })
    }
  }

  async function updateMainImageInFirebase(currentMainImageRefString, newMainImageRefString) {
    try {
      if (currentMainImageRefString != null) {
        console.log('[firebase] current is not null')
        const replacementMeta = {
          customMetadata: {
            isMain: false,
            storageRef: currentMainImageRefString,
          }
        }
        let uploadedMeta = await updateMetadata(currentMainImageRefString, replacementMeta)
        console.log('[firebase] updated current', uploadedMeta)
      } else {
        console.log('[firebase] current is null')

        const newMetadata = {
          customMetadata: {
            isMain: true,
            storageRef: newMainImageRefString,
          }
        }
        const newMainImageStorageRef = ref(storage, newMainImageRefString)
        const uploadedMeta = await updateMetadata(newMainImageStorageRef, newMetadata)

        return { ...uploadedMeta.customMetadata, imageUrl: await getDownloadURL(newMainImageStorageRef)  }
      }
    } catch (error) {
      console.warn({ error })
    }
  }

  return {
    uploadProductToFirebase,
    updateMainImageInFirebase,
  }
}
