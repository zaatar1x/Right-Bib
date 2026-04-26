# PowerShell API Testing Script for Windows
# Run with: .\test-api.ps1

$BASE_URL = "http://localhost:3000"
$TOKEN = ""

Write-Host "`n=== API Testing Script ===" -ForegroundColor Blue
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/books/all" -Method Get
    Write-Host "✓ Backend is running" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Backend is not responding" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Create Admin User
Write-Host "2. Creating Admin User..." -ForegroundColor Cyan
$body = @{
    email = "admin@test.com"
    username = "admin"
    password = "admin123"
    role = "admin"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/signup" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Admin user created" -ForegroundColor Green
    $response | ConvertTo-Json
    Write-Host ""
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠ User already exists (continuing...)" -ForegroundColor Yellow
    } else {
        Write-Host "Error: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 3: Login
Write-Host "3. Logging in..." -ForegroundColor Cyan
$body = @{
    identifiant = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/signin" -Method Post -Body $body -ContentType "application/json"
    $TOKEN = $response.access_token
    Write-Host "✓ Token received: $($TOKEN.Substring(0, [Math]::Min(50, $TOKEN.Length)))..." -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Login failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Test 4: Create Author
Write-Host "4. Creating Author (Victor Hugo)..." -ForegroundColor Cyan
$body = @{
    prenom = "Victor"
    nom = "Hugo"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/author/add" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Author created" -ForegroundColor Green
    $response | ConvertTo-Json
    Write-Host ""
} catch {
    Write-Host "⚠ Error creating author (may already exist)" -ForegroundColor Yellow
    Write-Host ""
}

# Test 5: Create Another Author
Write-Host "5. Creating Author (Albert Camus)..." -ForegroundColor Cyan
$body = @{
    prenom = "Albert"
    nom = "Camus"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/author/add" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Author created" -ForegroundColor Green
    $response | ConvertTo-Json
    Write-Host ""
} catch {
    Write-Host "⚠ Error creating author (may already exist)" -ForegroundColor Yellow
    Write-Host ""
}

# Test 6: Get All Authors
Write-Host "6. Getting All Authors..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/author/all" -Method Get
    Write-Host "✓ Authors retrieved: $($response.Count) authors" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get authors" -ForegroundColor Red
    Write-Host ""
}

# Test 7: Create Book
Write-Host "7. Creating Book (Les Misérables)..." -ForegroundColor Cyan
$body = @{
    title = "Les Misérables"
    year = 1862
    editor = "A. Lacroix"
    image = "https://example.com/les-miserables.jpg"
    category = "roman"
    author = 1
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/books/new" -Method Post -Body $body -Headers $headers
    Write-Host "✓ Book created" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
} catch {
    Write-Host "⚠ Error creating book" -ForegroundColor Yellow
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 8: Create Another Book
Write-Host "8. Creating Book (L'Étranger)..." -ForegroundColor Cyan
$body = @{
    title = "L'Étranger"
    year = 1942
    editor = "Gallimard"
    image = "https://example.com/letranger.jpg"
    category = "roman"
    author = 2
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/books/new" -Method Post -Body $body -Headers $headers
    Write-Host "✓ Book created" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
} catch {
    Write-Host "⚠ Error creating book" -ForegroundColor Yellow
    Write-Host ""
}

# Test 9: Get All Books
Write-Host "9. Getting All Books..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/books/all" -Method Get
    Write-Host "✓ Books retrieved: $($response.listeBooks.Count) books" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get books" -ForegroundColor Red
    Write-Host ""
}

# Test 10: Add to Favorites
Write-Host "10. Adding Book to Favorites (Book ID: 1)..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $TOKEN"
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/favoris/1" -Method Post -Headers $headers
    Write-Host "✓ Book added to favorites" -ForegroundColor Green
    $response | ConvertTo-Json
    Write-Host ""
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠ Book already in favorites" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Failed to add to favorites" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 11: Add Another to Favorites
Write-Host "11. Adding Book to Favorites (Book ID: 2)..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/favoris/2" -Method Post -Headers $headers
    Write-Host "✓ Book added to favorites" -ForegroundColor Green
    $response | ConvertTo-Json
    Write-Host ""
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠ Book already in favorites" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Failed to add to favorites" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 12: Get User Favorites
Write-Host "12. Getting User Favorites..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/favoris" -Method Get -Headers $headers
    Write-Host "✓ Favorites retrieved: $($response.Count) favorites" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get favorites" -ForegroundColor Red
    Write-Host ""
}

# Test 13: Get Statistics
Write-Host "13. Getting Statistics..." -ForegroundColor Cyan

Write-Host "`n--- Total Users ---" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/stats/total-users" -Method Get -Headers $headers
    $response | ConvertTo-Json
} catch {
    Write-Host "✗ Failed to get user stats" -ForegroundColor Red
}

Write-Host "`n--- Books Statistics ---" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/books/stats" -Method Get -Headers $headers
    $response | ConvertTo-Json
} catch {
    Write-Host "✗ Failed to get book stats" -ForegroundColor Red
}

Write-Host "`n--- Total Favorites ---" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/favoris/stats/total" -Method Get -Headers $headers
    $response | ConvertTo-Json
} catch {
    Write-Host "✗ Failed to get favorites stats" -ForegroundColor Red
}

Write-Host "`n--- Most Favorited Books ---" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/favoris/stats/most-favourited?limit=5" -Method Get -Headers $headers
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Failed to get most favorited books" -ForegroundColor Red
}

Write-Host ""

# Test 14: Create Task
Write-Host "14. Creating Task..." -ForegroundColor Cyan
$body = @{
    title = "TestTask"
    year = 2024
    statut = "todo"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/tasks/add" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Task created" -ForegroundColor Green
    $response | ConvertTo-Json
    Write-Host ""
} catch {
    Write-Host "✗ Failed to create task" -ForegroundColor Red
    Write-Host ""
}

# Test 15: Get All Tasks
Write-Host "15. Getting All Tasks..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/tasks/all" -Method Get
    Write-Host "✓ Tasks retrieved: $($response.Count) tasks" -ForegroundColor Green
    $response | ConvertTo-Json
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get tasks" -ForegroundColor Red
    Write-Host ""
}

Write-Host "`n=== All Tests Completed ===" -ForegroundColor Green
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "- Backend URL: $BASE_URL" -ForegroundColor White
Write-Host "- JWT Token: $($TOKEN.Substring(0, [Math]::Min(30, $TOKEN.Length)))..." -ForegroundColor White
Write-Host "- phpMyAdmin: http://localhost:8080" -ForegroundColor White
Write-Host "`nYou can now:" -ForegroundColor Yellow
Write-Host "  1. Access phpMyAdmin at http://localhost:8080 (root/root)" -ForegroundColor White
Write-Host "  2. View API documentation in API_TESTING_GUIDE.md" -ForegroundColor White
Write-Host "  3. Test more endpoints using the token above" -ForegroundColor White
Write-Host ""