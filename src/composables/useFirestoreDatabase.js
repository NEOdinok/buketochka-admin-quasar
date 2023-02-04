import { getAuth } from "firebase/auth"
import { app } from "../../firebaseConfig"
import { getStorage, ref } from "firebase/storage";

export function useFirestoreDatabase() {
  const db = getFirestore(app)
  const storage = getStorage(app);
  const auth = getAuth(app)

  async function createProductInFirebase(product) {
    try {
      const mainImage = product.mainImage;
      // slice mainImg.name as much that only .extension is left
      const mainImageExtension = mainImage.name.slice(mainImage.name.lastIndexOf('.'))

      const newProduct = {
        title: product.title,
        amount: product.amount,
        price: product.price,
        description: product.description,
        parentCategory: product.parentCategory,
        subCAtegory: product.subCategory,
        mainImageSrc: '',
        otherImagesSrc: [],
      }
      await addDoc(collection(db, "users", auth.currentUser.uid, "products"), newProduct)
    } catch (error) {
      console.warn({ error })
    }
  }

  async function uploadImageToFirestoreStorate(file) {
    const storageRef = ref(storage, 'products');

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot);
    });
  }

  return {

  }
}
