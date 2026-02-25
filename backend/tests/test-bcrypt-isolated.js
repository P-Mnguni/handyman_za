import bcrypt from "bcryptjs";
import { env } from "../src/config/env.js";

console.log("🔬 BCRYPT ISOLATED TEST");
console.log("=======================");

const testPassword = "Test123!";
const saltRounds = env.bcryptRounds;

console.log("1. saltRounds value:", saltRounds);
console.log("2. saltRounds type:", typeof saltRounds);
console.log("3. Is it a number?", !isNaN(saltRounds));

try {
    // Test 1: Using hashSync
    console.log("\n📝 Test 1: bcrypt.hashSync");
    const hash1 = bcrypt.hashSync(testPassword, saltRounds);
    console.log("✅ Success! Hash:", hash1.substring(0, 20) + "...");

    // Test 2: Using hash with await
    console.log("\n📝 Test 2: bcrypt.hash with await");
    const hash2 = await bcrypt.hash(testPassword, saltRounds);
    console.log("✅ Success! Hash:", hash2.substring(0, 20) + "...");

    // Test 3: Test with different formats
    console.log("\n📝 Test 3: Testing different salt formats");
    const formats = [
        12,
        "12",
        10,
        bcrypt.genSaltSync(12)
    ];

    for (let i = 0; i < formats.length; i++) {
        try {
            const hash = bcrypt.hashSync(testPassword, formats[i]);
            console.log(`   Format ${i+1} (${formats[i]}, ${typeof formats[i]}): ✅ OK`);
        } catch (e) {
            console.log(`   Format ${i+1} (${formats[i]}, ${typeof formats[i]}): ❌ Failed - ${e.message}`);
        }
    }

} catch (error) {
    console.log("\n❌ ERROR:", error);
    console.log("   Full error object:", JSON.stringify(error, null, 2));
}