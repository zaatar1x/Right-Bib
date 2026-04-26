#!/bin/bash

# API Testing Script for NestJS Backend
# This script tests all major endpoints

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="http://localhost:3000"
JWT_TOKEN=""

echo "🧪 NestJS Backend - API Testing Script"
echo "======================================="
echo ""

# Function to print test header
print_test() {
    echo -e "${BLUE}▶ Testing: $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    echo ""
}

# Function to print error
print_error() {
    echo -e "${RED}❌ $1${NC}"
    echo ""
}

# Test 1: Health Check
print_test "Health Check (GET /)"
RESPONSE=$(curl -s -w "\n%{http_code}" $BASE_URL)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Health check passed"
    echo "Response: $BODY"
else
    print_error "Health check failed (HTTP $HTTP_CODE)"
    exit 1
fi

# Test 2: Sign Up
print_test "Sign Up (POST /auth/signup)"
SIGNUP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testadmin@example.com",
    "username": "testadmin",
    "password": "Admin123!",
    "role": "admin"
  }')

HTTP_CODE=$(echo "$SIGNUP_RESPONSE" | tail -n1)
BODY=$(echo "$SIGNUP_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    print_success "Sign up successful"
    echo "Response: $BODY"
elif echo "$BODY" | grep -q "Duplicate entry"; then
    print_success "User already exists (continuing with existing user)"
else
    print_error "Sign up failed (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
fi

# Test 3: Sign In
print_test "Sign In (POST /auth/signin)"
SIGNIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "identifiant": "testadmin",
    "password": "Admin123!"
  }')

