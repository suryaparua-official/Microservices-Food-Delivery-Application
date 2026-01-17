1. What this service really does

This service manages user identity in the system.
All user data lives in user-service, but:

signup

signin

JWT token generation

OTP based password reset

Google authentication

are controlled from here.

2. Where it sits in the system
   Frontend → Auth-service → User-service → MongoDB
   ↓
   Notification-service

3. Real end-to-end flow

User signs up → Auth-service

Auth-service → creates user in User-service

Auth-service → generates JWT → sets cookie

If user forgets password → OTP is generated

OTP → sent by Notification-service

OTP verified → password reset in User-service

4. API Contract
   Endpoint Called by When Why
   POST /api/auth/signup Frontend New user Create account
   POST /api/auth/signin Frontend Login Get JWT
   GET /api/auth/signout Frontend Logout Clear token
   POST /api/auth/send-otp Frontend Forgot password Send OTP
   POST /api/auth/verify-otp Frontend OTP input Verify OTP
   POST /api/auth/reset-password Frontend After OTP Reset password
   POST /api/auth/google-auth Frontend Google login Social auth
5. Dependencies

User-service → user data store

Notification-service → email OTP

JWT_SECRET → token signing

6. What this service does NOT do

Does not manage user profile data

Does not handle orders, payments, or delivery
