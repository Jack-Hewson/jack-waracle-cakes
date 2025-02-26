import { get, post, del } from "aws-amplify/api";
import { ref } from "vue";
import type { Cake } from "../models/cake";
import { v4 as uuidv4 } from "uuid";

const cakes = ref<Cake[]>([]);
const selectedCake = ref<Cake | null>(null);
const showLightbox = ref(false);

function isCake(response: any): response is Cake {
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
      console.log("Unexpected response structure:", response);
    }
  } catch (e) {
    console.log("GET call failed:", e);
  }
}

export async function fetchCakeById(id: number) {
  try {
    const restOperation = get({
      apiName: "warCakeApi",
      path: `/cakes/object/${id}`,
    });
    const { body } = await restOperation.response;
    const response = await body.json();

    if (response && isCake(response)) {
      selectedCake.value = response;
      showLightbox.value = true;
    } else {
      console.log("Cake not found or invalid response");
    }
  } catch (e) {
    console.log("GET call for single cake failed:", e);
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
      path: `/cakes/object/${cakeId}`,
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
