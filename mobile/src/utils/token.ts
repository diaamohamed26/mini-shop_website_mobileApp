const KEY = "mini_shop_token";

export const saveToken = (token: string) => {
  localStorage.setItem(KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(KEY);
};

export const deleteToken = () => {
  localStorage.removeItem(KEY);
};