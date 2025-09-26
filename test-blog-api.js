// Test script for Blog API endpoints
const BASE_URL = 'http://localhost:3001/api/blog';

async function testBlogAPI() {
  console.log('🧪 Testing Blog API Endpoints...\n');

  try {
    // Test 1: Get all categories
    console.log('1. Testing GET /categories');
    const categoriesResponse = await fetch(`${BASE_URL}/categories`);
    const categories = await categoriesResponse.json();
    console.log('✅ Categories:', categories.categories.length, 'categories found\n');

    // Test 2: Get all tags
    console.log('2. Testing GET /tags');
    const tagsResponse = await fetch(`${BASE_URL}/tags`);
    const tags = await tagsResponse.json();
    console.log('✅ Tags:', tags.tags.length, 'tags found\n');

    // Test 3: Get recent posts
    console.log('3. Testing GET /posts/recent');
    const recentPostsResponse = await fetch(`${BASE_URL}/posts/recent`);
    const recentPosts = await recentPostsResponse.json();
    console.log('✅ Recent posts:', recentPosts.length, 'posts found\n');

    // Test 4: Get popular posts
    console.log('4. Testing GET /posts/popular');
    const popularPostsResponse = await fetch(`${BASE_URL}/posts/popular`);
    const popularPosts = await popularPostsResponse.json();
    console.log('✅ Popular posts:', popularPosts.length, 'posts found\n');

    // Test 5: Get all posts (with pagination)
    console.log('5. Testing GET /posts');
    const postsResponse = await fetch(`${BASE_URL}/posts?limit=5&offset=0`);
    const postsData = await postsResponse.json();
    console.log('✅ Posts:', postsData.posts.length, 'posts found, total:', postsData.total, '\n');

    // Test 6: Get authors
    console.log('6. Testing GET /authors');
    const authorsResponse = await fetch(`${BASE_URL}/authors`);
    const authors = await authorsResponse.json();
    console.log('✅ Authors:', authors.length, 'authors found\n');

    console.log('🎉 All Blog API tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testBlogAPI();
