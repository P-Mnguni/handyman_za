import { authorize } from "../src/middlewares/role.middleware.js";

// Mock request, response, next
const createMockContext = (userRole) => ({
    req: { user: userRole ? { role: userRole } : null },
    res: {},
    next: (error) => {
        if (error) {
            console.log("❌ Next called with error:", error.message); 
            return error;
        }
        console.log("✅ Next called without error");
        return null;
    }
});

console.log("🔬 TESTING ROLE MIDDLEWARE");
console.log("===========================");

// Test 1: No user (auth middleware missing)
console.log("\n📋 Test 1: No user in request");
const test1 = createMockContext(null);
const middleware1 = authorize("client");
middleware1(test1.req, test1.res, test1.next);

// Test 2: Correct role
console.log("\n📋 Test 2: Client accessing client route");
const test2 = createMockContext("client");
const middleware2 = authorize("client");
middleware2(test2.req, test2.res, test2.next);

// Test 3: Wrong role
console.log("\n📋 Test 3: Handyman accessing client route");
const test3 = createMockContext("handyman");
const middleware3 = authorize("client");
middleware3(test3.req, test3.res, test3.next);

// Test 4: Multiple allowed roles - correct
console.log("\n📋 Test 4: Client accessing client/handyman route");
const test4 = createMockContext("client");
const middleware4 = authorize("client", "handyman");
middleware4(test4.req, test4.res, test4.next);

// Test 5: Multiple allowed roles - incorrect
console.log("\n📋 Test 5: Admin accessing client/handyman route");
const test5 = createMockContext("admin");
const middleware5 = authorize("client", "handyman");
middleware5(test5.req, test5.res, test5.next);