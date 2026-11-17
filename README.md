# NeevCraft Engineering & Storefront

A full-stack MERN capstone application inspired by NeevCraft, an Indian electronics and robotics store that also supports engineering projects. The storefront covers Arduino/ESP32 boards, robotics and STEM kits, account/cart/order flows, and engineering-service information for robotics, IoT, software and prototypes.

The project is an independent capstone implementation, not NeevCraft's production website or order system.

## What is included

- React storefront with company-specific Home, Shop, Product, About, Project Inquiry, FAQ and Policies pages.
- Search, category/price filters, sorting, pagination, product details, sale-price display and package contents.
- Product catalog seeded from public NeevCraft listings: ESP32 and Arduino robot kits, Arduino Uno board, STEM models, touchless tap model and TWS earbuds.
- Project brief form that prepares a WhatsApp message. It does not send anything until the visitor reviews the message and presses Send.
- Registration and login with bcrypt password hashing, JWT access tokens and rotating refresh tokens.
- Customer/admin role checks, personal cart, order history and a demo cash-on-delivery order flow.
- MongoDB-backed product, user, cart and order collections; admin product CRUD, order status updates and sales reports.
- API health endpoint, focused tests and an importable Postman collection.

## Company information represented

- **Business:** electronic components, robotics parts, DIY/STEM kits and engineering support.
- **Project areas:** robotics and IoT, full-stack web/mobile applications, academic engineering projects and startup proof-of-concepts.
- **Founder:** Kunal Kumar, Founder & Lead Engineer.
- **Contact:** support@neevcraft.com · +91 70117 98003 · Hans Enclave, Gurgaon, Haryana 122004, India.
- **Delivery information:** NeevCraft lists Pan-India component delivery and a typical 3–5 business day window for in-stock items.
- **Project response:** the company describes an initial-review target of 24 hours for a complete brief; actual timing can vary.
- **Defective hardware:** the company asks customers to report issues within 48 hours with order details, photos and a test video; replacement eligibility is reviewed.

Company information and policies are summarized in original wording. Confirm live details directly with [neevcraft.com](https://neevcraft.com).

## Catalogue and pricing note

The seed contains eight public listings and their observed prices/compare-at prices. Prices and stock can change. Seed stock values are demonstration data, not live inventory, and must be verified before any real launch.

| Product | Category | Seed price |
| --- | --- | ---: |
| ESP32 4WD Wi-Fi & Bluetooth Smart Robot Car Kit | RoboDrive ESP32 Smart Car | ₹2,499 |
| Arduino Bluetooth Controlled 2WD Smart Robot Car Kit | RoboDrive Arduino Smart Car | ₹1,500 |
| Arduino Bluetooth Controlled 4WD Smart Robot Car Kit | RoboDrive Arduino Smart Car | ₹2,499 |
| Arduino Uno SMD Board with USB Cable | Boards | ₹349 |
| Waste-to-Electricity Generator Working Model Kit | STEM Learning Kits | ₹5,999 |
| 4WD Arduino Line Follower Robot Car Kit | STEM Learning Kits | ₹2,699 |
| Automatic Touchless Water Tap Working Model Kit | Arduino Project | ₹1,700 |
| NC-TWS01 True Wireless Earbuds with Type-C Charging | Earbuds | ₹699 |

Product images link to NeevCraft's public website. Product descriptions are concise summaries; confirm precise inclusions and specifications on the live product listing.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm
- MongoDB Atlas or a local MongoDB replica set (checkout uses MongoDB transactions)

## Run locally

1. Install workspace dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env`. Add a MongoDB connection string and replace both JWT secrets with different, long random values. Keep `.env` private; it is ignored by Git.

   For Atlas, create a database user, allow your development IP in Network Access, then paste the driver's connection string into `MONGO_URI`.

3. Optionally set `ADMIN_NAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` to create the first admin account. The password must have at least 8 characters. Admin credentials are not hard-coded, and public registration cannot assign the admin role.

4. Seed the NeevCraft catalogue and configured admin (if requested):

   ```sh
   npm run seed
   ```

   The seed adds products without deleting existing database records. If you previously seeded the ShopEasy demo catalog into the same database, review those older sample products in the admin dashboard and remove them manually if appropriate.

5. Start the API and React development server:

   ```sh
   npm run dev
   ```

   Open `http://localhost:5173`. Vite proxies `/api` requests to `http://localhost:5000`; the API health check is at `http://localhost:5000/api/health`.

For production, run `npm run build` and then `npm start`. Express serves the built React app and API from `http://localhost:5000`.

## API overview

All routes are prefixed with `/api`. Protected routes expect `Authorization: Bearer <accessToken>`.

| Area | Routes | Access |
| --- | --- | --- |
| Health | `GET /health` | Public |
| Authentication | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me` | Refresh/current-user routes require their token |
| Products | `GET /products`, `GET /products/:id` | Public |
| Catalogue management | `POST /products`, `PUT /products/:id`, `DELETE /products/:id` | Admin |
| Cart | `GET /cart`, `POST /cart`, `PATCH /cart/:productId`, `DELETE /cart/:productId` | Customer or admin |
| Orders | `POST /orders`, `GET /orders/my-orders` | Customer or admin |
| Order management | `GET /orders/all`, `GET /orders/report`, `PATCH /orders/:id/status` | Admin |

Product listing accepts `search`, `category`, `minPrice`, `maxPrice`, `sort`, `page` and `limit`. Sort values are `newest`, `price-asc`, `price-desc` and `name-asc`. Product records can include `compareAtPrice`, `features` and `boxContents`.

The checkout request body is:

```json
{
  "shippingAddress": {
    "name": "Asha Kumar",
    "phone": "+91 98765 43210",
    "line1": "12 Example Road",
    "city": "Delhi",
    "postalCode": "110001"
  }
}
```

Checkout is a demonstration COD flow. It does not notify NeevCraft, process online payments or calculate live courier charges. The order total includes product prices only; confirm actual shipping cost, payment methods and availability with the company before placing any real order. Use a MongoDB replica set for transactional checkout.

## Tests and Postman

Run the backend tests:

```sh
npm test
```

Import `NeevCraft.postman_collection.json` into Postman. Set `baseUrl` if needed, register or log in, then use the collection's saved access token. Admin endpoints require the admin account configured in `.env`.
