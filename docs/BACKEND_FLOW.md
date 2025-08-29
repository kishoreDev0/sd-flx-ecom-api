# Backend Flow and Routes Overview

This document summarizes the major backend flows, modules, and primary routes for the e-commerce API. It also explains authentication, authorization, and the vendor approval lifecycle.

## Conventions
- Base URL: `/api`
- Version prefix: `/v1`
- Most protected routes require headers: `user-id`, `access-token`
- Role-based access via `@RequireRoles(Roles.ADMIN|VENDOR|USER)` and global `RolesGuard`

## Authentication & Authorization
- Guards:
  - `AuthGuard` (global): validates `user-id` + `access-token`
  - `RolesGuard` (global): enforces required roles from metadata
- Roles resolution via `CommonUtilService.getUserRole(userId)`

### Auth Routes (`/v1/authentication`)
- POST `/login` (Public): user login
- POST `/register/user` (Public): register a consumer user (active immediately)
- POST `/register/vendor` (Public): register a vendor user + vendor record (isVerified=false)
- POST `/forgotPassword` (Public)
- POST `/recoverPassword` (Public, header `resetToken`)
- POST `/resetPassword` (Auth)
- POST `/generatePassword` (Auth, Admin)
- POST `/logout` (Headers: `user-id`, `access-token`)
- GET `/google` (OAuth start), GET `/google/redirect` (OAuth callback)

### Vendor Lifecycle
1. Vendor registers: POST `/v1/authentication/register/vendor` → creates `User`(Vendor role) + `Vendor{ isVerified=false }`
2. Admin reviews and approves:
   - PATCH `/v1/vendors/:id/verify` (Auth, Admin) → sets `isVerified=true`
3. Vendor can list products (guarded in service to require `isVerified=true`)
4. Vendor can manage payout/KYC:
   - PATCH `/v1/vendors/:id/payout-settings` (Auth, Admin)
   - PATCH `/v1/vendors/:id/kyc` (Auth, Admin)

## Users (`/v1/users`)
- Typical CRUD/get endpoints (Auth) for user profiles and management.

## Vendors (`/v1/vendors`)
- POST `/` (Auth, Admin): create vendor (admin-created path)
- GET `/` (Auth): list vendors (filters: `active`, `verified`, `pending`)
- GET `/stats` (Auth): vendor statistics
- GET `/my-profile` (Auth): vendor’s own profile
- GET `/pending-verification` (Auth): list pending vendors
- GET `/:id` (Auth): get vendor by id
- PATCH `/:id` (Auth, Admin): update vendor
- PATCH `/:id/verify` (Auth, Admin): verify/unverify vendor
- PATCH `/:id/payout-settings` (Auth, Admin)
- PATCH `/:id/kyc` (Auth, Admin)
- DELETE `/:id` (Auth, Admin)
- PATCH `/:id/soft-delete` (Auth, Admin)
- PATCH `/:id/restore` (Auth, Admin)

## Products (`/v1/products`)
- POST `/` (Auth): create product (service rejects if `vendor.isVerified=false`)
- GET `/` (Public): list products with filters
- GET `/:id` (Public)
- PATCH `/:id` (Auth)
- DELETE `/:id` (Auth)
- POST `/upload-images` (Auth)
- PATCH `/:id/approve` (Auth, Admin): approve product

## Categories (`/v1/categories`)
- GET `/` (Public; supports `type`, `parentId`)
- GET `/:id` (Public)
- GET `/:id/subcategories` (Public)
- POST `/` (Auth, Admin)
- PATCH `/:id` (Auth, Admin)
- DELETE `/:id` (Auth, Admin; protected against deleting with children)

## Brands (`/v1/brands`) & Brand-Categories (`/v1/brand-categories`)
- CRUD (Auth, Admin), public gets

## Inventory (`/v1/inventory`)
- CRUD (Auth)
- POST `/adjust` (Auth): stock adjustments (in/out/return etc.)
- POST `/bulk-import` (Auth)
- GET `/stats` (Auth)

## Orders (`/v1/orders`)
- POST `/` (Auth): create order
- GET `/` (Auth): list orders (filters, pagination)
- GET `/:id` (Auth)
- GET `/by-number/:orderNumber` (Auth)
- PATCH `/:id` (Auth): update order (addresses, notes, statuses)
- PATCH `/:id/status` (Auth): update status
- POST `/:id/cancel` (Auth)
- POST `/:id/request-return` (Auth)
- POST `/:id/escalate` (Auth)
- GET `/stats` (Auth, Admin)
- GET `/me` (Auth): current user orders
- GET `/vendor` (Auth, Vendor): vendor-specific orders

## Order Tracking (`/v1/order-tracking`)
- POST `/` (Auth): create tracking event
- Helpers within service to mark delivered/cancelled and stats endpoints

## Payments (`/v1/payments`)
- POST `/` (Auth, Admin): create payment record
- GET `/` (Auth): list payments (filters)
- GET `/:id` (Auth)
- GET `/by-transaction/:transactionId` (Auth)
- POST `/process` (Auth): process a payment
- POST `/refund` (Auth): refund
- POST `/payout` (Auth, Admin/Vendor): request payout
- GET `/stats` (Auth, Admin)
- GET `/commission-stats` (Auth, Admin)

## Shipping (`/v1/shipping`)
- Addresses (Auth):
  - POST `/addresses` | GET `/addresses` | PATCH `/addresses/:id` | DELETE `/addresses/:id`
- Methods:
  - POST `/methods` (Auth, Admin)
  - GET `/methods` (Public)
- Zones:
  - POST `/zones` (Auth, Admin)
  - GET `/zones` (Public)
- Shipments (Auth):
  - POST `/shipments`, GET `/shipments`, GET `/shipments/:id`, PATCH `/shipments/:id/status`
- Calculate shipping (Public): POST `/calculate`
- Stats (Auth, Admin): GET `/stats`

## Reviews (`/v1/reviews`)
- POST `/` (Auth): create review
- PATCH `/:id` (Auth): update review
- POST `/:id/respond` (Auth)
- POST `/:id/helpful` (Auth)
- POST `/:id/report` (Auth)
- Admin moderation (Auth, Admin): approve/reject review, resolve reports

## Notifications (`/v1/notifications`)
- Standard CRUD and send operations (Auth)

## Wishlist (`/v1/wishlist`), Cart (`/v1/cart`), FAQ (`/v1/faq`), Static (`/v1/static`)
- Typical CRUD endpoints; many are Auth for mutating operations and public for reads

---

## Authentication & RBAC Flow
1. Client calls public routes (login/register) without headers
2. For protected routes: send `user-id` and `access-token`
3. `AuthGuard` validates session; `RolesGuard` checks required role metadata

## Vendor Flow Summary (End-to-End)
- Register vendor → `Vendor.isVerified=false`
- Admin verifies vendor → `PATCH /v1/vendors/:id/verify` sets `isVerified=true`
- Vendor creates products → service gate requires verified vendors
- Orders, payments, shipping proceed as normal

## Notes
- Swagger is available at: `/api/v1/docs`
- Low-level enums for orders, payments, shipping, reviews are handled via TypeORM `enum` columns
