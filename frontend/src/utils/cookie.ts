// import cookie from "cookie";
// import { NextPageContext } from "next";

// // Function to parse cookies on the server side
// export function parseCookies(ctx?: NextPageContext) {
//   const cookies = ctx?.req?.headers.cookie;
//   return cookie.parse(cookies || "");
// }

// // Function to set a cookie on the server side
// export function setCookie(name: string, value: string, ctx?: NextPageContext) {
//   const cookieStr = cookie.serialize(name, value, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     path: "/",
//   });

//   if (ctx?.res) {
//     ctx.res.setHeader("Set-Cookie", cookieStr);
//   } else {
//     document.cookie = cookieStr;
//   }
// }

// // Function to get a cookie on the client side
// export function getCookie(name: string) {
//   const cookies = cookie.parse(document.cookie);
//   return cookies[name];
// }

import { parseCookies } from "nookies";

export const getCookies = (ctx?: any) => {
  return parseCookies(ctx);
};
