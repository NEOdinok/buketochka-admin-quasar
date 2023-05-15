import {
  getDocs,
  collection,
  getFirestore,
  deleteDoc,
  doc,
  setDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { ref } from "vue"
import { app } from "../../firebaseConfig"
import { getAuth } from "firebase/auth";
import { useFirestoreDatabase } from "./useFirestoreDatabase";
const { removeImageFromFirebaseStorage } = useFirestoreDatabase();

export function useFirebase() {
  const db = getFirestore(app)
  const auth = getAuth(app)

  async function getCategoryDocsFromFirebase() {
    const pulledCategoryDocs = ref([])
    const categoriesData = ref([])

    try {
      const snapShot = await getDocs(collection(db, "categories"))

      snapShot.forEach((doc) => {
        pulledCategoryDocs.value.push({
          categoryId: doc.id,
          categoryName: doc.data().categoryName,
          categoryRoute: doc.data().categoryRoute
        })
      })
      categoriesData.value = pulledCategoryDocs.value
      pulledCategoryDocs.value = []

    } catch (error) {
      console.warn({error})
    }

    return { categoriesData }
  }

  async function getSubcategoryDocsFromFirebase(parentCategoryId) {
    const pulledSubcategoryDocs = ref([])
    const subcategoriesData = ref([])

    try {
      const snapShot = await getDocs(collection(db, "categories", parentCategoryId.value, "subcategories"))

      snapShot.forEach((doc) => {
        pulledSubcategoryDocs.value.push({
          subCategoryId: doc.id,
          subCategoryName: doc.data().subCategoryName,
          subCategoryRoute: doc.data().subCategoryRoute
        })
      })

      subcategoriesData.value = pulledSubcategoryDocs.value
      pulledSubcategoryDocs.value = []

    } catch (error) {
      console.warn({error})
    }

    return { subcategoriesData }
  }

  async function deleteSubcategoryFromFirebase(parentCategoryId, subCategoryId) {
    try {
      await deleteDoc(doc(db, "categories", parentCategoryId.value, "subcategories", subCategoryId.value))
    } catch (error) {
      console.warn({error})
    }
  }

  async function updateSubcategoryInFirebase(parentCategoryId, subCategoryId, newSubCategory) {
    try {
      const subCategoryRef = doc(db, "categories", parentCategoryId.value, "subcategories", subCategoryId.value)
      await setDoc(subCategoryRef, newSubCategory)
    } catch (error) {
      console.warn({error})
    }
  }

  async function updateCategoryInFirebase(categoryId, newCategory) {
    try {
      const categoryRef = doc(db, "categories", categoryId.value)
      await setDoc(categoryRef, newCategory)
    } catch (error) {
      console.warn({error})
    }
  }

  async function createCategoryInFirebase(newCategory) {
    try {
      await addDoc(collection(db, "categories"), newCategory)
    } catch (error) {
      console.warn({ error })
    }
  }

  async function createSubcategoryInFirebase(parentCategoryId, newSubCategory) {
    try {
      await addDoc(collection(db, "categories", parentCategoryId.value, "subcategories"), newSubCategory)
    } catch (error) {
      console.warn({ error })
    }
  }

  async function deleteCategoryFromFirebase(categoryId) {
    try {
      //first delete all subcategories
      const snapShot = await getDocs(collection(db, "categories", categoryId.value, "subcategories"))

      snapShot.forEach(async (doc) => {
        await deleteDoc(doc.ref)
      })

      await deleteDoc(doc(db, "categories", categoryId.value))
    } catch (error) {
      console.warn({ error })
    }
  }

  async function createProductInFirebase(productData) {
    try {
      await addDoc(collection(db, "products"), productData)
    } catch (error) {
      console.warn({ error })
    }
  }

  async function getProductDocsFromFirebase() {
    const productsData = [];

    try {
      const querySnapshot = await getDocs(collection(db, "products"));

      querySnapshot.forEach(productDoc => {
        productsData.push({ ...productDoc.data(), id: productDoc.id });
      });
    } catch (error) {
      console.warn({ error });
    }

    return { productsData };
  }

  async function deleteProductFromFirebase(productId) {
    try {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      //first, delete all images by refs
      docSnap.data().imagesData.forEach(async img => {
        // console.log('img ref:', img.storageRef);
        await removeImageFromFirebaseStorage(img);
      })
      //second, delete product record
      await deleteDoc(docRef);

    } catch (error) {
      console.warn({ error })
    }
  }

  return {
    getCategoryDocsFromFirebase,
    updateCategoryInFirebase,
    createCategoryInFirebase,
    deleteCategoryFromFirebase,
    createSubcategoryInFirebase,
    getSubcategoryDocsFromFirebase,
    deleteSubcategoryFromFirebase,
    updateSubcategoryInFirebase,
    createProductInFirebase,
    getProductDocsFromFirebase,
    deleteProductFromFirebase,
  }
}
