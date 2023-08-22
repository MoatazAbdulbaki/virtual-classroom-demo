import Cookies from "js-cookie";

export function setToken(token: string) {
  Cookies.set("token", token, {
    expires: 7,
    secure: false,
    sameSite: "strict",
  });
}

export function getToken() {
  return Cookies.get("token");
}

export function clearToken() {
  Cookies.remove("token");
}
