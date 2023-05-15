import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  updateMetadata,
  deleteObject
} from "firebase/storage";
import { app } from "../../firebaseConfig"

export function useFirestoreDatabase() {
  const storage = getStorage(app)

  //string, object
  async function updateMainImageInFirebase(currentMainImgObj, newMainImgObj) {
    try {
      if (currentMainImgObj != null) {
        const replacementMeta = {
          customMetadata: {
            isMain: false,
            uid: currentMainImgObj.uid,
            extension: currentMainImgObj.extension,
            storageRef: currentMainImgObj.storageRef,
            url: currentMainImgObj.url
          }
        }
        const storageRef = ref(storage, currentMainImgObj.storageRef)
        let uploadedMeta = await updateMetadata(storageRef, replacementMeta)
      } else {

        const newMetadata = {
          customMetadata: {
            isMain: true,
            uid: newMainImgObj.uid,
            extension: newMainImgObj.extension,
            storageRef: newMainImgObj.storageRef,
            url: newMainImgObj.url
          }
        }

        const storageRef = ref(storage, newMainImgObj.storageRef)
        const uploadedMeta = await updateMetadata(storageRef, newMetadata)
        return { ...uploadedMeta.customMetadata }
      }
    } catch (error) {
      console.warn({ error })
    }
  }

  async function uploadImagesToFirebaseStorage(images) {
    try {
      const promises = images.map(async (imageFile) => {
        const imageExt = imageFile.name.slice(imageFile.name.lastIndexOf('.'))

        const imageUid = generateUniqueImageId()

        const imageFileStorageRefString = `images/${imageUid}${imageExt}`

        const storageRef = ref(storage, imageFileStorageRefString)

        await uploadBytesResumable(storageRef, imageFile)
        const metadata = {
          customMetadata: {
            isMain: false,
            uid: imageUid,
            extension: imageExt,
            storageRef: imageFileStorageRefString,
          }
        }
        const uploadedMeta = await updateMetadata(storageRef, metadata)

        return { ...uploadedMeta.customMetadata, url: await getDownloadURL(storageRef) }
      })

      return Promise.all(promises)
    } catch (error) {
      console.warn({ error })
    }
  }

  async function removeImageFromFirebaseStorage(image) {
    console.log('composable deletes', image.storageRef);
    try {
      const imageRef = ref(storage, image.storageRef)
      await deleteObject(imageRef);
    } catch (error) {
      console.warn({ error })
    }
  }

  function generateUniqueImageId() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  return {
    updateMainImageInFirebase,
    uploadImagesToFirebaseStorage,
    generateUniqueImageId,
    removeImageFromFirebaseStorage,
  }
}