HTTP_CODE=$(echo "$SIGNIN_RESPONSE" | tail -n1)
BODY=$(echo "$SIGNIN_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    print_success "Sign in successful"
    JWT_TOKEN=$(echo "$BODY" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    echo "JWT Token obtained: ${JWT_TOKEN:0:50}..."
else
    print_error "Sign in failed (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    exit 1
fi

# Test 4: Add Author
print_test "Add Author (POST /author/add)"
AUTHOR_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/author/add \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Victor",
    "nom": "Hugo"
  }')

HTTP_CODE=$(echo "$AUTHOR_RESPONSE" | tail -n1)
BODY=$(echo "$AUTHOR_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    print_success "Author added successfully"
    AUTHOR_ID=$(echo "$BODY" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    echo "Author ID: $AUTHOR_ID"
    echo "Response: $BODY"
else
    print_error "Add author failed (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    AUTHOR_ID=1  # Use default ID
fi

# Test 5: Get All Authors
print_test "Get All Authors (GET /author/all)"
AUTHORS_RESPONSE=$(curl -s -w "\n%{http_code}" $BASE_URL/author/all)

HTTP_CODE=$(echo "$AUTHORS_RESPONSE" | tail -n1)
BODY=$(echo "$AUTHORS_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Authors retrieved successfully"
    echo "Response: $BODY"
else
    print_error "Get authors failed (HTTP $HTTP_CODE)"
fi

# Test 6: Add Book (Requires Admin JWT)
print_test "Add Book (POST /books/new) - Admin Only"
BOOK_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/books/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d "{
    \"title\": \"Les Misérables\",
    \"year\": 1862,
    \"editor\": \"A. Lacroix\",
    \"image\": \"https://example.com/les-miserables.jpg\",
    \"category\": \"roman\",
    \"author\": $AUTHOR_ID
  }")

HTTP_CODE=$(echo "$BOOK_RESPONSE" | tail -n1)
BODY=$(echo "$BOOK_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    print_success "Book added successfully"
    BOOK_ID=$(echo "$BODY" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    echo "Book ID: $BOOK_ID"
    echo "Response: $BODY"
else
    print_error "Add book failed (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    BOOK_ID=1  # Use default ID
fi

# Test 7: Get All Books
print_test "Get All Books (GET /books/all)"
BOOKS_RESPONSE=$(curl -s -w "\n%{http_code}" $BASE_URL/books/all)

HTTP_CODE=$(echo "$BOOKS_RESPONSE" | tail -n1)
BODY=$(echo "$BOOKS_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Books retrieved successfully"
    echo "Response: $BODY"
else
    print_error "Get books failed (HTTP $HTTP_CODE)"
fi

# Test 8: Get Book By ID (Requires JWT)
print_test "Get Book By ID (GET /books/search/$BOOK_ID)"
BOOK_DETAIL_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  $BASE_URL/books/search/$BOOK_ID)

HTTP_CODE=$(echo "$BOOK_DETAIL_RESPONSE" | tail -n1)
BODY=$(echo "$BOOK_DETAIL_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Book details retrieved successfully"
    echo "Response: $BODY"
else
    print_error "Get book by ID failed (HTTP $HTTP_CODE)"
fi

# Test 9: Add to Favorites (Requires JWT)
print_test "Add to Favorites (POST /favoris/$BOOK_ID)"
FAVORITE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: Bearer $JWT_TOKEN" \
  $BASE_URL/favoris/$BOOK_ID)

HTTP_CODE=$(echo "$FAVORITE_RESPONSE" | tail -n1)
BODY=$(echo "$FAVORITE_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    print_success "Book added to favorites"
    echo "Response: $BODY"
elif echo "$BODY" | grep -q "Already in favorites"; then
    print_success "Book already in favorites"
else
    print_error "Add to favorites failed (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
fi

# Test 10: Get User Favorites (Requires JWT)
print_test "Get User Favorites (GET /favoris)"
FAVORITES_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  $BASE_URL/favoris)

HTTP_CODE=$(echo "$FAVORITES_RESPONSE" | tail -n1)
BODY=$(echo "$FAVORITES_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Favorites retrieved successfully"
    echo "Response: $BODY"
else
    print_error "Get favorites failed (HTTP $HTTP_CODE)"
fi

# Test 11: Get All Tasks
print_test "Get All Tasks (GET /tasks/all)"
TASKS_RESPONSE=$(curl -s -w "\n%{http_code}" $BASE_URL/tasks/all)

HTTP_CODE=$(echo "$TASKS_RESPONSE" | tail -n1)
BODY=$(echo "$TASKS_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Tasks retrieved successfully"
    echo "Response: $BODY"
else
    print_error "Get tasks failed (HTTP $HTTP_CODE)"
fi

# Test 12: Admin Stats - Total Users (Requires Admin JWT)
print_test "Total Users Stats (GET /auth/stats/total-users) - Admin Only"
USERS_STATS_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  $BASE_URL/auth/stats/total-users)

HTTP_CODE=$(echo "$USERS_STATS_RESPONSE" | tail -n1)
BODY=$(echo "$USERS_STATS_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "User stats retrieved successfully"
    echo "Response: $BODY"
else
    print_error "Get user stats failed (HTTP $HTTP_CODE)"
fi

# Test 13: Admin Stats - Books Per Year (Requires Admin JWT)
print_test "Books Stats (GET /books/stats) - Admin Only"
BOOKS_STATS_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  $BASE_URL/books/stats)

HTTP_CODE=$(echo "$BOOKS_STATS_RESPONSE" | tail -n1)
BODY=$(echo "$BOOKS_STATS_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Book stats retrieved successfully"
    echo "Response: $BODY"
else
    print_error "Get book stats failed (HTTP $HTTP_CODE)"
fi

# Summary
echo "======================================="
echo -e "${GREEN}🎉 API Testing Complete!${NC}"
echo ""
echo "📊 Summary:"
echo "  - Base URL: $BASE_URL"
echo "  - JWT Token: ${JWT_TOKEN:0:50}..."
echo "  - Author ID: $AUTHOR_ID"
echo "  - Book ID: $BOOK_ID"
echo ""
echo "💡 Use the JWT token for authenticated requests:"
echo "   curl -H \"Authorization: Bearer $JWT_TOKEN\" $BASE_URL/books/all"
echo "======================================="
