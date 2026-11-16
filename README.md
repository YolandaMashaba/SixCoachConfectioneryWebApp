# React + Vite

## Ordering

Customers can add products to the cart, edit pack options and quantities, and review the estimated total before submitting an order request. The cart collects customer contact details and a preferred date and time, then saves the structured order to the Firestore `enquiries` collection. The bakery confirms availability and final pricing.

Cart contents stay in page state until submitted and are cleared after a successful database save. Customers can still contact the bakery directly through WhatsApp with questions.

Configure the Firebase web app values from `env.example` in the deployment environment for Firebase-backed catalogue and admin features. Deploy Firestore security rules with `firebase deploy --only firestore:rules` when updating database access.

## In-store availability

The website reads live availability from the separate Firebase project configured by `VITE_STOCK_FIREBASE_*`. Register a **Web app** in the inventory project (`sixcoachconfectionery-e9a5a`) and set its API key and app ID along with the project ID in the deployment environment.

The Android app should maintain a `publicStock` collection with one document per website product. Use the website product ID (`c1`–`c7`) for `productId`, and include a numeric `quantityInStock`, including zero quantities:

```json
{
  "productId": "c1",
  "quantityInStock": 5
}
```

Only copy the product ID and stock quantity into this feed; keep costs, ingredient records, and other internal inventory data in the existing private collections. Configure the inventory project's Firestore rules to allow unauthenticated reads only for `publicStock`, while restricting writes to the trusted Android/admin workflow. The website shows “In stock in store” when quantity is above zero, “Out of stock in store” at zero, and an unavailable message when the feed cannot be read or a product has no feed record.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
