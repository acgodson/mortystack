const headers = {
  "Content-Type": "application/json",
};

export const createShop = async (
  metadata: Record<string, unknown>,
  callback: (error: any) => void
) => {
  try {
    const body = JSON.stringify(metadata);
    const response = await fetch("/api/create-shop", {
      method: "POST",
      body,
      headers,
    });
    const data = await response.json();
    callback(data.error);
  } catch (error) {
    callback(error);
  }
};

export const getShop = async (
  name: string,
  callback: (error: any, shop?: any) => void
) => {
  try {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/get-shop/${name}`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    callback(data.error, data.shop);
  } catch (error) {
    console.log(error);
    callback(error);
  }
};

export const getShopsByOid = async (
  oid: string,
  callback: (error: any, shops?: any[]) => void
) => {
  try {
    const response = await fetch(`/api/get-shops-by-oid/${oid}`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    callback(data.error, data);
  } catch (error) {
    callback(error);
  }
};

// TODO: Not done yet.

export const updateShop = async (
  shopId: string,
  metadata: Record<string, unknown>,
  callback: (error: any) => void
) => {
  try {
    const body = JSON.stringify(metadata);
    const response = await fetch(`/api/update-shop/${shopId}`, {
      method: "POST",
      body,
      headers,
    });
    const data = await response.json();
    callback(data.error);
  } catch (error) {
    callback(error);
  }
};

export const deleteShop = async (
  shopId: string,
  callback: (error: any) => void
) => {
  try {
    const response = await fetch(`/api/delete-shop/${shopId}`, {
      method: "DELETE",
      headers,
    });
    const data = await response.json();
    callback(data.error);
  } catch (error) {
    callback(error);
  }
};
