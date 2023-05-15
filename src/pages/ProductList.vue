<template>
  <q-page>
    <div class="row justify-center">
      <div class="content col no-wrap">
        <div class="topRow">
          <div class="filtersRow">
            <q-select
              class="categoryFilter filterInput"
              outlined
              label="Product category"
              v-model="selectedCategory"
              :options="categoriesQselectOptions"
            />

            <q-select
              class="subCategoryFilter filterInput"
              outlined
              label="Product Subcategory"
              v-model="selectedSubCategory"
              :options="subCategoriesQselectOptions"
            />

            <q-btn
              unelevated
              rounded
              class="createBtn btn"
              align="between"
              icon-right="clear"
              color="primary"
              label="Clear"
              @click="clearFilters()"
            />
          </div>

          <div class="btnsRow">

            <q-btn
              no-caps
              class="createBtn btn"
              align="between"
              icon-right="add"
              color="positive"
              label="Create Product"
              @click="redirectToCreateProduct"
            />
          </div>

        </div>

        <div class="cardsSection ">
          <ProductCard
            v-if="products.length !=0"
            v-for="(product, i) in filteredProducts"
            @productDelete="() => handleDelete()"
            :name="product.name"
            :price="+product.price"
            :mainImgUrl="product.imagesData.filter(img => img.isMain === `true`)[0].url"
            :imagesData="product.imagesData"
            :id="product.id"
          />
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useFirebase } from 'src/composables/useFirebase';
import ProductCard from 'src/components/ProductCard.vue';
import Modal from '../components/ConfirmationModal.vue'
import { useNotifications } from 'src/composables/useNotifications';
import {useRouter} from 'vue-router';
const categories = ref('');
const subcategories = ref('');
const categoriesQselectOptions = ref([]);
const subCategoriesQselectOptions = ref([]);
const selectedCategory = ref(null);
const selectedSubCategory = ref(null);
const products = ref([]);
const filteredProducts = ref([]);
const router = useRouter();

const {
  getCategoryDocsFromFirebase,
  getSubcategoryDocsFromFirebase,
  getProductDocsFromFirebase,
} = useFirebase();

onMounted(async () => {
  try {
    const { categoriesData } = await getCategoryDocsFromFirebase()
    const { productsData } = await getProductDocsFromFirebase();

    categories.value = categoriesData.value;
    products.value = productsData;
    if (products.value) searchFilter();
  } catch(error) {
    console.warn({error})
  }
})

const redirectToCreateProduct = () => {
  router.push('/products/create');
}

const handleDelete = async () => {
  try {
    const { productsData } = await getProductDocsFromFirebase();
    products.value = productsData;
    if (products.value) searchFilter();
  } catch(error) {
    console.warn({error})
  }
}

const clearFilters = () => {
  selectedCategory.value = null;
  selectedSubCategory.value = null;
}

const searchFilter = () => {
  if (selectedCategory.value && selectedSubCategory.value) {
    filteredProducts.value = products.value.filter(p => {
      console.log('p.cat:', p.category.label, 'p.subCat:', p.subCategory.label);
      return p.category.label === selectedCategory.value.label && p.subCategory.label === selectedSubCategory.value.label;
    })
  } else if (selectedCategory.value) {
    filteredProducts.value = products.value.filter(p => p.category.label === selectedCategory.value.label);
  } else filteredProducts.value = products.value;
}

const subCategoriesHandler = async (parentCategoryId) => {
  try {
    const { subcategoriesData } = await getSubcategoryDocsFromFirebase(parentCategoryId)
    subcategories.value = subcategoriesData.value;
  } catch (error) {
    console.error({error})
  }
}

watch (selectedCategory, () => {
  if (selectedCategory.value) subCategoriesHandler(selectedCategory.value);
  selectedSubCategory.value = null;
  searchFilter();
});

watch (selectedSubCategory, () => {
  searchFilter();
});

watch(categories, () => {
  categoriesQselectOptions.value = categories.value.map(c => ({
    label: c.categoryName,
    value: c.categoryId
  }))
});

watch (subcategories, () => {
  subCategoriesQselectOptions.value = subcategories.value.map(c => ({
    label: c.subCategoryName,
    value: c.subCategoryId
  }))
});
</script>

<style lang="scss" scoped>
//smallest
@media screen and (max-width: 399px) {
  .content {
    padding: 1rem;
  }
  .cardsSection {
    display: flex;
    flex-direction: column;
    gap: 1rem
  }
}

//mobile
@media screen and (min-width: 400px) and (max-width: 599px) {
  .content {
    padding: 1rem;
  }

  .cardsSection {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

//tablet
@media screen and (min-width: 600px) and (max-width: 930px) {
  .cardsSection {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, 1fr);
  }
}

//desktop
@media screen and (min-width: 931px) {
  .cardsSection {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(4, 1fr);
  }
}

//up to tablet
@media screen and (max-width: 599px) {
  .topRow {
    flex-direction: column;
  }
  .filtersRow {
    display: flex;
    align-items: center;
    width: 100%;
    padding-bottom: 1rem;
  }
  .filterInput {
    width: 100%;
  }

  .btn {
    min-width: 120px;
  }
}

//tablet and larger
@media screen and (min-width: 600px) {
  .filterInput {
    min-width: 150px;
  }
  .topRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .filtersRow {
    align-items: center;
  }
}
.btn {
  height: fit-content;
  width: fit-content;
}
.topRow {
  display: flex;
  padding: 1rem 0;
}
.filtersRow,
.btnsRow {
  display: flex;
  gap: 1rem;
}
.content {
  padding: 0 1rem;
  max-width: 1200px;
}
</style>
