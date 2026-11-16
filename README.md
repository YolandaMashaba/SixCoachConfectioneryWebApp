# React + Vite

## Ordering

Customers can add products to the cart, edit pack options and quantities, and review the estimated total before submitting an order request. The cart collects customer contact details and a preferred date and time, then saves the structured order to the Firestore `enquiries` collection. The bakery confirms availability and final pricing.

Cart contents stay in page state until submitted and are cleared after a successful database save. Customers can still contact the bakery directly through WhatsApp with questions.

Configure the Firebase web app values from `env.example` in the deployment environment for Firebase-backed catalogue and admin features. Deploy Firestore security rules with `firebase deploy --only firestore:rules` when updating database access.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
