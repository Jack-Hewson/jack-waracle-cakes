import { get, post, del } from "aws-amplify/api";
import { ref } from "vue";
import type { Cake } from "../models/cake";

const cakes = ref<Cake[]>([]);
const selectedCake = ref<Cake | null>(null);
const showLightbox = ref(false);

function isCake(response: Cake) {
  return (
    response &&
    typeof response.id === "number" &&
    typeof response.name === "string" &&
    typeof response.comment === "string" &&
    typeof response.imageUrl === "string" &&
    typeof response.yumFactor === "number"
  );
}

export async function fetchCakes() {
  try {
    const restOperation = get({
      apiName: "warCakeApi",
      path: "/cakes",
    });
    const { body } = await restOperation.response;
    const response = await body.json();
    if (Array.isArray(response)) {
      cakes.value = response as unknown as Cake[];
    } else {
      console.error("Unexpected response structure:", response);
      throw new Error("Invalid response format");
    }
  } catch (e) {
    console.error("GET call failed:", e);
    throw e;
  }
}

export async function fetchCakeById(id: number) {
  try {
    const restOperation = get({
      apiName: "warCakeApi",
      path: `/cakes/${id}`,
    });
    const { body } = await restOperation.response;
    const response = await body.json();

    if (
      Array.isArray(response) &&
      response.length > 0 &&
      isCake(response[0] as unknown as Cake)
    ) {
      selectedCake.value = response[0] as unknown as Cake;
      showLightbox.value = true;
    } else {
      console.log("Cake not found or invalid response");
      selectedCake.value = null;
    }
  } catch (e) {
    console.log("GET call for single cake failed:", e);
    selectedCake.value = null;
  }
}

export async function addCake(cakeData: {
  name: string;
  comment: string;
  yumFactor: number;
}) {
  try {
    const existingCake = cakes.value.find((cake) => {
      return cake.name.toLowerCase() === cakeData.name.toLowerCase();
    });

    if (existingCake) {
      console.log("Cake with this name already exists.");
      alert("Cake with this name already exists.");

      return;
    }

    const restOperation = post({
      apiName: "warCakeApi",
      path: "/cakes",
      options: {
        body: {
          id: Date.now() + Math.floor(Math.random() * 1000),
          name: cakeData.name,
          comment: cakeData.comment,
          imageUrl: "src/assets/cake.svg",
          yumFactor: cakeData.yumFactor,
        },
      },
    });

    const { body } = await restOperation.response;
    const response = await body.json();

    if (response) {
      fetchCakes();
      showLightbox.value = false;
    }
  } catch (e) {
    console.log("POST call failed:", e);
  }

  fetchCakes();
}

export async function deleteCake(cakeId: number) {
  try {
    const restOperation = del({
      apiName: "warCakeApi",
      path: `/cakes/${cakeId}`,
    });

    const { body } = (await restOperation.response) as unknown as {
      body: Response;
    };
    const response = await body.json();

    if (response) {
      fetchCakes();
    }
  } catch (e) {
    console.log("DELETE call failed:", e);
  }
}

export { cakes, selectedCake, showLightbox };
